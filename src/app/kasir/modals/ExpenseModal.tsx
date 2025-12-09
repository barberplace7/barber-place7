'use client';

export default function ExpenseModal({ state, onClose }: any) {
  const handleSubmit = async () => {
    if (state.isSubmitting) return;
    if (!state.expenseData.nominal || parseInt(state.expenseData.nominal) <= 0) {
      alert('Silakan masukkan jumlah pengeluaran yang valid');
      return;
    }
    
    state.setIsSubmitting(true);
    try {
      await state.mutations.addExpense.mutateAsync({
        ...state.expenseData,
        kasirId: state.currentKasir
      });
      state.setExpenseData({ nominal: '', category: 'OPERASIONAL', note: '' });
      onClose();
      state.showToast('Pengeluaran berhasil ditambahkan!', 'success');
    } catch (error: any) {
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
        state.showToast(error?.message || 'Gagal menambahkan pengeluaran', 'error');
      }
    } finally {
      state.setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="px-6 py-4 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-800">💸 Tambah Pengeluaran</h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl">×</button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Jumlah *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500">Rp</span>
              <input
                type="number"
                placeholder="0"
                value={state.expenseData.nominal}
                onChange={(e) => state.setExpenseData({...state.expenseData, nominal: e.target.value})}
                className="w-full border border-stone-300 rounded-lg pl-10 pr-4 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Kategori</label>
            <select
              value={state.expenseData.category}
              onChange={(e) => state.setExpenseData({...state.expenseData, category: e.target.value})}
              className="w-full border border-stone-300 rounded-lg px-3 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800"
            >
              <option value="OPERASIONAL">Operasional</option>
              <option value="TAMBAHAN">Tambahan</option>
              <option value="LAINNYA">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Catatan (Opsional)</label>
            <textarea
              placeholder="Untuk apa pengeluaran ini?"
              value={state.expenseData.note}
              onChange={(e) => state.setExpenseData({...state.expenseData, note: e.target.value})}
              className="w-full border border-stone-300 rounded-lg px-3 py-3 focus:border-stone-500 focus:outline-none bg-white text-stone-800 resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-stone-200">
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 text-stone-600 hover:text-stone-800 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors">Batal</button>
            <button onClick={handleSubmit} disabled={!state.expenseData.nominal || parseInt(state.expenseData.nominal) <= 0 || state.isSubmitting} className="flex-1 bg-stone-500 text-white px-4 py-2 rounded-lg hover:bg-stone-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {state.isSubmitting && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
              {state.isSubmitting ? 'Menambahkan...' : 'Tambah Pengeluaran'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
