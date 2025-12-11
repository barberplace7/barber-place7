'use client';
import { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import OverviewTab from './tabs/OverviewTab';
import TransactionsTab from './tabs/TransactionsTab';
import CommissionTab from './tabs/CommissionTab';
import UsersTab from './tabs/UsersTab';
import MasterDataTab from './tabs/MasterDataTab';
import KasbonTab from './tabs/KasbonTab';
import { useAdminData } from '@/hooks/useAdminData';
import { GlobalLoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<{[key: string]: boolean}>({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const adminData = useAdminData();

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

  const handleLogout = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        expandedMenus={expandedMenus}
        setExpandedMenus={setExpandedMenus}
        setShowLogoutModal={setShowLogoutModal}
      />

      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
          <div className={`bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 ${!sidebarOpen ? 'mt-16 lg:mt-0' : ''} ${sidebarOpen ? 'lg:mr-0' : ''}`}>
            {activeTab === 'overview' && <OverviewTab adminData={adminData} />}
            {activeTab === 'transactions' && <TransactionsTab cabangList={adminData.cabangList} />}
            {activeTab === 'commission' && <CommissionTab adminData={adminData} />}
            {activeTab === 'kasbon' && <KasbonTab adminData={adminData} />}
            {['capster', 'kasir', 'branches'].includes(activeTab) && <UsersTab activeTab={activeTab} adminData={adminData} />}
            {['services', 'products', 'gallery'].includes(activeTab) && <MasterDataTab activeTab={activeTab} adminData={adminData} />}
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 shadow-2xl border border-gray-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Konfirmasi Logout</h3>
              <p className="text-gray-600 mb-6">Apakah Anda yakin ingin logout dari panel admin?</p>
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
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {adminData.loading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Memuat data...</p>
          </div>
        </div>
      )}
    </div>
  );
}
