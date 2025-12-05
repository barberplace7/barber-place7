'use client';
import { useState, useEffect } from 'react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

interface Customer {
  id: string;
  customerName: string;
  customerPhone: string;
  capster: { name: string };
  jamMasuk: string;
  status: string;
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
  }[];
}

interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
}

interface Capster {
  id: string;
  name: string;
}

interface Kasir {
  id: string;
  name: string;
}

export default function KasirDashboard() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [capsters, setCapsters] = useState<Capster[]>([]);
  const [kasirList, setKasirList] = useState<Kasir[]>([]);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    services: [] as string[],
    capsterId: ''
  });
  const [editingVisit, setEditingVisit] = useState<Customer | null>(null);
  const [editServices, setEditServices] = useState<string[]>([]);
  const [completingCustomer, setCompletingCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{id: string, quantity: number}[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [completedBy, setCompletedBy] = useState('');
  const [currentKasir, setCurrentKasir] = useState('');
  const [showKasirSwitcher, setShowKasirSwitcher] = useState(false);
  const [showProductSale, setShowProductSale] = useState(false);
  const [productSaleData, setProductSaleData] = useState({
    customerName: '',
    customerPhone: '',
    products: [] as {id: string, quantity: number}[],
    paymentMethod: 'CASH',
    completedBy: '',
    recommendedBy: ''
  });
  const [showExpense, setShowExpense] = useState(false);
  const [expenseData, setExpenseData] = useState({
    nominal: '',
    category: 'OPERASIONAL',
    note: ''
  });
  const [showAddService, setShowAddService] = useState(false);
  const [customerView, setCustomerView] = useState('ongoing');
  const [completedToday, setCompletedToday] = useState<any[]>([]);
  const [productTransactions, setProductTransactions] = useState<any[]>([]);
  const [dailySummary, setDailySummary] = useState({total: 0, cash: 0, qris: 0});
  const [history, setHistory] = useState<{visits: any[], productSales: any[], expenses: any[], allStaff?: any[]}>({visits: [], productSales: [], expenses: []});
  const [historyFilters, setHistoryFilters] = useState({
    dateFrom: '',
    dateTo: '',
    type: 'ALL' // ALL, SERVICE, PRODUCT, EXPENSES
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [datePreset, setDatePreset] = useState('7days');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [branchInfo, setBranchInfo] = useState({ name: '', kasirName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{show: boolean, title: string, message: string, onConfirm: () => void} | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchSessionInfo = async () => {
    try {
      const response = await fetch('/api/kasir/session-info');
      if (response.ok) {
        const data = await response.json();
        setBranchInfo({ name: data.branchName, kasirName: data.kasirName });
      }
    } catch (error) {
      console.error('Failed to fetch session info:', error);
    }
  };

  // useEffect(() => {
  //   fetchCustomers();
  //   fetchServices();
  //   fetchCapsters();
  //   fetchKasir();
  //   fetchProducts();
  //   fetchSessionInfo();
  //   if (activeTab === 'transactions') {
  //     if (customerView === 'completed') {
  //       fetchCompletedToday();
  //     }
  //   }
  //   if (activeTab === 'history') fetchHistory();
  // }, [activeTab, customerView]);

  // useEffect(() => {
  //   if (activeTab === 'history') {
  //     fetchHistory();
  //   }
  // }, [historyFilters]);

  const handleDatePresetChange = (preset: string) => {
    setDatePreset(preset);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    let dateFrom = '';
    
    switch (preset) {
      case 'today':
        dateFrom = today;
        break;
      case '7days':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case '30days':
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'custom':
        return; // Don't change dates for custom
    }
    
    setHistoryFilters(prev => ({
      ...prev,
      dateFrom,
      dateTo: today
    }));
  };

  // Client-side hydration fix and sync dates
  useEffect(() => {
    setIsClient(true);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setHistoryFilters({
      dateFrom: sevenDaysAgo,
      dateTo: today,
      type: 'ALL'
    });
  }, []);

  // Live clock
  useEffect(() => {
    if (isClient) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isClient]);

  useEffect(() => {
    if (kasirList.length > 0 && !currentKasir) {
      setCurrentKasir(kasirList[0].id);
    }
  }, [kasirList]);

  useEffect(() => {
    if (branchInfo.kasirName) {
      // Find the kasir ID from the session kasir name
      const sessionKasir = kasirList.find(k => k.name === branchInfo.kasirName);
      if (sessionKasir) {
        setCompletedBy(sessionKasir.id);
        setProductSaleData(prev => ({...prev, completedBy: sessionKasir.id, recommendedBy: sessionKasir.id}));
      }
    }
  }, [branchInfo.kasirName, kasirList]);

  useEffect(() => {
    if (showProductSale || showExpense || showAddService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showProductSale, showExpense, showAddService]);

  const fetchCustomers = async () => {
    try {
      setGlobalLoading(true);
      const response = await fetch('/api/kasir/customers');
      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/kasir/services');
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchCapsters = async () => {
    try {
      const response = await fetch('/api/kasir/capsters');
      const data = await response.json();
      setCapsters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch capsters:', error);
    }
  };

  const fetchKasir = async () => {
    try {
      const response = await fetch('/api/kasir/kasir-list');
      const data = await response.json();
      setKasirList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch kasir:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/kasir/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const params = new URLSearchParams({
        dateFrom: historyFilters.dateFrom,
        dateTo: historyFilters.dateTo
      });
      
      const response = await fetch(`/api/kasir/history?${params}`);
      const data = await response.json();
      setHistory(data);
      setCurrentPage(1); // Reset to first page when filters change
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setHistory({visits: [], productSales: [], expenses: []});
    }
  };

  const fetchCompletedToday = async () => {
    try {
      setGlobalLoading(true);
      const response = await fetch('/api/kasir/completed-today');
      const data = await response.json();
      setCompletedToday(data.visits);
      setDailySummary(data.summary);
      
      const productResponse = await fetch('/api/kasir/product-transactions');
      if (productResponse.ok) {
        const productData = await productResponse.json();
        setProductTransactions(productData);
      }
    } catch (error) {
      console.error('Failed to fetch completed today:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    try {
      const response = await fetch('/api/kasir/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });
      
      if (response.ok) {
        setNewCustomer({ name: '', phone: '', services: [], capsterId: '' });
        setShowNewCustomer(false);
        fetchCustomers();
      }
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  };

  const handleEditVisit = async () => {
    if (!editingVisit) return;
    
    try {
      const response = await fetch('/api/kasir/edit-visit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitId: editingVisit.id,
          services: editServices
        })
      });
      
      if (response.ok) {
        setEditingVisit(null);
        setEditServices([]);
        fetchCustomers();
      }
    } catch (error) {
      console.error('Failed to edit visit:', error);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  const hairCutServices = services.filter(s => s.category === 'HAIRCUT');
  const treatmentServices = services.filter(s => s.category === 'TREATMENT');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo_barberplace.png" 
                alt="Barber Place Logo" 
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className={`text-lg font-bold text-gray-900 ${montserrat.className}`}>Barber Place</h1>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-center text-gray-600">
            <span className="text-sm font-medium">Sistem Manajemen Kasir</span>
          </div>
          <div className="mt-3 text-center">
            <div className="text-xs text-gray-500">Cabang: {branchInfo.name || 'Loading...'}</div>
            <div className="text-xs text-gray-500">Kasir: {branchInfo.kasirName || 'Loading...'}</div>
          </div>
        </div>
        
        <nav className="mt-4 px-4">
          <div className="mb-4 px-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Menu Kasir</h2>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors mb-2 ${
              activeTab === 'transactions'
                ? 'bg-stone-800 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className={`font-medium ${montserrat.className}`}>Live Transactions</span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors mb-2 ${
              activeTab === 'history'
                ? 'bg-stone-800 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className={`font-medium ${montserrat.className}`}>Transaction History</span>
          </button>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-300 shadow-md">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-7">
              <div className="flex items-center space-x-3">
                {!sidebarOpen && (
                  <button 
                    onClick={() => setSidebarOpen(true)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {[
                      { id: 'transactions', name: 'Live Transactions' },
                      { id: 'history', name: 'Transaction History' }
                    ].find(tab => tab.id === activeTab)?.name || 'Live Transactions'}
                  </h1>
                  <p className="text-sm text-gray-500">Sistem Manajemen Kasir</p>
                  <div className="text-sm text-gray-600 mt-1">
                    {isClient ? currentTime.toLocaleDateString('id-ID', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    }) : 'Loading...'} - 
                    {isClient ? `${currentTime.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: '2-digit', second: '2-digit' })} WIB` : '--:--:-- WIB'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 mt-2">

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
          {activeTab === 'transactions' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-stone-800">Transaksi</h2>
                    <div className="text-stone-600">
                      <div className="text-sm sm:text-lg font-medium">
                        {isClient ? currentTime.toLocaleDateString('id-ID', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'Loading...'}
                      </div>
                      <div className="text-lg sm:text-2xl font-bold text-stone-800">
                        {isClient ? `${currentTime.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: '2-digit', second: '2-digit' })} WIB` : '--:--:-- WIB'}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-0 bg-white rounded-xl border border-stone-200">
                    {[
                      { id: 'ongoing', name: 'Layanan Berlangsung' },
                      { id: 'completed', name: 'Selesai Hari Ini' }
                    ].map((view) => (
                      <button
                        key={view.id}
                        onClick={() => setCustomerView(view.id)}
                        className={`py-2 px-4 font-medium text-sm transition-colors first:rounded-l-xl last:rounded-r-xl ${
                          customerView === view.id
                            ? 'bg-stone-800 text-white'
                            : 'text-stone-600 hover:text-stone-800 hover:bg-stone-50'
                        }`}
                      >
                        {view.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button 
                    onClick={() => setShowAddService(true)}
                    className="bg-stone-800 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-stone-900 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <span>✂</span> <span className="hidden sm:inline">Tambah Layanan</span><span className="sm:hidden">Layanan</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowProductSale(true);
                      // Set default to current kasir if not already set
                      if (!productSaleData.completedBy && branchInfo.kasirName) {
                        const sessionKasir = kasirList.find(k => k.name === branchInfo.kasirName);
                        if (sessionKasir) {
                          setProductSaleData(prev => ({...prev, completedBy: sessionKasir.id, recommendedBy: sessionKasir.id}));
                        }
                      }
                    }}
                    className="bg-stone-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <span>📦</span> <span className="hidden sm:inline">Tambah Produk</span><span className="sm:hidden">Produk</span>
                  </button>
                  <button 
                    onClick={() => setShowExpense(true)}
                    className="bg-stone-500 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-stone-600 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <span>💸</span> <span className="hidden sm:inline">Tambah Pengeluaran</span><span className="sm:hidden">Pengeluaran</span>
                  </button>
                </div>
              </div>

              {customerView === 'completed' && (
                <div className="mb-8 p-6 bg-stone-50 rounded-xl border border-stone-200">
                  <h3 className="font-bold text-stone-800 mb-4">Ringkasan Pendapatan Hari Ini</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-stone-800">
                        Rp {(dailySummary?.total || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-stone-600">Total Pendapatan</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        Rp {(dailySummary?.cash || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-stone-600">Cash</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        Rp {(dailySummary?.qris || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-stone-600">QRIS</div>
                    </div>
                  </div>
                </div>
              )}



              <div className="overflow-hidden rounded-xl border border-stone-200">
                <table className="min-w-full">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Service/Product</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">{customerView === 'completed' ? 'Capster/Recommend By' : 'Capster'}</th>
                      {customerView === 'completed' && <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Amount</th>}
                      <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">{customerView === 'ongoing' ? 'Start Time' : 'Completed'}</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">{customerView === 'ongoing' ? 'Status' : 'Payment'}</th>
                      {customerView === 'ongoing' && <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-100">
                    {customerView === 'ongoing' ? (
                      customers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center text-stone-500">
                            <div className="text-4xl mb-4">✂</div>
                            <div>Tidak ada pelanggan aktif</div>
                            <div className="text-sm mt-1">Tambahkan pelanggan baru untuk memulai</div>
                          </td>
                        </tr>
                      ) : (
                        customers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-stone-50">
                            <td className="px-6 py-5">
                              <div className="font-medium text-stone-800">{customer.customerName}</div>
                              <div className="text-sm text-stone-500">{customer.customerPhone}</div>
                            </td>
                            <td className="px-6 py-5 text-stone-700">
                              {customer.visitServices?.map(vs => vs.service.name).join(' + ') || 'No services'}
                            </td>
                            <td className="px-6 py-5 text-stone-700">{customer.capster.name}</td>
                            <td className="px-6 py-5 text-stone-500 text-sm">
                              {new Date(customer.jamMasuk).toLocaleTimeString()}
                            </td>
                            <td className="px-6 py-5">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                customer.status === 'ONGOING' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-stone-100 text-stone-800'
                              }`}>
                                {customer.status}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              {customer.status === 'ONGOING' && (
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      console.log('Customer data:', customer);
                                      console.log('Visit services:', customer.visitServices);
                                      setEditingVisit(customer);
                                      const currentServices = customer.visitServices?.map(vs => vs.service.id) || [];
                                      console.log('Current services IDs:', currentServices);
                                      setEditServices(currentServices);
                                    }}
                                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setCompletingCustomer(customer);
                                      // Set to current logged user
                                      const sessionKasir = kasirList.find(k => k.name === branchInfo.kasirName);
                                      if (sessionKasir) {
                                        setCompletedBy(sessionKasir.id);
                                      } else {
                                        setCompletedBy(currentKasir);
                                      }
                                    }}
                                    className="bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-900 transition-colors text-sm font-medium"
                                  >
                                    Complete
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      if (confirm('Cancel this service?')) {
                                        try {
                                          setGlobalLoading(true);
                                          const response = await fetch('/api/kasir/cancel', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ visitId: customer.id })
                                          });
                                          if (response.ok) fetchCustomers();
                                        } catch (error) {
                                          console.error('Failed to cancel:', error);
                                        } finally {
                                          setGlobalLoading(false);
                                        }
                                      }
                                    }}
                                    className="text-stone-500 hover:text-red-600 px-3 py-2 border border-stone-300 rounded-lg hover:border-red-300 transition-colors text-sm"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )
                    ) : (
                      (completedToday.length === 0 && productTransactions.length === 0) ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center text-stone-500">
                            <div className="text-4xl mb-4">✂</div>
                            <div>Tidak ada transaksi selesai hari ini</div>
                            <div className="text-sm mt-1">Transaksi yang selesai akan muncul di sini</div>
                          </td>
                        </tr>
                      ) : (
                        <>
                          {completedToday.map((customer) => (
                            <tr key={`service-${customer.id}`} className="hover:bg-stone-50">
                              <td className="px-6 py-5">
                                <div className="font-medium text-stone-800">{customer.customerName}</div>
                                <div className="text-sm text-stone-500">{customer.customerPhone}</div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="text-stone-700">
                                {customer.serviceTransactions?.length > 0 
                                  ? customer.serviceTransactions[0].paketName 
                                  : customer.visitServices?.map(vs => vs.service.name).join(' + ') || 'No services'
                                }
                              </div>
                                <div className="text-xs text-blue-600 font-medium">SERVICE</div>
                              </td>
                              <td className="px-6 py-5 text-stone-700">{customer.capster.name}</td>
                              <td className="px-6 py-5 text-stone-700 font-medium">
                                Rp {(() => {
                                  if (customer.serviceTransactions?.length > 0) {
                                    return customer.serviceTransactions.reduce((sum, st) => sum + st.priceFinal, 0).toLocaleString();
                                  }
                                  return customer.visitServices?.reduce((sum, vs) => sum + vs.service.basePrice, 0).toLocaleString() || '0';
                                })()}
                              </td>
                              <td className="px-6 py-5 text-stone-500 text-sm">
                                {new Date(customer.jamSelesai).toLocaleTimeString()}
                              </td>
                              <td className="px-6 py-5">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  customer.paymentMethod === 'CASH' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {customer.paymentMethod}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {productTransactions.map((transaction) => (
                            <tr key={`product-${transaction.id}`} className="hover:bg-stone-50">
                              <td className="px-6 py-5">
                                <div className="font-medium text-stone-800">{transaction.customerName}</div>
                                <div className="text-sm text-stone-500">{transaction.customerPhone}</div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="text-stone-700">{transaction.productNameSnapshot} (x{transaction.quantity})</div>
                                <div className="text-xs text-orange-600 font-medium">PRODUCT</div>
                              </td>
                              <td className="px-6 py-5 text-stone-700">
                                {(() => {
                                  const recommender = [...kasirList, ...capsters].find(p => p.id === transaction.recommenderId);
                                  return recommender ? recommender.name : 'Unknown';
                                })()}
                              </td>
                              <td className="px-6 py-5 text-stone-700 font-medium">Rp {transaction.totalPrice?.toLocaleString()}</td>
                              <td className="px-6 py-5 text-stone-500 text-sm">
                                {new Date(transaction.createdAt).toLocaleTimeString()}
                              </td>
                              <td className="px-6 py-5">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  transaction.paymentMethod === 'CASH' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {transaction.paymentMethod}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Inline Complete Form */}
              {customerView === 'ongoing' && completingCustomer && (
                <div className="mt-8 p-6 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-stone-800 mb-2">
                        Selesaikan Layanan - {completingCustomer.customerName}
                      </h3>
                      <div className="text-sm text-stone-600">
                        <span className="font-medium">{completingCustomer.visitServices?.map(vs => vs.service.name).join(' + ') || 'No services'}</span> by {completingCustomer.capster.name}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setCompletingCustomer(null);
                        setSelectedProducts([]);
                      }}
                      className="text-stone-400 hover:text-stone-600 text-xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="max-w-md mx-auto">
                    {/* Payment & Completion */}
                    <div className="space-y-4">
                      {/* Total Calculation */}
                      <div className="p-4 bg-white rounded-lg border border-stone-300">
                        <h4 className="font-medium text-stone-800 mb-3">Ringkasan Tagihan</h4>
                        <div className="space-y-2">
                          {completingCustomer.visitServices?.map((vs, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-stone-600">{vs.service.name}</span>
                              <span className="font-medium text-stone-800">Rp {vs.service.basePrice.toLocaleString()}</span>
                            </div>
                          ))}

                          <div className="border-t border-stone-200 pt-2 mt-2">
                            <div className="flex justify-between font-bold text-lg">
                              <span className="text-stone-800">TOTAL</span>
                              <span className="text-stone-900">
Rp {(completingCustomer.visitServices?.reduce((sum, vs) => sum + vs.service.basePrice, 0) || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Metode Pembayaran</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800"
                        >
                          <option value="CASH">Cash</option>
                          <option value="QRIS">QRIS</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Penanggung Jawab Transaksi</label>
                        <select
                          value={completedBy}
                          onChange={(e) => setCompletedBy(e.target.value)}
                          className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800"
                        >
                          {[...capsters, ...kasirList].map((person) => {
                            const isCurrentUser = person.name === branchInfo.kasirName;
                            return (
                              <option key={person.id} value={person.id}>
                                {person.name}{isCurrentUser ? ' (You)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button 
                          onClick={async () => {
                            if (isSubmitting) return;
                            
const total = completingCustomer.visitServices?.reduce((sum, vs) => sum + vs.service.basePrice, 0) || 0;
                            
                            setConfirmModal({
                              show: true,
                              title: 'Complete Transaction',
                              message: `Complete transaction for ${completingCustomer.customerName}?\n\nTotal: Rp ${total.toLocaleString()}`,
                              onConfirm: async () => {
                                setConfirmModal(null);
                                setIsSubmitting(true);
                                try {
                                  const response = await fetch('/api/kasir/complete', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
                                      visitId: completingCustomer.id,
                                      products: [],
                                      paymentMethod,
                                      completedBy
                                    })
                                  });
                                  
                                  if (response.ok) {
                                    setCompletingCustomer(null);
                                    setSelectedProducts([]);
                                    fetchCustomers();
                                  }
                                } catch (error) {
                                  console.error('Failed to complete visit:', error);
                                } finally {
                                  setIsSubmitting(false);
                                }
                              }
                            });
                            return;

                          }}
                          disabled={isSubmitting}
                          className="flex-1 bg-stone-800 text-white px-6 py-3 rounded-lg hover:bg-stone-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Memproses...' : 'Selesaikan Transaksi'}
                        </button>
                        <button 
                          onClick={() => {
                            setCompletingCustomer(null);
                            setSelectedProducts([]);
                          }}
                          className="px-6 py-3 text-stone-600 hover:text-stone-800 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}


            </div>
          )}



          {activeTab === 'history' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-stone-800">Riwayat Transaksi</h2>
                  <p className="text-stone-500 text-sm mt-1">Filter dan lihat riwayat transaksi</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-stone-50 rounded-xl p-6 mb-8">
                {/* Date Presets */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-stone-700 mb-2">Date Range</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'today', name: 'Today' },
                      { id: '7days', name: 'Last 7 Days' },
                      { id: '30days', name: 'Last 30 Days' },
                      { id: 'custom', name: 'Custom Range' }
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleDatePresetChange(preset.id)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          datePreset === preset.id
                            ? 'bg-stone-800 text-white'
                            : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">From Date</label>
                    <input
                      type="date"
                      value={historyFilters.dateFrom}
                      onChange={(e) => {
                        setHistoryFilters({...historyFilters, dateFrom: e.target.value});
                        setDatePreset('custom');
                      }}
                      disabled={datePreset !== 'custom'}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:border-stone-500 focus:outline-none bg-white text-stone-800 disabled:bg-stone-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">To Date</label>
                    <input
                      type="date"
                      value={historyFilters.dateTo}
                      onChange={(e) => {
                        setHistoryFilters({...historyFilters, dateTo: e.target.value});
                        setDatePreset('custom');
                      }}
                      disabled={datePreset !== 'custom'}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:border-stone-500 focus:outline-none bg-white text-stone-800 disabled:bg-stone-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Transaction Type</label>
                    <select
                      value={historyFilters.type}
                      onChange={(e) => setHistoryFilters({...historyFilters, type: e.target.value})}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:border-stone-500 focus:outline-none bg-white text-stone-800"
                    >
                      <option value="ALL">All Transactions</option>
                      <option value="REVENUE">Revenue Only</option>
                      <option value="SERVICE">Services Only</option>
                      <option value="PRODUCT">Products Only</option>
                      <option value="EXPENSES">Expenses Only</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={fetchHistory}
                      className="w-full bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-900 transition-colors font-medium"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {(() => {
                const allTransactions = [];
                
                // Add service transactions
                if (historyFilters.type === 'ALL' || historyFilters.type === 'REVENUE' || historyFilters.type === 'SERVICE') {
                  history.visits.forEach(visit => {
                    const serviceAmount = visit.serviceTransactions?.length > 0 
                      ? visit.serviceTransactions.reduce((sum, st) => sum + st.priceFinal, 0)
                      : visit.visitServices?.reduce((sum, vs) => sum + vs.service.basePrice, 0) || 0;
                    
                    allTransactions.push({
                      amount: serviceAmount,
                      paymentMethod: visit.serviceTransactions?.length > 0 ? visit.serviceTransactions[0].paymentMethod : 'CASH'
                    });
                  });
                }
                
                // Add product transactions from visits
                if (historyFilters.type === 'ALL' || historyFilters.type === 'REVENUE' || historyFilters.type === 'PRODUCT') {
                  history.visits.forEach(visit => {
                    visit.productTransactions.forEach(pt => {
                      allTransactions.push({
                        amount: pt.totalPrice,
                        paymentMethod: visit.serviceTransactions?.length > 0 ? visit.serviceTransactions[0].paymentMethod : 'CASH'
                      });
                    });
                  });
                  
                  // Add standalone product sales
                  history.productSales.forEach(sale => {
                    allTransactions.push({
                      amount: sale.totalPrice,
                      paymentMethod: sale.paymentMethod
                    });
                  });
                }
                
                // Add expenses
                if (historyFilters.type === 'ALL' || historyFilters.type === 'EXPENSES') {
                  history.expenses.forEach(expense => {
                    allTransactions.push({
                      amount: -expense.nominal, // Negative for expenses
                      paymentMethod: 'CASH' // Expenses are typically cash
                    });
                  });
                }
                
                const revenueAmount = allTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
                const expenseAmount = Math.abs(allTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
                const netAmount = revenueAmount - expenseAmount;
                const cashAmount = allTransactions.filter(t => t.paymentMethod === 'CASH' && t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
                const qrisAmount = allTransactions.filter(t => t.paymentMethod === 'QRIS' && t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
                const transactionCount = allTransactions.length;
                
                return (
                  <div className="mb-6 p-6 bg-stone-50 rounded-xl border border-stone-200">
                    <h3 className="font-bold text-stone-800 mb-4">Summary ({historyFilters.dateFrom} to {historyFilters.dateTo})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">
                          Rp {revenueAmount.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-stone-600">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-red-600">
                          Rp {expenseAmount.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-stone-600">Expenses</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl sm:text-2xl font-bold ${
                          netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          Rp {netAmount.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-stone-600">Net Profit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-stone-600">
                          Rp {cashAmount.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-stone-600">Cash</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                          Rp {qrisAmount.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-stone-600">QRIS</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Combined Transactions Table */}
              <div className="overflow-hidden rounded-xl border border-stone-200">
                <table className="min-w-full">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Service/Product</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Submitted By</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-100">
                    {(() => {
                      const allTransactions = [];
                      
                      // Add service transactions
                      if (historyFilters.type === 'ALL' || historyFilters.type === 'REVENUE' || historyFilters.type === 'SERVICE') {
                        history.visits.forEach(visit => {
                          const serviceAmount = visit.serviceTransactions?.length > 0 
                            ? visit.serviceTransactions.reduce((sum, st) => sum + st.priceFinal, 0)
                            : visit.visitServices?.reduce((sum, vs) => sum + vs.service.basePrice, 0) || 0;
                          
                          const serviceName = visit.serviceTransactions?.length > 0
                            ? visit.serviceTransactions[0].paketName
                            : visit.visitServices?.map(vs => vs.service.name).join(' + ') || 'No services';
                          
                          allTransactions.push({
                            ...visit,
                            type: 'SERVICE',
                            date: visit.jamSelesai,
                            amount: serviceAmount,
                            paymentMethod: visit.serviceTransactions?.length > 0 ? visit.serviceTransactions[0].paymentMethod : 'CASH',
                            staff: (() => {
                              if (visit.serviceTransactions?.length > 0) {
                                const st = visit.serviceTransactions[0];
                                const responsibleStaff = history.allStaff?.find(s => s.id === st.closingById);
                                return responsibleStaff?.name || 'Unknown';
                              }
                              return visit.capster.name;
                            })(),
                            staffId: visit.serviceTransactions?.length > 0 ? visit.serviceTransactions[0].closingById : visit.capster.id,
                            itemName: serviceName,
                            customerName: visit.customerName,
                            customerPhone: visit.customerPhone
                          });
                        });
                      }
                      
                      // Add product transactions from visits (products bought with service)
                      if (historyFilters.type === 'ALL' || historyFilters.type === 'REVENUE' || historyFilters.type === 'PRODUCT') {
                        history.visits.forEach(visit => {
                          visit.productTransactions.forEach(pt => {
                            allTransactions.push({
                              ...pt,
                              type: 'PRODUCT',
                              date: visit.jamSelesai,
                              customerName: visit.customerName,
                              customerPhone: visit.customerPhone,
                              amount: pt.totalPrice,
                              paymentMethod: visit.serviceTransactions?.length > 0 ? visit.serviceTransactions[0].paymentMethod : 'CASH',
                              staff: (() => {
                                if (visit.serviceTransactions?.length > 0) {
                                  const st = visit.serviceTransactions[0];
                                  const responsibleStaff = history.allStaff?.find(s => s.id === st.closingById);
                                  return responsibleStaff?.name || 'Unknown';
                                }
                                return visit.capster.name;
                              })(),
                              staffId: visit.serviceTransactions?.length > 0 ? visit.serviceTransactions[0].closingById : visit.capster.id,
                              itemName: `${pt.product.name} (x${pt.quantity})`
                            });
                          });
                        });
                        
                        // Add standalone product sales
                        history.productSales.forEach(sale => {
                          const responsibleStaff = history.allStaff?.find(s => s.id === sale.closingById);
                          allTransactions.push({
                            ...sale,
                            type: 'PRODUCT',
                            date: sale.createdAt,
                            amount: sale.totalPrice,
                            staff: responsibleStaff?.name || 'Unknown',
                            staffId: sale.closingById,
                            itemName: `${sale.productNameSnapshot} (x${sale.quantity})`
                          });
                        });
                      }
                      
                      // Add expenses
                      if (historyFilters.type === 'ALL' || historyFilters.type === 'EXPENSES') {
                        history.expenses.forEach(expense => {
                          allTransactions.push({
                            ...expense,
                            type: 'EXPENSE',
                            date: expense.createdAt,
                            amount: expense.nominal,
                            paymentMethod: 'CASH',
                            staff: expense.kasir?.name || 'Unknown',
                            staffId: expense.kasirId,
                            itemName: `${expense.category}${expense.note ? ` - ${expense.note}` : ''}`,
                            customerName: 'Business Expense',
                            customerPhone: ''
                          });
                        });
                      }
                      
                      // Sort by date (newest first)
                      allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                      
                      // Pagination
                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const endIndex = startIndex + itemsPerPage;
                      const paginatedTransactions = allTransactions.slice(startIndex, endIndex);
                      
                      if (paginatedTransactions.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="px-6 py-16 text-center text-stone-500">
                              <div className="text-4xl mb-4">📊</div>
                              <div>No transactions found</div>
                              <div className="text-sm mt-1">Try adjusting your filters</div>
                            </td>
                          </tr>
                        );
                      }
                      
                      return paginatedTransactions.map((transaction, index) => (
                        <tr key={`${transaction.type}-${transaction.id}-${startIndex + index}`} className="hover:bg-stone-50">
                          <td className="px-6 py-5 text-stone-500 text-sm">
                            {new Date(transaction.date).toLocaleDateString('id-ID')}
                            <div className="text-xs text-stone-400">
                              {new Date(transaction.date).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="font-medium text-stone-800">{transaction.customerName}</div>
                            <div className="text-sm text-stone-500">{transaction.customerPhone}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-stone-700">{transaction.itemName}</div>
                            <div className={`text-xs font-medium ${
                              transaction.type === 'SERVICE' ? 'text-blue-600' : 
                              transaction.type === 'PRODUCT' ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {transaction.type}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-stone-700">{transaction.staff}</td>
                          <td className="px-6 py-5 font-medium">
                            <span className={transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-stone-700'}>
                              {transaction.type === 'EXPENSE' ? '-' : ''}Rp {Math.abs(transaction.amount).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            {transaction.type === 'EXPENSE' ? (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                EXPENSE
                              </span>
                            ) : (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                transaction.paymentMethod === 'CASH' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {transaction.paymentMethod}
                              </span>
                            )}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {(() => {
                const allTransactions = [];
                
                // Rebuild transaction list for pagination count
                if (historyFilters.type === 'ALL' || historyFilters.type === 'REVENUE' || historyFilters.type === 'SERVICE') {
                  history.visits.forEach(visit => {
                    allTransactions.push(visit);
                  });
                }
                
                if (historyFilters.type === 'ALL' || historyFilters.type === 'REVENUE' || historyFilters.type === 'PRODUCT') {
                  history.visits.forEach(visit => {
                    visit.productTransactions.forEach(pt => {
                      allTransactions.push(pt);
                    });
                  });
                  
                  history.productSales.forEach(sale => {
                    allTransactions.push(sale);
                  });
                }
                
                if (historyFilters.type === 'ALL' || historyFilters.type === 'EXPENSES') {
                  history.expenses.forEach(expense => {
                    allTransactions.push(expense);
                  });
                }
                
                const totalTransactions = allTransactions.length;
                const totalPages = Math.ceil(totalTransactions / itemsPerPage);
                
                if (totalTransactions > itemsPerPage) {
                  return (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-stone-700">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalTransactions)} of {totalTransactions} transactions
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-stone-500 bg-white border border-stone-300 rounded-md hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => {
                            return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2;
                          })
                          .map((page, index, array) => {
                            if (index > 0 && array[index - 1] !== page - 1) {
                              return [
                                <span key={`ellipsis-${page}`} className="px-3 py-2 text-sm text-stone-500">...</span>,
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                                    currentPage === page
                                      ? 'bg-stone-800 text-white'
                                      : 'text-stone-700 bg-white border border-stone-300 hover:bg-stone-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              ];
                            }
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                  currentPage === page
                                    ? 'bg-stone-800 text-white'
                                    : 'text-stone-700 bg-white border border-stone-300 hover:bg-stone-50'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-stone-500 bg-white border border-stone-300 rounded-md hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  );
                }
                
                return null;
              })()}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Product Sale Modal */}
      {showProductSale && (
        <div className="fixed inset-0 bg-stone-900 bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-stone-200 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-stone-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">📦</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-stone-800">Product Sale</h2>
                    <p className="text-stone-500 text-sm">Sell products directly to customers</p>
                  </div>
                </div>
                <button 
                  onClick={() => {setShowProductSale(false); setProductSaleData({ customerName: '', customerPhone: '', products: [], paymentMethod: 'CASH', completedBy: '', recommendedBy: '' })}}
                  className="text-stone-400 hover:text-stone-600 text-2xl w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Customer Information */}
              <div className="bg-stone-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-stone-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">1</span>
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      placeholder="Enter customer name"
                      value={productSaleData.customerName}
                      onChange={(e) => setProductSaleData({...productSaleData, customerName: e.target.value})}
                      className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none bg-white text-stone-800 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Phone Number</label>
                    <input
                      type="text"
                      placeholder="Enter phone number (optional)"
                      value={productSaleData.customerPhone}
                      onChange={(e) => setProductSaleData({...productSaleData, customerPhone: e.target.value})}
                      className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none bg-white text-stone-800 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Product Selection */}
              <div className="bg-stone-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-stone-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">2</span>
                  Product Selection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {products.map((product) => {
                    const selectedProduct = productSaleData.products.find(p => p.id === product.id);
                    const isSelected = !!selectedProduct;
                    const quantity = selectedProduct?.quantity || 0;
                    
                    return (
                      <div key={product.id} className={`border rounded-lg p-4 transition-all ${
                        isSelected ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProductSaleData(prev => ({
                                    ...prev,
                                    products: [...prev.products, {id: product.id, quantity: 1}]
                                  }));
                                } else {
                                  setProductSaleData(prev => ({
                                    ...prev,
                                    products: prev.products.filter(p => p.id !== product.id)
                                  }));
                                }
                              }}
                              className="rounded border-stone-300 text-stone-600"
                            />
                            <div>
                              <div className="font-medium text-stone-800">{product.name}</div>
                              <div className="text-sm text-stone-500">Hair care product</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-stone-800">Rp {product.basePrice.toLocaleString()}</div>
                            <div className="text-xs text-stone-500">per unit</div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center justify-center space-x-3 pt-3 border-t border-stone-200">
                            <button
                              type="button"
                              onClick={() => {
                                setProductSaleData(prev => ({
                                  ...prev,
                                  products: prev.products.map(p => p.id === product.id ? {...p, quantity: Math.max(1, p.quantity - 1)} : p)
                                }));
                              }}
                              className="w-8 h-8 bg-stone-200 hover:bg-stone-300 rounded-lg flex items-center justify-center text-stone-700 font-bold transition-colors"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-medium text-stone-800">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setProductSaleData(prev => ({
                                  ...prev,
                                  products: prev.products.map(p => p.id === product.id ? {...p, quantity: p.quantity + 1} : p)
                                }));
                              }}
                              className="w-8 h-8 bg-stone-200 hover:bg-stone-300 rounded-lg flex items-center justify-center text-stone-700 font-bold transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-stone-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-stone-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">3</span>
                  Payment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Recommend By</label>
                    <select
                      value={productSaleData.recommendedBy}
                      onChange={(e) => setProductSaleData({...productSaleData, recommendedBy: e.target.value})}
                      className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none bg-white text-stone-800 transition-all"
                    >
                      <option value="">Select recommender</option>
                      {[...capsters, ...kasirList].map((person) => {
                        const isCurrentUser = person.name === branchInfo.kasirName;
                        return (
                          <option key={person.id} value={person.id}>
                            {person.name}{isCurrentUser ? ' (You)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Transaction Responsible</label>
                    <select
                      value={productSaleData.completedBy}
                      onChange={(e) => setProductSaleData({...productSaleData, completedBy: e.target.value})}
                      className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none bg-white text-stone-800 transition-all"
                    >
                      <option value="">Select responsible person</option>
                      {[...capsters, ...kasirList].map((person) => {
                        const isCurrentUser = person.name === branchInfo.kasirName;
                        return (
                          <option key={person.id} value={person.id}>
                            {person.name}{isCurrentUser ? ' (You)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">Payment Method</label>
                  <div className="space-y-2">
                    {['CASH', 'QRIS'].map((method) => (
                      <label key={method} className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        productSaleData.paymentMethod === method ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={productSaleData.paymentMethod === method}
                          onChange={(e) => setProductSaleData({...productSaleData, paymentMethod: e.target.value})}
                          className="text-stone-600"
                        />
                        <div>
                          <div className="font-medium text-stone-800">{method}</div>
                          <div className="text-sm text-stone-500">{method === 'CASH' ? 'Cash payment' : 'Digital payment'}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bill Summary */}
              {productSaleData.products.length > 0 && (
                <div className="bg-stone-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Bill Summary</h3>
                  <div className="space-y-2">
                    {productSaleData.products.map((selectedProduct) => {
                      const product = products.find(p => p.id === selectedProduct.id);
                      if (!product) return null;
                      const subtotal = product.basePrice * selectedProduct.quantity;
                      return (
                        <div key={selectedProduct.id} className="flex justify-between">
                          <span>{product.name} x{selectedProduct.quantity}</span>
                          <span>Rp {subtotal.toLocaleString()}</span>
                        </div>
                      );
                    })}
                    <div className="border-t border-stone-500 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Amount</span>
                        <span>Rp {productSaleData.products.reduce((total, selectedProduct) => {
                          const product = products.find(p => p.id === selectedProduct.id);
                          return total + (product ? product.basePrice * selectedProduct.quantity : 0);
                        }, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-stone-200 px-8 py-6 rounded-b-2xl">
              <div className="flex gap-4">
                <button 
                  onClick={() => {setShowProductSale(false); setProductSaleData({ customerName: '', customerPhone: '', products: [], paymentMethod: 'CASH', completedBy: '', recommendedBy: '' })}}
                  className="flex-1 text-stone-600 hover:text-stone-800 px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    if (!productSaleData.customerName || productSaleData.products.length === 0) {
                      alert('Please enter customer name and select at least one product');
                      return;
                    }
                    
                    try {
                      const response = await fetch('/api/kasir/product-sale', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          ...productSaleData,
                          completedBy: productSaleData.completedBy || currentKasir
                        })
                      });
                      
                      if (response.ok) {
                        setProductSaleData({ customerName: '', customerPhone: '', products: [], paymentMethod: 'CASH', completedBy: '', recommendedBy: '' });
                        setShowProductSale(false);
                      }
                    } catch (error) {
                      console.error('Failed to add product sale:', error);
                    }
                  }}
                  disabled={!productSaleData.customerName || productSaleData.products.length === 0}
                  className="flex-1 bg-stone-600 text-white px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>📦</span>
                  <span>Complete Sale</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpense && (
        <div className="fixed inset-0 bg-stone-900 bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-stone-800">💸 Add Expense</h2>
                <button 
                  onClick={() => {setShowExpense(false); setExpenseData({ nominal: '', category: 'OPERASIONAL', note: '' })}}
                  className="text-stone-400 hover:text-stone-600 text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Amount *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500">Rp</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={expenseData.nominal}
                    onChange={(e) => setExpenseData({...expenseData, nominal: e.target.value})}
                    className="w-full border border-stone-300 rounded-lg pl-10 pr-4 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Category</label>
                <select
                  value={expenseData.category}
                  onChange={(e) => setExpenseData({...expenseData, category: e.target.value})}
                  className="w-full border border-stone-300 rounded-lg px-3 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800"
                >
                  <option value="OPERASIONAL">Operasional</option>
                  <option value="TAMBAHAN">Tambahan</option>
                  <option value="LAINNYA">Lainnya</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Note (Optional)</label>
                <textarea
                  placeholder="What is this expense for?"
                  value={expenseData.note}
                  onChange={(e) => setExpenseData({...expenseData, note: e.target.value})}
                  className="w-full border border-stone-300 rounded-lg px-3 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800 resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-stone-200">
              <div className="flex gap-3">
                <button 
                  onClick={() => {setShowExpense(false); setExpenseData({ nominal: '', category: 'OPERASIONAL', note: '' })}}
                  className="flex-1 text-stone-600 hover:text-stone-800 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    if (!expenseData.nominal || parseInt(expenseData.nominal) <= 0) {
                      alert('Please enter a valid expense amount');
                      return;
                    }
                    
                    try {
                      const response = await fetch('/api/kasir/expense', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          ...expenseData,
                          nominal: parseInt(expenseData.nominal),
                          kasirId: currentKasir
                        })
                      });
                      
                      if (response.ok) {
                        setExpenseData({ nominal: '', category: 'OPERASIONAL', note: '' });
                        setShowExpense(false);
                      }
                    } catch (error) {
                      console.error('Failed to add expense:', error);
                    }
                  }}
                  disabled={!expenseData.nominal || parseInt(expenseData.nominal) <= 0}
                  className="flex-1 bg-stone-500 text-white px-4 py-2 rounded-lg hover:bg-stone-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Visit Modal */}
      {editingVisit && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-stone-800">Edit Services - {editingVisit.customerName}</h2>
                  <p className="text-stone-500 text-sm">Modify services for ongoing visit</p>
                </div>
                <button 
                  onClick={() => {setEditingVisit(null); setEditServices([]);}}
                  className="text-stone-400 hover:text-stone-600 text-2xl w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-4">Edit Services</h3>
                <div className="space-y-6">
                  {/* Haircut Packages */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-stone-700">Haircut Package <span className="text-stone-500">(Optional)</span></label>
                      {editServices.some(id => {
                        const service = services.find(s => s.id === id);
                        return service?.category === 'HAIRCUT';
                      }) && (
                        <button
                          type="button"
                          onClick={() => {
                            const nonHaircutServices = editServices.filter(id => {
                              const service = services.find(s => s.id === id);
                              return service?.category !== 'HAIRCUT';
                            });
                            setEditServices(nonHaircutServices);
                          }}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          Clear Haircut
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {hairCutServices.map((service) => (
                        <label key={service.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                          editServices.includes(service.id) ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="editHaircut"
                              checked={editServices.includes(service.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Remove any existing haircut services and add this one
                                  const nonHaircutServices = editServices.filter(id => {
                                    const existingService = services.find(s => s.id === id);
                                    return existingService?.category !== 'HAIRCUT';
                                  });
                                  setEditServices([...nonHaircutServices, service.id]);
                                } else {
                                  // Allow unchecking by removing this service
                                  setEditServices(editServices.filter(id => id !== service.id));
                                }
                              }}
                              className="text-stone-800"
                            />
                            <div>
                              <div className="font-medium text-stone-800">{service.name}</div>
                              <div className="text-sm text-stone-500">Professional haircut service</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-stone-800">Rp {service.basePrice.toLocaleString()}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Treatments */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">Additional Treatments <span className="text-stone-500">(Optional)</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {treatmentServices.map((service) => (
                        <label key={service.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                          editServices.includes(service.id) ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={editServices.includes(service.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditServices([...editServices, service.id]);
                                } else {
                                  setEditServices(editServices.filter(id => id !== service.id));
                                }
                              }}
                              className="rounded border-stone-300 text-stone-800"
                            />
                            <div>
                              <div className="font-medium text-stone-800">{service.name}</div>
                              <div className="text-sm text-stone-500">Premium treatment</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-stone-800">+Rp {service.basePrice.toLocaleString()}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {editServices.length > 0 && (
                <div className="bg-stone-800 rounded-xl p-4 text-white">
                  <h4 className="font-medium mb-2">Updated Services</h4>
                  <div className="space-y-1">
                    {editServices.map(serviceId => {
                      const service = services.find(s => s.id === serviceId);
                      return service ? (
                        <div key={serviceId} className="flex justify-between text-sm">
                          <span>{service.name}</span>
                          <span>Rp {service.basePrice.toLocaleString()}</span>
                        </div>
                      ) : null;
                    })}
                    <div className="border-t border-stone-600 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>Rp {editServices.reduce((total, serviceId) => {
                          const service = services.find(s => s.id === serviceId);
                          return total + (service?.basePrice || 0);
                        }, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-stone-200 px-6 py-4 rounded-b-2xl">
              <div className="flex gap-3">
                <button 
                  onClick={() => {setEditingVisit(null); setEditServices([]);}}
                  className="flex-1 text-stone-600 hover:text-stone-800 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (isSubmitting) return;
                    setConfirmModal({
                      show: true,
                      title: 'Update Services',
                      message: `Update services for ${editingVisit?.customerName}?`,
                      onConfirm: async () => {
                        setConfirmModal(null);
                        setIsSubmitting(true);
                        try {
                          await handleEditVisit();
                        } finally {
                          setIsSubmitting(false);
                        }
                      }
                    });
                  }}
                  disabled={editServices.length === 0 || isSubmitting}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Services'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-stone-900 bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-stone-200 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✂</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-stone-800">New Service</h2>
                    <p className="text-stone-500 text-sm">Add a new customer and start their service</p>
                  </div>
                </div>
                <button 
                  onClick={() => {setShowAddService(false); setNewCustomer({ name: '', phone: '', services: [], capsterId: '' })}}
                  className="text-stone-400 hover:text-stone-600 text-2xl w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Customer Information */}
              <div className="bg-stone-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-stone-800 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">1</span>
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      placeholder="Enter customer name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none bg-white text-stone-800 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Phone Number</label>
                    <input
                      type="text"
                      placeholder="Enter phone number (optional)"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none bg-white text-stone-800 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="bg-stone-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-stone-800 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">2</span>
                  Service Selection
                </h3>
                <div className="space-y-6">
                  {/* Haircut Packages */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">Haircut Package <span className="text-stone-500">(Optional)</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {hairCutServices.map((service) => (
                        <label key={service.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                          newCustomer.services.includes(service.id) ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={newCustomer.services.includes(service.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Remove any existing haircut services and add this one
                                  const nonHaircutServices = newCustomer.services.filter(id => {
                                    const existingService = services.find(s => s.id === id);
                                    return existingService?.category !== 'HAIRCUT';
                                  });
                                  setNewCustomer({...newCustomer, services: [...nonHaircutServices, service.id]});
                                } else {
                                  // Remove this haircut service
                                  setNewCustomer({...newCustomer, services: newCustomer.services.filter(id => id !== service.id)});
                                }
                              }}
                              className="rounded border-stone-300 text-stone-800"
                            />
                            <div>
                              <div className="font-medium text-stone-800">{service.name}</div>
                              <div className="text-sm text-stone-500">Professional haircut service</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-stone-800">Rp {service.basePrice.toLocaleString()}</div>
                            <div className="text-xs text-stone-500">Base price</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Treatments */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">Additional Treatments <span className="text-stone-500">(Optional)</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {treatmentServices.map((service) => (
                        <label key={service.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                          newCustomer.services.includes(service.id) ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={newCustomer.services.includes(service.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewCustomer({...newCustomer, services: [...newCustomer.services, service.id]});
                                } else {
                                  setNewCustomer({...newCustomer, services: newCustomer.services.filter(id => id !== service.id)});
                                }
                              }}
                              className="rounded border-stone-300 text-stone-800"
                            />
                            <div>
                              <div className="font-medium text-stone-800">{service.name}</div>
                              <div className="text-sm text-stone-500">Premium treatment</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-stone-800">+Rp {service.basePrice.toLocaleString()}</div>
                            <div className="text-xs text-stone-500">Add-on</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">Assign Capster *</label>
                    <div className="space-y-2">
                      {capsters.map((capster) => (
                        <label key={capster.id} className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          newCustomer.capsterId === capster.id ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                        }`}>
                          <input
                            type="radio"
                            name="capster"
                            value={capster.id}
                            checked={newCustomer.capsterId === capster.id}
                            onChange={(e) => setNewCustomer({...newCustomer, capsterId: e.target.value})}
                            className="text-stone-800"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-stone-800">{capster.name}</div>
                            <div className="text-sm text-stone-500">Professional barber</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>



              {/* Summary */}
              {newCustomer.services.length > 0 && (
                <div className="bg-stone-800 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Service Summary</h3>
                  <div className="space-y-2">
                    {newCustomer.services.map(serviceId => {
                      const service = services.find(s => s.id === serviceId);
                      return service ? (
                        <div key={serviceId} className="flex justify-between">
                          <span>{service.name}</span>
                          <span>Rp {service.basePrice.toLocaleString()}</span>
                        </div>
                      ) : null;
                    })}
                    <div className="border-t border-stone-600 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Estimate</span>
                        <span>Rp {newCustomer.services.reduce((total, serviceId) => {
                          const service = services.find(s => s.id === serviceId);
                          return total + (service?.basePrice || 0);
                        }, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-stone-200 px-8 py-6 rounded-b-2xl">
              <div className="flex gap-4">
                <button 
                  onClick={() => {setShowAddService(false); setNewCustomer({ name: '', phone: '', services: [], capsterId: '' })}}
                  className="flex-1 text-stone-600 hover:text-stone-800 px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    if (isSubmitting) return;
                    
                    const hasHaircut = newCustomer.services.some(serviceId => {
                      const service = services.find(s => s.id === serviceId);
                      return service?.category === 'HAIRCUT';
                    });
                    
                    if (!newCustomer.name || newCustomer.services.length === 0 || !newCustomer.capsterId) {
                      alert('Please fill in customer name, select at least one service, and assign a capster');
                      return;
                    }
                    
                    setConfirmModal({
                      show: true,
                      title: 'Start Service',
                      message: `Start service for ${newCustomer.name}?`,
                      onConfirm: async () => {
                        setConfirmModal(null);
                        setIsSubmitting(true);
                        try {
                          const response = await fetch('/api/kasir/customers', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newCustomer)
                          });
                          
                          if (response.ok) {
                            setNewCustomer({ name: '', phone: '', services: [], capsterId: '' });
                            setShowAddService(false);
                            fetchCustomers();
                          }
                        } catch (error) {
                          console.error('Failed to add customer:', error);
                        } finally {
                          setIsSubmitting(false);
                        }
                      }
                    });
                    return;

                  }}
                  disabled={!newCustomer.name || newCustomer.services.length === 0 || !newCustomer.capsterId || isSubmitting}
                  className="flex-1 bg-stone-800 text-white px-6 py-3 rounded-lg hover:bg-stone-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>✂</span>
                  <span>{isSubmitting ? 'Starting...' : 'Start Service'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 p-4 min-w-[300px]">
            <p className="text-stone-800 mb-4 text-center">{confirmModal.message}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-3 py-2 text-stone-600 hover:text-stone-800 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="flex-1 px-3 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 shadow-2xl border border-gray-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Konfirmasi Logout</h3>
              <p className="text-gray-600 mb-6">Apakah Anda yakin ingin logout dari panel kasir?</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Loading Spinner */}
      {globalLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-stone-800 rounded-full animate-spin bg-white shadow-lg"></div>
        </div>
      )}
    </div>
  );
}