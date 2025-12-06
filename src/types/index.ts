export interface User {
  id: string;
  username: string;
  role: 'ADMIN' | 'KASIR';
  cabangId: string | null;
  cabangName?: string | null;
}

export interface Session {
  userId: string;
  username: string;
  role: string;
  cabangId: string | null;
  selectedKasirId: string | null;
}

export interface Kasir {
  id: string;
  name: string;
  phone: string | null;
}

export interface Capster {
  id: string;
  name: string;
  phone: string | null;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  commissionRate: number;
}

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  commissionPerUnit: number;
}

export interface Gallery {
  id: string;
  position: number;
  url: string;
  filename: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
}
