import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';

export const useAdminMasterData = () => {
  const kasirList = useQuery({
    queryKey: ['admin', 'kasir'],
    queryFn: adminApi.getKasir,
    staleTime: 10 * 60 * 1000,
  });

  const capsterList = useQuery({
    queryKey: ['admin', 'capster'],
    queryFn: adminApi.getCapster,
    staleTime: 10 * 60 * 1000,
  });

  const serviceList = useQuery({
    queryKey: ['admin', 'services'],
    queryFn: adminApi.getServices,
    staleTime: 10 * 60 * 1000,
  });

  const productList = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: adminApi.getProducts,
    staleTime: 10 * 60 * 1000,
  });

  const cabangList = useQuery({
    queryKey: ['admin', 'cabang'],
    queryFn: adminApi.getCabang,
    staleTime: 10 * 60 * 1000,
  });

  const branchList = useQuery({
    queryKey: ['admin', 'branch-logins'],
    queryFn: adminApi.getBranchLogins,
    staleTime: 10 * 60 * 1000,
  });

  const galleries = useQuery({
    queryKey: ['admin', 'gallery'],
    queryFn: adminApi.getGallery,
    staleTime: 10 * 60 * 1000,
  });

  const loading = kasirList.isLoading || capsterList.isLoading || serviceList.isLoading || 
                  productList.isLoading || cabangList.isLoading || branchList.isLoading || galleries.isLoading;

  return {
    kasirList: kasirList.data || [],
    capsterList: capsterList.data || [],
    serviceList: serviceList.data || [],
    productList: productList.data || [],
    cabangList: cabangList.data || [],
    branchList: branchList.data || [],
    galleries: galleries.data || [],
    loading,
  };
};

export const useAdminOverview = (params: { overviewPeriod: string; chartPeriod: string; branchPeriod: string }) => {
  return useQuery({
    queryKey: ['admin', 'overview', params],
    queryFn: () => adminApi.getOverview(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useAdminTransactions = (params: any) => {
  return useQuery({
    queryKey: ['admin', 'transactions', params],
    queryFn: () => adminApi.getTransactions(params),
    staleTime: 2 * 60 * 1000,
    enabled: !!params.dateFrom && !!params.dateTo,
  });
};

export const useAdminCommission = (params: any) => {
  return useQuery({
    queryKey: ['admin', 'commission', params],
    queryFn: () => adminApi.getCommission(params),
    staleTime: 2 * 60 * 1000,
    enabled: !!params.dateFrom && !!params.dateTo,
  });
};
