'use client';
import { useState, useEffect } from 'react';

interface Kasir {
  id: string;
  name: string;
  phone: string | null;
}

interface Capster {
  id: string;
  name: string;
  phone: string | null;
}

interface Gallery {
  id: string;
  position: number;
  url: string;
  filename: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  commissionRate: number;
}

interface Product {
  id: string;
  name: string;
  basePrice: number;
  commissionPerUnit: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [kasirList, setKasirList] = useState<Kasir[]>([]);
  const [capsterList, setCapsterList] = useState<Capster[]>([]);
  const [showKasirForm, setShowKasirForm] = useState(false);
  const [showCapsterForm, setShowCapsterForm] = useState(false);
  const [newKasir, setNewKasir] = useState({ name: '', phone: '' });
  const [newCapster, setNewCapster] = useState({ name: '', phone: '' });
  const [galleryList, setGalleryList] = useState<Gallery[]>([]);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newService, setNewService] = useState({ name: '', category: 'HAIRCUT', basePrice: '', commissionRate: '' });
  const [newProduct, setNewProduct] = useState({ name: '', basePrice: '', commissionPerUnit: '' });
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [branchList, setBranchList] = useState<any[]>([]);
  const [cabangList, setCabangList] = useState<any[]>([]);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [newBranch, setNewBranch] = useState({ cabangId: '', username: '', password: '' });

  useEffect(() => {
    if (activeTab === 'kasir') fetchKasir();
    if (activeTab === 'capster') fetchCapster();
    if (activeTab === 'gallery') fetchGallery();
    if (activeTab === 'services') fetchServices();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'branches') {
      fetchBranches();
      fetchCabangList();
    }
  }, [activeTab]);

  const fetchKasir = async () => {
    try {
      const response = await fetch('/api/admin/kasir');
      const data = await response.json();
      setKasirList(data);
    } catch (error) {
      console.error('Failed to fetch kasir:', error);
    }
  };

  const fetchCapster = async () => {
    try {
      const response = await fetch('/api/admin/capster');
      const data = await response.json();
      setCapsterList(data);
    } catch (error) {
      console.error('Failed to fetch capster:', error);
    }
  };

  const handleAddKasir = async () => {
    try {
      const response = await fetch('/api/admin/kasir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKasir)
      });
      
      if (response.ok) {
        setNewKasir({ name: '', phone: '' });
        setShowKasirForm(false);
        fetchKasir();
      }
    } catch (error) {
      console.error('Failed to add kasir:', error);
    }
  };

  const handleAddCapster = async () => {
    try {
      const response = await fetch('/api/admin/capster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCapster)
      });
      
      if (response.ok) {
        setNewCapster({ name: '', phone: '' });
        setShowCapsterForm(false);
        fetchCapster();
      }
    } catch (error) {
      console.error('Failed to add capster:', error);
    }
  };

  const handleDeleteKasir = async (id: string) => {
    if (confirm('Are you sure you want to delete this kasir?')) {
      try {
        const response = await fetch(`/api/admin/kasir?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchKasir();
        }
      } catch (error) {
        console.error('Failed to delete kasir:', error);
      }
    }
  };

  const handleDeleteCapster = async (id: string) => {
    if (confirm('Are you sure you want to delete this capster?')) {
      try {
        const response = await fetch(`/api/admin/capster?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchCapster();
        }
      } catch (error) {
        console.error('Failed to delete capster:', error);
      }
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/admin/gallery');
      const data = await response.json();
      setGalleryList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      setGalleryList([]);
    }
  };

  const handleUploadImage = async (position: number, file: File) => {
    setUploadingSlot(position);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('position', position.toString());

      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        fetchGallery();
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleDeleteImage = async (position: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await fetch(`/api/admin/gallery?position=${position}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchGallery();
        }
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      const data = await response.json();
      setServiceList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServiceList([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProductList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProductList([]);
    }
  };

  const handleAddService = async () => {
    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      });
      
      if (response.ok) {
        setNewService({ name: '', category: 'HAIRCUT', basePrice: '', commissionRate: '' });
        setShowServiceForm(false);
        fetchServices();
      }
    } catch (error) {
      console.error('Failed to add service:', error);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      category: service.category,
      basePrice: service.basePrice.toString(),
      commissionRate: service.commissionRate.toString()
    });
    setShowServiceForm(true);
  };

  const handleUpdateService = async () => {
    if (!editingService) return;
    
    try {
      const response = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingService.id, ...newService })
      });
      
      if (response.ok) {
        setNewService({ name: '', category: 'HAIRCUT', basePrice: '', commissionRate: '' });
        setEditingService(null);
        setShowServiceForm(false);
        fetchServices();
      }
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      
      if (response.ok) {
        setNewProduct({ name: '', basePrice: '', commissionPerUnit: '' });
        setShowProductForm(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      basePrice: product.basePrice.toString(),
      commissionPerUnit: product.commissionPerUnit.toString()
    });
    setShowProductForm(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingProduct.id, ...newProduct })
      });
      
      if (response.ok) {
        setNewProduct({ name: '', basePrice: '', commissionPerUnit: '' });
        setEditingProduct(null);
        setShowProductForm(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`/api/admin/services?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchServices();
        }
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const fetchBranches = async () => {
    try {
      const loginResponse = await fetch('/api/admin/branch-logins');
      const loginAccounts = await loginResponse.json();
      setBranchList(Array.isArray(loginAccounts) ? loginAccounts : []);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  };

  const fetchCabangList = async () => {
    try {
      const response = await fetch('/api/admin/cabang');
      const data = await response.json();
      setCabangList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch cabang:', error);
    }
  };

  const handleAddBranch = async () => {
    try {
      const response = await fetch('/api/admin/branch-logins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBranch)
      });
      
      if (response.ok) {
        setNewBranch({ cabangId: '', username: '', password: '' });
        setShowBranchForm(false);
        fetchBranches();
      }
    } catch (error) {
      console.error('Failed to add branch login:', error);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (confirm('Are you sure you want to delete this login account?')) {
      try {
        const response = await fetch(`/api/admin/branch-logins?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchBranches();
        }
      } catch (error) {
        console.error('Failed to delete branch login:', error);
      }
    }
  };

  const handleLogout = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">BP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Barber Place Management</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'branches', name: 'Branch Logins' },
              { id: 'capster', name: 'Manage Capster' },
              { id: 'kasir', name: 'Manage Kasir' },
              { id: 'services', name: 'Service Packages' },
              { id: 'products', name: 'Products' },
              { id: 'gallery', name: 'Gallery Images' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="text-sm font-medium text-gray-600">Total Branches</h3>
                  <p className="text-2xl font-bold text-black">{branchList.length}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-gray-600">Total Capsters</h3>
                  <p className="text-2xl font-bold text-black">{capsterList.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-sm font-medium text-gray-600">Total Kasir</h3>
                  <p className="text-2xl font-bold text-black">{kasirList.length}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-sm font-medium text-gray-600">Services & Products</h3>
                  <p className="text-2xl font-bold text-black">{serviceList.length + productList.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branches' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">Branch Login Accounts</h2>
                <button 
                  onClick={() => setShowBranchForm(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Add Login Account
                </button>
              </div>
              
              {showBranchForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-bold text-black mb-4">Add Login Account for Branch</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Select Branch</label>
                      <select
                        value={newBranch.cabangId}
                        onChange={(e) => setNewBranch({...newBranch, cabangId: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500 focus:outline-none bg-white text-black"
                      >
                        <option value="">Choose existing branch...</option>
                        {cabangList.map((cabang) => (
                          <option key={cabang.id} value={cabang.id}>
                            {cabang.name} - {cabang.address}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Login Username</label>
                      <input
                        type="text"
                        placeholder="cabang1, cabang2, etc"
                        value={newBranch.username}
                        onChange={(e) => setNewBranch({...newBranch, username: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500 focus:outline-none bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Login Password</label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={newBranch.password}
                        onChange={(e) => setNewBranch({...newBranch, password: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500 focus:outline-none bg-white text-black"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={handleAddBranch}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Save Login Account
                    </button>
                    <button 
                      onClick={() => {setShowBranchForm(false); setNewBranch({ cabangId: '', username: '', password: '' })}}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {branchList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No login accounts yet. Add login credentials for existing branches.
                        </td>
                      </tr>
                    ) : (
                      branchList.map((branch) => (
                        <tr key={branch.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{branch.branchName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(branch.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleDeleteBranch(branch.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'capster' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-black">Manage Capster</h2>
                  <p className="text-gray-600 text-sm">Add, edit, and manage your capster team</p>
                </div>
                <button 
                  onClick={() => setShowCapsterForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add New Capster
                </button>
              </div>
              
              {showCapsterForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-bold text-black mb-4">Add New Capster</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter capster name"
                        value={newCapster.name}
                        onChange={(e) => setNewCapster({...newCapster, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="Enter phone number"
                        value={newCapster.phone}
                        onChange={(e) => setNewCapster({...newCapster, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={handleAddCapster}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Save Capster
                    </button>
                    <button 
                      onClick={() => {setShowCapsterForm(false); setNewCapster({name: '', phone: ''})}}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {capsterList.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                          No capsters yet. Add your first capster to get started.
                        </td>
                      </tr>
                    ) : (
                      capsterList.map((capster) => (
                        <tr key={capster.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{capster.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{capster.phone || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleDeleteCapster(capster.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'kasir' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">Manage Kasir</h2>
                <button 
                  onClick={() => setShowKasirForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add New Kasir
                </button>
              </div>
              
              {showKasirForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-bold text-black mb-4">Add New Kasir</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter kasir name"
                        value={newKasir.name}
                        onChange={(e) => setNewKasir({...newKasir, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-green-500 focus:outline-none bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="Enter phone number"
                        value={newKasir.phone}
                        onChange={(e) => setNewKasir({...newKasir, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-green-500 focus:outline-none bg-white text-black"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={handleAddKasir}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Save Kasir
                    </button>
                    <button 
                      onClick={() => {setShowKasirForm(false); setNewKasir({name: '', phone: ''})}}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {kasirList.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                          No kasir yet. Add your first kasir to get started.
                        </td>
                      </tr>
                    ) : (
                      kasirList.map((kasir) => (
                        <tr key={kasir.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{kasir.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kasir.phone || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleDeleteKasir(kasir.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">Service Packages</h2>
                <button 
                  onClick={() => setShowServiceForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add New Service
                </button>
              </div>
              
              {showServiceForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-bold text-black mb-4">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Service Name</label>
                      <input
                        type="text"
                        placeholder="Enter service name"
                        value={newService.name}
                        onChange={(e) => setNewService({...newService, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Category</label>
                      <select
                        value={newService.category}
                        onChange={(e) => setNewService({...newService, category: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
                      >
                        <option value="HAIRCUT">Hair Cut</option>
                        <option value="TREATMENT">Treatment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Base Price (Rp)</label>
                      <input
                        type="number"
                        placeholder="Enter base price"
                        value={newService.basePrice}
                        onChange={(e) => setNewService({...newService, basePrice: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Commission Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.20 (20%)"
                        value={newService.commissionRate}
                        onChange={(e) => setNewService({...newService, commissionRate: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={editingService ? handleUpdateService : handleAddService}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      {editingService ? 'Update Service' : 'Save Service'}
                    </button>
                    <button 
                      onClick={() => {
                        setShowServiceForm(false);
                        setNewService({name: '', category: 'HAIRCUT', basePrice: '', commissionRate: ''});
                        setEditingService(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {serviceList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No services yet. Add your first service to get started.
                        </td>
                      </tr>
                    ) : (
                      serviceList.map((service) => (
                        <tr key={service.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{service.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              service.category === 'HAIRCUT' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {service.category === 'HAIRCUT' ? 'Hair Cut' : 'Treatment'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {service.basePrice.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(service.commissionRate * 100).toFixed(1)}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-3">
                              <button 
                                onClick={() => handleEditService(service)}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors font-medium"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteService(service.id)}
                                className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">Products</h2>
                <button 
                  onClick={() => setShowProductForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add New Product
                </button>
              </div>
              
              {showProductForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-bold text-black mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Product Name</label>
                      <input
                        type="text"
                        placeholder="Enter product name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-green-500 focus:outline-none bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Base Price (Rp)</label>
                      <input
                        type="number"
                        placeholder="Enter base price"
                        value={newProduct.basePrice}
                        onChange={(e) => setNewProduct({...newProduct, basePrice: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-green-500 focus:outline-none bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Commission Per Unit (Rp)</label>
                      <input
                        type="number"
                        placeholder="Enter commission per unit"
                        value={newProduct.commissionPerUnit}
                        onChange={(e) => setNewProduct({...newProduct, commissionPerUnit: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-green-500 focus:outline-none bg-white text-black"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      {editingProduct ? 'Update Product' : 'Save Product'}
                    </button>
                    <button 
                      onClick={() => {
                        setShowProductForm(false);
                        setNewProduct({name: '', basePrice: '', commissionPerUnit: ''});
                        setEditingProduct(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Per Unit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No products yet. Add your first product to get started.
                        </td>
                      </tr>
                    ) : (
                      productList.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {product.basePrice.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {product.commissionPerUnit.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-3">
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors font-medium"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">Gallery Images (6 slots)</h2>
                <p className="text-gray-600 text-sm">Upload images for landing page gallery</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map((slot) => {
                  const galleryImage = Array.isArray(galleryList) ? galleryList.find(g => g.position === slot) : null;
                  const isUploading = uploadingSlot === slot;
                  
                  return (
                    <div key={slot} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative group">
                      {galleryImage ? (
                        <>
                          <img 
                            src={galleryImage.url} 
                            alt={`Gallery Slot ${slot}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <label className="bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer hover:bg-blue-700">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUploadImage(slot, file);
                                }}
                              />
                            </label>
                            <button 
                              onClick={() => handleDeleteImage(slot)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          {isUploading ? (
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                              <span className="text-sm text-gray-600">Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <span className="text-gray-500 mb-2">Slot {slot}</span>
                              <label className="bg-purple-600 text-white px-3 py-1 rounded text-sm cursor-pointer hover:bg-purple-700">
                                Upload Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadImage(slot, file);
                                  }}
                                />
                              </label>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}