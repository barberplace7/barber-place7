// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const USE_EXTERNAL_API = process.env.NEXT_PUBLIC_USE_EXTERNAL_API === 'true';

// API Client with fallback to current implementation
class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    if (USE_EXTERNAL_API) {
      // External API call
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      return response.json();
    } else {
      // Fallback to current Next.js API routes
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      return response.json();
    }
  }

  // Capster Management
  async getCapsters() {
    return this.request('/capsters');
  }

  async createCapster(data: { name: string; phone: string }) {
    return this.request('/capsters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteCapster(id: string) {
    return this.request(`/capsters/${id}`, {
      method: 'DELETE',
    });
  }

  // Kasir Management
  async getKasirs() {
    return this.request('/kasirs');
  }

  async createKasir(data: { name: string; phone: string }) {
    return this.request('/kasirs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteKasir(id: string) {
    return this.request(`/kasirs/${id}`, {
      method: 'DELETE',
    });
  }

  // Gallery Management
  async getGallery() {
    return this.request('/gallery');
  }

  async uploadImage(position: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('position', position.toString());

    if (USE_EXTERNAL_API) {
      const response = await fetch(`${API_BASE_URL}/gallery/upload`, {
        method: 'POST',
        body: formData,
      });
      return response.json();
    } else {
      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      });
      return response.json();
    }
  }

  async deleteImage(position: number) {
    return this.request(`/gallery/${position}`, {
      method: 'DELETE',
    });
  }

  // Service Management
  async getServices() {
    return this.request('/services');
  }

  async createService(data: { name: string; category: string; basePrice: number; commissionRate: number }) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: { name: string; category: string; basePrice: number; commissionRate: number }) {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string) {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Product Management
  async getProducts() {
    return this.request('/products');
  }

  async createProduct(data: { name: string; basePrice: number; commissionPerUnit: number }) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: { name: string; basePrice: number; commissionPerUnit: number }) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Branch Management
  async getBranches() {
    return this.request('/branches');
  }

  async getCabangList() {
    return this.request('/cabang');
  }

  async createBranch(data: { cabangId: string; username: string; password: string }) {
    return this.request('/branches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteBranch(id: string) {
    return this.request(`/branches/${id}`, {
      method: 'DELETE',
    });
  }

  // Commission Management
  async getCommissions(filters: { dateFrom: string; dateTo: string; capsterId: string; branchId: string }) {
    const params = new URLSearchParams(filters);
    return this.request(`/commissions?${params}`);
  }

  async getStaffTransactionDetails(staff: any) {
    return this.request(`/commissions/staff/${staff.id}/details`);
  }

  // Transaction Management
  async getTransactions(filters: { dateFrom: string; dateTo: string; branchId: string; type: string }) {
    const params = new URLSearchParams(filters);
    return this.request(`/transactions?${params}`);
  }

  async deleteTransaction(id: string) {
    return this.request(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Overview/Dashboard
  async getOverviewData(period: string) {
    return this.request(`/overview?period=${period}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual services for easier imports
export const capsterService = {
  getAll: () => apiClient.getCapsters(),
  create: (data: { name: string; phone: string }) => apiClient.createCapster(data),
  delete: (id: string) => apiClient.deleteCapster(id),
};

export const kasirService = {
  getAll: () => apiClient.getKasirs(),
  create: (data: { name: string; phone: string }) => apiClient.createKasir(data),
  delete: (id: string) => apiClient.deleteKasir(id),
};

export const galleryService = {
  getAll: () => apiClient.getGallery(),
  uploadImage: (position: number, file: File) => apiClient.uploadImage(position, file),
  deleteImage: (position: number) => apiClient.deleteImage(position),
};

export const serviceService = {
  getAll: () => apiClient.getServices(),
  create: (data: { name: string; category: string; basePrice: number; commissionRate: number }) => apiClient.createService(data),
  update: (id: string, data: { name: string; category: string; basePrice: number; commissionRate: number }) => apiClient.updateService(id, data),
  delete: (id: string) => apiClient.deleteService(id),
};

export const productService = {
  getAll: () => apiClient.getProducts(),
  create: (data: { name: string; basePrice: number; commissionPerUnit: number }) => apiClient.createProduct(data),
  update: (id: string, data: { name: string; basePrice: number; commissionPerUnit: number }) => apiClient.updateProduct(id, data),
  delete: (id: string) => apiClient.deleteProduct(id),
};

export const branchService = {
  getAll: () => apiClient.getBranches(),
  getCabangList: () => apiClient.getCabangList(),
  create: (data: { cabangId: string; username: string; password: string }) => apiClient.createBranch(data),
  delete: (id: string) => apiClient.deleteBranch(id),
};

export const commissionService = {
  getAll: (filters: { dateFrom: string; dateTo: string; capsterId: string; branchId: string }) => apiClient.getCommissions(filters),
  getStaffDetails: (staff: any) => apiClient.getStaffTransactionDetails(staff),
};

export const transactionService = {
  getAll: (filters: { dateFrom: string; dateTo: string; branchId: string; type: string }) => apiClient.getTransactions(filters),
  delete: (id: string) => apiClient.deleteTransaction(id),
};

export const overviewService = {
  getData: (period: string) => apiClient.getOverviewData(period),
};