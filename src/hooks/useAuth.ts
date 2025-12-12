import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthUser {
  id: string;
  role: 'ADMIN' | 'KASIR';
  username: string;
  cabangId?: string;
  cabangName?: string;
  kasirId?: string;
  kasirName?: string;
}

export function useAuth(requiredRole?: 'ADMIN' | 'KASIR') {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        // Check role permission
        if (requiredRole && userData.role !== requiredRole) {
          logout();
          return;
        }
        
        setUser(userData);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    router.push('/login');
  };

  return { user, loading, logout, checkAuth };
}