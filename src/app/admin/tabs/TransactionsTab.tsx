'use client';
import { useState } from 'react';
import { useDateFilter } from '@/hooks/useDateFilter';
import { usePagination } from '@/hooks/usePagination';
import { useAdminTransactions } from '@/hooks/useAdminQueries';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { DateFilter } from '@/components/shared/DateFilter';
import { Pagination } from '@/components/shared/Pagination';
import TransactionDetailsModal from '../components/TransactionDetailsModal';
import DeleteTransactionModal from '../components/DeleteTransactionModal';
import { useDeleteTransaction } from '../hooks/useDeleteTransaction';

export default function TransactionsTab({ cabangList }: any) {
  const [branchId, setBranchId] = useState('');
  const [type, setType] = useState('ALL');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const { datePreset, dateFrom, dateTo, setDatePreset, setCustomDates } = useDateFilter('7days');
  const { data, isLoading, refetch } = useAdminTransactions({ dateFrom, dateTo, branchId, type });
  const { deleteTransaction, isDeleting } = useDeleteTransaction(() => {
    refetch();
    setShowDeleteModal(false);
    setSelectedTransaction(null);
  });
  
  const transactionHistory = data?.transactions || [];
  const transactionSummary = data?.summary || { 
    totalRevenue: 0, 
    totalExpenses: 0, 
    totalKasbon: 0,
    totalCommissions: 0, 
    cashRevenue: 0, 
    qrisRevenue: 0, 
    netIncome: 0 
  };
  const { currentPage, setCurrentPage, paginatedItems, totalPages, totalItems } = usePagination(transactionHistory, 15);

  const handleDelete = () => deleteTransaction(selectedTransaction);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-black">Monitor Transaksi</h2>
          <p className="text-gray-600 text-sm">
            Menampilkan {paginatedItems.length} dari {totalItems} transaksi
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <DateFilter
          datePreset={datePreset}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onPresetChange={setDatePreset}
          onDateChange={setCustomDates}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cabang</label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black min-h-[44px]"
            >
              <option value="">Semua Cabang</option>
              {cabangList.map((cabang: any) => (
                <option key={cabang.id} value={cabang.id}>{cabang.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black min-h-[44px]"
            >
              <option value="ALL">Semua Transaksi</option>
              <option value="SERVICE">Layanan Saja</option>
              <option value="PRODUCT">Produk Saja</option>
              <option value="KASBON">Kasbon Saja</option>
              <option value="EXPENSE">Pengeluaran Saja</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-bold text-black mb-4">Ringkasan Keuangan</h3>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-8 bg-gray-300 rounded mb-2 mx-auto w-32"></div>
                <div className="h-4 bg-gray-200 rounded mx-auto w-24"></div>
              </div>
            ))}
          </div>
        ) : transactionHistory.length > 0 ? (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">Rp {transactionSummary.totalRevenue.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Uang Masuk</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">Rp {(transactionSummary.totalCommissions || 0).toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Komisi Staf</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">Rp {transactionSummary.totalExpenses.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Pengeluaran</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">Rp {(transactionSummary.totalKasbon || 0).toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Kasbon</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700">Rp {transactionSummary.cashRevenue.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Tunai</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">Rp {transactionSummary.qrisRevenue.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Pendapatan QRIS</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">Rp {transactionHistory.filter(t => t.type === 'PRODUCT').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Penjualan Produk</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t-2 border-blue-300">
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-700">Rp {(transactionSummary.netIncome || 0).toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-gray-700 font-medium">PENDAPATAN BERSIH (Pendapatan - Komisi - Pengeluaran)</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-4">Belum ada data</div>
        )}
      </div>

      {/* Service Statistics Section */}
      <ServiceStatsSection 
        dateFrom={dateFrom} 
        dateTo={dateTo} 
        branchId={branchId}
        type={type}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Memuat transaksi...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaksi</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Pelanggan</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Item</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Penanggung Jawab</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 sm:px-6 py-12 text-center text-gray-500">
                    Tidak ada transaksi untuk periode yang dipilih.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((transaction: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">
                        {new Date(transaction.date).toLocaleDateString('id-ID')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(transaction.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="sm:hidden mt-2">
                        <div className="font-medium text-black text-xs">{transaction.customerName}</div>
                        <div className="text-xs text-gray-500">{transaction.customerPhone}</div>
                        <div className="md:hidden mt-1">
                          {transaction.serviceDetails && transaction.serviceDetails.length > 0 ? (
                            <div className="text-xs text-gray-700">
                              {transaction.serviceDetails.length} layanan
                            </div>
                          ) : (
                            <div className="text-xs text-gray-700 truncate max-w-[120px]">{transaction.itemName}</div>
                          )}
                          <div className={`text-xs font-medium ${
                            transaction.type === 'SERVICE' ? 'text-blue-600' : 
                            transaction.type === 'PRODUCT' ? 'text-orange-600' : 
                            transaction.type === 'KASBON' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {transaction.type}
                          </div>
                        </div>
                        <div className="lg:hidden mt-1 text-xs text-gray-600">
                          PJ: {transaction.staffName}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm hidden sm:table-cell">
                      <div className="font-medium text-black">{transaction.customerName}</div>
                      <div className="text-xs text-gray-500 mt-1">{transaction.customerPhone}</div>
                      <div className="text-xs text-gray-500 mt-1">{transaction.branchName}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm hidden md:table-cell">
                      {transaction.serviceDetails && transaction.serviceDetails.length > 0 ? (
                        <div>
                          <div className="text-gray-700 font-medium">
                            {transaction.serviceDetails.length} layanan
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {transaction.serviceDetails.slice(0, 2).map((s: any) => s.serviceName).join(', ')}
                            {transaction.serviceDetails.length > 2 && ` +${transaction.serviceDetails.length - 2} lagi`}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-700 truncate max-w-[150px]">{transaction.itemName}</div>
                      )}
                      <div className={`text-xs font-medium mt-1 ${
                        transaction.type === 'SERVICE' ? 'text-blue-600' : 
                        transaction.type === 'PRODUCT' ? 'text-orange-600' : 
                        transaction.type === 'KASBON' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {transaction.type}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-700 hidden lg:table-cell">{transaction.staffName}</td>
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <div className={`font-medium ${
                        transaction.type === 'EXPENSE' ? 'text-red-600' : 
                        transaction.type === 'KASBON' ? 'text-yellow-600' : 'text-gray-900'
                      }`}>
                        {transaction.type === 'EXPENSE' ? '-' : 
                         transaction.type === 'KASBON' ? 'Kasbon: ' : ''}Rp {Math.abs(transaction.amount).toLocaleString()}
                      </div>
                      <div className="mt-1">
                        {transaction.type === 'EXPENSE' ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">PENGELUARAN</span>
                        ) : transaction.type === 'KASBON' ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">KASBON</span>
                        ) : (
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.paymentMethod === 'CASH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {transaction.paymentMethod}
                            </span>
                            {transaction.paymentMethod === 'QRIS' && transaction.qrisExcessAmount > 0 && (
                              <div className="mt-1">
                                <div className="text-xs text-amber-600 font-medium">
                                  +Rp {transaction.qrisExcessAmount.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {transaction.qrisExcessType === 'TIPS' ? 'Tips' : 
                                   transaction.qrisExcessType === 'CASH_WITHDRAWAL' ? 'Tarik Cash' : 
                                   transaction.qrisExcessType === 'OTHER' ? 'Lainnya' : transaction.qrisExcessType}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="px-3 py-2 border border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 text-xs font-medium transition-colors flex items-center gap-2 min-h-[44px] justify-center"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Lihat</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowDeleteModal(true);
                          }}
                          className="px-3 py-2 border border-red-400 text-red-600 rounded-lg hover:bg-red-50 text-xs font-medium transition-colors flex items-center gap-2 min-h-[44px] justify-center"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={15}
          onPageChange={setCurrentPage}
        />
      )}

      {selectedTransaction && !showDeleteModal && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      {showDeleteModal && (
        <DeleteTransactionModal
          transaction={selectedTransaction}
          isDeleting={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}
    </div>
  );
}

function ServiceStatsSection({ dateFrom, dateTo, branchId, type }: any) {
  const { data: serviceStats = [], isLoading } = useQuery({
    queryKey: ['service-stats', dateFrom, dateTo, branchId],
    queryFn: () => adminApi.getServiceStats({ dateFrom, dateTo, branchId }),
    enabled: type === 'ALL' || type === 'SERVICE' || type === 'PRODUCT'
  });

  return (
    <div className="mb-6 p-6 bg-green-50 rounded-lg border border-green-200">
      <h3 className="font-bold text-black mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Statistik Layanan & Produk
      </h3>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : serviceStats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {serviceStats.map((stat: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-sm font-medium text-gray-700 mb-2 truncate">{stat.serviceName}</div>
              <div className="text-2xl font-bold text-green-600 mb-1">{stat.count}x</div>
              <div className="text-xs text-gray-500">
                Rp {stat.revenue.toLocaleString()} • Komisi: Rp {stat.commission.toLocaleString()}
              </div>
              <div className={`text-xs font-medium mt-1 ${
                stat.type === 'SERVICE' ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {stat.type === 'SERVICE' ? 'LAYANAN' : 'PRODUK'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">Belum ada data layanan</div>
      )}
    </div>
  );
}
