export interface ApiErrorResponse {
  isError: boolean;
  shouldShowManualMode: boolean;
  errorMessage: string;
}

export function handleApiError(error: any): ApiErrorResponse {
  // Network errors
  if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
    return {
      isError: true,
      shouldShowManualMode: true,
      errorMessage: 'Tidak dapat terhubung ke server. Gunakan mode manual untuk mencatat transaksi.'
    };
  }

  // Server errors (500, 502, 503, 504)
  if (error.status >= 500) {
    return {
      isError: true,
      shouldShowManualMode: true,
      errorMessage: 'Server sedang bermasalah. Silakan gunakan mode manual.'
    };
  }

  // Timeout errors
  if (error.name === 'AbortError' || error.message?.includes('timeout')) {
    return {
      isError: true,
      shouldShowManualMode: true,
      errorMessage: 'Koneksi timeout. Gunakan mode manual untuk melanjutkan.'
    };
  }

  // Database errors
  if (error.message?.includes('Prisma') || error.message?.includes('database')) {
    return {
      isError: true,
      shouldShowManualMode: true,
      errorMessage: 'Database error. Silakan gunakan mode manual.'
    };
  }

  // Other errors (400, 401, 404, etc) - don't show manual mode
  return {
    isError: true,
    shouldShowManualMode: false,
    errorMessage: error.message || 'Terjadi kesalahan. Silakan coba lagi.'
  };
}

export async function apiCallWithErrorHandling<T>(
  apiCall: () => Promise<T>,
  onError?: (errorResponse: ApiErrorResponse) => void
): Promise<T | null> {
  try {
    const response = await apiCall();
    return response;
  } catch (error: any) {
    const errorResponse = handleApiError(error);
    if (onError) {
      onError(errorResponse);
    }
    return null;
  }
}
