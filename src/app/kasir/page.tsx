'use client';
import KasirSidebar from './components/KasirSidebar';
import TransactionsTab from './tabs/TransactionsTab';
import HistoryTab from './tabs/HistoryTab';
import Toast from '@/components/shared/Toast';
import ApiErrorAlert from '@/components/shared/ApiErrorAlert';
import ManualTransactionGuide from './components/ManualTransactionGuide';
import { useKasirStateV2 } from './hooks/useKasirStateV2';


export default function KasirDashboard() {
  const state = useKasirStateV2();

  const handleLogout = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex h-screen overflow-hidden">
      <KasirSidebar state={state} onLogout={() => state.setShowLogoutModal(true)} />

      {!state.sidebarOpen && (
        <button
          onClick={() => state.setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 group backdrop-blur-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <div className="flex-1 overflow-auto min-w-0">
        <div className={`p-3 sm:p-4 lg:p-6 transition-all duration-300 ${!state.sidebarOpen ? 'mt-16 lg:mt-0' : ''}`}>
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 border border-gray-300">
            {state.activeTab === 'transactions' && <TransactionsTab state={state} />}
            {state.activeTab === 'history' && <HistoryTab state={state} />}
          </div>
        </div>
      </div>

      {state.showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
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
                  onClick={() => state.setShowLogoutModal(false)}
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

      {state.confirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 p-4 min-w-[300px]">
            <p className="text-stone-800 mb-4 text-center">{state.confirmModal.message}</p>
            <div className="flex gap-2">
              <button
                onClick={() => state.setConfirmModal(null)}
                className="flex-1 px-3 py-2 text-stone-600 hover:text-stone-800 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={state.confirmModal.onConfirm}
                className="flex-1 px-3 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors text-sm"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {(state.globalLoading || state.isInitialLoading) && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-stone-800 rounded-full animate-spin"></div>
            <p className="text-stone-700 font-medium">{state.isInitialLoading ? 'Memuat data...' : 'Memproses...'}</p>
          </div>
        </div>
      )}

      {state.toast.show && (
        <Toast message={state.toast.message} type={state.toast.type} onClose={state.hideToast} />
      )}

      <ApiErrorAlert
        isOpen={state.apiError.isOpen}
        onClose={() => state.setApiError({ isOpen: false, shouldShowManualMode: false, errorMessage: '' })}
        onManualMode={() => {
          state.setApiError({ isOpen: false, shouldShowManualMode: false, errorMessage: '' });
          state.setShowManualGuide(true);
        }}
        errorMessage={state.apiError.errorMessage}
      />

      <ManualTransactionGuide
        isOpen={state.showManualGuide}
        onClose={() => state.setShowManualGuide(false)}
      />
    </div>
  );
}
