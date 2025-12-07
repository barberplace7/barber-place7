import { useState, useEffect } from 'react';
import { useKasirQueries, useKasirHistory } from '@/hooks/useKasirQueries';
import { useToast } from '@/hooks/useToast';
import type { NewCustomerForm, ProductSaleForm, ExpenseForm, HistoryFilters, ConfirmModalData, AdvanceForm } from '../types';

export const useKasirStateV2 = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [customerView, setCustomerView] = useState('ongoing');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [showAddService, setShowAddService] = useState(false);
  const [showProductSale, setShowProductSale] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState<NewCustomerForm>({ name: '', phone: '', services: [], capsterId: '' });
  const [productSaleData, setProductSaleData] = useState<ProductSaleForm>({ customerName: '', customerPhone: '', products: [], paymentMethod: 'CASH', completedBy: '', recommendedBy: '' });
  const [expenseData, setExpenseData] = useState<ExpenseForm>({ nominal: '', category: 'OPERASIONAL', note: '' });
  
  const [editingVisit, setEditingVisit] = useState<any>(null);
  const [editServices, setEditServices] = useState<string[]>([]);
  const [completingCustomer, setCompletingCustomer] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [completedBy, setCompletedBy] = useState('');
  const [currentKasir, setCurrentKasir] = useState('');
  
  const [historyFilters, setHistoryFilters] = useState<HistoryFilters>({ dateFrom: '', dateTo: '', type: 'ALL' });
  const [currentPage, setCurrentPage] = useState(1);
  const [datePreset, setDatePreset] = useState('7days');
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalData | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [apiError, setApiError] = useState<{ isOpen: boolean; shouldShowManualMode: boolean; errorMessage: string }>({ isOpen: false, shouldShowManualMode: false, errorMessage: '' });
  const [showManualGuide, setShowManualGuide] = useState(false);

  const queries = useKasirQueries();
  const historyQuery = useKasirHistory(historyFilters);
  const { toast, showToast, hideToast } = useToast();
  
  const isInitialLoading = queries.services.isLoading || queries.capsters.isLoading || 
                           queries.kasirList.isLoading || queries.products.isLoading || 
                           queries.sessionInfo.isLoading;
  
  const isHistoryLoading = historyQuery.isLoading || historyQuery.isFetching;

  useEffect(() => {
    if (customerView === 'completed') {
      queries.completedToday.refetch();
    }
  }, [customerView]);

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
    if (queries.kasirList.data && queries.kasirList.data.length > 0 && !currentKasir) {
      setCurrentKasir(queries.kasirList.data[0].id);
    }
  }, [queries.kasirList.data]);

  useEffect(() => {
    if (queries.sessionInfo.data?.kasirName && queries.kasirList.data) {
      const sessionKasir = queries.kasirList.data.find((k: any) => k.name === queries.sessionInfo.data.kasirName);
      if (sessionKasir) {
        setCompletedBy(sessionKasir.id);
        setProductSaleData(prev => ({ ...prev, completedBy: sessionKasir.id, recommendedBy: sessionKasir.id }));
      }
    }
  }, [queries.sessionInfo.data, queries.kasirList.data]);

  useEffect(() => {
    if (showProductSale || showExpense || showAddService || showAdvance) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showProductSale, showExpense, showAddService, showAdvance]);

  return {
    activeTab, setActiveTab,
    customers: queries.customers.data || [],
    setCustomers: () => queries.customers.refetch(),
    services: queries.services.data || [],
    capsters: queries.capsters.data || [],
    kasirList: queries.kasirList.data || [],
    products: queries.products.data || [],
    branchInfo: { 
      name: queries.sessionInfo.data?.branchName || '', 
      kasirName: queries.sessionInfo.data?.kasirName || '' 
    },
    showAddService, setShowAddService,
    showProductSale, setShowProductSale,
    showExpense, setShowExpense,
    showLogoutModal, setShowLogoutModal,
    showAdvance, setShowAdvance,
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
    completedToday: queries.completedToday.data?.visits || [],
    productTransactions: queries.completedToday.data?.productTransactions || [],
    dailySummary: queries.completedToday.data?.summary || { total: 0, cash: 0, qris: 0 },
    history: historyQuery.data || { visits: [], productSales: [], expenses: [], allStaff: [] },
    historyFilters, setHistoryFilters,
    currentPage, setCurrentPage,
    datePreset, setDatePreset,
    currentTime, isClient,
    isSubmitting, setIsSubmitting,
    confirmModal, setConfirmModal,
    globalLoading, setGlobalLoading,
    sidebarOpen, setSidebarOpen,
    fetchCustomers: () => queries.customers.refetch(),
    fetchCompletedToday: () => queries.completedToday.refetch(),
    fetchHistory: () => historyQuery.refetch(),
    mutations: queries,
    toast,
    showToast,
    hideToast,
    isInitialLoading,
    isHistoryLoading,
    apiError,
    setApiError,
    showManualGuide,
    setShowManualGuide,
  };
};
