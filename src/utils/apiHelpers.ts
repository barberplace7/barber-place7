export const handleApiError = (error: any, context: string) => {
  console.error(`[API ${context}] Error:`, {
    error: error?.message || error,
    stack: error?.stack,
    timestamp: new Date().toISOString()
  });
};

export const fetchWithErrorHandling = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error, url);
    throw error;
  }
};
