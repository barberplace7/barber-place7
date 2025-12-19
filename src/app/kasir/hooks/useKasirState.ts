import { useState, useEffect } from 'react';
import type { Customer, Service, Capster, Kasir, Product, NewCustomerForm, ProductSaleForm, ExpenseForm, HistoryFilters, DailySummary, ConfirmModalData } from '../types';
import { kasirApi } from '../services/api';

export const useKasirState = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [capsters, setCapsters] = useState<Capster[]>([]);
  const [kasirList, setKasirList] = useState<Kasir[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [branchInfo, setBranchInfo] = useState({ name: '', kasirName: '' });
  
  const [showAddService, setShowAddService] = useState(false);
  const [showProductSale, setShowProductSale] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState<NewCustomerForm>({ name: '', phone: '', serviceCapsterPairs: [] });
  const [productSaleData, setProductSaleData] = useState<ProductSaleForm>({ customerName: '', customerPhone: '', products: [], paymentMethod: 'CASH', completedBy: '', recommendedBy: '' });
  const [expenseData, setExpenseData] = useState<ExpenseForm>({ nominal: '', category: 'OPERASIONAL', note: '' });
  
  const [editingVisit, setEditingVisit] = useState<Customer | null>(null);
  const [editServices, setEditServices] = useState<string[]>([]);
  const [completingCustomer, setCompletingCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [completedBy, setCompletedBy] = useState('');
  const [currentKasir, setCurrentKasir] = useState('');
  
  const [customerView, setCustomerView] = useState('ongoing');
  const [completedToday, setCompletedToday] = useState<any[]>([]);
  const [productTransactions, setProductTransactions] = useState<any[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary>({ total: 0, cash: 0, qris: 0 });
  
  const [history, setHistory] = useState<any>({ visits: [], productSales: [], expenses: [], allStaff: [] });
  const [historyFilters, setHistoryFilters] = useState<HistoryFilters>({ dateFrom: '', dateTo: '', type: 'ALL' });
  const [currentPage, setCurrentPage] = useState(1);
  const [datePreset, setDatePreset] = useState('7days');
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalData | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchCustomers = async () => {
    try {
      const data = await kasirApi.fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await kasirApi.fetchServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchCapsters = async () => {
    try {
      const data = await kasirApi.fetchCapsters();
      setCapsters(data);
    } catch (error) {
      console.error('Failed to fetch capsters:', error);
    }
  };

  const fetchKasir = async () => {
    try {
      const data = await kasirApi.fetchKasirList();
      setKasirList(data);
    } catch (error) {
      console.error('Failed to fetch kasir:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await kasirApi.fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchSessionInfo = async () => {
    try {
      const data = await kasirApi.fetchSessionInfo();
      setBranchInfo({ name: data.branchName, kasirName: data.kasirName });
    } catch (error) {
      console.error('Failed to fetch session info:', error);
    }
  };

  const fetchCompletedToday = async () => {
    try {
      const data = await kasirApi.fetchCompletedToday();
      setCompletedToday(data.visits || []);
      setDailySummary(data.summary || { total: 0, cash: 0, qris: 0 });
      setProductTransactions(data.productTransactions || []);
    } catch (error) {
      console.error('Failed to fetch completed today:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await kasirApi.fetchHistory(historyFilters);
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchServices();
    fetchCapsters();
    fetchKasir();
    fetchProducts();
    fetchSessionInfo();
    if (activeTab === 'transactions' && customerView === 'completed') {
      fetchCompletedToday();
    }
    if (activeTab === 'history') fetchHistory();
  }, [activeTab, customerView]);

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [historyFilters]);

  useEffect(() => {
    setIsClient(true);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setHistoryFilters({ dateFrom: sevenDaysAgo, dateTo: today, type: 'ALL' });
  }, []);

  useEffect(() => {
    if (isClient) {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
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
      const sessionKasir = kasirList.find(k => k.name === branchInfo.kasirName);
      if (sessionKasir) {
        setCompletedBy(sessionKasir.id);
        setProductSaleData(prev => ({ ...prev, completedBy: sessionKasir.id, recommendedBy: sessionKasir.id }));
      }
    }
  }, [branchInfo.kasirName, kasirList]);

  useEffect(() => {
    if (showProductSale || showExpense || showAddService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showProductSale, showExpense, showAddService]);

  return {
    activeTab, setActiveTab,
    customers, setCustomers,
    services, capsters, kasirList, products,
    branchInfo,
    showAddService, setShowAddService,
    showProductSale, setShowProductSale,
    showExpense, setShowExpense,
    showLogoutModal, setShowLogoutModal,
    newCustomer, setNewCustomer,
    productSaleData, setProductSaleData,
    expenseData, setExpenseData,
    editingVisit, setEditingVisit,
    editServices, setEditServices,
    completingCustomer, setCompletingCustomer,
    paymentMethod, setPaymentMethod,
    completedBy, setCompletedBy,
    currentKasir,
    customerView, setCustomerView,
    completedToday, productTransactions, dailySummary,
    history, historyFilters, setHistoryFilters,
    currentPage, setCurrentPage,
    datePreset, setDatePreset,
    currentTime, isClient,
    isSubmitting, setIsSubmitting,
    confirmModal, setConfirmModal,
    globalLoading, setGlobalLoading,
    sidebarOpen, setSidebarOpen,
    fetchCustomers, fetchCompletedToday, fetchHistory
  };
};
