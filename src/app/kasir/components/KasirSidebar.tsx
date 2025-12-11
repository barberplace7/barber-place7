'use client';

export default function KasirSidebar({ state, onLogout }: any) {
  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${state.sidebarOpen ? 'w-64' : 'w-0'} flex flex-col h-screen overflow-hidden flex-shrink-0`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${!state.sidebarOpen && 'justify-center'}`}>
            <img src="/logo_barberplace.png" alt="Barber Place Logo" className="w-10 h-10 rounded-full object-cover shadow-md" />
            {state.sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">Kasir {state.branchInfo.kasirName}</h1>
                <p className="text-xs text-gray-500">{state.branchInfo.name}</p>
              </div>
            )}
          </div>
          {state.sidebarOpen && (
            <button onClick={() => state.setSidebarOpen(false)} className="p-1 rounded-md hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {state.sidebarOpen && (
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Menu</div>
        )}
        
        <button
          onClick={() => state.setActiveTab('transactions')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
            state.activeTab === 'transactions' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
          } ${!state.sidebarOpen && 'justify-center'}`}
        >
          <span className={state.activeTab === 'transactions' ? 'text-white' : 'text-gray-600'}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          {state.sidebarOpen && <span className="font-semibold">Transaksi Aktif</span>}
        </button>
        
        <button
          onClick={() => state.setActiveTab('history')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
            state.activeTab === 'history' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
          } ${!state.sidebarOpen && 'justify-center'}`}
        >
          <span className={state.activeTab === 'history' ? 'text-white' : 'text-gray-600'}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
          {state.sidebarOpen && <span className="font-semibold">Riwayat Transaksi</span>}
        </button>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={onLogout}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors ${
            !state.sidebarOpen && 'justify-center'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {state.sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
