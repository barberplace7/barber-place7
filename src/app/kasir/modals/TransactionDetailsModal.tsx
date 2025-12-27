'use client';

export default function TransactionDetailsModal({ transaction, onClose }: any) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-black">Detail Transaksi</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Tipe</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                transaction.visitServices ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {transaction.visitServices ? 'SERVICE' : 'PRODUCT'}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Metode Pembayaran</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                transaction.paymentMethod === 'CASH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {transaction.paymentMethod}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Pelanggan</p>
            <p className="font-medium text-black">{transaction.customerName}</p>
            {transaction.customerPhone && (
              <p className="text-sm text-gray-600">{transaction.customerPhone}</p>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">{transaction.visitServices ? 'Layanan' : 'Produk'}</p>
            {transaction.visitServices && transaction.visitServices.length > 0 ? (
              <div className="space-y-2">
                {transaction.visitServices.map((vs: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-black">{vs.service.name}</p>
                        <p className="text-sm text-gray-600">Capster: {transaction.capster.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">Rp {vs.service.basePrice.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Komisi: Rp {vs.service.commissionAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-black">{transaction.productNameSnapshot}</p>
                    <p className="text-sm text-gray-600">Quantity: {transaction.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">Rp {transaction.totalPrice?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Per unit: Rp {transaction.pricePerUnitSnapshot?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Diinput Oleh</p>
            <p className="font-medium text-black">
              {transaction.completedByName || transaction.closingByNameSnapshot || 'Tidak Diketahui'}
            </p>
          </div>

          {transaction.paymentMethod === 'QRIS' && (
            (transaction.serviceTransactions?.[0]?.qrisExcessAmount > 0 || transaction.qrisExcessAmount > 0) && (
              <div className="bg-amber-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Detail QRIS</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Selisih QRIS:</span>
                    <span className="font-medium text-amber-600">
                      +Rp {(transaction.serviceTransactions?.[0]?.qrisExcessAmount || transaction.qrisExcessAmount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Keterangan:</span>
                    <span className="font-medium">
                      {(() => {
                        const type = transaction.serviceTransactions?.[0]?.qrisExcessType || transaction.qrisExcessType;
                        return type === 'TIPS' ? 'Tips' : 
                               type === 'CASH_WITHDRAWAL' ? 'Tarik Cash' : 
                               type === 'OTHER' ? 'Lainnya' : type || '-';
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-green-600">
              Rp {(() => {
                if (transaction.visitServices) {
                  return transaction.visitServices.reduce((sum: number, vs: any) => sum + vs.service.basePrice, 0).toLocaleString();
                }
                return (transaction.totalPrice || 0).toLocaleString();
              })()}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Tanggal & Waktu</p>
            <p className="text-sm text-gray-700">
              {new Date(transaction.jamSelesai || transaction.createdAt).toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full border-2 border-red-600 text-red-600 py-2.5 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}