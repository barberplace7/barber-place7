import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kasirApi } from '@/lib/api/kasir';
import { CACHE_TIMES } from '@/lib/queryClient';

export const useKasirQueries = () => {
  const queryClient = useQueryClient();

  const services = useQuery({
    queryKey: ['kasir', 'services'],
    queryFn: kasirApi.getServices,
    staleTime: CACHE_TIMES.LONG,
  });

  const capsters = useQuery({
    queryKey: ['kasir', 'capsters'],
    queryFn: kasirApi.getCapsters,
    staleTime: CACHE_TIMES.LONG,
  });

  const kasirList = useQuery({
    queryKey: ['kasir', 'kasir-list'],
    queryFn: kasirApi.getKasirList,
    staleTime: CACHE_TIMES.LONG,
  });

  const products = useQuery({
    queryKey: ['kasir', 'products'],
    queryFn: kasirApi.getProducts,
    staleTime: CACHE_TIMES.LONG,
  });

  const sessionInfo = useQuery({
    queryKey: ['kasir', 'session-info'],
    queryFn: kasirApi.getSessionInfo,
    staleTime: CACHE_TIMES.SESSION,
  });

  const customers = useQuery({
    queryKey: ['kasir', 'customers'],
    queryFn: kasirApi.getCustomers,
    staleTime: CACHE_TIMES.REALTIME,
    refetchInterval: CACHE_TIMES.REALTIME,
  });

  const completedToday = useQuery({
    queryKey: ['kasir', 'completed-today'],
    queryFn: kasirApi.getCompletedToday,
    staleTime: CACHE_TIMES.REALTIME,
    enabled: false,
  });

  const addCustomerMutation = useMutation({
    mutationFn: kasirApi.addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kasir', 'customers'] });
    },
  });

  const editVisitMutation = useMutation({
    mutationFn: ({ visitId, services }: { visitId: string; services: string[] }) =>
      kasirApi.editVisit(visitId, services),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kasir', 'customers'] });
    },
  });

  const completeVisitMutation = useMutation({
    mutationFn: kasirApi.completeVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kasir', 'customers'] });
      queryClient.invalidateQueries({ queryKey: ['kasir', 'completed-today'] });
    },
  });

  const cancelVisitMutation = useMutation({
    mutationFn: kasirApi.cancelVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kasir', 'customers'] });
    },
  });

  const addProductSaleMutation = useMutation({
    mutationFn: kasirApi.addProductSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kasir', 'completed-today'] });
    },
  });

  const addExpenseMutation = useMutation({
    mutationFn: kasirApi.addExpense,
  });

  const addAdvanceMutation = useMutation({
    mutationFn: kasirApi.addAdvance,
  });

  return {
    services,
    capsters,
    kasirList,
    products,
    sessionInfo,
    customers,
    completedToday,
    addCustomer: addCustomerMutation,
    editVisit: editVisitMutation,
    completeVisit: completeVisitMutation,
    cancelVisit: cancelVisitMutation,
    addProductSale: addProductSaleMutation,
    addExpense: addExpenseMutation,
    addAdvance: addAdvanceMutation,
  };
};

export const useKasirHistory = (filters: { dateFrom: string; dateTo: string; type: string }) => {
  return useQuery({
    queryKey: ['kasir', 'history', filters],
    queryFn: () => kasirApi.getHistory(filters),
    staleTime: CACHE_TIMES.SHORT,
    enabled: !!filters.dateFrom && !!filters.dateTo,
  });
};
