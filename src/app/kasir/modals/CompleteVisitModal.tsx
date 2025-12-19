'use client';

export default function CompleteVisitModal({ state, onClose }: any) {
  const handleSubmit = async () => {
    if (state.isSubmitting) return;
    
    const total = state.completingCustomer.visitServices?.reduce((sum: number, vs: any) => sum + vs.service.basePrice, 0) || 0;
    
    // Validation for QRIS
    if (state.paymentMethod === 'QRIS') {
      if (!state.qrisAmountReceived || state.qrisAmountReceived < total) {
        state.showToast('Nominal QRIS tidak boleh kurang dari total tagihan', 'error');
        return;
      }
      if (state.qrisExcessAmount > 0 && !state.qrisExcessType) {
        state.showToast('Pilih keterangan selisih QRIS', 'error');
        return;
      }
    }
    
    state.setConfirmModal({
      show: true,
      title: 'Selesaikan Transaksi',
      message: `Selesaikan transaksi untuk ${state.completingCustomer.customerName}?\n\nTotal: Rp ${total.toLocaleString()}`,
      onConfirm: async () => {
        state.setConfirmModal(null);
        state.setIsSubmitting(true);
        try {
          await state.mutations.completeVisit.mutateAsync({
            visitId: state.completingCustomer.id,
            products: [],
            paymentMethod: state.paymentMethod,
            completedBy: state.completedBy,
            qrisAmountReceived: state.paymentMethod === 'QRIS' ? state.qrisAmountReceived : undefined,
            qrisExcessAmount: state.paymentMethod === 'QRIS' ? state.qrisExcessAmount : undefined,
            qrisExcessType: state.paymentMethod === 'QRIS' ? state.qrisExcessType : undefined,
            qrisExcessNote: state.paymentMethod === 'QRIS' ? state.qrisExcessNote : undefined
          });
          state.setCompletingCustomer(null);
          state.showToast('Transaksi berhasil diselesaikan!', 'success');
          onClose();
        } catch (error: any) {
          console.error('Complete visit error:', error);
          const isNetworkError = error.message === 'Failed to fetch' || error.name === 'TypeError' || error.name === 'AbortError';
          const isServerError = error.status >= 500;
          
          if (isNetworkError || isServerError) {
            state.setApiError({
              isOpen: true,
              shouldShowManualMode: true,
              errorMessage: isNetworkError 
                ? 'Tidak dapat terhubung ke server. Gunakan mode manual untuk mencatat transaksi.'
                : 'Server sedang bermasalah. Silakan gunakan mode manual.'
            });
          } else {
            state.showToast(error?.message || 'Gagal menyelesaikan transaksi', 'error');
          }
        } finally {
          state.setIsSubmitting(false);
        }
      }
    });
  };

  return (
    <div className="mt-8 p-6 bg-stone-50 rounded-xl border border-stone-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-2">
            Selesaikan Layanan - {state.completingCustomer.customerName}
          </h3>
          <div className="text-sm text-stone-600">
            <span className="font-medium">{state.completingCustomer.visitServices?.map((vs: any) => vs.service.name).join(' + ') || 'No services'}</span> by {state.completingCustomer.capster.name}
          </div>
        </div>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl">×</button>
      </div>

      <div className="max-w-md mx-auto">
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg border border-stone-300">
            <h4 className="font-medium text-stone-800 mb-3">Ringkasan Tagihan</h4>
            <div className="space-y-2">
              {state.completingCustomer.visitServices?.map((vs: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-stone-600">{vs.service.name}</span>
                  <span className="font-medium text-stone-800">Rp {vs.service.basePrice.toLocaleString()}</span>
                </div>
              ))}

              <div className="border-t border-stone-200 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-stone-800">TOTAL</span>
                  <span className="text-stone-900">
                    Rp {(state.completingCustomer.visitServices?.reduce((sum: number, vs: any) => sum + vs.service.basePrice, 0) || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Metode Pembayaran</label>
            <select
              value={state.paymentMethod}
              onChange={(e) => state.setPaymentMethod(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800"
            >
              <option value="CASH">Cash</option>
              <option value="QRIS">QRIS</option>
            </select>
          </div>

          {state.paymentMethod === 'QRIS' && (
            <>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Nominal QRIS Diterima</label>
                <input
                  type="number"
                  value={state.qrisAmountReceived || ''}
                  onChange={(e) => state.setQrisAmountReceived(Number(e.target.value))}
                  min={(state.completingCustomer.visitServices?.reduce((sum: number, vs: any) => sum + vs.service.basePrice, 0) || 0)}
                  className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800"
                  placeholder="Masukkan nominal QRIS"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Minimal: Rp {(state.completingCustomer.visitServices?.reduce((sum: number, vs: any) => sum + vs.service.basePrice, 0) || 0).toLocaleString()}
                </p>
              </div>

              {state.qrisExcessAmount > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-800">Selisih QRIS Terdeteksi</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Rp {state.qrisExcessAmount.toLocaleString()} perlu diambil dari cash (manual)
                      </p>
                    </div>
                  </div>
                  
                  <label className="block text-sm font-medium text-stone-700 mb-2">Keterangan Selisih *</label>
                  <select
                    value={state.qrisExcessType || ''}
                    onChange={(e) => state.setQrisExcessType(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800"
                    required
                  >
                    <option value="">Pilih keterangan</option>
                    <option value="TIPS">Tips untuk Staff</option>
                    <option value="CASH_WITHDRAWAL">Tarik Cash</option>
                    <option value="OTHER">Lainnya</option>
                  </select>
                  
                  {state.qrisExcessType === 'OTHER' && (
                    <input
                      type="text"
                      value={state.qrisExcessNote || ''}
                      onChange={(e) => state.setQrisExcessNote(e.target.value)}
                      className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800 mt-2"
                      placeholder="Catatan tambahan"
                    />
                  )}
                </div>
              )}
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Penanggung Jawab Transaksi</label>
            <select
              value={state.completedBy}
              onChange={(e) => state.setCompletedBy(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800"
            >
              {[...state.capsters, ...state.kasirList].map((person: any) => {
                const isCurrentUser = person.name === state.branchInfo.kasirName;
                return (
                  <option key={person.id} value={person.id}>
                    {person.name}{isCurrentUser ? ' (You)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={handleSubmit}
              disabled={state.isSubmitting}
              className="flex-1 bg-stone-800 text-white px-6 py-3 rounded-lg hover:bg-stone-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {state.isSubmitting && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
              {state.isSubmitting ? 'Memproses...' : 'Selesaikan Transaksi'}
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-3 text-stone-600 hover:text-stone-800 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
