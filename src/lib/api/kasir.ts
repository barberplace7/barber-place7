const apiFetch = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(10000) // 10s timeout
  });
  if (!response.ok) {
    const error: any = new Error(`API Error: ${response.statusText}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

export const kasirApi = {
  getServices: () => apiFetch('/api/kasir/services'),
  getCapsters: () => apiFetch('/api/kasir/capsters'),
  getKasirList: () => apiFetch('/api/kasir/kasir-list'),
  getProducts: () => apiFetch('/api/kasir/products'),
  getSessionInfo: () => apiFetch('/api/kasir/session-info'),
  getCustomers: () => apiFetch('/api/kasir/customers'),
  getCompletedToday: () => apiFetch('/api/kasir/completed-today'),
  getHistory: (filters: { dateFrom: string; dateTo: string; type: string }) => {
    const params = new URLSearchParams(filters);
    return apiFetch(`/api/kasir/history?${params}`);
  },
  addCustomer: (data: any) => apiFetch('/api/kasir/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  editVisit: (data: { visitId: string; serviceCapsterPairs: any[] }) => apiFetch('/api/kasir/edit-visit', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  completeVisit: (data: any) => apiFetch('/api/kasir/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  cancelVisit: (visitId: string) => apiFetch('/api/kasir/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitId }),
  }),
  addProductSale: (data: any) => apiFetch('/api/kasir/product-sale', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  addExpense: (data: any) => apiFetch('/api/kasir/expense', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, nominal: parseInt(data.nominal) }),
  }),
  addAdvance: (data: any) => apiFetch('/api/kasir/advance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
};
