import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Enhanced auth hook with Zustand integration
export const useAuthStore = () => {
  const { user, setUser, logout } = useAdminStore();
  
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify', { credentials: 'include' });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return userData;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      logout();
      return null;
    }
  };
  
  return { user, checkAuth, logout };
};

interface AdminState {
  // UI State
  activeTab: string;
  sidebarOpen: boolean;
  
  // Auth State
  user: {
    id: string;
    role: 'ADMIN' | 'KASIR';
    username: string;
    cabangId?: string;
    kasirId?: string;
  } | null;
  
  // Cached Data (for offline support)
  masterData: {
    kasirList: any[];
    capsterList: any[];
    serviceList: any[];
    productList: any[];
    cabangList: any[];
    lastUpdated: number;
  } | null;
  
  // Actions
  setActiveTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setUser: (user: any) => void;
  updateMasterData: (data: any) => void;
  clearCache: () => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      activeTab: 'overview',
      sidebarOpen: true,
      user: null,
      masterData: null,
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setUser: (user) => set({ user }),
      updateMasterData: (data) => set({ 
        masterData: { ...data, lastUpdated: Date.now() } 
      }),
      clearCache: () => set({ masterData: null }),
      logout: () => {
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        set({ user: null, masterData: null });
        window.location.href = '/login';
      },
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({ 
        activeTab: state.activeTab,
        sidebarOpen: state.sidebarOpen,
        user: state.user,
        masterData: state.masterData 
      }),
    }
  )
);