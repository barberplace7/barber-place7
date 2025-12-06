import { useState } from 'react';
import { adminApi } from '@/lib/api/admin';

export const useDeleteTransaction = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTransaction = async (transaction: any) => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await adminApi.deleteTransaction({
        type: transaction.type,
        transactionId: transaction.id,
        visitId: transaction.visitId,
      });
      
      if (onSuccess) onSuccess();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete transaction');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteTransaction, isDeleting, error };
};
