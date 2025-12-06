interface TransactionDetailsModalProps {
  transaction: any;
  onClose: () => void;
}

export default function TransactionDetailsModal({ transaction, onClose }: TransactionDetailsModalProps) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-black">Transaction Details</h3>
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
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                transaction.type === 'SERVICE' ? 'bg-blue-100 text-blue-800' : 
                transaction.type === 'PRODUCT' ? 'bg-orange-100 text-orange-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {transaction.type}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Payment Method</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                transaction.paymentMethod === 'CASH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {transaction.paymentMethod}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Customer</p>
            <p className="font-medium text-black">{transaction.customerName}</p>
            {transaction.customerPhone && (
              <p className="text-sm text-gray-600">{transaction.customerPhone}</p>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Item/Service</p>
            <p className="font-medium text-black">{transaction.itemName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Staff</p>
              <p className="font-medium text-black">{transaction.staffName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Branch</p>
              <p className="font-medium text-black">{transaction.branchName}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Amount</p>
            <p className={`text-2xl font-bold ${
              transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'
            }`}>
              {transaction.type === 'EXPENSE' ? '-' : ''}Rp {Math.abs(transaction.amount).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Date & Time</p>
            <p className="text-sm text-gray-700">{new Date(transaction.date).toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full border-2 border-red-600 text-red-600 py-2.5 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
