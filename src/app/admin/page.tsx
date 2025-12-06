'use client';
import { useState, useEffect } from 'react';
import Overview from './components/dashboard/Overview';
import TransactionMonitor from './components/transactions/TransactionMonitor';
import Sidebar from './components/layout/Sidebar';
import CapsterManager from './components/users/CapsterManager';
import KasirManager from './components/users/KasirManager';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<{[key: string]: boolean}>({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
  const [commissionData, setCommissionData] = useState<any[]>([]);
  const [commissionFilters, setCommissionFilters] = useState({
    dateFrom: '',
    dateTo: '',
    capsterId: '',
    branchId: ''
  });
  const [showCommissionDetail, setShowCommissionDetail] = useState(false);
  const [selectedStaffDetail, setSelectedStaffDetail] = useState<any>(null);
  const [staffTransactions, setStaffTransactions] = useState<any[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [transactionFilters, setTransactionFilters] = useState({
    dateFrom: '',
    dateTo: '',
    branchId: '',
    type: 'ALL' // ALL, SERVICE, PRODUCT
  });
  const [transactionSummary, setTransactionSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    cashRevenue: 0,
    qrisRevenue: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [datePreset, setDatePreset] = useState('7days');
  const [commissionDatePreset, setCommissionDatePreset] = useState('7days');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTransaction, setDeleteTransaction] = useState<any>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [globalLoading, setGlobalLoading] = useState(false);
  const [overviewData, setOverviewData] = useState(null);
  const [overviewPeriod, setOverviewPeriod] = useState('7days');
  const [chartPeriod, setChartPeriod] = useState('7days');
  const [branchPeriod, setBranchPeriod] = useState('7days');

  useEffect(() => {
    // Always fetch basic data on mount
    fetchCapster();
    fetchKasir();
    fetchCabangList();
    fetchBranches();
    fetchServices();
    fetchProducts();
    
    if (activeTab === 'overview') fetchOverviewData();
    if (activeTab === 'gallery') fetchGallery();
    if (activeTab === 'commission') fetchCommissionData();
    if (activeTab === 'transactions') fetchTransactionHistory();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverviewData();
    }
  }, [overviewPeriod, chartPeriod, branchPeriod]);

  const fetchKasir = async () => {
    console.log('API call disabled: fetchKasir');
    setKasirList([]);
  };

  const fetchCapster = async () => {
    console.log('API call disabled: fetchCapster');
    setCapsterList([]);
  };

  const handleAddKasir = async () => {
    console.log('API call disabled: handleAddKasir');
  };

  const handleAddCapster = async () => {
    console.log('API call disabled: handleAddCapster');
  };

  const handleDeleteKasir = async (id: string) => {
    console.log('API call disabled: handleDeleteKasir');
  };

  const handleDeleteCapster = async (id: string) => {
    console.log('API call disabled: handleDeleteCapster');
  };

  const fetchGallery = async () => {
    console.log('API call disabled: fetchGallery');
    setGalleryList([]);
  };

  const handleUploadImage = async (position: number, file: File) => {
    console.log('API call disabled: handleUploadImage');
  };

  const handleDeleteImage = async (position: number) => {
    console.log('API call disabled: handleDeleteImage');
  };

  const fetchServices = async () => {
    console.log('API call disabled: fetchServices');
    setServiceList([]);
  };

  const fetchProducts = async () => {
    console.log('API call disabled: fetchProducts');
    setProductList([]);
  };

  const handleAddService = async () => {
    console.log('API call disabled: handleAddService');
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
    console.log('API call disabled: handleUpdateService');
  };

  const handleAddProduct = async () => {
    console.log('API call disabled: handleAddProduct');
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
    console.log('API call disabled: handleUpdateProduct');
  };

  const handleDeleteService = async (id: string) => {
    console.log('API call disabled: handleDeleteService');
  };

  const handleDeleteProduct = async (id: string) => {
    console.log('API call disabled: handleDeleteProduct');
  };

  const fetchBranches = async () => {
    console.log('API call disabled: fetchBranches');
    setBranchList([]);
  };

  const fetchCabangList = async () => {
    console.log('API call disabled: fetchCabangList');
    setCabangList([]);
  };

  const handleAddBranch = async () => {
    console.log('API call disabled: handleAddBranch');
  };

  const handleDeleteBranch = async (id: string) => {
    console.log('API call disabled: handleDeleteBranch');
  };

  const fetchCommissionData = async () => {
    console.log('API call disabled: fetchCommissionData');
    setCommissionData([]);
  };

  const fetchStaffTransactionDetails = async (staff: any) => {
    console.log('API call disabled: fetchStaffTransactionDetails');
    setStaffTransactions([]);
  };

  const fetchTransactionHistory = async () => {
    console.log('API call disabled: fetchTransactionHistory');
    setTransactionHistory([]);
  };

  const fetchOverviewData = async () => {
    console.log('API call disabled: fetchOverviewData');
    setOverviewData(null);
  };

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setCommissionFilters({
      dateFrom: sevenDaysAgo,
      dateTo: today,
      capsterId: '',
      branchId: ''
    });
    setTransactionFilters({
      dateFrom: sevenDaysAgo,
      dateTo: today,
      branchId: '',
      type: 'ALL'
    });
  }, []);

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
    
    setTransactionFilters(prev => ({
      ...prev,
      dateFrom,
      dateTo: today
    }));
  };

  const handleCommissionDatePresetChange = (preset: string) => {
    setCommissionDatePreset(preset);
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
    
    setCommissionFilters(prev => ({
      ...prev,
      dateFrom,
      dateTo: today
    }));
  };

  useEffect(() => {
    if (activeTab === 'commission') {
      fetchCommissionData();
    }
  }, [commissionFilters]);

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactionHistory();
    }
  }, [transactionFilters]);

  // Auto-expand menus based on active tab
  useEffect(() => {
    if (['services', 'products', 'gallery'].includes(activeTab)) {
      setExpandedMenus(prev => ({ ...prev, 'data-master': true }));
    } else if (['capster', 'kasir', 'branches'].includes(activeTab)) {
      setExpandedMenus(prev => ({ ...prev, 'data-user': true }));
    } else if (['transactions', 'commission'].includes(activeTab)) {
      setExpandedMenus(prev => ({ ...prev, 'data-transaksi': true }));
    }
  }, [activeTab]);

  const generateCommissionPDF = (staff: any, transactions: any[]) => {
    const doc = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Commission Report - ${staff.capsterName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .report-title { font-size: 18px; color: #666; }
        .staff-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
        .summary-card { background: #fff; border: 1px solid #ddd; padding: 15px; text-align: center; border-radius: 8px; }
        .summary-amount { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
        .summary-label { font-size: 12px; color: #666; }
        .service-commission { color: #2563eb; }
        .product-commission { color: #ea580c; }
        .total-commission { color: #16a34a; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .transaction-type { padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
        .type-service { background: #dbeafe; color: #1d4ed8; }
        .type-product { background: #fed7aa; color: #c2410c; }
        .amount { font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">BARBER PLACE</div>
        <div class="report-title">Commission Report</div>
    </div>
    
    <div class="staff-info">
        <h3>Staff Information</h3>
        <p><strong>Name:</strong> ${staff.capsterName}</p>
        <p><strong>Role:</strong> ${staff.role || 'CAPSTER'}</p>
        <p><strong>Branch:</strong> ${staff.branchName}</p>
        <p><strong>Period:</strong> ${commissionFilters.dateFrom} to ${commissionFilters.dateTo}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString()}</p>
    </div>
    
    <div class="summary-cards">
        <div class="summary-card">
            <div class="summary-amount service-commission">Rp ${(staff.serviceCommission || 0).toLocaleString()}</div>
            <div class="summary-label">Service Commission</div>
        </div>
        <div class="summary-card">
            <div class="summary-amount product-commission">Rp ${(staff.productCommission || 0).toLocaleString()}</div>
            <div class="summary-label">Product Commission</div>
        </div>
        <div class="summary-card">
            <div class="summary-amount total-commission">Rp ${((staff.serviceCommission || 0) + (staff.productCommission || 0)).toLocaleString()}</div>
            <div class="summary-label">Total Commission</div>
        </div>
    </div>
    
    <h3>Transaction Details</h3>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Commission</th>
            </tr>
        </thead>
        <tbody>
            ${transactions.map(t => `
                <tr>
                    <td>${new Date(t.date).toLocaleDateString('id-ID')}</td>
                    <td><span class="transaction-type type-${t.type.toLowerCase()}">${t.type}</span></td>
                    <td>${t.description}</td>
                    <td class="amount">Rp ${t.amount?.toLocaleString()}</td>
                    <td class="amount">Rp ${t.commission?.toLocaleString()}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="footer">
        <p>This is an automated commission report generated by Barber Place Management System</p>
        <p>Report ID: ${Date.now()}</p>
    </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(doc);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDeleteTransaction = async (transaction: any) => {
    setDeleteTransaction(transaction);
    setShowDeleteModal(true);
  };

  const confirmDeleteTransaction = async () => {
    console.log('API call disabled: confirmDeleteTransaction');
  };

  const handleLogout = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };



  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        expandedMenus={expandedMenus}
        setExpandedMenus={setExpandedMenus}
        setShowLogoutModal={setShowLogoutModal}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Barber Place Management</h1>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
          {activeTab === 'overview' && (
            <Overview
              overviewData={overviewData}
              overviewPeriod={overviewPeriod}
              chartPeriod={chartPeriod}
              branchPeriod={branchPeriod}
              setOverviewPeriod={setOverviewPeriod}
              setChartPeriod={setChartPeriod}
              setBranchPeriod={setBranchPeriod}
              branchList={branchList}
              capsterList={capsterList}
              kasirList={kasirList}
              serviceList={serviceList}
              productList={productList}
            />
          )}

          {activeTab === 'transactions' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-black">Transaction Monitor</h2>
                  <p className="text-gray-600 text-sm">Monitor all branch transactions</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                {/* Date Presets */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
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
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                    <input
                      type="date"
                      value={transactionFilters.dateFrom}
                      onChange={(e) => {
                        setTransactionFilters({...transactionFilters, dateFrom: e.target.value});
                        setDatePreset('custom');
                      }}
                      disabled={datePreset !== 'custom'}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                    <input
                      type="date"
                      value={transactionFilters.dateTo}
                      onChange={(e) => {
                        setTransactionFilters({...transactionFilters, dateTo: e.target.value});
                        setDatePreset('custom');
                      }}
                      disabled={datePreset !== 'custom'}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                    <select
                      value={transactionFilters.branchId}
                      onChange={(e) => setTransactionFilters({...transactionFilters, branchId: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
                    >
                      <option value="">All Branches</option>
                      {cabangList.map((cabang) => (
                        <option key={cabang.id} value={cabang.id}>
                          {cabang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={transactionFilters.type}
                      onChange={(e) => setTransactionFilters({...transactionFilters, type: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
                    >
                      <option value="ALL">All Transactions</option>
                      <option value="SERVICE">Services Only</option>
                      <option value="PRODUCT">Products Only</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchTransactionHistory}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* Revenue Summary */}
              {transactionHistory.length > 0 && (
                <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-black mb-4">Financial Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        Rp {transactionSummary.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        Rp {transactionSummary.totalExpenses.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Expenses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">
                        Rp {transactionSummary.cashRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Cash Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        Rp {transactionSummary.qrisRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">QRIS Revenue</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Table */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service/Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(() => {
                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const endIndex = startIndex + itemsPerPage;
                      const paginatedTransactions = transactionHistory.slice(startIndex, endIndex);
                      
                      if (paginatedTransactions.length === 0) {
                        return (
                          <tr>
                            <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                              No transactions found for the selected period.
                            </td>
                          </tr>
                        );
                      }
                      
                      return paginatedTransactions.map((transaction, index) => (
                        <tr key={startIndex + index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('id-ID')}
                            <div className="text-xs text-gray-400">
                              {new Date(transaction.date).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">
                            {transaction.customerName}
                            <div className="text-xs text-gray-500">{transaction.customerPhone}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {transaction.itemName}
                            <div className={`text-xs font-medium ${
                              transaction.type === 'SERVICE' ? 'text-blue-600' : 
                              transaction.type === 'PRODUCT' ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {transaction.type}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.staffName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.branchName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-gray-700'}>
                              {transaction.type === 'EXPENSE' ? '-' : ''}Rp {Math.abs(transaction.amount).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteTransaction(transaction)}
                              className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {transactionHistory.length > itemsPerPage && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, transactionHistory.length)} of {transactionHistory.length} transactions
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.ceil(transactionHistory.length / itemsPerPage) }, (_, i) => i + 1)
                      .filter(page => {
                        const totalPages = Math.ceil(transactionHistory.length / itemsPerPage);
                        return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2;
                      })
                      .map((page, index, array) => {
                        if (index > 0 && array[index - 1] !== page - 1) {
                          return [
                            <span key={`ellipsis-${page}`} className="px-3 py-2 text-sm text-gray-500">...</span>,
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
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
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(transactionHistory.length / itemsPerPage)))}
                      disabled={currentPage === Math.ceil(transactionHistory.length / itemsPerPage)}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'commission' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-black">Commission Monitor</h2>
                  <p className="text-gray-600 text-sm">Track capster commissions and performance</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                {/* Date Presets */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'today', name: 'Today' },
                      { id: '7days', name: 'Last 7 Days' },
                      { id: '30days', name: 'Last 30 Days' },
                      { id: 'custom', name: 'Custom Range' }
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleCommissionDatePresetChange(preset.id)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          commissionDatePreset === preset.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                    <input
                      type="date"
                      value={commissionFilters.dateFrom}
                      onChange={(e) => {
                        setCommissionFilters({...commissionFilters, dateFrom: e.target.value});
                        setCommissionDatePreset('custom');
                      }}
                      disabled={commissionDatePreset !== 'custom'}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                    <input
                      type="date"
                      value={commissionFilters.dateTo}
                      onChange={(e) => {
                        setCommissionFilters({...commissionFilters, dateTo: e.target.value});
                        setCommissionDatePreset('custom');
                      }}
                      disabled={commissionDatePreset !== 'custom'}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Staff</label>
                    <select
                      value={commissionFilters.capsterId}
                      onChange={(e) => setCommissionFilters({...commissionFilters, capsterId: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
                    >
                      <option value="">All Staff</option>
                      <optgroup label="Capsters">
                        {capsterList.map((capster) => (
                          <option key={capster.id} value={capster.id}>
                            {capster.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Kasirs">
                        {kasirList.map((kasir) => (
                          <option key={kasir.id} value={kasir.id}>
                            {kasir.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                    <select
                      value={commissionFilters.branchId}
                      onChange={(e) => setCommissionFilters({...commissionFilters, branchId: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
                    >
                      <option value="">All Branches</option>
                      {cabangList.map((cabang) => (
                        <option key={cabang.id} value={cabang.id}>
                          {cabang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchCommissionData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* Commission Summary */}
              {commissionData.length > 0 && (
                <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-black mb-4">Commission Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        Rp {commissionData.reduce((sum, item) => sum + (item.serviceCommission || 0) + (item.productCommission || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Commission</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        Rp {commissionData.reduce((sum, item) => sum + (item.serviceCommission || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Service Commission</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        Rp {commissionData.reduce((sum, item) => sum + (item.productCommission || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Product Commission</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Commission Table */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Commission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Commission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Commission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {commissionData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                          No commission data found for the selected period.
                        </td>
                      </tr>
                    ) : (
                      commissionData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{item.capsterName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.role === 'CAPSTER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {item.role || 'CAPSTER'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.branchName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                            Rp {(item.serviceCommission || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                            Rp {(item.productCommission || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                            Rp {((item.serviceCommission || 0) + (item.productCommission || 0)).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.serviceCount || 0} services, {item.productCount || 0} products
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedStaffDetail(item);
                                fetchStaffTransactionDetails(item);
                                setShowCommissionDetail(true);
                              }}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors font-medium"
                            >
                              Details
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
            <CapsterManager
              capsterList={capsterList}
              showCapsterForm={showCapsterForm}
              setShowCapsterForm={setShowCapsterForm}
              newCapster={newCapster}
              setNewCapster={setNewCapster}
              handleAddCapster={handleAddCapster}
              handleDeleteCapster={handleDeleteCapster}
            />
          )}

          {activeTab === 'kasir' && (
            <KasirManager
              kasirList={kasirList}
              showKasirForm={showKasirForm}
              setShowKasirForm={setShowKasirForm}
              newKasir={newKasir}
              setNewKasir={setNewKasir}
              handleAddKasir={handleAddKasir}
              handleDeleteKasir={handleDeleteKasir}
            />
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTransaction && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white rounded-lg w-80 p-6 shadow-2xl border">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Delete Transaction?</h3>
            <p className="text-gray-600 mb-6 text-center">
              <strong>{deleteTransaction.customerName}</strong><br/>
              Rp {Math.abs(deleteTransaction.amount).toLocaleString()}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {setShowDeleteModal(false); setDeleteTransaction(null)}}
                className="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTransaction}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg ${
            notificationMessage.includes('success') ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {notificationMessage}
          </div>
        </div>
      )}

      {/* Commission Detail Modal */}
      {showCommissionDetail && selectedStaffDetail && (
        <div className="fixed inset-0 bg-stone-900 bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-stone-200 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-stone-800">Commission Details</h2>
                  <p className="text-stone-500 text-sm">{selectedStaffDetail.capsterName} - {selectedStaffDetail.role}</p>
                </div>
                <button 
                  onClick={() => {setShowCommissionDetail(false); setSelectedStaffDetail(null); setStaffTransactions([])}}
                  className="text-stone-400 hover:text-stone-600 text-2xl w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-gray-600">Service Commission</h3>
                  <p className="text-2xl font-bold text-blue-600">Rp {(selectedStaffDetail.serviceCommission || 0).toLocaleString()}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="text-sm font-medium text-gray-600">Product Commission</h3>
                  <p className="text-2xl font-bold text-orange-600">Rp {(selectedStaffDetail.productCommission || 0).toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-sm font-medium text-gray-600">Total Commission</h3>
                  <p className="text-2xl font-bold text-green-600">Rp {((selectedStaffDetail.serviceCommission || 0) + (selectedStaffDetail.productCommission || 0)).toLocaleString()}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Breakdown</h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {staffTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            No detailed transactions available
                          </td>
                        </tr>
                      ) : (
                        staffTransactions.map((transaction, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.type === 'SERVICE' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                              }`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{transaction.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                              Rp {transaction.amount?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                              Rp {transaction.commission?.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-stone-200 px-8 py-6 rounded-b-2xl">
              <div className="flex gap-3">
                <button 
                  onClick={() => generateCommissionPDF(selectedStaffDetail, staffTransactions)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <span>📄</span>
                  Export PDF
                </button>
                <button 
                  onClick={() => {setShowCommissionDetail(false); setSelectedStaffDetail(null); setStaffTransactions([])}}
                  className="bg-stone-600 text-white px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Loading Spinner */}
      {globalLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin bg-white shadow-lg"></div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-80 p-6 shadow-2xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Konfirmasi Logout</h3>
            <p className="text-gray-600 mb-6 text-center">Apakah Anda yakin ingin keluar dari dashboard admin?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}