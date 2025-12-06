'use client';

interface ManualTransactionGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManualTransactionGuide({ isOpen, onClose }: ManualTransactionGuideProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">📝 Panduan Transaksi Manual</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium">⚠️ Sistem sedang offline. Catat transaksi secara manual.</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Langkah-langkah:</h3>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium text-gray-900">1. Catat di Buku/Kertas</p>
              <ul className="list-disc list-inside text-gray-600 mt-1 space-y-1">
                <li>Nama customer</li>
                <li>No. HP (jika ada)</li>
                <li>Layanan yang dipilih</li>
                <li>Nama capster</li>
                <li>Total harga</li>
                <li>Metode pembayaran (Cash/QRIS)</li>
                <li>Waktu transaksi</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-medium text-gray-900">2. Proses Pembayaran</p>
              <ul className="list-disc list-inside text-gray-600 mt-1">
                <li>Terima pembayaran dari customer</li>
                <li>Berikan struk manual jika tersedia</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <p className="font-medium text-gray-900">3. Input ke Sistem (Setelah Online)</p>
              <ul className="list-disc list-inside text-gray-600 mt-1">
                <li>Tunggu sistem kembali normal</li>
                <li>Input semua transaksi manual ke sistem</li>
                <li>Verifikasi total pendapatan</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-xs">
              💡 <strong>Tips:</strong> Simpan catatan manual dengan rapi. Setelah sistem online, 
              segera input data untuk menjaga akurasi laporan.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
