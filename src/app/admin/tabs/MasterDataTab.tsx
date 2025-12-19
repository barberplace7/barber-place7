'use client';
import { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AddServiceModal from '../components/AddServiceModal';
import AddProductModal from '../components/AddProductModal';

export default function MasterDataTab({ activeTab, adminData }: any) {
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, type: 'service'|'product', id: string, name: string}>({show: false, type: 'service', id: '', name: ''});
  const [servicePage, setServicePage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [editingBranch, setEditingBranch] = useState<{id: string, name: string, address: string} | null>(null);
  const itemsPerPage = 15;
  
  const queryClient = useQueryClient();

  // Pagination logic for services
  const paginatedServices = useMemo(() => {
    const services = adminData.serviceList || [];
    const startIndex = (servicePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: services.slice(startIndex, endIndex),
      totalPages: Math.ceil(services.length / itemsPerPage),
      totalItems: services.length
    };
  }, [adminData.serviceList, servicePage]);

  // Pagination logic for products
  const paginatedProducts = useMemo(() => {
    const products = adminData.productList || [];
    const startIndex = (productPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: products.slice(startIndex, endIndex),
      totalPages: Math.ceil(products.length / itemsPerPage),
      totalItems: products.length
    };
  }, [adminData.productList, productPage]);
  
  const addServiceMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to add service');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      setShowServiceForm(false);
    }
  });
  
  const addProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to add product');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setShowProductForm(false);
    }
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    }
  });

  const uploadGalleryMutation = useMutation({
    mutationFn: async ({ file, position }: { file: File; position: number }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('position', position.toString());
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to upload');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
    }
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (position: number) => {
      const res = await fetch(`/api/admin/gallery?position=${position}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
    }
  });

  const updateBranchMutation = useMutation({
    mutationFn: async (data: {id: string, name: string, address: string}) => {
      const res = await fetch('/api/admin/cabang', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update branch');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cabang'] });
      setEditingBranch(null);
    }
  });

  if (activeTab === 'services') {
    return (
      <>
        {showServiceForm && (
          <AddServiceModal
            onClose={() => setShowServiceForm(false)}
            onSubmit={(data) => addServiceMutation.mutate(data)}
            isSubmitting={addServiceMutation.isPending}
          />
        )}
        
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-black">Paket Layanan</h2>
              <p className="text-sm text-gray-600 mt-1">
                Menampilkan {paginatedServices.data.length} dari {paginatedServices.totalItems} layanan
              </p>
            </div>
            <button 
              onClick={() => setShowServiceForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 min-h-[44px] justify-center"
            >
              <span className="text-xl">+</span>
              <span className="hidden sm:inline">Tambah Layanan Baru</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Layanan</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Kategori</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Komisi</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedServices.totalItems === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 sm:px-6 py-12 text-center text-gray-500">
                        Belum ada layanan. Tambahkan layanan pertama untuk memulai.
                      </td>
                    </tr>
                  ) : (
                    paginatedServices.data.map((service: any) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 text-sm">
                          <div className="font-bold text-black">{service.name}</div>
                          <div className="sm:hidden mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              service.category === 'HAIRCUT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {service.category === 'HAIRCUT' ? 'Potong Rambut' : 'Perawatan'}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            service.category === 'HAIRCUT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {service.category === 'HAIRCUT' ? 'Potong Rambut' : 'Perawatan'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm">
                          <div className="text-gray-900 font-medium">Rp {service.basePrice.toLocaleString()}</div>
                          <div className="md:hidden text-xs text-gray-500 mt-1">Komisi: Rp {service.commissionAmount.toLocaleString()}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">Rp {service.commissionAmount.toLocaleString()}</td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setDeleteConfirm({show: true, type: 'service', id: service.id, name: service.name})}
                            disabled={deleteServiceMutation.isPending}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {paginatedServices.totalPages > 1 && (
              <div className="px-3 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-700">
                    Halaman {servicePage} dari {paginatedServices.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setServicePage(prev => Math.max(prev - 1, 1))}
                      disabled={servicePage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setServicePage(prev => Math.min(prev + 1, paginatedServices.totalPages))}
                      disabled={servicePage === paginatedServices.totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm({show: false, type: 'service', id: '', name: ''})}></div>
            <div className="relative bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Layanan</h3>
                <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus "{deleteConfirm.name}"? Tindakan ini tidak dapat dibatalkan.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm({show: false, type: 'service', id: '', name: ''})}
                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      deleteServiceMutation.mutate(deleteConfirm.id);
                      setDeleteConfirm({show: false, type: 'service', id: '', name: ''});
                    }}
                    className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (activeTab === 'products') {
    return (
      <>
        {showProductForm && (
          <AddProductModal
            onClose={() => setShowProductForm(false)}
            onSubmit={(data) => addProductMutation.mutate(data)}
            isSubmitting={addProductMutation.isPending}
          />
        )}
        
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-black">Produk</h2>
              <p className="text-sm text-gray-600 mt-1">
                Menampilkan {paginatedProducts.data.length} dari {paginatedProducts.totalItems} produk
              </p>
            </div>
            <button 
              onClick={() => setShowProductForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 min-h-[44px] justify-center"
            >
              <span className="text-xl">+</span>
              <span className="hidden sm:inline">Tambah Produk Baru</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Komisi</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.totalItems === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 sm:px-6 py-12 text-center text-gray-500">
                        Belum ada produk. Tambahkan produk pertama untuk memulai.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.data.map((product: any) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 text-sm font-bold text-black">{product.name}</td>
                        <td className="px-3 sm:px-6 py-4 text-sm">
                          <div className="text-gray-900 font-medium">Rp {product.basePrice.toLocaleString()}</div>
                          <div className="md:hidden text-xs text-gray-500 mt-1">Komisi: Rp {product.commissionPerUnit.toLocaleString()}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">Rp {product.commissionPerUnit.toLocaleString()}</td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setDeleteConfirm({show: true, type: 'product', id: product.id, name: product.name})}
                            disabled={deleteProductMutation.isPending}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {paginatedProducts.totalPages > 1 && (
              <div className="px-3 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-700">
                    Halaman {productPage} dari {paginatedProducts.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setProductPage(prev => Math.max(prev - 1, 1))}
                      disabled={productPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setProductPage(prev => Math.min(prev + 1, paginatedProducts.totalPages))}
                      disabled={productPage === paginatedProducts.totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm({show: false, type: 'product', id: '', name: ''})}></div>
            <div className="relative bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Produk</h3>
                <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus "{deleteConfirm.name}"? Tindakan ini tidak dapat dibatalkan.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm({show: false, type: 'product', id: '', name: ''})}
                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      deleteProductMutation.mutate(deleteConfirm.id);
                      setDeleteConfirm({show: false, type: 'product', id: '', name: ''});
                    }}
                    className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (activeTab === 'branches') {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Kelola Cabang</h2>
          <p className="text-gray-600 text-sm">Edit nama dan alamat cabang</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Cabang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(adminData.cabangList || []).map((branch: any) => (
                  <tr key={branch.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{branch.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{branch.address}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setEditingBranch({id: branch.id, name: branch.name, address: branch.address})}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Edit Branch Modal */}
        {editingBranch && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-black">Edit Cabang</h2>
                    <p className="text-gray-600 text-sm">Ubah nama dan alamat cabang</p>
                  </div>
                  <button 
                    onClick={() => setEditingBranch(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                    <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">✎</span>
                    Informasi Cabang
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Nama Cabang *</label>
                      <input
                        type="text"
                        placeholder="Masukkan nama cabang"
                        value={editingBranch.name}
                        onChange={(e) => setEditingBranch({...editingBranch, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white text-black transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Alamat</label>
                      <input
                        type="text"
                        placeholder="Masukkan alamat cabang"
                        value={editingBranch.address}
                        onChange={(e) => setEditingBranch({...editingBranch, address: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white text-black transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                <div className="flex gap-3">
                  <button 
                    onClick={() => setEditingBranch(null)}
                    className="flex-1 text-gray-600 hover:text-gray-800 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => updateBranchMutation.mutate(editingBranch)}
                    disabled={!editingBranch.name || updateBranchMutation.isPending}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    {updateBranchMutation.isPending && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    {updateBranchMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'gallery') {
    const galleries = adminData.galleries || [];
    const galleryMap = new Map(galleries.map((g: any) => [g.position, g]));

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Gambar Galeri (6 slot)</h2>
          <p className="text-gray-600 text-sm">Unggah gambar untuk galeri halaman utama</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((slot) => {
            const gallery = galleryMap.get(slot);
            return (
              <div key={slot} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative group">
                {gallery ? (
                  <>
                    <img src={(gallery as any)?.url} alt={`Gallery ${slot}`} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                      <label className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm cursor-pointer hover:bg-blue-700 min-h-[44px] flex items-center justify-center">
                        Ganti
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadGalleryMutation.mutate({ file, position: slot });
                          }}
                        />
                      </label>
                      <button
                        onClick={() => {
                          if (confirm('Hapus gambar ini?')) deleteGalleryMutation.mutate(slot);
                        }}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 min-h-[44px] flex items-center justify-center"
                      >
                        Hapus
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className="text-gray-500 mb-2">Slot {slot}</span>
                    <label className="bg-purple-600 text-white px-3 py-2 rounded text-sm cursor-pointer hover:bg-purple-700 min-h-[44px] flex items-center justify-center">
                      Unggah Gambar
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadGalleryMutation.mutate({ file, position: slot });
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <div>Tab tidak ditemukan</div>;
}
