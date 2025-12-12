import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';

// Optimized: Single API call for all master data
export const useOptimizedAdminData = () => {
  return useQuery({
    queryKey: ['admin', 'master-data'],
    queryFn: async () => {
      // Batch all master data in single API call
      const [kasir, capster, services, products, cabang, branches, gallery] = await Promise.all([
        adminApi.getKasir(),
        adminApi.getCapster(),
        adminApi.getServices(),
        adminApi.getProducts(),
        adminApi.getCabang(),
        adminApi.getBranchLogins(),
        adminApi.getGallery(),
      ]);
      
      return {
        kasirList: kasir,
        capsterList: capster,
        serviceList: services,
        productList: products,
        cabangList: cabang,
        branchList: branches,
        galleries: gallery,
      };
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - master data changes rarely
    gcTime: 30 * 60 * 1000,    // Keep in cache for 30 minutes
  });
};