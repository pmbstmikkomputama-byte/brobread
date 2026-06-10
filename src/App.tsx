/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  Check,
  CheckCircle2, 
  ReceiptText, 
  ChevronLeft,
  ChevronRight,
  Search,
  Store,
  Tag,
  Percent,
  History,
  CreditCard,
  Banknote,
  Smartphone,
  Utensils,
  Cookie,
  Star,
  Package,
  Coffee,
  Settings,
  ShieldCheck,
  Building2,
  MapPin,
  Image as ImageIcon,
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Users,
  LayoutDashboard,
  MoreHorizontal,
  LogOut,
  Pencil,
  FileClock,
  Lock,
  Key,
  User as UserIcon,
  Upload,
  AlertTriangle,
  Copy
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Product, CartItem, Transaction, User } from './types';
import { PRODUCTS, CATEGORIES } from './constants';
import { supabaseService as firebaseService } from './services/supabaseService';
import { supabase } from './lib/supabase';

export function toast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  if (typeof window !== 'undefined' && (window as any).showToast) {
    (window as any).showToast(message, type);
  } else {
    console.log(`[Toast Fallback - ${type}]: ${message}`);
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const CATEGORY_DETAILS: Record<string, { description: string, image: string, color: string }> = {
  'Bolen Pisang': {
    description: 'Varian bolen pisang klasik dengan pisang pilihan dan adonan pastry berlapis yang renyah.',
    image: 'https://images.unsplash.com/photo-1621236304845-8d13ed539370?q=80&w=800&auto=format&fit=crop',
    color: 'from-yellow-400/10 to-orange-500/10'
  },
  'Bolen Spesial': {
    description: 'Inovasi rasa unik dan premium untuk pengalaman menikmati bolen yang berbeda dari biasanya.',
    image: 'https://images.unsplash.com/photo-1548364538-60b952c308b9?q=80&w=800&auto=format&fit=crop',
    color: 'from-purple-400/10 to-pink-500/10'
  },
  'Roti & Snack': {
    description: 'Pilihan roti lembut dan camilan gurih yang cocok untuk menemani waktu santai Anda.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    color: 'from-amber-400/10 to-stone-500/10'
  },
  'Paket Box': {
    description: 'Kemasan eksklusif yang pas untuk dikirimkan sebagai hadiah atau oleh-oleh spesial.',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop',
    color: 'from-red-400/10 to-rose-500/10'
  },
  'Minuman': {
    description: 'Segarkan hari Anda dengan aneka minuman pilihan yang pas bersanding dengan produk BroBread.',
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=800&auto=format&fit=crop',
    color: 'from-blue-400/10 to-cyan-500/10'
  }
};

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  index: number;
  onDetail: () => void;
  onAdd: () => void;
}

