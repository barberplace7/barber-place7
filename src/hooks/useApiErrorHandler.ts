'use client';

import { useState } from 'react';
import { ApiErrorResponse } from '@/lib/apiErrorHandler';

export function useApiErrorHandler() {
  const [errorState, setErrorState] = useState<{
    isOpen: boolean;
    shouldShowManualMode: boolean;
    errorMessage: string;
  }>({
    isOpen: false,
    shouldShowManualMode: false,
    errorMessage: ''
  });

  const showError = (errorResponse: ApiErrorResponse) => {
    setErrorState({
      isOpen: true,
      shouldShowManualMode: errorResponse.shouldShowManualMode,
      errorMessage: errorResponse.errorMessage
    });
  };

  const closeError = () => {
    setErrorState({
      isOpen: false,
      shouldShowManualMode: false,
      errorMessage: ''
    });
  };

  return {
    errorState,
    showError,
    closeError
  };
}
