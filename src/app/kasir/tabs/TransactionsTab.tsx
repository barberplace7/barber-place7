'use client';
import { useMemo } from 'react';
import AddServiceModal from '../modals/AddServiceModal';
import ProductSaleModal from '../modals/ProductSaleModal';
import ExpenseModal from '../modals/ExpenseModal';
import EditVisitModal from '../modals/EditVisitModal';
import CompleteVisitModal from '../modals/CompleteVisitModal';
import AddAdvanceModal from '../modals/AddAdvanceModal';

export default function TransactionsTab({ state }: any) {
  const hairCutServices = useMemo(() => state.services.filter(s => s.category === 'HAIRCUT'), [state.services]);
  const treatmentServices = useMemo(() => state.services.filter(s => s.category === 'TREATMENT'), [state.services]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-800">Transaksi</h2>
            <div className="text-stone-600">
              <div className="text-sm sm:text-lg font-medium">
                {state.isClient ? state.currentTime.toLocaleDateString('id-ID', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                }) : 'Loading...'}
              </div>
              <div className="text-lg sm:text-2xl font-bold text-stone-800">
                {state.isClient ? `${state.currentTime.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: '2-digit', second: '2-digit' })} WIB` : '--:--:-- WIB'}
              </div>
            </div>
          </div>
          <div className="inline-flex rounded-xl border border-stone-200 overflow-hidden">
            {[
              { id: 'ongoing', name: 'Layanan Berlangsung' },
              { id: 'completed', name: 'Selesai Hari Ini' }
            ].map((view, index) => (
              <button
                key={view.id}
                onClick={() => state.setCustomerView(view.id)}
                className={`py-2 px-4 font-medium text-sm transition-colors ${
                  index > 0 ? 'border-l border-stone-200' : ''
                } ${
                  state.customerView === view.id ? 'bg-stone-800 text-white' : 'text-stone-600 hover:text-stone-800 hover:bg-stone-50'
                }`}
              >
                {view.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button 
            onClick={() => state.setShowAddService(true)}
            className="bg-stone-800 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-stone-900 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>✂</span> <span className="hidden sm:inline">Tambah Layanan</span><span className="sm:hidden">Layanan</span>
          </button>
          <button 
            onClick={() => {
              state.setShowProductSale(true);
              if (!state.productSaleData.completedBy && state.branchInfo.kasirName) {
                const sessionKasir = state.kasirList.find(k => k.name === state.branchInfo.kasirName);
                if (sessionKasir) {
                  state.setProductSaleData(prev => ({...prev, completedBy: sessionKasir.id, recommendedBy: sessionKasir.id}));
                }
              }
            }}
            className="bg-stone-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>📦</span> <span className="hidden sm:inline">Tambah Produk</span><span className="sm:hidden">Produk</span>
          </button>
          <button 
            onClick={() => state.setShowExpense(true)}
            className="bg-stone-500 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-stone-600 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>💸</span> <span className="hidden sm:inline">Tambah Pengeluaran</span><span className="sm:hidden">Pengeluaran</span>
          </button>
          <button 
            onClick={() => state.setShowAdvance(true)}
            className="bg-orange-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>💰</span> <span className="hidden sm:inline">Kasbon</span><span className="sm:hidden">Kasbon</span>
          </button>
        </div>
      </div>

      {state.customerView === 'completed' && (
        <div className="mb-8 p-6 bg-stone-50 rounded-xl border border-stone-200">
          <h3 className="font-bold text-stone-800 mb-4">Ringkasan Pendapatan Hari Ini</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-stone-800">Rp {(state.dailySummary?.total || 0).toLocaleString()}</div>
              <div className="text-sm text-stone-600">Total Pendapatan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Rp {(state.dailySummary?.cash || 0).toLocaleString()}</div>
              <div className="text-sm text-stone-600">Cash</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Rp {(state.dailySummary?.qris || 0).toLocaleString()}</div>
              <div className="text-sm text-stone-600">QRIS</div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-stone-200">
        <table className="min-w-full">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Service/Product</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">{state.customerView === 'completed' ? 'Capster/Recommend By' : 'Capster'}</th>
              {state.customerView === 'completed' && <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Amount</th>}
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">{state.customerView === 'ongoing' ? 'Start Time' : 'Completed'}</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">{state.customerView === 'ongoing' ? 'Status' : 'Payment'}</th>
              {state.customerView === 'ongoing' && <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-100">
            {state.customerView === 'ongoing' ? (
              state.customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-stone-500">
                    <div className="text-4xl mb-4">✂</div>
                    <div>Tidak ada pelanggan aktif</div>
                    <div className="text-sm mt-1">Tambahkan pelanggan baru untuk memulai</div>
                  </td>
                </tr>
              ) : (
                state.customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-stone-50">
                    <td className="px-6 py-5">
                      <div className="font-medium text-stone-800">{customer.customerName}</div>
                      <div className="text-sm text-stone-500">{customer.customerPhone}</div>
                    </td>
                    <td className="px-6 py-5 text-stone-700">
                      {customer.visitServices?.map(vs => vs.service.name).join(' + ') || 'No services'}
                    </td>
                    <td className="px-6 py-5 text-stone-700">{customer.capster.name}</td>
                    <td className="px-6 py-5 text-stone-500 text-sm">
                      {new Date(customer.jamMasuk).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'ONGOING' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {customer.status === 'ONGOING' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              state.setEditingVisit(customer);
                              const currentServices = customer.visitServices?.map(vs => vs.service.id) || [];
                              state.setEditServices(currentServices);
                            }}
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => {
                              state.setCompletingCustomer(customer);
                              const sessionKasir = state.kasirList.find(k => k.name === state.branchInfo.kasirName);
                              if (sessionKasir) {
                                state.setCompletedBy(sessionKasir.id);
                              } else {
                                state.setCompletedBy(state.currentKasir);
                              }
                            }}
                            className="bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-900 transition-colors text-sm font-medium"
                          >
                            Complete
                          </button>
                          <button 
                            onClick={async () => {
                              if (confirm('Cancel this service?')) {
                                try {
                                  state.setGlobalLoading(true);
                                  await state.mutations.cancelVisit.mutateAsync(customer.id);
                                  state.showToast('Layanan berhasil dibatalkan', 'success');
                                } catch (error: any) {
                                  state.showToast(error?.message || 'Gagal membatalkan layanan', 'error');
                                } finally {
                                  state.setGlobalLoading(false);
                                }
                              }
                            }}
                            className="text-stone-500 hover:text-red-600 px-3 py-2 border border-stone-300 rounded-lg hover:border-red-300 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )
            ) : (
              (state.completedToday.length === 0 && state.productTransactions.length === 0) ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-stone-500">
                    <div className="text-4xl mb-4">✂</div>
                    <div>Tidak ada transaksi selesai hari ini</div>
                    <div className="text-sm mt-1">Transaksi yang selesai akan muncul di sini</div>
                  </td>
                </tr>
              ) : (
                <>
                  {state.completedToday.map((customer) => (
                    <tr key={`service-${customer.id}`} className="hover:bg-stone-50">
                      <td className="px-6 py-5">
                        <div className="font-medium text-stone-800">{customer.customerName}</div>
                        <div className="text-sm text-stone-500">{customer.customerPhone}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-stone-700">
                        {customer.serviceTransactions?.length > 0 
                          ? customer.serviceTransactions[0].paketName 
                          : customer.visitServices?.map(vs => vs.service.name).join(' + ') || 'No services'
                        }
                      </div>
                        <div className="text-xs text-blue-600 font-medium">SERVICE</div>
                      </td>
                      <td className="px-6 py-5 text-stone-700">{customer.capster.name}</td>
                      <td className="px-6 py-5 text-stone-700 font-medium">
                        Rp {(() => {
                          if (customer.serviceTransactions?.length > 0) {
                            return customer.serviceTransactions.reduce((sum, st) => sum + st.priceFinal, 0).toLocaleString();
                          }
                          return customer.visitServices?.reduce((sum, vs) => sum + vs.service.basePrice, 0).toLocaleString() || '0';
                        })()}
                      </td>
                      <td className="px-6 py-5 text-stone-500 text-sm">
                        {new Date(customer.jamSelesai).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          customer.paymentMethod === 'CASH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {customer.paymentMethod}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {state.productTransactions.map((transaction) => (
                    <tr key={`product-${transaction.id}`} className="hover:bg-stone-50">
                      <td className="px-6 py-5">
                        <div className="font-medium text-stone-800">{transaction.customerName}</div>
                        <div className="text-sm text-stone-500">{transaction.customerPhone}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-stone-700">{transaction.productNameSnapshot} (x{transaction.quantity})</div>
                        <div className="text-xs text-orange-600 font-medium">PRODUCT</div>
                      </td>
                      <td className="px-6 py-5 text-stone-700">
                        {(() => {
                          const recommender = [...state.kasirList, ...state.capsters].find(p => p.id === transaction.recommenderId);
                          return recommender ? recommender.name : 'Unknown';
                        })()}
                      </td>
                      <td className="px-6 py-5 text-stone-700 font-medium">Rp {transaction.totalPrice?.toLocaleString()}</td>
                      <td className="px-6 py-5 text-stone-500 text-sm">
                        {new Date(transaction.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.paymentMethod === 'CASH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.paymentMethod}
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              )
            )}
          </tbody>
        </table>
      </div>

      {state.showAddService && <AddServiceModal state={state} hairCutServices={hairCutServices} treatmentServices={treatmentServices} onClose={() => state.setShowAddService(false)} />}
      {state.showProductSale && <ProductSaleModal state={state} onClose={() => state.setShowProductSale(false)} />}
      {state.showExpense && <ExpenseModal state={state} onClose={() => state.setShowExpense(false)} />}
      {state.showAdvance && (
        <AddAdvanceModal
          onClose={() => state.setShowAdvance(false)}
          onSubmit={async (data) => {
            try {
              state.setIsSubmitting(true);
              await state.mutations.addAdvance.mutateAsync(data);
              state.showToast('Kasbon berhasil ditambahkan', 'success');
              state.setShowAdvance(false);
            } catch (error: any) {
              state.showToast(error?.message || 'Gagal menambahkan kasbon', 'error');
            } finally {
              state.setIsSubmitting(false);
            }
          }}
          isSubmitting={state.isSubmitting}
          capsters={state.capsters}
          kasirList={state.kasirList}
        />
      )}
      {state.editingVisit && <EditVisitModal state={state} onClose={() => { state.setEditingVisit(null); state.setEditServices([]); }} />}
      {state.completingCustomer && <CompleteVisitModal state={state} onClose={() => { state.setCompletingCustomer(null); state.setSelectedProducts([]); }} />}
    </div>
  );
}
