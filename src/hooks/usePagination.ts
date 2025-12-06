import { useState, useMemo } from 'react';
import { PAGINATION } from '@/utils/constants';

export const usePagination = <T>(items: T[], itemsPerPage: number = PAGINATION.DEFAULT_PAGE_SIZE) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  return {
    currentPage,
    setCurrentPage,
    paginatedItems,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    totalItems: items.length
  };
};
