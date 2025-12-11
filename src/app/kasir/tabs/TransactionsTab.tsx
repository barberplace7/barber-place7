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
                }) : 'Memuat...'}
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
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center mt-1">
          <button 
            onClick={() => state.setShowAddService(true)}
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 text-white px-4 py-2 rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 font-medium flex items-center gap-2 text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-gray-700 hover:border-gray-600"
          >
            <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-md group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </div>
            <span>Tambah Layanan</span>
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
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 text-white px-4 py-2 rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 font-medium flex items-center gap-2 text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-gray-700 hover:border-gray-600"
          >
            <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg shadow-md group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-110">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span>Tambah Produk</span>
          </button>
          
          <button 
            onClick={() => state.setShowExpense(true)}
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 text-white px-4 py-2 rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 font-medium flex items-center gap-2 text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-gray-700 hover:border-gray-600"
          >
            <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg shadow-md group-hover:shadow-rose-500/25 transition-all duration-300 group-hover:scale-110">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span>Pengeluaran</span>
          </button>
          
          <button 
            onClick={() => state.setShowAdvance(true)}
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 text-white px-4 py-2 rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 font-medium flex items-center gap-2 text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-gray-700 hover:border-gray-600"
          >
            <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-md group-hover:shadow-amber-500/25 transition-all duration-300 group-hover:scale-110">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
            </div>
            <span>Kasbon</span>
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
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Pelanggan</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Layanan/Produk</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">{state.customerView === 'completed' ? 'Capster/Direkomendasi Oleh' : 'Capster'}</th>
              {state.customerView === 'completed' && <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Jumlah</th>}
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">{state.customerView === 'ongoing' ? 'Waktu Mulai' : 'Selesai'}</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">{state.customerView === 'ongoing' ? 'Status' : 'Pembayaran'}</th>
              {state.customerView === 'ongoing' && <th className="px-6 py-4 text-left text-sm font-medium text-stone-700">Aksi</th>}
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
                      {customer.visitServices?.map(vs => vs.service.name).join(' + ') || 'Tidak ada layanan'}
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
                            className="group relative bg-gradient-to-br from-gray-700 to-gray-800 text-white px-3 py-2 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 border border-gray-600 hover:border-gray-500"
                          >
                            <div className="w-4 h-4 bg-gradient-to-br from-sky-400 to-sky-600 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                              </svg>
                            </div>
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
                            className="group relative bg-gradient-to-br from-gray-700 to-gray-800 text-white px-4 py-2 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 border border-gray-600 hover:border-gray-500"
                          >
                            <div className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                            </div>
                            Selesai
                          </button>
                          <button 
                            onClick={async () => {
                              if (confirm('Batalkan layanan ini?')) {
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
                            className="group relative bg-gradient-to-br from-gray-700 to-gray-800 text-white px-3 py-2 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 border border-gray-600 hover:border-gray-500"
                          >
                            <div className="w-4 h-4 bg-gradient-to-br from-rose-400 to-rose-600 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                              </svg>
                            </div>
                            Batal
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
                          : customer.visitServices?.map(vs => vs.service.name).join(' + ') || 'Tidak ada layanan'
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
                          return recommender ? recommender.name : 'Tidak Diketahui';
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
      {state.completingCustomer && <CompleteVisitModal state={state} onClose={() => state.setCompletingCustomer(null)} />}
    </div>
  );
}
