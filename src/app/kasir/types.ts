export interface Customer {
  id: string;
  customerName: string;
  customerPhone: string;
  capster: { name: string };
  jamMasuk: string;
  jamSelesai?: string;
  status: string;
  paymentMethod?: string;
  visitServices?: {
    service: {
      id: string;
      name: string;
      basePrice: number;
      category: string;
    };
  }[];
  serviceTransactions?: {
    paketName: string;
    priceFinal: number;
    paymentMethod: string;
    closingById: string;
  }[];
  productTransactions?: any[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
}

export interface Capster {
  id: string;
  name: string;
}

export interface Kasir {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  basePrice: number;
}

export interface ServiceCapsterPair {
  serviceId: string;
  capsterId: string;
}

export interface NewCustomerForm {
  name: string;
  phone: string;
  serviceCapsterPairs: ServiceCapsterPair[];
}

export interface ProductSaleForm {
  customerName: string;
  customerPhone: string;
  products: { id: string; quantity: number }[];
  paymentMethod: string;
  completedBy: string;
  recommendedBy: string;
}

export interface ExpenseForm {
  nominal: string;
  category: string;
  note: string;
}

export interface HistoryFilters {
  dateFrom: string;
  dateTo: string;
  type: string;
}

export interface DailySummary {
  total: number;
  cash: number;
  qris: number;
}

export interface ConfirmModalData {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export interface AdvanceForm {
  staffId: string;
  staffRole: string;
  staffName: string;
  amount: string;
  note: string;
}
