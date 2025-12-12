'use client';
import { useEffect } from 'react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  expandedMenus: {[key: string]: boolean};
  setExpandedMenus: React.Dispatch<React.SetStateAction<{[key: string]: boolean}>>;
  setShowLogoutModal: (show: boolean) => void;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  expandedMenus,
  setExpandedMenus,
  setShowLogoutModal
}: SidebarProps) {
  // Auto-collapse pada mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  // Close sidebar saat klik menu di mobile
  const handleMenuClick = (tabId: string) => {
    setActiveTab(tabId);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };
  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    {
      id: 'overview',
      name: 'Beranda',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
    {
      id: 'data-master',
      name: 'Data Master',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      submenu: [
        { id: 'services', name: 'Data Layanan' },
        { id: 'products', name: 'Data Produk' },
        { id: 'gallery', name: 'Data Galeri' }
      ]
    },
    {
      id: 'data-user',
      name: 'Data User',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      submenu: [
        { id: 'capster', name: 'Data Capster' },
        { id: 'kasir', name: 'Data Kasir' },
        { id: 'branches', name: 'Data Pengguna Cabang' }
      ]
    },
    {
      id: 'data-transaksi',
      name: 'Data Transaksi',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      submenu: [
        { id: 'transactions', name: 'Transaksi Cabang' },
        { id: 'commission', name: 'Transaksi Staf' },
        { id: 'kasbon', name: 'Kasbon Staf' }
      ]
    }
  ];

  return (
    <>
    {/* Mobile Overlay */}
    {sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}
    
    <div className={`bg-white shadow-lg transition-all duration-300 flex-shrink-0 flex flex-col h-screen overflow-hidden
      ${sidebarOpen ? 'w-64' : 'w-0'} 
      lg:relative fixed z-50 lg:z-auto
    `}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
            <img 
              src="/logo_barberplace.png" 
              alt="Barber Place Logo" 
              className="w-10 h-10 rounded-full object-cover shadow-md"
            />
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Acong</h1>
                <p className="text-xs text-gray-500">Barberplace</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarOpen && (
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Menu
          </div>
        )}
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors hover:bg-gray-100 ${
                    sidebarOpen ? '' : 'justify-center'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">{item.icon}</span>
                    {sidebarOpen && <span className="font-medium text-gray-700">{item.name}</span>}
                  </div>
                  {sidebarOpen && (
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedMenus[item.id] ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                {sidebarOpen && expandedMenus[item.id] && (
                  <div className="ml-11 mt-1 space-y-0.5">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleMenuClick(subItem.id)}
                        className={`w-full text-left p-2 rounded-md text-sm transition-colors flex items-center gap-2 min-h-[44px] ${
                          activeTab === subItem.id
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span className="font-bold">•</span>
                        {subItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors min-h-[44px] ${
                  activeTab === item.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${!sidebarOpen && 'justify-center'}`}
              >
                <span>{item.icon}</span>
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setShowLogoutModal(true)}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors ${
            !sidebarOpen && 'justify-center'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
    
    {/* Floating Hamburger Button */}
    {!sidebarOpen && (
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 group backdrop-blur-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    )}
    </>
  );
}