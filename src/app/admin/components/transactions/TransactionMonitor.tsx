interface TransactionMonitorProps {
  transactionHistory: any[];
  transactionFilters: any;
  transactionSummary: any;
  currentPage: number;
  itemsPerPage: number;
  datePreset: string;
  cabangList: any[];
  setTransactionFilters: (filters: any) => void;
  setCurrentPage: (page: number) => void;
  setDatePreset: (preset: string) => void;
  handleDatePresetChange: (preset: string) => void;
  fetchTransactionHistory: () => void;
  handleDeleteTransaction: (transaction: any) => void;
}

export default function TransactionMonitor({
  transactionHistory,
  transactionFilters,
  transactionSummary,
  currentPage,
  itemsPerPage,
  datePreset,
  cabangList,
  setTransactionFilters,
  setCurrentPage,
  setDatePreset,
  handleDatePresetChange,
  fetchTransactionHistory,
  handleDeleteTransaction
}: TransactionMonitorProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-black">Transaction Monitor</h2>
          <p className="text-gray-600 text-sm">Monitor all branch transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        {/* Date Presets */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'today', name: 'Today' },
              { id: '7days', name: 'Last 7 Days' },
              { id: '30days', name: 'Last 30 Days' },
              { id: 'custom', name: 'Custom Range' }
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleDatePresetChange(preset.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  datePreset === preset.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={transactionFilters.dateFrom}
              onChange={(e) => {
                setTransactionFilters({...transactionFilters, dateFrom: e.target.value});
                setDatePreset('custom');
              }}
              disabled={datePreset !== 'custom'}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={transactionFilters.dateTo}
              onChange={(e) => {
                setTransactionFilters({...transactionFilters, dateTo: e.target.value});
                setDatePreset('custom');
              }}
              disabled={datePreset !== 'custom'}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <select
              value={transactionFilters.branchId}
              onChange={(e) => setTransactionFilters({...transactionFilters, branchId: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
            >
              <option value="">All Branches</option>
              {cabangList.map((cabang) => (
                <option key={cabang.id} value={cabang.id}>
                  {cabang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={transactionFilters.type}
              onChange={(e) => setTransactionFilters({...transactionFilters, type: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
            >
              <option value="ALL">All Transactions</option>
              <option value="SERVICE">Services Only</option>
              <option value="PRODUCT">Products Only</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={fetchTransactionHistory}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Revenue Summary */}
      {transactionHistory.length > 0 && (
        <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-bold text-black mb-4">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                Rp {transactionSummary.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                Rp {transactionSummary.totalExpenses.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Expenses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                Rp {transactionSummary.cashRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Cash Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Rp {transactionSummary.qrisRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">QRIS Revenue</div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service/Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(() => {
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              const paginatedTransactions = transactionHistory.slice(startIndex, endIndex);
              
              if (paginatedTransactions.length === 0) {
                return (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No transactions found for the selected period.
                    </td>
                  </tr>
                );
              }
              
              return paginatedTransactions.map((transaction, index) => (
                <tr key={startIndex + index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('id-ID')}
                    <div className="text-xs text-gray-400">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">
                    {transaction.customerName}
                    <div className="text-xs text-gray-500">{transaction.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {transaction.itemName}
                    <div className={`text-xs font-medium ${
                      transaction.type === 'SERVICE' ? 'text-blue-600' : 
                      transaction.type === 'PRODUCT' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {transaction.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.staffName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.branchName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-gray-700'}>
                      {transaction.type === 'EXPENSE' ? '-' : ''}Rp {Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {transaction.type === 'EXPENSE' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        EXPENSE
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.paymentMethod === 'CASH' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.paymentMethod}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteTransaction(transaction)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {transactionHistory.length > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, transactionHistory.length)} of {transactionHistory.length} transactions
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.ceil(transactionHistory.length / itemsPerPage) }, (_, i) => i + 1)
              .filter(page => {
                const totalPages = Math.ceil(transactionHistory.length / itemsPerPage);
                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2;
              })
              .map((page, index, array) => {
                if (index > 0 && array[index - 1] !== page - 1) {
                  return [
                    <span key={`ellipsis-${page}`} className="px-3 py-2 text-sm text-gray-500">...</span>,
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ];
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(transactionHistory.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(transactionHistory.length / itemsPerPage)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}