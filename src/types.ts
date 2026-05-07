/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'kasir';
  pin: string;
}

export interface EditLog {
  timestamp: Date;
  changedBy: string;
  notes: string;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  paymentMethod: 'cash' | 'e-wallet' | 'card';
  editLogs?: EditLog[];
}
