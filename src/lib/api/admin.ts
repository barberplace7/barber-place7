const apiFetch = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return response.json();
};

export const adminApi = {
  getKasir: () => apiFetch('/api/admin/kasir'),
  getCapster: () => apiFetch('/api/admin/capster'),
  getServices: () => apiFetch('/api/admin/services'),
  getProducts: () => apiFetch('/api/admin/products'),
  getCabang: () => apiFetch('/api/admin/cabang'),
  getBranchLogins: () => apiFetch('/api/admin/branch-logins'),
  getOverview: (params: { overviewPeriod: string; chartPeriod: string; branchPeriod: string }) => {
    const searchParams = new URLSearchParams(params);
    return apiFetch(`/api/admin/overview?${searchParams}`);
  },
  getTransactions: (params: any) => {
    const searchParams = new URLSearchParams(params);
    return apiFetch(`/api/admin/transactions?${searchParams}`);
  },
  getCommission: (params: any) => {
    const searchParams = new URLSearchParams(params);
    return apiFetch(`/api/admin/commission?${searchParams}`);
  },
  deleteTransaction: (data: { type: string; transactionId?: string; visitId?: string }) => 
    apiFetch('/api/admin/delete-transaction', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  getStaffTransactionDetails: (params: { capsterId: string; dateFrom: string; dateTo: string }) => {
    const searchParams = new URLSearchParams(params);
    return apiFetch(`/api/admin/staff-transactions?${searchParams}`);
  },
  getServiceStats: (params: any) => {
    const searchParams = new URLSearchParams(params);
    return apiFetch(`/api/admin/service-stats?${searchParams}`);
  },
  getGallery: () => apiFetch('/api/admin/gallery'),
};