const ProductCard = ({ product, index, onDetail, onAdd }: ProductCardProps) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.02, type: 'spring', damping: 20, stiffness: 100 }}
      onClick={onDetail}
      className="card-bakery group bg-white border-2 border-bakery-tan/10 rounded-[32px] overflow-hidden flex flex-col active:scale-95 transition-all shadow-sm cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-bakery-cream/30">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-black text-bakery-terracotta shadow-sm border border-bakery-tan/30">
          {formatPrice(product.price)}
        </div>
        
        <AnimatePresence>
          {isAdded && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              className="absolute inset-0 bg-bakery-terracotta/90 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 z-10"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                className="bg-white/20 p-3 rounded-full mb-2"
              >
                <ShoppingBag className="w-6 h-6" />
              </motion.div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tersimpan</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-4 flex flex-col items-center text-center flex-1">
        <h3 className="text-xs md:text-sm font-black text-bakery-bark leading-snug line-clamp-2 uppercase tracking-tight">{product.name}</h3>
        <div className="mt-auto w-full flex justify-center pt-4">
          <button
            onClick={handleAdd}
            className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-500 flex items-center justify-center gap-2 shadow-sm ${
              isAdded 
                ? 'bg-green-500 text-white border-green-500 scale-[1.02]' 
                : 'bg-bakery-cream text-bakery-terracotta border-bakery-tan hover:bg-bakery-terracotta hover:text-white hover:border-bakery-terracotta hover:shadow-lg hover:shadow-bakery-terracotta/20'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Berhasil
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Tambah
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ReportsDashboard = ({ transactions }: { transactions: Transaction[] }) => {
  const downloadCSV = () => {
    if (transactions.length === 0) return;

    // Header CSV
    const headers = ['ID Transaksi', 'Waktu', 'Produk', 'Jumlah', 'Total Harga', 'Metode Bayar'];
    
    // Baris CSV
    const rows = transactions.map(tx => {
      return tx.items.map(item => [
        tx.id,
        new Date(tx.timestamp).toLocaleString('id-ID'),
        item.product.name,
        item.quantity,
        item.product.price * item.quantity,
        tx.paymentMethod
      ].join(',')).join('\n');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-penjualan-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = useMemo(() => {
    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0);
    const totalOrders = transactions.length;
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const productSales: Record<string, { name: string, quantity: number, revenue: number }> = {};
    const categorySales: Record<string, number> = {};
    
    transactions.forEach(tx => {
      tx.items.forEach(item => {
        const id = item.product.id;
        if (!productSales[id]) {
          productSales[id] = { name: item.product.name, quantity: 0, revenue: 0 };
        }
        productSales[id].quantity += item.quantity;
        productSales[id].revenue += item.product.price * item.quantity;
        
        const cat = item.product.category;
        categorySales[cat] = (categorySales[cat] || 0) + (item.product.price * item.quantity);
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
      
    const chartData = Object.entries(categorySales).map(([name, value]) => ({ 
      name, 
      value,
      color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random enough for colors
    }));
    
    return { totalRevenue, totalOrders, avgOrder, topProducts, chartData };
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="bg-white/50 border-2 border-dashed border-bakery-tan/30 rounded-[32px] p-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-bakery-tan/20 rounded-3xl flex items-center justify-center text-bakery-muted mb-6">
          <BarChart3 className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-serif font-bold text-bakery-bark mb-2">Laporan Belum Tersedia</h3>
        <p className="text-bakery-muted text-sm max-w-xs">Data laporan akan muncul setelah Anda melakukan setidaknya satu transaksi penjualan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-serif font-black text-bakery-bark">Analisis Penjualan</h2>
          <p className="text-bakery-muted text-xs font-bold uppercase tracking-widest mt-1">Metrik performa BroBread hari ini</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={downloadCSV}
             className="bg-white px-4 py-2.5 rounded-2xl border border-bakery-tan/30 shadow-sm flex items-center gap-3 hover:bg-bakery-cream transition-colors text-bakery-bark group"
           >
             <Download className="w-4 h-4 text-bakery-terracotta group-hover:scale-110 transition-transform" />
             <span className="text-[10px] font-black uppercase">Unduh CSV</span>
           </button>
           <div className="bg-white px-4 py-2.5 rounded-2xl border border-bakery-tan/30 shadow-sm flex items-center gap-3">
             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
             <span className="text-[10px] font-black uppercase text-bakery-bark">Live Data</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-bakery-tan/30 shadow-sm flex items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase text-bakery-muted mb-0.5 md:mb-1 truncate">Total Pendapatan</p>
            <h4 className="text-xl md:text-2xl font-black text-bakery-bark tracking-tight">{formatPrice(stats.totalRevenue)}</h4>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-bakery-tan/30 shadow-sm flex items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase text-bakery-muted mb-0.5 md:mb-1 truncate">Total Pesanan</p>
            <h4 className="text-xl md:text-2xl font-black text-bakery-bark tracking-tight">{stats.totalOrders} <span className="text-xs text-bakery-muted">TX</span></h4>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-bakery-tan/30 shadow-sm flex items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase text-bakery-muted mb-0.5 md:mb-1 truncate">Rata-rata / Order</p>
            <h4 className="text-xl md:text-2xl font-black text-bakery-bark tracking-tight">{formatPrice(stats.avgOrder)}</h4>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 md:p-10 rounded-[48px] border border-bakery-tan/30 shadow-sm">
          <h3 className="text-lg font-serif font-black text-bakery-bark mb-8 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-bakery-terracotta" />
            Penjualan per Kategori
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#888', fontWeight: 900, textTransform: 'uppercase' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#888' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#fafafa' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#C58F72', '#5D4037', '#9E7E6A', '#E6B89C', '#8D6E63'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white p-8 md:p-10 rounded-[48px] border border-bakery-tan/30 shadow-sm flex flex-col">
          <h3 className="text-lg font-serif font-black text-bakery-bark mb-8 flex items-center gap-3">
            <Star className="w-5 h-5 text-bakery-terracotta" />
            Produk Terlaris
          </h3>
          <div className="space-y-4 flex-1">
            {stats.topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 rounded-3xl bg-bakery-cream/30 border border-transparent hover:border-bakery-tan/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-bakery-tan/20 flex items-center justify-center text-bakery-terracotta font-black text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-bakery-bark uppercase tracking-tight">{product.name}</h5>
                    <p className="text-[10px] text-bakery-muted font-bold mt-0.5">{product.quantity} unit terjual</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-bakery-bark">{formatPrice(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const UserManagementView = ({ onBack }: { onBack: () => void }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState<'admin' | 'kasir'>('kasir');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await firebaseService.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    if (!name || !username || !pin) {
      setErrorMsg('Semua data wajib diisi!');
      return;
    }
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      setErrorMsg('PIN harus terdiri dari 6 digit angka!');
      return;
    }

    try {
      setErrorMsg('');
      await firebaseService.createUser(username.toLowerCase(), pin, name, role);
      setIsAdding(false);
      resetForm();
      fetchUsers();
    } catch (e: any) {
      setErrorMsg(e.message || 'Gagal menambahkan pengguna.');
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    if (!name || !username) {
      setErrorMsg('Nama dan Username wajib diisi!');
      return;
    }
    if (pin && (pin.length !== 6 || !/^\d+$/.test(pin))) {
      setErrorMsg('PIN harus 6 digit angka!');
      return;
    }

    try {
      setErrorMsg('');
      await firebaseService.updateUser({
        id: editingUser.id,
        name,
        username: username.toLowerCase(),
        role,
        pin
      });
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (e: any) {
      setErrorMsg(e.message || 'Gagal mengubah pengguna.');
    }
  };

  const handleDelete = async (user: User) => {
    if (user.username === 'admin') {
      toast('Akun administrator utama tidak dapat dihapus!', 'error');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.name}"?`)) {
      try {
        await firebaseService.deleteUser(user.id);
        fetchUsers();
        toast(`Pengguna "${user.name}" berhasil dihapus`, 'success');
      } catch (e) {
        toast('Gagal menghapus pengguna.', 'error');
      }
    }
  };

  const resetForm = () => {
    setName('');
    setUsername('');
    setPin('');
    setRole('kasir');
    setErrorMsg('');
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setUsername(user.username);
    setRole(user.role);
    setPin('');
    setIsAdding(false);
    setErrorMsg('');
  };

  const startAdd = () => {
    resetForm();
    setIsAdding(true);
    setEditingUser(null);
    setErrorMsg('');
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <button 
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-bakery-muted hover:text-bakery-terracotta font-black text-[10px] uppercase tracking-widest transition-colors w-fit mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Kembali ke Panel
          </button>
          <h2 className="text-3xl font-serif font-black text-bakery-bark">Manajemen Kasir</h2>
          <p className="text-bakery-muted text-xs font-bold uppercase tracking-widest mt-1">Kelola hak akses dan akun kasir toko</p>
        </div>
        <button 
          onClick={startAdd}
          className="px-6 py-3.5 rounded-2xl bg-bakery-terracotta text-white shadow-lg shadow-bakery-terracotta/20 font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all self-end"
        >
          <Plus className="w-5 h-5" />
          Tambah Kasir / Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-bakery-muted font-bold">Memuat daftar kasir...</div>
        ) : (
          users.map(user => (
            <div key={user.id} className="bg-white p-6 rounded-[32px] border border-bakery-tan/20 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${user.role === 'admin' ? 'bg-bakery-bark' : 'bg-bakery-terracotta'}`}>
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    user.role === 'admin' ? 'bg-bakery-bark/10 text-bakery-bark' : 'bg-bakery-terracotta/10 text-bakery-terracotta'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <h4 className="text-sm font-black text-bakery-bark uppercase tracking-tight">{user.name}</h4>
                <p className="text-xs text-bakery-muted font-semibold mt-1">Username: @{user.username}</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-2 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> PIN Aktif ({user.pin ? "Terdaftar" : "Belum Ditentukan"})
                </p>
              </div>

              <div className="flex gap-2 border-t border-bakery-tan/15 pt-4 mt-6">
                <button 
                  onClick={() => startEdit(user)}
                  className="flex-1 py-2.5 bg-bakery-cream hover:bg-bakery-tan/10 text-bakery-bark rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button 
                  disabled={user.username === 'admin'}
                  onClick={() => handleDelete(user)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${
                    user.username === 'admin' 
                      ? 'bg-stone-100 text-stone-300 cursor-not-allowed' 
                      : 'bg-red-50 hover:bg-red-100 text-red-600'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingUser) && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bakery-bark/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            >
              <div className="p-8 border-b border-bakery-tan/30 flex items-center justify-between">
                <h3 className="text-xl font-serif font-black text-bakery-bark">
                  {isAdding ? 'Tambah Staff Baru' : 'Edit Staff / Kasir'}
                </h3>
                <button 
                  onClick={() => { setIsAdding(false); setEditingUser(null); }} 
                  className="p-2 bg-bakery-cream rounded-2xl text-bakery-muted hover:text-bakery-bark transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-5 overflow-y-auto flex-1">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-600 text-xs font-bold leading-relaxed">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-4 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">Username (Untuk Login)</label>
                  <input 
                    type="text" 
                    placeholder="budis"
                    disabled={editingUser?.username === 'admin'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-4 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark transition-all text-sm disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">PIN Rahasia (6 Digit Angka)</label>
                  <input 
                    type="password" 
                    maxLength={6}
                    placeholder={editingUser ? 'Kosongkan jika tidak ada perubahan PIN' : 'Masukkan 6 digit angka...'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-4 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">Hak Akses / Peran</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'kasir', label: 'Kasir Toko', desc: 'Akses menu penjualan & sebatas laporan harian' },
                      { id: 'admin', label: 'Administrator', desc: 'Akses penuh seluruh pengaturan & sistem database' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={editingUser?.username === 'admin' && opt.id !== 'admin'}
                        onClick={() => setRole(opt.id as any)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                          role === opt.id 
                            ? 'border-bakery-terracotta bg-bakery-tan/10 text-bakery-bark shadow-sm' 
                            : 'border-bakery-tan/20 text-bakery-muted hover:border-bakery-terracotta/30'
                        } disabled:opacity-50`}
                      >
                        <span className="text-xs font-black uppercase tracking-wide">{opt.label}</span>
                        <span className="text-[8px] font-bold opacity-60 leading-normal mt-1">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-bakery-cream/30 border-t border-bakery-tan/30 flex gap-4">
                <button 
                  type="button"
                  onClick={() => { setIsAdding(false); setEditingUser(null); }}
                  className="flex-1 py-3.5 bg-white border border-bakery-tan/50 hover:bg-zinc-50 rounded-2xl font-black text-xs uppercase tracking-widest text-zinc-600 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="button"
                  onClick={isAdding ? handleCreate : handleUpdate}
                  className="flex-1 py-3.5 bg-bakery-terracotta text-white font-black text-xs uppercase tracking-widest hover:bg-bakery-terracotta/90 transition-colors rounded-2xl shadow-lg shadow-bakery-terracotta/15"
                >
                  {isAdding ? 'Tambah' : 'Simpan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WebsiteSettingsView = ({ 
  config, 
  setConfig, 
  onBack 
}: { 
  config: any, 
  setConfig: (c: any) => void, 
  onBack: () => void 
}) => {
  const [localConfig, setLocalConfig] = useState({...config});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await firebaseService.saveConfig(localConfig);
      setConfig(localConfig);
      setSaveSuccess(true);
      toast("Pengaturan website berhasil disimpan!", "success");
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      toast("Gagal mengubah pengaturan website.", "error");
    }
  };

  const setField = (field: string, value: any) => {
    setLocalConfig((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <button 
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-bakery-muted hover:text-bakery-terracotta font-black text-[10px] uppercase tracking-widest transition-colors w-fit mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Kembali ke Panel
          </button>
          <h2 className="text-3xl font-serif font-black text-bakery-bark">Manajemen Website</h2>
          <p className="text-bakery-muted text-xs font-bold uppercase tracking-widest mt-1">Sesuaikan informasi toko dan preferensi situs</p>
        </div>
        {saveSuccess && (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-end">
            <Check className="w-4 h-4" /> Disimpan!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-bakery-tan/30 shadow-sm space-y-6">
          <h3 className="text-lg font-serif font-black text-bakery-bark flex items-center gap-3">
            <Building2 className="w-6 h-6 text-bakery-terracotta" />
            Profil Utama Website
          </h3>

          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted w-full ml-1 text-center">Logo Utama Website (Gambar)</label>
              <div 
                onClick={() => document.getElementById('logo-upload-input-2')?.click()}
                className="w-32 h-32 rounded-[32px] bg-bakery-cream/30 border-4 border-dashed border-bakery-tan/20 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-bakery-terracotta/30 transition-all mx-auto"
              >
                {localConfig.logoUrl ? (
                  <img src={localConfig.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-bakery-muted group-hover:text-bakery-terracotta transition-colors">
                    <Upload className="w-8 h-8" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Upload Logo</span>
                  </div>
                )}
                {localConfig.logoUrl && (
                  <div className="absolute inset-0 bg-bakery-bark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-black text-[10px] uppercase tracking-widest">Ganti Logo</p>
                  </div>
                )}
              </div>
              <input 
                id="logo-upload-input-2"
                type="file" 
                hidden 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setField('logoUrl', reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {localConfig.logoUrl && (
                <button 
                  type="button"
                  onClick={() => setField('logoUrl', '')}
                  className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
                >
                  Hapus Logo Gambar
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">Nama Brand / Toko</label>
              <input 
                type="text" 
                value={localConfig.name}
                onChange={(e) => setField('name', e.target.value)}
                className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-4 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">Inisial Logo (Jika Logo Gambar Kosong)</label>
              <input 
                type="text" 
                maxLength={2}
                value={localConfig.logo}
                onChange={(e) => setField('logo', e.target.value.toUpperCase())}
                className="w-20 bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-4 py-3 focus:border-bakery-terracotta outline-none font-bold text-center uppercase tracking-wider text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-bakery-tan/30 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-black text-bakery-bark flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-bakery-terracotta" />
              Kontak & Atribut Website
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">Nomor Telepon / WhatsApp</label>
                <input 
                  type="text" 
                  value={localConfig.phone || ''}
                  onChange={(e) => setField('phone', e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-4 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">Alamat Lengkap Toko / Kantor</label>
                <textarea 
                  value={localConfig.address}
                  onChange={(e) => setField('address', e.target.value)}
                  className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-4 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark transition-all h-24 text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">Kode Warna Utama Brand</label>
                <div className="flex gap-4">
                  <input 
                    type="color" 
                    value={localConfig.primaryColor || '#C58F72'}
                    onChange={(e) => setField('primaryColor', e.target.value)}
                    className="w-12 h-12 bg-transparent border-0 cursor-pointer p-0 shrink-0"
                  />
                  <input 
                    type="text" 
                    maxLength={7}
                    value={localConfig.primaryColor || '#C58F72'}
                    onChange={(e) => setField('primaryColor', e.target.value)}
                    className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-4 py-3 focus:border-bakery-terracotta outline-none font-bold uppercase text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-bakery-tan/20">
            <button 
              type="submit"
              className="w-full py-4 bg-bakery-terracotta hover:bg-bakery-terracotta/90 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-bakery-terracotta/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Check className="w-5 h-5" /> Simpan Perubahan Website
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const SettingsView = ({ 
  config, 
  setConfig, 
  userRole, 
  setView, 
  activeSection, 
  setActiveSection, 
  transactions, 
  setCurrentUser,
  products,
  setProducts,
  categories,
  setCategories,
  categoryDetails,
  setCategoryDetails,
  refreshCategories
}: { 
  config: any, 
  setConfig: (c: any) => void,
  userRole: 'admin' | 'kasir',
  setView: (v: any) => void,
  activeSection: 'general' | 'reports' | 'history' | 'catalog' | 'kasir' | 'website',
  setActiveSection: (s: 'general' | 'reports' | 'history' | 'catalog' | 'kasir' | 'website') => void,
  transactions: Transaction[],
  setCurrentUser: (u: User | null) => void,
  products: Product[],
  setProducts: (p: Product[]) => void,
  categories: string[],
  setCategories: (c: string[]) => void,
  categoryDetails: Record<string, { description: string, image: string, color: string }>,
  setCategoryDetails: (d: Record<string, { description: string, image: string, color: string }>) => void,
  refreshCategories: () => void
}) => {
  const handleLogout = () => {
    setCurrentUser(null);
    setView('menu');
  };

  if (activeSection === 'reports') {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setActiveSection('general')}
          className="flex items-center gap-2 text-bakery-muted hover:text-bakery-terracotta font-black text-[10px] uppercase tracking-widest transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Dashboard
        </button>
        <ReportsDashboard transactions={transactions} />
      </div>
    );
  }

  if (activeSection === 'catalog') {
    return (
      <CatalogView 
        products={products}
        setProducts={setProducts}
        categories={categories}
        setCategories={setCategories}
        categoryDetails={categoryDetails}
        setCategoryDetails={setCategoryDetails}
        refreshCategories={refreshCategories}
        onBack={() => setActiveSection('general')}
      />
    );
  }

  if (activeSection === 'kasir') {
    return (
      <UserManagementView onBack={() => setActiveSection('general')} />
    );
  }

  if (activeSection === 'website') {
    return (
      <WebsiteSettingsView 
        config={config} 
        setConfig={setConfig} 
        onBack={() => setActiveSection('general')} 
      />
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-serif font-black text-bakery-bark">Panel Administrator</h2>
          <p className="text-bakery-muted text-xs font-bold uppercase tracking-widest mt-1">Kelola sistem, kasir, produk, dan performa bisnis</p>
        </div>
        <div className="flex gap-3">
          {userRole === 'admin' && (
            <button 
              onClick={handleLogout}
              className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100 transition-all font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-sm shadow-red-100"
            >
              <LogOut className="w-5 h-5" />
              Keluar Sesi
            </button>
          )}
        </div>
      </div>

      {/* Admin Dashboard Cards - Clean & Functional Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <button 
          onClick={() => { setView('reports'); if (userRole === 'admin') setActiveSection('reports'); }}
          className="bg-white p-6 md:p-8 rounded-[40px] border border-bakery-tan/30 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between min-h-[180px]"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-bakery-cream rounded-2xl flex items-center justify-center text-bakery-terracotta group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-black text-bakery-bark uppercase tracking-widest leading-snug">Laporan Penjualan</h4>
            <p className="text-[9px] md:text-[10px] text-bakery-muted font-bold mt-1 uppercase">Analisa pendapatan & performa produk</p>
          </div>
        </button>

        <button 
          onClick={() => { setView('history'); }}
          className="bg-white p-6 md:p-8 rounded-[40px] border border-bakery-tan/30 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between min-h-[180px]"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-bakery-cream rounded-2xl flex items-center justify-center text-bakery-terracotta group-hover:scale-110 transition-transform">
            <History className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-black text-bakery-bark uppercase tracking-widest leading-snug">Riwayat Transaksi</h4>
            <p className="text-[9px] md:text-[10px] text-bakery-muted font-bold mt-1 uppercase">Monitor, edit, & hapus transaksi</p>
          </div>
        </button>

        <button 
          onClick={() => { if (userRole === 'admin') setActiveSection('catalog'); }}
          className="bg-white p-6 md:p-8 rounded-[40px] border border-bakery-tan/30 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between min-h-[180px]"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-bakery-cream rounded-2xl flex items-center justify-center text-bakery-terracotta group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-black text-bakery-bark uppercase tracking-widest leading-snug">Manajemen Produk</h4>
            <p className="text-[9px] md:text-[10px] text-bakery-muted font-bold mt-1 uppercase">Kelola produk & kategori penjualan</p>
          </div>
        </button>

        <button 
          onClick={() => { if (userRole === 'admin') setActiveSection('kasir'); }}
          className="bg-white p-6 md:p-8 rounded-[40px] border border-bakery-tan/30 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between min-h-[180px]"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-bakery-cream rounded-2xl flex items-center justify-center text-bakery-terracotta group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-black text-bakery-bark uppercase tracking-widest leading-snug">Manajemen Kasir</h4>
            <p className="text-[9px] md:text-[10px] text-bakery-muted font-bold mt-1 uppercase">Atur hak akses & akun staff</p>
          </div>
        </button>

        <button 
          onClick={() => { if (userRole === 'admin') setActiveSection('website'); }}
          className="bg-white p-6 md:p-8 rounded-[40px] border border-bakery-tan/30 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between min-h-[180px]"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-bakery-cream rounded-2xl flex items-center justify-center text-bakery-terracotta group-hover:scale-110 transition-transform">
            <Settings className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-black text-bakery-bark uppercase tracking-widest leading-snug">Manajemen Website</h4>
            <p className="text-[9px] md:text-[10px] text-bakery-muted font-bold mt-1 uppercase">Atur profil brand & kontak toko</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-4">
        <div className="bg-bakery-bark p-8 rounded-[40px] shadow-lg flex items-center justify-between text-white relative overflow-hidden group min-h-[140px]">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Transaksi</p>
            <h3 className="text-4xl font-black font-serif">{transactions.length}</h3>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-black">+12%</span>
              <span className="text-[10px] opacity-40 font-bold uppercase">Bulan ini</span>
            </div>
          </div>
          <TrendingUp className="w-24 h-24 absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform" />
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-bakery-tan/30 shadow-sm flex items-center justify-between min-h-[140px]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-bakery-muted mb-2">Pendapatan Total bruto</p>
            <h3 className="text-3xl font-black font-serif text-bakery-bark">
              {formatPrice(transactions.reduce((sum, t) => sum + (t.total || 0), 0))}
            </h3>
            <p className="text-[9px] text-bakery-muted font-bold uppercase mt-2">Semua Transaksi Tercatat</p>
          </div>
          <DollarSign className="w-12 h-12 text-bakery-terracotta/30" />
        </div>
      </div>
    </div>
  );
};

const TransactionEditModal = ({ transaction, onSave, onClose }: { 
  transaction: Transaction, 
  onSave: (tx: Transaction, notes: string) => void, 
  onClose: () => void 
}) => {
  const [items, setItems] = useState(transaction.items.map(item => ({
    ...item, 
    product: { ...item.product }
  })));
  const [paymentMethod, setPaymentMethod] = useState(transaction.paymentMethod);
  const [notes, setNotes] = useState('');

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const updateQty = (idx: number, delta: number) => {
    const newItems = [...items];
    newItems[idx].quantity = Math.max(1, newItems[idx].quantity + delta);
    setItems(newItems);
  };

  const updatePrice = (idx: number, price: number) => {
    const newItems = [...items];
    newItems[idx].product.price = price;
    setItems(newItems);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-bakery-bark/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-bakery-tan/30 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-black text-bakery-bark">Edit Transaksi</h2>
            <p className="text-xs text-bakery-muted font-bold uppercase tracking-widest mt-1">ID: {transaction.id}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-bakery-cream rounded-2xl text-bakery-muted hover:text-bakery-bark transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-bakery-muted">Item Pesanan</h3>
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-bakery-cream/30 rounded-3xl border border-bakery-tan/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-bakery-terracotta">
                     <Package className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-bakery-bark uppercase truncate">{item.product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-bakery-muted uppercase whitespace-nowrap">Harga @</span>
                      <input 
                        type="number"
                        value={item.product.price}
                        onChange={(e) => updatePrice(idx, Number(e.target.value))}
                        className="w-24 bg-white border border-bakery-tan/30 rounded-lg px-2 py-1 text-xs font-black text-bakery-bark outline-none focus:border-bakery-terracotta"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-between sm:justify-start">
                  <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-bakery-tan/20">
                    <button onClick={() => updateQty(idx, -1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-bakery-muted hover:bg-bakery-cream transition-colors"><Minus className="w-4 h-4" /></button>
                    <span className="w-6 text-center font-black text-bakery-bark">{item.quantity}</span>
                    <button onClick={() => updateQty(idx, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-bakery-terracotta hover:bg-bakery-cream transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="text-sm font-black text-bakery-bark">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-bakery-muted">Metode Pembayaran</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cash', icon: Banknote, label: 'Tunai' },
                  { id: 'e-wallet', icon: Smartphone, label: 'QRIS' },
                  { id: 'card', icon: CreditCard, label: 'Debit' }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === method.id 
                        ? 'border-bakery-terracotta bg-bakery-terracotta text-white shadow-lg shadow-bakery-terracotta/20' 
                        : 'border-bakery-tan/20 text-bakery-muted hover:border-bakery-terracotta/30'
                    }`}
                  >
                    <method.icon className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-bakery-muted">Alasan Perubahan</h3>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Kesalahan input jumlah barang oleh kasir"
                className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-5 py-4 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark transition-all h-24 placeholder:text-bakery-muted/40 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-bakery-cream/30 border-t border-bakery-tan/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-bakery-muted mb-1">Total Akhir</p>
            <p className="text-3xl font-serif font-black text-bakery-bark">{formatPrice(total)}</p>
          </div>
          <button 
            disabled={!notes.trim()}
            onClick={() => onSave({ ...transaction, items, total, paymentMethod }, notes)}
            className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
              notes.trim() 
                ? 'bg-bakery-terracotta text-white shadow-xl shadow-bakery-terracotta/30 hover:scale-[1.02]' 
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            Selesaikan Edit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CatalogView = ({ 
  products, 
  setProducts, 
  categories, 
  setCategories,
  categoryDetails,
  setCategoryDetails,
  refreshCategories,
  onBack
}: { 
  products: Product[], 
  setProducts: (p: Product[]) => void,
  categories: string[],
  setCategories: (c: string[]) => void,
  categoryDetails: Record<string, { description: string, image: string, color: string }>,
  setCategoryDetails: (d: Record<string, { description: string, image: string, color: string }>) => void,
  refreshCategories: () => void,
  onBack: () => void
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Category Edit details states
  const [editingCategoryName, setEditingCategoryName] = useState<string | null>(null);
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [categoryColor, setCategoryColor] = useState('from-yellow-400/10 to-orange-500/10');

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Hapus produk ini?')) {
      try {
        await firebaseService.deleteProduct(id);
        toast("Produk berhasil dihapus", "success");
      } catch (err) {
        toast("Gagal menghapus produk.", "error");
      }
    }
  };

  const handleSaveProduct = async (product: Product) => {
    try {
      await firebaseService.saveProduct(product);
      setEditingProduct(null);
      setIsAddingProduct(false);
      toast("Produk berhasil disimpan!", "success");
    } catch (err) {
      toast("Gagal menyimpan produk.", "error");
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    if (cat === 'Semua') return;
    if (products.some(p => p.category === cat)) {
      toast('Kategori ini masih digunakan oleh beberapa produk. Silakan ubah kategori produk tersebut terlebih dahulu.', 'error');
      return;
    }
    if (confirm(`Hapus kategori "${cat}"?`)) {
      try {
        await firebaseService.deleteCategory(cat);
        if (editingCategoryName === cat) setEditingCategoryName(null);
        refreshCategories();
        toast(`Kategori "${cat}" berhasil dihapus`, 'success');
      } catch (err) {
        toast("Gagal menghapus kategori.", "error");
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      try {
        await firebaseService.saveCategory(newCategory.trim());
        refreshCategories();
        toast(`Kategori "${newCategory.trim()}" berhasil ditambahkan!`, 'success');
        setNewCategory('');
      } catch (err) {
        toast("Gagal menambah kategori.", "error");
      }
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-bakery-muted hover:text-bakery-terracotta font-black text-[10px] uppercase tracking-widest transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Panel
        </button>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsManagingCategories(!isManagingCategories)}
            className={`px-4 sm:px-6 py-3.5 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 ${
              isManagingCategories ? 'bg-bakery-bark text-white border-bakery-bark' : 'bg-white text-bakery-bark border-bakery-tan/30'
            }`}
          >
            <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
            Kelola Kategori
          </button>
          <button 
            onClick={() => { setIsAddingProduct(true); setEditingProduct({ id: Date.now().toString(), name: '', price: 0, category: categories[1] || '', description: '', image: '' }); }}
            className="px-4 sm:px-6 py-3.5 rounded-2xl bg-bakery-terracotta text-white shadow-lg shadow-bakery-terracotta/20 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Tambah Produk
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isManagingCategories && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-8 rounded-[40px] border border-bakery-tan/30 shadow-sm space-y-6">
              <h3 className="text-lg font-serif font-black text-bakery-bark">Manajemen Kategori</h3>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nama kategori baru..."
                  className="flex-1 bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-5 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark"
                />
                <button 
                  onClick={handleAddCategory}
                  className="px-8 py-3 bg-bakery-bark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-bakery-terracotta transition-colors"
                >
                  Tambah
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {categories.map(cat => {
                  const details = categoryDetails[cat] || { description: '', image: '', color: 'from-amber-400/10 to-stone-500/10' };
                  return (
                    <div key={cat} className="flex flex-col p-4 bg-bakery-cream/30 rounded-2xl border border-bakery-tan/10 relative hover:border-bakery-tan/50 transition-all">
                      <div className="flex items-center justify-between font-serif mb-2 pb-2 border-b border-bakery-tan/10">
                        <span className="text-xs font-black text-bakery-bark uppercase">{cat}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingCategoryName(cat);
                              setCategoryDescription(details.description);
                              setCategoryImage(details.image);
                              setCategoryColor(details.color || 'from-yellow-400/10 to-orange-500/10');
                            }}
                            className="p-1 px-2 bg-bakery-cream hover:bg-bakery-tan/20 text-bakery-bark rounded-lg text-[9px] font-black transition-colors"
                            title="Edit Detail Kategori"
                          >
                            Edit
                          </button>
                          {cat !== 'Semua' && (
                            <button onClick={() => handleDeleteCategory(cat)} className="text-red-400 hover:text-red-600 p-1" title="Hapus Kategori">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] font-semibold text-bakery-bark/70 line-clamp-2 min-h-[2.5rem]">
                        {details.description || <span className="opacity-40 italic">Belum ada deskripsi</span>}
                      </div>
                      {details.image && (
                        <img 
                          src={details.image} 
                          alt="" 
                          className="w-full h-16 object-cover rounded-lg border border-bakery-tan/20 mt-2" 
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {editingCategoryName && (
                <div className="p-6 bg-bakery-cream/40 rounded-3xl border-2 border-bakery-tan/20 space-y-4 mt-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-bakery-bark uppercase tracking-widest">
                      Edit Detail Kategori: {editingCategoryName}
                    </h4>
                    <button 
                      onClick={() => setEditingCategoryName(null)}
                      className="text-xs font-bold text-bakery-muted hover:text-bakery-bark transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">
                        Deskripsi Kategori
                      </label>
                      <textarea
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        placeholder="Masukkan deskripsi untuk kategori ini..."
                        className="w-full bg-white border-2 border-bakery-tan/20 rounded-2xl px-5 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark text-xs min-h-[80px]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">
                          URL Gambar Kategori
                        </label>
                        <input
                          type="text"
                          value={categoryImage.startsWith('data:') ? '' : categoryImage}
                          onChange={(e) => setCategoryImage(e.target.value)}
                          placeholder="Atau tempel URL gambar Unsplash..."
                          className="w-full bg-white border-2 border-bakery-tan/20 rounded-2xl px-5 py-3 focus:border-bakery-terracotta outline-none font-semibold text-bakery-bark text-xs"
                        />
                        <div className="mt-2">
                          <span className="text-[9px] font-bold text-bakery-muted">Atau Unggah Gambar:</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setCategoryImage(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="block w-full text-xs text-bakery-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-wider file:bg-bakery-bark file:text-white file:hover:bg-bakery-terracotta pointer mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">
                          Warna Tema (Gradient)
                        </label>
                        <select
                          value={categoryColor}
                          onChange={(e) => setCategoryColor(e.target.value)}
                          className="w-full bg-white border-2 border-bakery-tan/20 rounded-2xl px-5 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark text-xs"
                        >
                          <option value="from-yellow-400/10 to-orange-500/10">Kuning-Oranye (Bolen Pisang)</option>
                          <option value="from-purple-400/10 to-pink-500/10">Ungu-Merah Muda (Bolen Spesial)</option>
                          <option value="from-amber-400/10 to-stone-500/10">Cokelat-Abu (Roti & Snack)</option>
                          <option value="from-red-400/10 to-rose-500/10">Merah-Mawar (Paket Box)</option>
                          <option value="from-blue-400/10 to-cyan-500/10">Biru-Sian (Minuman)</option>
                          <option value="from-green-400/10 to-emerald-500/10">Hijau (Spesial Sehat)</option>
                        </select>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-[9px] font-bold text-bakery-muted">Pratinjau Warna:</span>
                          <div className={`w-20 h-8 rounded-lg bg-gradient-to-br ${categoryColor} border border-bakery-tan/20 flex items-center justify-center`}>
                            <span className="text-[9px] font-bold text-bakery-bark text-center">Tampilan</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={async () => {
                        try {
                          await firebaseService.saveCategoryWithDetails({
                            name: editingCategoryName,
                            description: categoryDescription,
                            image: categoryImage,
                            color: categoryColor
                          });
                          toast(`Detail kategori "${editingCategoryName}" berhasil diperbarui!`, 'success');
                          setEditingCategoryName(null);
                          refreshCategories();
                        } catch (e) {
                          toast("Gagal menyimpan detail kategori.", "error");
                        }
                      }}
                      className="w-full py-3 bg-bakery-terracotta text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-bakery-terracotta/10"
                    >
                      Simpan Perubahan Detail
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-[32px] border border-bakery-tan/20 overflow-hidden group shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="relative aspect-video bg-bakery-cream/30">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button 
                  onClick={() => { setEditingProduct(product); setIsAddingProduct(false); }}
                  className="p-2 bg-white/90 backdrop-blur rounded-xl text-bakery-bark shadow-sm hover:text-bakery-terracotta transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 bg-white/90 backdrop-blur rounded-xl text-red-500 shadow-sm hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 bg-bakery-terracotta text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                {product.category}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="text-sm font-black text-bakery-bark uppercase leading-tight">{product.name}</h4>
              <p className="text-[10px] text-bakery-muted font-bold mt-1 line-clamp-2">{product.description}</p>
              <div className="mt-4 pt-4 border-t border-bakery-tan/100">
                <p className="text-lg font-black text-bakery-terracotta">{formatPrice(product.price)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(editingProduct || isAddingProduct) && editingProduct && (
          <ProductEditModal 
            product={editingProduct}
            categories={categories.filter(c => c !== 'Semua')}
            onSave={handleSaveProduct}
            onClose={() => { setEditingProduct(null); setIsAddingProduct(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductEditModal = ({ product, categories, onSave, onClose }: { 
  product: Product, 
  categories: string[], 
  onSave: (p: Product) => void, 
  onClose: () => void 
}) => {
  const [formData, setFormData] = useState<Product>({...product});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-bakery-bark/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-bakery-tan/30 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-black text-bakery-bark">{product.name ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <button onClick={onClose} className="p-2 bg-bakery-cream rounded-2xl text-bakery-muted hover:text-bakery-bark transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex flex-col items-center gap-6 mb-2">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full aspect-video rounded-[32px] border-4 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative ${
                isDragging ? 'border-bakery-terracotta bg-bakery-terracotta/5' : 'border-bakery-tan/20 bg-bakery-cream/30 hover:border-bakery-terracotta/30'
              }`}
            >
              {formData.image ? (
                <>
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-bakery-bark/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-black text-xs uppercase tracking-widest">Ganti Gambar</p>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-bakery-terracotta mx-auto mb-4 shadow-sm">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-xs font-black text-bakery-bark uppercase tracking-widest">Upload Gambar Produk</p>
                  <p className="text-[10px] text-bakery-muted font-bold mt-2 uppercase">Drag & drop atau klik untuk memilih</p>
                </div>
              )}
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">Nama Produk</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-5 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">Harga (IDR)</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-5 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">Kategori</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-5 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">URL Gambar (Opsional)</label>
            <input 
              type="text" 
              value={formData.image.startsWith('data:') ? '' : formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="Atau masukkan URL gambar..."
              className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-5 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1">Deskripsi</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-5 py-3 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark h-24"
            />
          </div>
        </div>
        <div className="p-8 border-t border-bakery-tan/30">
          <button 
            onClick={() => onSave(formData)}
            className="w-full py-4 bg-bakery-terracotta text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-bakery-terracotta/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Simpan Perubahan
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SETUP_SQL = `-- 1. Buat Tabel-tabel (Bila Belum Ada)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    pin TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'kasir')) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    items JSONB NOT NULL,
    total NUMERIC NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    "paymentMethod" TEXT CHECK ("paymentMethod" IN ('cash', 'e-wallet', 'card')) NOT NULL,
    "editLogs" JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public."systemConfigs" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    "logoUrl" TEXT,
    address TEXT,
    phone TEXT,
    "primaryColor" TEXT
);

CREATE TABLE IF NOT EXISTS public.categories (
    name TEXT PRIMARY KEY,
    description TEXT,
    image TEXT,
    color TEXT
);

-- 2. Nonaktifkan RLS (Row Level Security) Agar Browser Bisa Membaca & Menulis Secara Anonim
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."systemConfigs" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories DISABLE ROW LEVEL SECURITY;

-- 3. Masukkan Data Bawaan Awal (Default Seeds)
INSERT INTO public.users (id, username, pin, name, role) VALUES
('b8764b8e-324c-473d-8ab1-24fbce828a25', 'admin', '123456', 'Administrator', 'admin'),
('c3894b9e-524c-473d-8ab1-24fbce828a26', 'kasir', '000000', 'Kasir Toko', 'kasir')
ON CONFLICT (username) DO UPDATE SET pin = EXCLUDED.pin, name = EXCLUDED.name, role = EXCLUDED.role;

INSERT INTO public.categories (name, description, image, color) VALUES
('Semua', 'Semua menu lezat dan premium pilihan terbaik untuk Anda.', '', ''),
('Bolen Pisang', 'Varian bolen pisang klasik dengan pisang pilihan dan adonan pastry berlapis yang renyah.', 'https://images.unsplash.com/photo-1621236304845-8d13ed539370?q=80&w=800&auto=format&fit=crop', 'from-yellow-400/10 to-orange-500/10'),
('Bolen Spesial', 'Inovasi rasa unik dan premium untuk pengalaman menikmati bolen yang berbeda dari biasanya.', 'https://images.unsplash.com/photo-1548364538-60b952c308b9?q=80&w=800&auto=format&fit=crop', 'from-purple-400/10 to-pink-500/10'),
('Roti & Snack', 'Pilihan roti lembut dan camilan gurih yang cocok untuk menemani waktu santai Anda.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop', 'from-amber-400/10 to-stone-500/10'),
('Paket Box', 'Kemasan eksklusif yang pas untuk dikirimkan sebagai hadiah atau oleh-oleh spesial.', 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop', 'from-red-400/10 to-rose-500/10'),
('Minuman', 'Minuman segar pilihan sebagai pendamping makan bolen lumer yang lezat.', 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=800&auto=format&fit=crop', 'from-blue-400/10 to-cyan-500/10')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, image = EXCLUDED.image, color = EXCLUDED.color;

INSERT INTO public."systemConfigs" (id, name, logo, "logoUrl", address, phone, "primaryColor") VALUES
('default', 'BroBread', 'B', '', 'Jl. Raya No. 123, Purwokerto', '0812-3456-7890', '#C58F72')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, price, category, description, image) VALUES
('b1', 'Bolen Pisang Keju', 35000, 'Bolen Pisang', 'Pastry renyah dengan isian pisang raja manis dan potongan keju gurih.', 'https://images.unsplash.com/photo-1621236304845-8d13ed539370?q=80&w=400&h=400&auto=format&fit=crop'),
('b2', 'Bolen Pisang Cokelat', 35000, 'Bolen Pisang', 'Perpaduan sempurna pisang manis dan cokelat lumer berkualitas.', 'https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=400&h=400&auto=format&fit=crop'),
('b3', 'Bolen Pisang Cokelat Keju', 38000, 'Bolen Pisang', 'Kombinasi lengkap cokelat lumer dan keju parut di dalam satu lapis bolen.', 'https://images.unsplash.com/photo-1555507036-ab10bc72b243?q=80&w=400&h=400&auto=format&fit=crop'),
('s1', 'Bolen Durian King', 48000, 'Bolen Spesial', 'Edisi premium dengan isian durian montong asli yang legit dan harum.', 'https://images.unsplash.com/photo-1548364538-60b952c308b9?q=80&w=400&h=400&auto=format&fit=crop'),
('s2', 'Bolen Tape Ketan', 32000, 'Bolen Spesial', 'Isian tape pilihan dengan paduan ketan hitam yang unik dan legit.', 'https://images.unsplash.com/photo-1558961359-1d99283f085c?q=80&w=400&h=400&auto=format&fit=crop'),
('s3', 'Bolen Nanas Madu', 32000, 'Bolen Spesial', 'Isian selai nanas madu buatan sendiri yang segar dan manis alami.', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&h=400&auto=format&fit=crop'),
('r1', 'Roti Keset Susu', 25000, 'Roti & Snack', 'Roti sobek super lembut dengan olesan susu dan mentega premium.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&h=400&auto=format&fit=crop'),
('r2', 'Brownies Panggang', 45000, 'Roti & Snack', 'Brownies cokelat padat dengan crust yang shiny dan topping almond.', 'https://images.unsplash.com/photo-1464347719102-1c5137ad6bad?q=80&w=400&h=400&auto=format&fit=crop'),
('p1', 'Hantaran Box (Isi 10)', 68000, 'Paket Box', 'Box eksklusif berisi 10 bolen campur, cocok untuk buah tangan.', 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=400&h=400&auto=format&fit=crop'),
('p2', 'Family Pack (Isi 20)', 125000, 'Paket Box', 'Paket besar lebih hemat untuk dinikmati bersama seluruh anggota keluarga.', 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=400&h=400&auto=format&fit=crop'),
('m1', 'Es Kopi Susu Mantap', 18000, 'Minuman', 'Kopi susu gula aren andalan pendamping makan bolen.', 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400&h=400&auto=format&fit=crop'),
('m2', 'Thai Tea Special', 15000, 'Minuman', 'Teh Thailand autentik dengan susu evaporasi yang creamy.', 'https://images.unsplash.com/photo-1558961359-1d99283f085c?q=80&w=400&h=400&auto=format&fit=crop')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, description = EXCLUDED.description, image = EXCLUDED.image;`;

const LoginView = ({ onLogin, config }: { onLogin: (user: User) => void, config: any }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [status, setStatus] = useState('');
  const [dbSetupError, setDbSetupError] = useState<'RLS_ERROR' | 'RELATION_MISSING' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInitialSetup = async () => {
    setLoading(true);
    setStatus('Memulai inisialisasi...');
    setDbSetupError(null);
    try {
      // Create admin
      setStatus('Menyiapkan akun Administrator...');
      try {
        await firebaseService.createUser('admin', '123456', 'Administrator', 'admin');
      } catch (e: any) {
        if (e.code !== 'auth/email-already-in-use') throw e;
        console.log("Admin account already exists in Auth.");
      }
      
      // Create kasir
      setStatus('Menyiapkan akun Kasir...');
      try {
        await firebaseService.createUser('kasir', '000000', 'Kasir Toko', 'kasir');
      } catch (e: any) {
        if (e.code !== 'auth/email-already-in-use') throw e;
        console.log("Kasir account already exists in Auth.");
      }
      
      // Seed products - Try to login as admin to perform other setup
      setStatus('Menyiapkan data sistem...');
      try {
        // Try the default PIN first
        try {
          await firebaseService.login('admin', '123456');
        } catch (loginErr: any) {
          // If default fails, maybe it's the old 4-digit PIN?
          if (loginErr.code === 'auth/invalid-credential' || loginErr.code === 'auth/wrong-password') {
            console.log("PIN 123456 failed, trying legacy PIN 1234...");
            await firebaseService.login('admin', '1234');
          } else {
            throw loginErr;
          }
        }
        
        setStatus('Mengisi katalog produk...');
        for (const p of PRODUCTS) {
          await firebaseService.saveProduct(p);
        }
        
        setStatus('Menyiapkan kategori...');
        const categoriesToSave = ['Semua', 'Bolen Pisang', 'Bolen Spesial', 'Roti & Snack', 'Paket Box', 'Minuman'];
        for (const cat of categoriesToSave) {
          await firebaseService.saveCategory(cat);
        }
        
        setStatus('Menyiapkan konfigurasi...');
        await firebaseService.saveConfig({
          name: 'BroBread',
          logo: 'B',
          logoUrl: '',
          address: 'Jl. Raya No. 123, Purwokerto',
          phone: '0812-3456-7890',
          primaryColor: '#C58F72'
        });
      } catch (loginErr: any) {
        if (loginErr.code === 'auth/invalid-credential') {
          throw new Error("Akun Admin sudah ada di Firebase Auth namun dengan PIN yang berbeda. Silakan hapus user di Firebase Console atau hubungi administrator.");
        }
        throw loginErr;
      }

      setStatus('Selesai...');
      await firebaseService.logout();
      
      toast("Inisialisasi Berhasil! Silakan login menggunakan akun demo.", "success");
      setStatus('');
    } catch (err: any) {
      console.error("Setup Error:", err);
      const errMsg = (err.message || '').toLowerCase();
      const errCode = err.code || '';
      
      if (errCode === '42501' || errMsg.includes('row-level security') || errMsg.includes('violates row-level security') || errMsg.includes('policy')) {
        setDbSetupError('RLS_ERROR');
      } else if (errCode === '42P01' || errCode === 'PGRST205' || errMsg.includes('relation') || errMsg.includes('does not exist')) {
        setDbSetupError('RELATION_MISSING');
      } else if (err.code === 'auth/operation-not-allowed') {
        toast("Gagal: Metode Email/Password belum aktif di Firebase Console.", "error");
      } else {
        toast("Gagal inisialisasi: " + (err.message || "Terjadi kesalahan."), "error");
      }
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fbUser = await firebaseService.login(username, pin);
      if (fbUser) {
        const userDoc = await firebaseService.getUser(fbUser.uid);
        if (userDoc) {
          onLogin(userDoc);
        } else {
          const fallbackUser: User = {
            id: fbUser.uid,
            name: username,
            username: username,
            role: username.toLowerCase() === 'admin' ? 'admin' : 'kasir',
            pin: ''
          };
          onLogin(fallbackUser);
        }
      }
    } catch (err: any) {
      console.error("Login catching error details:", err);
      const errMsg = (err.message || '').toLowerCase();
      const errCode = err.code || '';
      
      if (errCode === '42501' || errMsg.includes('security') || errMsg.includes('row-level security') || errMsg.includes('policy')) {
        setDbSetupError('RLS_ERROR');
      } else if (errCode === '42P01' || errCode === 'PGRST205' || errMsg.includes('relation') || errMsg.includes('does not exist')) {
        setDbSetupError('RELATION_MISSING');
      } else if (errCode === 'auth/invalid-credential') {
        // Run a silent database presence/empty check because RLS might be returning 0 rows for SELECT without throwing
        try {
          const { data, error } = await supabase.from('users').select('id').limit(1);
          if (error) {
            const innerCode = error.code || '';
            const innerMsg = (error.message || '').toLowerCase();
            if (innerCode === '42501' || innerMsg.includes('security') || innerMsg.includes('row-level security') || innerMsg.includes('policy')) {
              setDbSetupError('RLS_ERROR');
            } else if (innerCode === '42P01' || innerCode === 'PGRST205' || innerMsg.includes('relation') || innerMsg.includes('does not exist')) {
              setDbSetupError('RELATION_MISSING');
            } else {
              setError('Login Gagal. Pastikan Username & PIN benar.');
            }
          } else if (!data || data.length === 0) {
            // No users exist at all - must be a fresh Supabase instance that needs seeding
            setDbSetupError('RELATION_MISSING');
          } else {
            setError('Login Gagal. Pastikan Username & PIN benar.');
          }
        } catch (checkErr) {
          setError('Login Gagal. Pastikan Username & PIN benar.');
        }
      } else {
        setError('Terjadi kesalahan login. Jika ini database baru, pastikan tabel telah dibuat.');
      }
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bakery-cream flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decors */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-bakery-terracotta opacity-5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-bakery-bark opacity-5 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 md:p-12 rounded-[48px] shadow-2xl shadow-bakery-bark/10 border border-bakery-tan/20 flex flex-col items-center relative z-10"
      >
        <div className="w-20 h-20 bg-bakery-terracotta rounded-[28px] flex items-center justify-center text-white font-serif font-black text-4xl mb-8 shadow-xl shadow-bakery-terracotta/30 overflow-hidden">
          {config.logoUrl ? (
            <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            config.logo
          )}
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-black text-bakery-bark">{config.name}</h1>
          <p className="text-[10px] text-bakery-muted font-black uppercase tracking-[0.3em] mt-2">Sistem Pos & Inventori</p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1 flex items-center gap-2">
              <UserIcon className="w-3 h-3" /> Username
            </label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-5 py-4 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark transition-all placeholder:text-bakery-muted/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-bakery-muted ml-1 flex items-center gap-2">
              <Key className="w-3 h-3" /> PIN Akses
            </label>
            <input 
              type="password" 
              required
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full bg-bakery-cream/50 border-2 border-bakery-tan/20 rounded-2xl px-5 py-4 focus:border-bakery-terracotta outline-none font-bold text-bakery-bark transition-all text-center tracking-[1em] text-xl placeholder:text-bakery-muted/40 placeholder:tracking-normal placeholder:text-sm"
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-black uppercase text-red-500 text-center"
            >
              {error}
            </motion.p>
          )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-bakery-terracotta text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-bakery-terracotta/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              <Lock className="w-5 h-5" />
              {loading ? (status || 'Menghubungkan...') : 'Masuk Sekarang'}
            </button>
            
            {status && (
              <p className="text-[10px] text-bakery-terracotta font-black text-center animate-pulse uppercase tracking-widest mt-2">
                {status}
              </p>
            )}
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-[10px] text-bakery-muted font-bold uppercase tracking-widest">Akun Demo:</p>
          <div className="flex gap-4">
            <button 
              onClick={() => { setUsername('admin'); setPin('123456'); }}
              className="text-[9px] bg-bakery-cream border border-bakery-tan/20 px-3 py-1.5 rounded-full font-black text-bakery-muted hover:text-bakery-terracotta transition-colors"
            >
              ADMIN (123456)
            </button>
            <button 
              onClick={() => { setUsername('kasir'); setPin('000000'); }}
              className="text-[9px] bg-bakery-cream border border-bakery-tan/20 px-3 py-1.5 rounded-full font-black text-bakery-muted hover:text-bakery-terracotta transition-colors"
            >
              KASIR (000000)
            </button>
          </div>
        </div>
      </motion.div>

      {/* DB Setup Error Modal */}
      {dbSetupError && (
        <div className="fixed inset-0 bg-bakery-bark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-2xl rounded-[32px] p-8 md:p-10 shadow-2xl border border-bakery-tan/20 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center gap-4 text-amber-600 mb-6 border-b border-bakery-tan/20 pb-4">
              <AlertTriangle className="w-8 h-8 flex-shrink-0 animate-bounce" />
              <div className="text-left">
                <h2 className="text-xl font-serif font-black text-bakery-bark">
                  {dbSetupError === 'RLS_ERROR' ? 'Supabase Row-Level Security (RLS) Aktif' : 'Tabel Database Belum Tersedia'}
                </h2>
                <p className="text-[10px] text-bakery-muted font-black uppercase tracking-widest mt-1">
                  Penyebab: {dbSetupError === 'RLS_ERROR' ? 'Akses Tulis Tanpa Kunci Diblokir' : 'Relasi Database Belum Dibuat'}
                </p>
              </div>
            </div>

            <p className="text-sm text-bakery-muted leading-relaxed mb-6 font-medium text-left">
              {dbSetupError === 'RLS_ERROR' 
                ? 'Sistem berhasil mendeteksi tabel Supabase Anda, namun data tidak bisa ditulis karena Row-Level Security (RLS) diaktifkan tanpa kebijakan (policy) publik. Untuk menyalakan sistem POS, silakan jalankan query SQL di bawah ini pada dashboard Supabase untuk menonaktifkan RLS:'
                : 'Sistem mendeteksi bahwa tabel-tabel database yang diperlukan belum dibuat di database Supabase Anda. Silakan jalankan query SQL di bawah ini pada dashboard Supabase Anda untuk membuat relasi tabel dan menonaktifkan RLS:'}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 bg-bakery-cream/50 border border-bakery-tan/20 p-4 rounded-2xl text-left">
                <span className="w-6 h-6 rounded-full bg-bakery-terracotta text-white flex items-center justify-center font-black text-xs">1</span>
                <p className="text-xs font-bold text-bakery-bark">Buka dashboard proyek Anda di <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-bakery-terracotta underline">Supabase Console</a>.</p>
              </div>
              <div className="flex items-center gap-3 bg-bakery-cream/50 border border-bakery-tan/20 p-4 rounded-2xl text-left">
                <span className="w-6 h-6 rounded-full bg-bakery-terracotta text-white flex items-center justify-center font-black text-xs">2</span>
                <p className="text-xs font-bold text-bakery-bark">Pilih menu <strong className="font-extrabold uppercase text-[10px] tracking-wider text-bakery-terracotta">SQL Editor</strong> di sidebar sebelah kiri.</p>
              </div>
              <div className="flex items-center gap-3 bg-bakery-cream/50 border border-bakery-tan/20 p-4 rounded-2xl text-left">
                <span className="w-6 h-6 rounded-full bg-bakery-terracotta text-white flex items-center justify-center font-black text-xs">3</span>
                <p className="text-xs font-bold text-bakery-bark">Klik <strong className="font-extrabold uppercase text-[10px] tracking-wider text-bakery-terracotta">+ New Query</strong>, tempelkan skrip SQL di bawah ini, lalu klik <strong className="font-extrabold uppercase text-[10px] tracking-wider text-bakery-terracotta">Run</strong>.</p>
              </div>
            </div>

            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-5 font-mono text-xs text-slate-300 max-h-60 overflow-y-auto mb-6 text-left">
              <pre className="whitespace-pre-wrap">{SETUP_SQL}</pre>
              <button
                onClick={handleCopySql}
                className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider py-2 px-3 rounded-xl transition-all flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-4 border-t border-bakery-tan/20 pt-6">
              <button
                onClick={() => setDbSetupError(null)}
                className="flex-1 py-4 bg-bakery-bark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-bakery-bark/90 transition-all active:scale-[0.98]"
              >
                Tutup Panduan
              </button>
              <button
                onClick={() => {
                  setDbSetupError(null);
                  handleInitialSetup();
                }}
                className="flex-1 py-4 bg-bakery-terracotta text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-bakery-terracotta/30"
              >
                Coba Lagi
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryDetails, setCategoryDetails] = useState<Record<string, { description: string, image: string, color: string }>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<'menu' | 'history' | 'reports' | 'settings' | 'loading'>('loading');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const userRole = currentUser?.role || 'kasir';
  const [adminSection, setAdminSection] = useState<'general' | 'reports' | 'history' | 'catalog' | 'kasir' | 'website'>('general');
  const [systemConfig, setSystemConfig] = useState({
    name: 'BroBread',
    logo: 'B',
    logoUrl: '',
    address: 'Jl. Raya No. 123, Purwokerto',
    phone: '0812-3456-7890',
    primaryColor: '#C58F72'
  });
  const [quotaError, setQuotaError] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    (window as any).showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({ message: msg, type });
    };
    return () => {
      delete (window as any).showToast;
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        const userDoc = await firebaseService.getUser(fbUser.uid);
        if (userDoc) {
          setCurrentUser(userDoc);
        } else {
          // Placeholder user
          const username = fbUser.email?.split('@')[0] || 'staff';
          setCurrentUser({
            id: fbUser.uid,
            name: fbUser.displayName || 'Staff',
            username: username,
            role: (username.toLowerCase() === 'admin' || fbUser.displayName === 'Administrator') ? 'admin' : 'kasir',
            pin: ''
          });
        }
        setView('menu');
      } else {
        setCurrentUser(null);
        setView('menu'); // View is 'menu' but not logged in will show login if needed
      }
    });
    return () => unsubscribe();
  }, []);

  // Data Listeners
  useEffect(() => {
    if (!currentUser) return;

    const handleDbError = (err: any) => {
      console.error("Firestore Listener Error captured: ", err);
      if (err?.code === 'resource-exhausted' || err?.message?.includes('resource-exhausted') || err?.message?.includes('Quota exceeded')) {
        setQuotaError(true);
      }
    };

    const unsubProducts = firebaseService.onProductsChange(setProducts, handleDbError);
    const unsubTransactions = firebaseService.onTransactionsChange(setTransactions, handleDbError);

    // Initial Fetch for categories and config
    firebaseService.getCategoriesWithDetails().then(catsWithDetails => {
      setCategories(catsWithDetails.map(c => c.name));
      const detailsMap: Record<string, { description: string, image: string, color: string }> = {};
      catsWithDetails.forEach(c => {
        detailsMap[c.name] = {
          description: c.description,
          image: c.image,
          color: c.color
        };
      });
      setCategoryDetails(detailsMap);
    }).catch(handleDbError);
    firebaseService.getConfig().then(cfg => {
      if (cfg) setSystemConfig(cfg);
    }).catch(handleDbError);

    return () => {
      unsubProducts();
      unsubTransactions();
    };
  }, [currentUser]);

  const refreshCategories = () => {
    firebaseService.getCategoriesWithDetails().then(catsWithDetails => {
      setCategories(catsWithDetails.map(c => c.name));
      const detailsMap: Record<string, { description: string, image: string, color: string }> = {};
      catsWithDetails.forEach(c => {
        detailsMap[c.name] = {
          description: c.description,
          image: c.image,
          color: c.color
        };
      });
      setCategoryDetails(detailsMap);
    }).catch(err => console.error("Error refreshing categories:", err));
  };
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'e-wallet' | 'card'>('cash');
  const [isSuccess, setIsSuccess] = useState(false);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [isProcessingQRIS, setIsProcessingQRIS] = useState(false);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailQty, setDetailQty] = useState(1);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleSaveEdit = async (updatedTx: Transaction, notes: string) => {
    const editLog = {
      timestamp: new Date(),
      changedBy: currentUser?.name || 'Admin',
      notes: notes
    };
    const txToSave = {
      ...updatedTx,
      editLogs: [...(updatedTx.editLogs || []), editLog]
    };

    try {
      await firebaseService.saveTransaction(txToSave);
      setEditingTransaction(null);
      toast("Perubahan transaksi berhasil disimpan!", "success");
    } catch (err) {
      toast("Gagal menyimpan perubahan transaksi.", "error");
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      setDetailQty(1);
    }
  }, [selectedProduct]);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('bakery_search_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bakery_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToSearchHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 5);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  // Category Icon Mapping
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Semua': return <Utensils className="w-3.5 h-3.5" />;
      case 'Bolen Pisang': return <Cookie className="w-3.5 h-3.5" />; // I'll assume Cookie is imported or use Utensils
      case 'Bolen Spesial': return <Star className="w-3.5 h-3.5" />;
      case 'Roti & Snack': return <Plus className="w-3.5 h-3.5" />;
      case 'Paket Box': return <Package className="w-3.5 h-3.5" />;
      case 'Minuman': return <Coffee className="w-3.5 h-3.5" />;
      default: return <MoreHorizontal className="w-3.5 h-3.5" />;
    }
  };

  // Get count per category
  const getCategoryCount = (category: string) => {
    if (category === 'Semua') return products.length;
    return products.filter(p => p.category === category).length;
  };

  // Sorted Transactions
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [transactions, sortOrder]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = activeCategory === 'Semua' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Cart total
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (discountType === 'percent') {
      return (cartTotal * discountValue) / 100;
    }
    return Math.min(discountValue, cartTotal);
  }, [cartTotal, discountValue, discountType]);

  const taxableAmount = useMemo(() => Math.max(0, cartTotal - discountAmount), [cartTotal, discountAmount]);
  const taxAmount = useMemo(() => taxableAmount * 0.11, [taxableAmount]);
  const totalWithTax = useMemo(() => taxableAmount + taxAmount, [taxableAmount, taxAmount]);

  const change = useMemo(() => {
    const received = parseFloat(cashReceived) || 0;
    return Math.max(0, received - totalWithTax);
  }, [cashReceived, totalWithTax]);

  // Add to cart
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Open cart automatically on first item on mobile if needed, 
    // but for now let's just show a clear indicator
  };

  // Remove/Decrement
  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
    setDiscountValue(0);
    setDiscountType('percent');
  };

  const [direction, setDirection] = useState(0);

  // Navigate between products in modal
  const navigateProduct = (newDirection: 'next' | 'prev') => {
    if (!selectedProduct) return;
    const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
    if (currentIndex === -1) return;

    let nextIndex;
    if (newDirection === 'next') {
      setDirection(1);
      nextIndex = (currentIndex + 1) % filteredProducts.length;
    } else {
      setDirection(-1);
      nextIndex = (currentIndex - 1 + filteredProducts.length) % filteredProducts.length;
    }
    setSelectedProduct(filteredProducts[nextIndex]);
  };

  // Finalize Transaction
  const handleCheckout = async () => {
    const newTransaction: Transaction = {
      id: `TX-${Date.now()}`,
      items: [...cart],
      total: totalWithTax,
      timestamp: new Date(),
      paymentMethod
    };

    try {
      await firebaseService.saveTransaction(newTransaction);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setShowCheckout(false);
        setCashReceived('');
        clearCart();
      }, 2000);
    } catch (err) {
      toast("Gagal menyimpan transaksi. Periksa koneksi Anda.", "error");
    }
  };

  if (!currentUser) {
    return <LoginView onLogin={setCurrentUser} config={systemConfig} />;
  }

  return (
    <div className="min-h-screen bg-bakery-cream flex flex-col md:flex-row">
      
      {/* Quota Exceeded Modal */}
      <AnimatePresence>
        {quotaError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white max-w-xl w-full rounded-[32px] p-8 md:p-10 shadow-2xl border border-red-100 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Subtle decorative background glow */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-red-100/50 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl" />

              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <h3 className="text-xl md:text-2xl font-serif font-black text-stone-900 mb-3 leading-tight">
                Kuota Harian Firestore Habis
              </h3>

              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                Aplikasi <strong>{systemConfig.name}</strong> saat ini mendeteksi bahwa kuota tulis/baca harian gratis (Spark Plan) untuk database Anda telah habis (<em>Quota exceeded</em>). 
              </p>

              <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 mb-6 text-left w-full space-y-2">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Info Quota & Solusi:
                </p>
                <ul className="list-disc pl-4 text-xs text-amber-900 leading-relaxed font-semibold space-y-1">
                  <li>Google mengatur ulang (reset) kuota gratis setiap hari pada pukul 14:00 WIB (00:00 PST).</li>
                  <li>Anda dapat memantau penggunaan unit database Firestore, atau meningkatkan ke paket berbayar di Firebase Console.</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full animate-fade-in">
                <a
                  href="https://console.firebase.google.com/project/brocodeid-project/firestore/databases/ai-studio-0897d681-c86c-4e15-8984-47b8f0b605de/data?openUpgradeDialog=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 bg-bakery-terracotta text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-bakery-terracotta/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
                >
                  Buka Firebase Console
                </a>
                <button
                  type="button"
                  onClick={() => setQuotaError(false)}
                  className="py-4 px-6 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl font-bold text-sm tracking-wide transition-all"
                >
                  Tutup Sementara
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sidebar for History / Dashboard (Desktop) */}
      <aside className="hidden md:flex w-24 flex-col bg-bakery-tan text-bakery-bark py-8 gap-8 items-center border-r border-bakery-tan/50 sticky top-0 h-screen">
        <div className="w-12 h-12 bg-bakery-terracotta rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-bakery-terracotta/20 overflow-hidden">
          {systemConfig.logoUrl ? (
            <img src={systemConfig.logoUrl} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            systemConfig.logo
          )}
        </div>
        <div className="flex flex-col gap-6 items-center flex-1">
          <button 
            onClick={() => setView('menu')}
            className={`p-3 rounded-2xl transition-all ${view === 'menu' ? 'bg-white shadow-sm text-bakery-terracotta' : 'text-bakery-muted hover:text-bakery-terracotta'}`}
            title="Menu Pesanan"
          >
            <ShoppingBag className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setView('history')}
            className={`p-3 rounded-2xl transition-all ${view === 'history' ? 'bg-white shadow-sm text-bakery-terracotta' : 'text-bakery-muted hover:text-bakery-terracotta'}`}
            title="Riwayat Transaksi"
          >
            <History className="w-6 h-6" />
          </button>

          <button 
            onClick={() => setView('reports')}
            className={`p-3 rounded-2xl transition-all ${view === 'reports' ? 'bg-white shadow-sm text-bakery-terracotta' : 'text-bakery-muted hover:text-bakery-terracotta'}`}
            title="Laporan Penjualan"
          >
            <BarChart3 className="w-6 h-6" />
          </button>

          {userRole === 'admin' && (
            <button 
              onClick={() => { setView('settings'); setAdminSection('general'); }}
              className={`p-3 rounded-2xl transition-all ${view === 'settings' ? 'bg-white shadow-sm text-bakery-terracotta' : 'text-bakery-muted hover:text-bakery-terracotta'}`}
              title="Panel Administrator"
            >
              <Settings className="w-6 h-6" />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3 items-center">
          <button 
            onClick={() => firebaseService.logout()}
            className="p-3 rounded-2xl text-red-400 hover:text-red-600 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-6 h-6" />
          </button>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm ${userRole === 'admin' ? 'bg-bakery-bark' : 'bg-bakery-terracotta'}`}>
            {currentUser?.name.slice(0, 1).toUpperCase()}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-bakery-cream relative min-h-screen">
        
        {/* Header - Sticky and more compact on mobile */}
        <header className="px-5 py-4 md:px-10 md:py-8 flex items-center justify-between bg-white/60 backdrop-blur-xl border-b border-bakery-tan/20 sticky top-0 z-30 shadow-sm md:shadow-none">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-bakery-terracotta rounded-2xl flex items-center justify-center text-white font-bold text-xl md:hidden shadow-xl shadow-bakery-terracotta/30 overflow-hidden">
              {systemConfig.logoUrl ? (
                <img src={systemConfig.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                systemConfig.logo
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-black text-bakery-bark leading-none tracking-tight">{systemConfig.name}</h1>
              <p className="hidden md:block text-xs text-bakery-muted mt-2 font-bold uppercase tracking-[0.2em]">{currentUser.name} • {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white px-4 py-2 rounded-2xl border border-bakery-tan/50 shadow-sm">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2.5 shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-pulse"></span>
              <span className="text-[10px] font-black text-bakery-bark uppercase tracking-[0.2em]">Online</span>
            </div>
          </div>
        </header>

        {/* Product Browser */}
        <div className="flex-1 px-4 md:px-10 py-6 md:py-10">
          {view === 'history' ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-32">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold">Riwayat Transaksi</h2>
                <div className="flex items-center bg-white border border-bakery-tan/50 rounded-xl p-1 shadow-sm">
                  <button 
                    onClick={() => setSortOrder('newest')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sortOrder === 'newest' ? 'bg-bakery-terracotta text-white shadow-sm' : 'text-bakery-muted hover:bg-bakery-cream'}`}
                  >
                    Terbaru
                  </button>
                  <button 
                    onClick={() => setSortOrder('oldest')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sortOrder === 'oldest' ? 'bg-bakery-terracotta text-white shadow-sm' : 'text-bakery-muted hover:bg-bakery-cream'}`}
                  >
                    Terlama
                  </button>
                </div>
              </div>
              {sortedTransactions.length === 0 ? (
                <div className="text-center py-24 opacity-20 flex flex-col items-center">
                  <History className="w-16 h-16 mb-4 stroke-1" />
                  <p className="font-medium">Belum ada riwayat penjualan.</p>
                </div>
              ) : (
                sortedTransactions.map(tx => (
                  <div key={tx.id} className="card-bakery p-5 flex flex-col gap-4 border-bakery-tan/30">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-mono text-bakery-terracotta font-black">{tx.id}</p>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                          <span>{tx.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                          <span className="text-bakery-muted">{tx.paymentMethod}</span>
                        </div>
                      </div>
                      <div className="flex justify-between sm:flex-col items-end pt-3 sm:pt-0 border-t sm:border-t-0 border-bakery-tan/20 grow">
                        <div className="flex items-center gap-4">
                          {userRole === 'admin' && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setEditingTransaction(tx)}
                                className="p-2.5 bg-bakery-bark/5 hover:bg-bakery-bark/10 text-bakery-bark rounded-xl transition-all"
                                title="Edit Transaksi"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => { if (confirm('Hapus riwayat transaksi ini?')) setTransactions(transactions.filter(t => t.id !== tx.id)); }}
                                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all"
                                title="Hapus Transaksi"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          <div className="text-right">
                            <p className="text-lg font-black text-bakery-bark">{formatPrice(tx.total)}</p>
                            <p className="text-[10px] text-bakery-muted font-bold uppercase">{tx.items.reduce((a, b) => a + b.quantity, 0)} Item</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {tx.editLogs && tx.editLogs.length > 0 && (
                      <div className="p-4 bg-yellow-50/50 rounded-2xl border border-yellow-100/50">
                        <div className="flex items-center gap-2 mb-2">
                          <FileClock className="w-3.5 h-3.5 text-yellow-600" />
                          <span className="text-[9px] font-black uppercase text-yellow-700 tracking-wider">Riwayat Perubahan</span>
                        </div>
                        <div className="space-y-2">
                          {tx.editLogs.map((log, i) => (
                            <div key={i} className="text-[10px] text-yellow-800 flex flex-col gap-0.5 border-t border-yellow-200/30 pt-2 first:border-0 first:pt-0">
                              <span className="font-bold">[{new Date(log.timestamp).toLocaleString('id-ID')}] {log.changedBy}</span>
                              <span className="opacity-80 leading-relaxed italic">"{log.notes}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          ) : view === 'reports' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32">
                <ReportsDashboard transactions={transactions} />
            </motion.div>
          ) : view === 'settings' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32">
                <SettingsView 
                  config={systemConfig} 
                  setConfig={(newConfig) => {
                    setSystemConfig(newConfig);
                    firebaseService.saveConfig(newConfig);
                  }} 
                  userRole={userRole} 
                  setView={setView}
                  activeSection={adminSection}
                  setActiveSection={setAdminSection}
                  transactions={transactions}
                  setCurrentUser={setCurrentUser}
                  products={products}
                  setProducts={setProducts}
                  categories={categories}
                  setCategories={setCategories}
                  categoryDetails={categoryDetails}
                  setCategoryDetails={setCategoryDetails}
                  refreshCategories={refreshCategories}
                />
            </motion.div>
          ) : (
            <div className="pb-40">
              {/* Promotional Banner (Mobile Only) */}
              <div className="md:hidden mb-8 bg-bakery-bark p-6 rounded-[32px] text-white relative overflow-hidden shadow-xl shadow-bakery-bark/20">
                <div className="relative z-10">
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase text-bakery-tan mb-1">Mulai Berjualan</p>
                  <h2 className="text-2xl font-serif font-bold leading-tight">Suguhkan Manisnya <br/>Hari Ini.</h2>
                </div>
                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-bakery-terracotta/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-[-20%] left-[40%] w-24 h-24 bg-bakery-tan/10 rounded-full blur-xl"></div>
              </div>

              {/* Search & Categories */}
              <div className="mb-8 space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-bakery-muted/60 group-focus-within:text-bakery-terracotta transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Apa yang pelanggan cari?" 
                      className="w-full bg-white border-2 border-bakery-tan/20 rounded-3xl py-4 pl-14 pr-4 focus:ring-4 focus:ring-bakery-terracotta/10 focus:border-bakery-terracotta/50 outline-none transition-all shadow-sm placeholder:text-bakery-muted/40 text-sm font-semibold"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addToSearchHistory(searchQuery);
                        }
                      }}
                    />
                  </div>
                  
                  {searchHistory.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 px-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-bakery-muted/40 mr-1">Terakhir:</span>
                      {searchHistory.map((h, i) => (
                        <button 
                          key={i}
                          onClick={() => {
                            setSearchQuery(h);
                            setActiveCategory('Semua');
                          }}
                          className="bg-bakery-tan/20 hover:bg-bakery-tan/40 text-bakery-bark px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border border-bakery-tan/10"
                        >
                          {h}
                        </button>
                      ))}
                      <button 
                        onClick={clearSearchHistory}
                        className="ml-auto text-[9px] font-black uppercase tracking-widest text-bakery-terracotta/60 hover:text-bakery-terracotta transition-colors px-2"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="relative -mx-4 md:-mx-8 group/slider">
                  <div 
                    ref={scrollContainerRef}
                    className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-4 md:px-8 scroll-smooth"
                  >
                    {categories.map(cat => {
                      const isActive = activeCategory === cat;
                      const count = getCategoryCount(cat);
                      
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`whitespace-nowrap px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all border-2 active:scale-95 flex items-center gap-2.5 shrink-0 ${
                            isActive 
                              ? 'bg-bakery-terracotta text-white border-bakery-terracotta shadow-xl shadow-bakery-terracotta/30' 
                              : 'bg-white text-bakery-muted border-bakery-tan/30 hover:border-bakery-terracotta/20 hover:bg-bakery-cream/20'
                          }`}
                        >
                          <span className={isActive ? 'text-white' : 'text-bakery-terracotta/60'}>
                            {getCategoryIcon(cat)}
                          </span>
                          {cat}
                          <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black ${
                            isActive ? 'bg-white/20 text-white' : 'bg-bakery-tan/20 text-bakery-muted'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Navigation Buttons */}
                  <button 
                    onClick={() => scrollCategories('left')}
                    className="absolute left-1 md:left-2 top-[42%] -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white shadow-xl border border-bakery-tan/50 rounded-full flex items-center justify-center text-bakery-terracotta z-20 active:scale-95 transition-all hover:scale-110 shadow-bakery-terracotta/10"
                    aria-label="Scroll Left"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => scrollCategories('right')}
                    className="absolute right-1 md:right-2 top-[42%] -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white shadow-xl border border-bakery-tan/50 rounded-full flex items-center justify-center text-bakery-terracotta z-20 active:scale-95 transition-all hover:scale-110 shadow-bakery-terracotta/10"
                    aria-label="Scroll Right"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Subtle edge masks for scroll indicators */}
                  <div className="absolute top-0 right-0 bottom-4 w-16 bg-gradient-to-l from-bakery-cream to-transparent pointer-events-none z-0"></div>
                  <div className="absolute top-0 left-0 bottom-4 w-16 bg-gradient-to-r from-bakery-cream to-transparent pointer-events-none z-0"></div>
                </div>
              </div>

              {/* Category Detail Header */}
              <AnimatePresence mode="wait">
                {activeCategory !== 'Semua' && (categoryDetails[activeCategory] || CATEGORY_DETAILS[activeCategory]) && (() => {
                  const activeCatDetails = categoryDetails[activeCategory] || CATEGORY_DETAILS[activeCategory];
                  return (
                    <motion.div 
                      key={activeCategory}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mb-10 relative overflow-hidden rounded-[32px] border border-bakery-tan/30 group"
                    >
                      <div className="absolute inset-0 z-0">
                        {activeCatDetails.image && (
                          <img 
                            src={activeCatDetails.image} 
                            alt="" 
                            className="w-full h-full object-cover opacity-20 transition-transform duration-[2s] group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className={`absolute inset-0 bg-gradient-to-br ${activeCatDetails.color || 'from-yellow-400/10 to-orange-500/10'} backdrop-blur-[2px]`} />
                      </div>
                      <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-bakery-terracotta text-white p-2 rounded-xl shadow-lg shadow-bakery-terracotta/20">
                              {getCategoryIcon(activeCategory)}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif font-black text-bakery-bark">
                               {activeCategory}
                            </h2>
                          </div>
                          <p className="text-bakery-bark/70 text-sm md:text-base leading-relaxed font-semibold">
                            {activeCatDetails.description}
                          </p>
                        </div>
                        <div className="shrink-0 space-y-2 text-right">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-bakery-muted/60">Tersedia</div>
                          <div className="text-2xl font-serif font-bold text-bakery-bark">
                            {getCategoryCount(activeCategory)} Menu pilihan
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

              {/* Product Grid - Visual Focus */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p, idx) => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      index={idx} 
                      onDetail={() => setSelectedProduct(p)} 
                      onAdd={() => addToCart(p)} 
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Improved Mobile Navigation & Cart Summary - Integrated Bar */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-40 space-y-4">
          <AnimatePresence>
            {view === 'menu' && cart.length > 0 && (
              <motion.button 
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="w-full bg-bakery-bark text-white p-2 rounded-[28px] flex items-center justify-between shadow-2xl shadow-bakery-bark/40 active:scale-[0.98] transition-all border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-bakery-terracotta h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] uppercase font-black text-bakery-tan tracking-widest">Pesanan Baru</span>
                    <span className="font-black text-sm whitespace-nowrap">Lihat Daftar</span>
                  </div>
                </div>
                <div className="px-6 py-2 bg-white/10 rounded-2xl border border-white/10 mx-1">
                  <span className="font-black text-base">{formatPrice(cartTotal)}</span>
                </div>
              </motion.button>
            )}
          </AnimatePresence>

          <nav className="bg-white/95 backdrop-blur-xl rounded-[32px] p-2 border border-bakery-tan shadow-[0_20px_50px_rgba(74,55,40,0.15)] flex gap-1.5 items-center w-full">
            <button 
              onClick={() => setView('menu')}
              className={`flex-1 py-1.5 sm:py-3.5 px-0.5 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2.5 transition-all ${
                view === 'menu' 
                  ? 'bg-bakery-terracotta text-white shadow-xl shadow-bakery-terracotta/20 scale-[1.02]' 
                  : 'text-bakery-muted font-bold'
              }`}
            >
              <Store className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">Menu</span>
            </button>
            
            <button 
              onClick={() => setView('history')}
              className={`flex-1 py-1.5 sm:py-3.5 px-0.5 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2.5 transition-all ${
                view === 'history' 
                  ? 'bg-bakery-terracotta text-white shadow-xl shadow-bakery-terracotta/20 scale-[1.02]' 
                  : 'text-bakery-muted font-bold'
              }`}
            >
              <History className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">Riwayat</span>
            </button>
            <button 
              onClick={() => setView('reports')}
              className={`flex-1 py-1.5 sm:py-3.5 px-0.5 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2.5 transition-all ${
                view === 'reports' 
                  ? 'bg-bakery-terracotta text-white shadow-xl shadow-bakery-terracotta/20 scale-[1.02]' 
                  : 'text-bakery-muted font-bold'
              }`}
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">Laporan</span>
            </button>
            {userRole === 'admin' && (
              <button 
                onClick={() => { setView('settings'); setAdminSection('general'); }}
                className={`flex-1 py-1.5 sm:py-3.5 px-0.5 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2.5 transition-all ${
                  view === 'settings' 
                    ? 'bg-bakery-terracotta text-white shadow-xl shadow-bakery-terracotta/20 scale-[1.02]' 
                    : 'text-bakery-muted font-bold'
                }`}
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">Admin</span>
              </button>
            )}
            <button 
              onClick={() => firebaseService.logout()}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-red-500 bg-red-50 active:bg-red-100 transition-all border border-red-100/50"
              title="Keluar"
            >
              <LogOut className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>
          </nav>
        </div>
      </main>

      {/* Cart Panel (Desktop Sidebar / Mobile Drawer) */}
      <AnimatePresence>
        {(isCartOpen || isDesktop) && (
          <>
            {/* Backdrop for Mobile */}
            {isCartOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="fixed inset-0 bg-bakery-bark/40 backdrop-blur-sm z-40 md:hidden"
              />
            )}
            
            <motion.aside
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[400px] md:sticky md:top-0 md:h-screen md:w-[380px] bg-white md:my-6 md:mr-6 md:rounded-[2.5rem] z-50 md:z-auto flex flex-col border border-bakery-tan shadow-2xl shadow-bakery-terracotta/10 overflow-hidden"
            >
              <div className="p-6 md:p-8 border-b border-bakery-tan/30 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex flex-col">
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-bakery-bark">Pesanan Baru</h2>
                  <p className="text-xs text-bakery-muted font-bold tracking-widest uppercase mt-1">Order #8421</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={clearCart} className="p-2 text-bakery-muted hover:text-red-500 transition-colors bg-bakery-cream rounded-xl">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 text-stone-400 bg-bakery-cream rounded-xl md:hidden">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                    <ShoppingBag className="w-16 h-16 mb-4 text-bakery-terracotta" />
                    <p className="font-medium">Belum ada item ditambahkan</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div 
                      layout 
                      key={item.product.id} 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 items-center group"
                    >
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-bakery-cream rounded-xl shrink-0 overflow-hidden border border-bakery-tan/30">
                        <img 
                          src={item.product.image} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm leading-tight text-bakery-bark truncate">{item.product.name}</h4>
                        <p className="text-xs text-bakery-muted mt-1 font-bold tracking-tight">{formatPrice(item.product.price)}</p>
                      </div>
                      <div className="flex items-center bg-bakery-cream rounded-2xl p-1 gap-1 border border-bakery-tan/40 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-xl transition-all text-bakery-terracotta active:scale-90 hover:shadow-sm"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-bakery-bark">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-xl transition-all text-bakery-terracotta active:scale-90 hover:shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => setCart(prev => prev.filter(p => p.product.id !== item.product.id))}
                        className="p-2 text-bakery-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-6 md:p-8 space-y-6 bg-bakery-cream/30 border-t border-dashed border-bakery-tan pb-safe">
                {/* Discount Interface */}
                <div className="p-4 bg-white rounded-2xl border border-bakery-tan/50 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-bakery-muted">Potongan / Diskon</span>
                    <div className="flex items-center bg-bakery-cream p-1 rounded-lg border border-bakery-tan/30">
                      <button 
                        onClick={() => setDiscountType('percent')}
                        className={`px-2 py-1 rounded-md text-[9px] font-black transition-all ${discountType === 'percent' ? 'bg-bakery-terracotta text-white shadow-sm' : 'text-bakery-muted'}`}
                      >
                        %
                      </button>
                      <button 
                        onClick={() => setDiscountType('fixed')}
                        className={`px-2 py-1 rounded-md text-[9px] font-black transition-all ${discountType === 'fixed' ? 'bg-bakery-terracotta text-white shadow-sm' : 'text-bakery-muted'}`}
                      >
                        Rp
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-bakery-muted/40" />
                    <input 
                      type="number"
                      placeholder="Masukan nominal..."
                      className="w-full bg-bakery-cream/20 border border-bakery-tan/30 rounded-xl py-2.5 pl-9 pr-10 text-xs font-bold outline-none focus:border-bakery-terracotta transition-colors"
                      value={discountValue === 0 ? '' : discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                    />
                    {discountValue > 0 && (
                      <button 
                        onClick={() => setDiscountValue(0)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-bakery-muted hover:text-bakery-terracotta transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-bakery-muted text-[10px] font-black uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-bakery-bark">{formatPrice(cartTotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 text-[10px] font-black uppercase tracking-widest">
                      <span>Diskon</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-bakery-muted text-[10px] font-black uppercase tracking-widest">
                    <span>PPN (11%)</span>
                    <span className="text-bakery-bark">{formatPrice(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xl md:text-2xl pt-4 border-t border-bakery-tan/30">
                    <span className="font-serif font-bold text-bakery-bark">Total</span>
                    <span className="font-bold text-bakery-terracotta">{formatPrice(totalWithTax)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    disabled={cart.length === 0}
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-bakery-terracotta text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-bakery-terracotta/30 hover:scale-[0.98] transition-all"
                  >
                    Lanjut Pembayaran
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Transition Overlay */}
      <AnimatePresence mode="wait">
        {editingTransaction && (
          <TransactionEditModal 
            transaction={editingTransaction}
            onSave={handleSaveEdit}
            onClose={() => setEditingTransaction(null)}
          />
        )}
        {showCheckout && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4"
          >
            <motion.div 
              className="absolute inset-0 bg-bakery-bark/60 backdrop-blur-sm"
              onClick={() => !isSuccess && setShowCheckout(false)}
            />
            
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-lg bg-white rounded-t-[40px] md:rounded-[40px] overflow-hidden shadow-2xl border border-bakery-tan flex flex-col max-h-[95vh]"
            >
              {!isSuccess ? (
                <div className="p-6 md:p-10 overflow-y-auto pb-safe">
                  <div className="flex justify-between items-center mb-6 md:mb-8 sticky top-0 bg-white z-10 pt-2">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-bakery-bark">Pembayaran</h2>
                      <p className="text-xs md:text-sm text-bakery-muted font-medium">Pilih metode pembayaran</p>
                    </div>
                    <button onClick={() => setShowCheckout(false)} className="p-2 md:p-3 bg-bakery-cream text-bakery-terracotta rounded-full border border-bakery-tan">
                      <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
                    {[
                      { id: 'cash', label: 'Tunai', icon: Banknote },
                      { id: 'card', label: 'Kartu', icon: CreditCard },
                      { id: 'e-wallet', label: 'QRIS', icon: Smartphone },
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`flex flex-col items-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all ${
                          paymentMethod === method.id 
                            ? 'border-bakery-terracotta bg-bakery-tan/20 text-bakery-terracotta shadow-sm' 
                            : 'border-bakery-tan bg-bakery-cream/30 text-bakery-muted grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-bakery-terracotta/40'
                        }`}
                      >
                        <method.icon className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{method.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-bakery-cream p-6 md:p-8 rounded-[24px] md:rounded-[32px] mb-6 md:mb-8 space-y-3 border border-bakery-tan/50 shadow-inner">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-bakery-muted/60">
                      <span>Subtotal</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-green-600">
                        <span>Diskon</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-bakery-muted/60">
                      <span>PPN (11%)</span>
                      <span>{formatPrice(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-bakery-tan/20">
                      <span className="text-[10px] md:text-xs font-black text-bakery-muted uppercase tracking-[0.2em]">Total Bayar</span>
                      <span className="text-2xl md:text-3xl font-black tracking-tight text-bakery-terracotta">{formatPrice(totalWithTax)}</span>
                    </div>
                    {paymentMethod === 'cash' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-4 md:pt-6 border-t border-bakery-tan/30 space-y-4 md:space-y-6"
                      >
                        <div>
                          <label className="block text-[10px] md:text-xs font-bold text-bakery-muted uppercase tracking-widest mb-2 md:mb-3">Uang Diterima (IDR)</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              inputMode="numeric"
                              placeholder="0" 
                              className="w-full bg-white border border-bakery-tan py-3 px-4 md:py-4 md:px-6 rounded-xl md:rounded-2xl font-bold text-xl md:text-2xl outline-none focus:ring-4 focus:ring-bakery-terracotta/10 text-bakery-bark"
                              value={cashReceived}
                              onChange={(e) => setCashReceived(e.target.value)}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                                {[50000, 100000].map(val => (
                                  <button 
                                    key={val}
                                    onClick={() => setCashReceived(val.toString())}
                                    className="bg-bakery-tan/30 hover:bg-bakery-tan/50 text-bakery-terracotta text-[9px] font-bold px-2 py-1 rounded-md transition-colors border border-bakery-tan/30"
                                  >
                                    {val/1000}k
                                  </button>
                                ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-bakery-tan/50">
                          <span className="text-[10px] font-bold text-bakery-muted uppercase tracking-widest">Kembalian</span>
                          <span className={`text-xl font-bold ${change > 0 ? 'text-green-600' : 'text-stone-300'}`}>
                            {formatPrice(change)}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'e-wallet' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="pt-4 md:pt-6 border-t border-bakery-tan/30 flex flex-col items-center gap-4 md:gap-6"
                      >
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-white p-2 md:p-3 rounded-2xl md:rounded-3xl border-4 border-bakery-tan shadow-xl overflow-hidden relative">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BroBread-${totalWithTax}`}
                            className={`w-full h-full object-contain ${isProcessingQRIS ? 'blur-sm grayscale' : ''}`}
                            alt="QRIS Code"
                          />
                          {isProcessingQRIS && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 border-4 border-bakery-terracotta border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-bakery-bark mb-1">Scan QRIS</p>
                          <p className="text-[10px] text-bakery-muted">Mendukung semua pembayaran Digital</p>
                        </div>
                        <button 
                          onClick={() => {
                            setIsProcessingQRIS(true);
                            setTimeout(() => {
                              setIsProcessingQRIS(false);
                              handleCheckout();
                            }, 2000);
                          }}
                          className="w-full bg-bakery-tan/30 text-bakery-terracotta py-2.5 rounded-xl text-[10px] font-bold border border-bakery-tan hover:bg-white transition-all"
                        >
                          Simulasi Berhasil
                        </button>
                      </motion.div>
                    )}
                  </div>

                  <button 
                    disabled={(paymentMethod === 'cash' && (parseFloat(cashReceived) || 0) < totalWithTax) || isProcessingQRIS}
                    onClick={handleCheckout}
                    className="w-full btn-primary py-4 md:py-5 text-base md:text-lg font-bold shadow-xl shadow-bakery-terracotta/30 disabled:grayscale disabled:opacity-50"
                  >
                    {isProcessingQRIS ? 'Memproses...' : (paymentMethod === 'cash' && (parseFloat(cashReceived) || 0) < totalWithTax ? 'Cek Nominal' : 'Konfirmasi & Cetak')}
                  </button>
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center h-[50vh] md:h-auto">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                    className="w-20 h-20 md:w-24 md:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-bakery-bark mb-2">Berhasil!</h2>
                  <p className="text-sm text-stone-500 mb-8">Transaksi selesai. Struk sedang dicetak.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4"
          >
            <motion.div 
              className="absolute inset-0 bg-bakery-bark/70 backdrop-blur-md"
              onClick={() => setSelectedProduct(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-t-[40px] md:rounded-[48px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] touch-none"
            >
              {/* Navigation Arrows for Desktop */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50 hidden md:block">
                <button 
                  onClick={(e) => { e.stopPropagation(); navigateProduct('prev'); }}
                  className="p-3 bg-white/90 backdrop-blur rounded-2xl shadow-xl hover:bg-bakery-terracotta hover:text-white transition-all text-bakery-terracotta"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 hidden md:block">
                <button 
                  onClick={(e) => { e.stopPropagation(); navigateProduct('next'); }}
                  className="p-3 bg-white/90 backdrop-blur rounded-2xl shadow-xl hover:bg-bakery-terracotta hover:text-white transition-all text-bakery-terracotta"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div 
                  key={selectedProduct.id}
                  custom={direction}
                  initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -100) navigateProduct('next');
                    if (info.offset.x > 100) navigateProduct('prev');
                  }}
                  className="w-full flex flex-col md:flex-row"
                >
                  <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-bakery-cream">
                    {/* Index Indicator */}
                    <div className="absolute top-6 right-6 z-20 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-bakery-terracotta border border-bakery-tan/30 shadow-sm md:hidden">
                      {filteredProducts.findIndex(p => p.id === selectedProduct.id) + 1} / {filteredProducts.length}
                    </div>
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => setSelectedProduct(null)}
                      className="absolute top-6 left-6 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-xl md:hidden"
                    >
                      <X className="w-6 h-6 text-bakery-terracotta" />
                    </button>
                  </div>

                  <div className="flex-1 p-8 md:p-12 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start mb-6 hidden md:flex">
                      <div className="flex flex-col gap-1">
                        <span className="bg-bakery-tan/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-bakery-terracotta w-fit">
                          {selectedProduct.category}
                        </span>
                        <span className="text-[10px] font-bold text-bakery-muted/60 ml-1">
                          Item {filteredProducts.findIndex(p => p.id === selectedProduct.id) + 1} of {filteredProducts.length}
                        </span>
                      </div>
                      <button onClick={() => setSelectedProduct(null)} className="text-bakery-muted hover:text-bakery-terracotta transition-colors">
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-bakery-bark mb-4 leading-tight">
                        {selectedProduct.name}
                      </h2>
                      <p className="text-2xl font-black text-bakery-terracotta mb-6">
                        {formatPrice(selectedProduct.price)}
                      </p>
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-bakery-muted">Deskripsi menu</h4>
                        <p className="text-stone-500 text-sm leading-relaxed font-medium">
                          Nikmati kelezatan {selectedProduct.name} kami yang legendaris. Dibuat dengan resep turun-temurun, menggunakan mentega berkualitas tinggi dan bahan-bahan pilihan untuk tekstur yang lembut di dalam dan renyah di luar.
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto space-y-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center bg-bakery-cream rounded-2xl p-1.5 gap-2 border border-bakery-tan/40 shadow-sm">
                          <button 
                            onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-bakery-terracotta active:scale-90 hover:shadow-sm"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="w-10 text-center text-lg font-black text-bakery-bark">{detailQty}</span>
                          <button 
                            onClick={() => setDetailQty(detailQty + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-bakery-terracotta active:scale-90 hover:shadow-sm"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex-1 flex flex-col items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest text-bakery-muted/60 mb-1">Total Harga</span>
                          <span className="text-xl font-black text-bakery-bark">{formatPrice(selectedProduct.price * detailQty)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 bg-bakery-cream p-4 rounded-2xl border border-bakery-tan/50">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-xs font-bold text-bakery-bark">Tersedia Stok Hari Ini</span>
                      </div>
                      
                      <button 
                        onClick={() => {
                          const existing = cart.find(i => i.product.id === selectedProduct.id);
                          if (existing) {
                            updateQuantity(selectedProduct.id, detailQty);
                          } else {
                            setCart([...cart, { product: selectedProduct, quantity: detailQty }]);
                          }
                          setSelectedProduct(null);
                        }}
                        className="w-full bg-bakery-terracotta text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-bakery-terracotta/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                      >
                        <Plus className="w-6 h-6" />
                        Tambah ke Pesanan
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 bg-white px-5 py-4 rounded-2xl shadow-xl border border-bakery-tan/20 max-w-sm"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              toast.type === 'success' ? 'bg-green-50 text-green-600' :
              toast.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
               toast.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <Package className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-bold uppercase tracking-wider text-bakery-muted">
                {toast.type === 'success' ? 'Sukses' :
                 toast.type === 'error' ? 'Peringatan' : 'Informasi'}
              </p>
              <p className="text-xs font-black text-bakery-bark leading-snug mt-0.5">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="p-1 rounded-lg text-bakery-muted hover:text-bakery-bark transition-colors hover:bg-bakery-cream"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
