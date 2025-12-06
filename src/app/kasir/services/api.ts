import type { NewCustomerForm, ProductSaleForm, ExpenseForm } from '../types';

export const kasirApi = {
  fetchCustomers: async () => {
    const response = await fetch('/api/kasir/customers');
    if (response.ok) return response.json();
    throw new Error('Failed to fetch customers');
  },

  fetchServices: async () => {
    const response = await fetch('/api/kasir/services');
    if (response.ok) return response.json();
    throw new Error('Failed to fetch services');
  },

  fetchCapsters: async () => {
    const response = await fetch('/api/kasir/capsters');
    if (response.ok) return response.json();
    throw new Error('Failed to fetch capsters');
  },

  fetchKasirList: async () => {
    const response = await fetch('/api/kasir/kasir-list');
    if (response.ok) return response.json();
    throw new Error('Failed to fetch kasir list');
  },

  fetchProducts: async () => {
    const response = await fetch('/api/kasir/products');
    if (response.ok) return response.json();
    throw new Error('Failed to fetch products');
  },

  fetchSessionInfo: async () => {
    const response = await fetch('/api/kasir/session-info');
    if (response.ok) return response.json();
    throw new Error('Failed to fetch session info');
  },

  fetchCompletedToday: async () => {
    const response = await fetch('/api/kasir/completed-today');
    if (response.ok) return response.json();
    throw new Error('Failed to fetch completed today');
  },

  fetchHistory: async (filters: { dateFrom: string; dateTo: string; type: string }) => {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.type) params.append('type', filters.type);
    
    const response = await fetch(`/api/kasir/history?${params.toString()}`);
    if (response.ok) return response.json();
    throw new Error('Failed to fetch history');
  },

  addCustomer: async (data: NewCustomerForm) => {
    const response = await fetch('/api/kasir/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.ok) return response.json();
    throw new Error('Failed to add customer');
  },

  editVisit: async (visitId: string, services: string[]) => {
    const response = await fetch('/api/kasir/edit-visit', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitId, services })
    });
    if (response.ok) return response.json();
    throw new Error('Failed to edit visit');
  },

  completeVisit: async (visitId: string, products: any[], paymentMethod: string, completedBy: string) => {
    const response = await fetch('/api/kasir/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitId, products, paymentMethod, completedBy })
    });
    if (response.ok) return response.json();
    throw new Error('Failed to complete visit');
  },

  cancelVisit: async (visitId: string) => {
    const response = await fetch('/api/kasir/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitId })
    });
    if (response.ok) return response.json();
    throw new Error('Failed to cancel visit');
  },

  addProductSale: async (data: ProductSaleForm) => {
    const response = await fetch('/api/kasir/product-sale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.ok) return response.json();
    throw new Error('Failed to add product sale');
  },

  addExpense: async (data: ExpenseForm & { kasirId: string }) => {
    const response = await fetch('/api/kasir/expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        nominal: parseInt(data.nominal)
      })
    });
    if (response.ok) return response.json();
    throw new Error('Failed to add expense');
  }
};
