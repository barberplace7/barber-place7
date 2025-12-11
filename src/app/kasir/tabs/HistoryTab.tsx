'use client';
import { useMemo } from 'react';

export default function HistoryTab({ state }: any) {
  const handleDatePresetChange = (preset: string) => {
    state.setDatePreset(preset);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    let dateFrom = '';
    switch (preset) {
      case 'today':
        dateFrom = today;
        break;
      case '7days':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case '30days':
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'custom':
        return;
    }
    
    state.setHistoryFilters(prev => ({ ...prev, dateFrom, dateTo: today }));
  };

  const allTransactions = useMemo(() => {
    const transactions = [];
    
    if (state.historyFilters.type === 'ALL' || state.historyFilters.type === 'REVENUE' || state.historyFilters.type === 'SERVICE') {
      state.history.visits.forEach(visit => {
        const serviceAmount = visit.serviceTransactions?.length > 0 
          ? visit.serviceTransactions.reduce((sum, st) => sum + st.priceFinal, 0)
          : visit.visitServices?.reduce((sum, vs) => sum + vs.service.basePrice, 0) || 0;
        
        const serviceName = visit.serviceTransactions?.length > 0
          ? visit.serviceTransactions[0].paketName
          : visit.visitServices?.map(vs => vs.service.name).join(' + ') || 'No services';
        
        transactions.push({
          ...visit,
          type: 'SERVICE',
          date: visit.jamSelesai,
          amount: serviceAmount,
          paymentMethod: visit.serviceTransactions?.length > 0 ? visit.serviceTransactions[0].paymentMethod : 'CASH',
          staff: visit.capster.name,
          itemName: serviceName,
          customerName: visit.customerName,
          customerPhone: visit.customerPhone
        });
      });
    }
    
    if (state.historyFilters.type === 'ALL' || state.historyFilters.type === 'REVENUE' || state.historyFilters.type === 'PRODUCT') {
      state.history.productSales.forEach(sale => {
        const responsibleStaff = state.history.allStaff?.find(s => s.id === sale.closingById);
        transactions.push({
          ...sale,
          type: 'PRODUCT',
          date: sale.createdAt,
          amount: sale.totalPrice,
          staff: responsibleStaff?.name || 'Unknown',
          itemName: `${sale.productNameSnapshot} (x${sale.quantity})`
        });
      });
    }
    
    if (state.historyFilters.type === 'ALL' || state.historyFilters.type === 'EXPENSES') {
      state.history.expenses.forEach(expense => {
        transactions.push({
          ...expense,
          type: 'EXPENSE',
          date: expense.createdAt,
          amount: expense.nominal,
          paymentMethod: 'CASH',
          staff: expense.kasir?.name || 'Unknown',
          itemName: `${expense.category}${expense.note ? ` - ${expense.note}` : ''}`,
          customerName: 'Business Expense',
          customerPhone: ''
        });
      });
    }
    
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.history, state.historyFilters.type]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (state.currentPage - 1) * 15;
    return allTransactions.slice(startIndex, startIndex + 15);
  }, [allTransactions, state.currentPage]);

  const totalPages = Math.ceil(allTransactions.length / 15);

  const summary = useMemo(() => {
    const revenueAmount = allTransactions.filter(t => t.amount > 0 && t.type !== 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const expenseAmount = Math.abs(allTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0));
    const netAmount = revenueAmount - expenseAmount;
    const cashAmount = allTransactions.filter(t => t.paymentMethod === 'CASH' && t.type !== 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const qrisAmount = allTransactions.filter(t => t.paymentMethod === 'QRIS' && t.type !== 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    
    return { revenueAmount, expenseAmount, netAmount, cashAmount, qrisAmount };
  }, [allTransactions]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800">Riwayat Transaksi</h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">Filter dan lihat riwayat transaksi</p>
        </div>
      </div>

      <div className="bg-stone-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Rentang Tanggal</label>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            {[
              { id: 'today', name: 'Hari Ini' },
              { id: '7days', name: '7 Hari Terakhir' },
              { id: '30days', name: '30 Hari Terakhir' },
              { id: 'custom', name: 'Rentang Kustom' }
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleDatePresetChange(preset.id)}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors min-h-[44px] ${
                  state.datePreset === preset.id
                    ? 'bg-stone-800 text-white'
                    : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Dari Tanggal</label>
            <input
              type="date"
              value={state.historyFilters.dateFrom}
              onChange={(e) => {
                state.setHistoryFilters({...state.historyFilters, dateFrom: e.target.value});
                state.setDatePreset('custom');
              }}
              disabled={state.datePreset !== 'custom'}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:border-stone-500 focus:outline-none bg-white text-stone-800 disabled:bg-stone-100 disabled:cursor-not-allowed min-h-[44px] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Sampai Tanggal</label>
            <input
              type="date"
              value={state.historyFilters.dateTo}
              onChange={(e) => {
                state.setHistoryFilters({...state.historyFilters, dateTo: e.target.value});
                state.setDatePreset('custom');
              }}
              disabled={state.datePreset !== 'custom'}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:border-stone-500 focus:outline-none bg-white text-stone-800 disabled:bg-stone-100 disabled:cursor-not-allowed min-h-[44px] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Tipe Transaksi</label>
            <select
              value={state.historyFilters.type}
              onChange={(e) => state.setHistoryFilters({...state.historyFilters, type: e.target.value})}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:border-stone-500 focus:outline-none bg-white text-stone-800 min-h-[44px] text-sm"
            >
              <option value="ALL">Semua Transaksi</option>
              <option value="REVENUE">Pendapatan Saja</option>
              <option value="SERVICE">Layanan Saja</option>
              <option value="PRODUCT">Produk Saja</option>
              <option value="EXPENSES">Pengeluaran Saja</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={state.fetchHistory}
              className="w-full bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-900 transition-colors font-medium min-h-[44px] text-sm"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 sm:p-6 bg-stone-50 rounded-xl border border-stone-200">
        <h3 className="font-bold text-stone-800 mb-4 text-sm sm:text-base">Ringkasan ({state.historyFilters.dateFrom} sampai {state.historyFilters.dateTo})</h3>
        {state.isHistoryLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-6 sm:h-8 bg-stone-300 rounded mb-2 mx-auto w-20 sm:w-24"></div>
                <div className="h-3 sm:h-4 bg-stone-200 rounded mx-auto w-12 sm:w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-green-600">Rp {summary.revenueAmount.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-stone-600">Pendapatan</div>
            </div>
            <div className="text-center">
              <div className={`text-base sm:text-lg lg:text-xl xl:text-2xl font-bold ${summary.netAmount >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                Rp {summary.netAmount.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-stone-600">Laba Bersih</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-emerald-600">Rp {summary.cashAmount.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-stone-600">Cash</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-blue-600">Rp {summary.qrisAmount.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-stone-600">QRIS</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-red-600">Rp {summary.expenseAmount.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-stone-600">Pengeluaran</div>
            </div>
          </div>
        )}
      </div>

      {state.isHistoryLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-600 font-medium">Memuat riwayat...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="min-w-full">
            <thead className="bg-stone-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-medium text-stone-700 whitespace-nowrap">Tanggal</th>
                <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-medium text-stone-700 whitespace-nowrap">Pelanggan</th>
                <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-medium text-stone-700 whitespace-nowrap">Layanan/Produk</th>
                <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-medium text-stone-700 whitespace-nowrap">Diinput Oleh</th>
                <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-medium text-stone-700 whitespace-nowrap">Jumlah</th>
                <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-medium text-stone-700 whitespace-nowrap">Pembayaran</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 sm:px-6 py-12 sm:py-16 text-center text-stone-500">
                  <div className="text-3xl sm:text-4xl mb-4">📊</div>
                  <div className="text-sm sm:text-base">Tidak ada transaksi ditemukan</div>
                  <div className="text-xs sm:text-sm mt-1">Coba sesuaikan filter Anda</div>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction, index) => (
                <tr key={`${transaction.type}-${transaction.id}-${index}`} className="hover:bg-stone-50">
                  <td className="px-3 sm:px-6 py-4 sm:py-5 text-stone-500 text-xs sm:text-sm">
                    {new Date(transaction.date).toLocaleDateString('id-ID')}
                    <div className="text-xs text-stone-400">{new Date(transaction.date).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 sm:py-5">
                    <div className="font-medium text-stone-800 text-sm sm:text-base">{transaction.customerName}</div>
                    <div className="text-xs sm:text-sm text-stone-500">{transaction.customerPhone}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 sm:py-5">
                    <div className="text-stone-700 text-sm sm:text-base">
                      <div className="max-w-[150px] sm:max-w-none truncate sm:whitespace-normal">
                        {transaction.itemName}
                      </div>
                    </div>
                    <div className={`text-xs font-medium ${
                      transaction.type === 'SERVICE' ? 'text-blue-600' : 
                      transaction.type === 'PRODUCT' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {transaction.type}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 sm:py-5 text-stone-700 text-sm sm:text-base">{transaction.staff}</td>
                  <td className="px-3 sm:px-6 py-4 sm:py-5 font-medium text-sm sm:text-base">
                    <span className={transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-stone-700'}>
                      {transaction.type === 'EXPENSE' ? '-' : ''}Rp {Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 sm:py-5">
                    {transaction.type === 'EXPENSE' ? (
                      <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">PENGELUARAN</span>
                    ) : (
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.paymentMethod === 'CASH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.paymentMethod}
                      </span>
                    )}
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!state.isHistoryLoading && totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xs sm:text-sm text-stone-700 text-center sm:text-left">
            Menampilkan {((state.currentPage - 1) * 15) + 1} sampai {Math.min(state.currentPage * 15, allTransactions.length)} dari {allTransactions.length} transaksi
          </div>
          <div className="flex justify-center sm:justify-end space-x-1 sm:space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => state.setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={state.currentPage === 1}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-stone-500 bg-white border border-stone-300 rounded-md hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] whitespace-nowrap"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => page === 1 || page === totalPages || Math.abs(page - state.currentPage) <= 2)
              .map((page, index, array) => {
                if (index > 0 && array[index - 1] !== page - 1) {
                  return [
                    <span key={`ellipsis-${page}`} className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-stone-500">...</span>,
                    <button
                      key={page}
                      onClick={() => state.setCurrentPage(page)}
                      className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md min-h-[44px] ${
                        state.currentPage === page ? 'bg-stone-800 text-white' : 'text-stone-700 bg-white border border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {page}
                    </button>
                  ];
                }
                return (
                  <button
                    key={page}
                    onClick={() => state.setCurrentPage(page)}
                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md min-h-[44px] ${
                      state.currentPage === page ? 'bg-stone-800 text-white' : 'text-stone-700 bg-white border border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            <button
              onClick={() => state.setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={state.currentPage === totalPages}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-stone-500 bg-white border border-stone-300 rounded-md hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] whitespace-nowrap"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
