import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Product, Transaction, User } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const DOMAIN = '@brobread.internal';

export const firebaseService = {
  // --- Auth ---
  async login(username: string, pin: string) {
    const email = username.toLowerCase() + DOMAIN;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pin);
      return userCredential.user;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  },

  async logout() {
    await signOut(auth);
  },

  async createUser(username: string, pin: string, name: string, role: 'admin' | 'kasir') {
    const email = username.toLowerCase() + DOMAIN;
    try {
      // Check if user already exists by trying to login first? No, just try create
      const userCredential = await createUserWithEmailAndPassword(auth, email, pin);
      const uid = userCredential.user.uid;
      const userData: User = { id: uid, name, username, role, pin: '' };
      await setDoc(doc(db, 'users', uid), userData);
      return userCredential.user;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        try {
          const loginResult = await signInWithEmailAndPassword(auth, email, pin);
          const uid = loginResult.user.uid;
          const userData: User = { id: uid, name, username, role, pin: '' };
          await setDoc(doc(db, 'users', uid), userData);
          return loginResult.user;
        } catch (signInError: any) {
          if (signInError.code === 'auth/invalid-credential' || signInError.code === 'auth/wrong-password') {
            const wrapError = new Error(`User "${username}" sudah ada di Authentication dengan PIN (password) yang berbeda. Silakan gunakan PIN yang lama atau hapus user di Firebase Console.`);
            (wrapError as any).code = 'auth/invalid-credential';
            throw wrapError;
          }
          throw error; 
        }
      }
      console.error("Create User Error:", error);
      throw error;
    }
  },

  // --- Products ---
  async getProducts(): Promise<Product[]> {
    const path = 'products';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => doc.data() as Product);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  onProductsChange(callback: (products: Product[]) => void, onError?: (error: any) => void) {
    const path = 'products';
    return onSnapshot(collection(db, path), (snapshot) => {
      callback(snapshot.docs.map(doc => doc.data() as Product));
    }, (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async saveProduct(product: Product) {
    const path = `products/${product.id}`;
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteProduct(id: string) {
    const path = `products/${id}`;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- Transactions ---
  async getTransactions(): Promise<Transaction[]> {
    const path = 'transactions';
    try {
      const q = query(collection(db, path), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timestamp: (data.timestamp as Timestamp).toDate()
        } as Transaction;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  onTransactionsChange(callback: (txs: Transaction[]) => void, onError?: (error: any) => void) {
    const path = 'transactions';
    return onSnapshot(query(collection(db, path), orderBy('timestamp', 'desc')), (snapshot) => {
      callback(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timestamp: (data.timestamp as Timestamp).toDate()
        } as Transaction;
      }));
    }, (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async saveTransaction(tx: Transaction) {
    const path = `transactions/${tx.id}`;
    try {
      await setDoc(doc(db, 'transactions', tx.id), {
        ...tx,
        timestamp: Timestamp.fromDate(tx.timestamp)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // --- Config ---
  async getConfig(): Promise<any> {
    const path = 'systemConfigs/default';
    try {
      const snapshot = await getDoc(doc(db, 'systemConfigs', 'default'));
      return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
      // We don't use handleFirestoreError here because it might be the first time
      return null;
    }
  },

  async saveConfig(config: any) {
    const path = 'systemConfigs/default';
    try {
      await setDoc(doc(db, 'systemConfigs', 'default'), config);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // --- Categories ---
  // In this app, categories are derived or from a separate collection
  async getCategories(): Promise<string[]> {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      if (snapshot.empty) return ['Semua', 'Bolen Pisang', 'Bolen Spesial', 'Roti & Snack', 'Paket Box', 'Minuman'];
      return snapshot.docs.map(doc => doc.data().name);
    } catch (error) {
      return ['Semua', 'Bolen Pisang', 'Bolen Spesial', 'Roti & Snack', 'Paket Box', 'Minuman'];
    }
  },

  async saveCategory(name: string) {
    await setDoc(doc(db, 'categories', name), { name });
  },

  async deleteCategory(name: string) {
    await deleteDoc(doc(db, 'categories', name));
  }
};

// Helper for initial setup (don't use in production code normally)
export const initialSetup = async (initialProducts: Product[], initialUsers: any[]) => {
  // Check if products exist
  const prodSnap = await getDocs(collection(db, 'products'));
  if (prodSnap.empty) {
    for (const p of initialProducts) {
      await firebaseService.saveProduct(p);
    }
  }

  // Check if users exist (requires careful handling due to auth)
  // This is just a placeholder - users should be created via admin panel
};
