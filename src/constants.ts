/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export const CATEGORIES = ['Semua', 'Bolen Pisang', 'Bolen Spesial', 'Roti & Snack', 'Paket Box', 'Minuman'];

export const PRODUCTS: Product[] = [
  {
    id: 'b1',
    name: 'Bolen Pisang Keju',
    price: 35000,
    category: 'Bolen Pisang',
    description: 'Pastry renyah dengan isian pisang raja manis dan potongan keju gurih.',
    image: 'https://images.unsplash.com/photo-1621236304845-8d13ed539370?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 'b2',
    name: 'Bolen Pisang Cokelat',
    price: 35000,
    category: 'Bolen Pisang',
    description: 'Perpaduan sempurna pisang manis dan cokelat lumer berkualitas.',
    image: 'https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 'b3',
    name: 'Bolen Pisang Cokelat Keju',
    price: 38000,
    category: 'Bolen Pisang',
    description: 'Kombinasi lengkap cokelat lumer dan keju parut di dalam satu lapis bolen.',
    image: 'https://images.unsplash.com/photo-1555507036-ab10bc72b243?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 's1',
    name: 'Bolen Durian King',
    price: 48000,
    category: 'Bolen Spesial',
    description: 'Edisi premium dengan isian durian montong asli yang legit dan harum.',
    image: 'https://images.unsplash.com/photo-1548364538-60b952c308b9?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 's2',
    name: 'Bolen Tape Ketan',
    price: 32000,
    category: 'Bolen Spesial',
    description: 'Isian tape pilihan dengan paduan ketan hitam yang unik dan legit.',
    image: 'https://images.unsplash.com/photo-1558961359-1d99283f085c?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 's3',
    name: 'Bolen Nanas Madu',
    price: 32000,
    category: 'Bolen Spesial',
    description: 'Isian selai nanas madu buatan sendiri yang segar dan manis alami.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 'r1',
    name: 'Roti Keset Susu',
    price: 25000,
    category: 'Roti & Snack',
    description: 'Roti sobek super lembut dengan olesan susu dan mentega premium.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 'r2',
    name: 'Brownies Panggang',
    price: 45000,
    category: 'Roti & Snack',
    description: 'Brownies cokelat padat dengan crust yang shiny dan topping almond.',
    image: 'https://images.unsplash.com/photo-1464347719102-1c5137ad6bad?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 'p1',
    name: 'Hantaran Box (Isi 10)',
    price: 68000,
    category: 'Paket Box',
    description: 'Box eksklusif berisi 10 bolen campur, cocok untuk buah tangan.',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 'p2',
    name: 'Family Pack (Isi 20)',
    price: 125000,
    category: 'Paket Box',
    description: 'Paket besar lebih hemat untuk dinikmati bersama seluruh anggota keluarga.',
    image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 'm1',
    name: 'Es Kopi Susu Mantap',
    price: 18000,
    category: 'Minuman',
    description: 'Kopi susu gula aren andalan pendamping makan bolen.',
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 'm2',
    name: 'Thai Tea Special',
    price: 15000,
    category: 'Minuman',
    description: 'Teh Thailand autentik dengan susu evaporasi yang creamy.',
    image: 'https://images.unsplash.com/photo-1558961359-1d99283f085c?q=80&w=400&h=400&auto=format&fit=crop'
  },
];
