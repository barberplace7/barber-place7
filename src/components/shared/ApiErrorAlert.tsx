'use client';

interface ApiErrorAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onManualMode: () => void;
  errorMessage?: string;
}

export default function ApiErrorAlert({ isOpen, onClose, onManualMode, errorMessage }: ApiErrorAlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sistem Sedang Bermasalah
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {errorMessage || 'Koneksi ke server gagal. Silakan gunakan mode transaksi manual untuk sementara.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onManualMode}
                className="flex-1 border-2 border-blue-400 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium transition-all duration-200"
              >
                Mode Manual
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border-2 border-red-400 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
