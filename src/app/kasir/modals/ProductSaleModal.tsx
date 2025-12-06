'use client';

export default function ProductSaleModal({ state, onClose }: any) {
  const handleSubmit = async () => {
    if (state.isSubmitting) return;
    if (!state.productSaleData.customerName || state.productSaleData.products.length === 0) {
      alert('Please enter customer name and select at least one product');
      return;
    }
    
    state.setIsSubmitting(true);
    try {
      await state.mutations.addProductSale.mutateAsync({
        ...state.productSaleData,
        completedBy: state.productSaleData.completedBy || state.currentKasir
      });
      state.setProductSaleData({ customerName: '', customerPhone: '', products: [], paymentMethod: 'CASH', completedBy: '', recommendedBy: '' });
      onClose();
      state.showToast('Penjualan produk berhasil!', 'success');
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
        state.showToast(error?.message || 'Gagal menambahkan penjualan produk', 'error');
      }
    } finally {
      state.setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-stone-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">📦</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-800">Product Sale</h2>
                <p className="text-stone-500 text-sm">Sell products directly to customers</p>
              </div>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl w-8 h-8 flex items-center justify-center">×</button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-stone-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-stone-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">1</span>
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Customer Name *</label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={state.productSaleData.customerName}
                  onChange={(e) => state.setProductSaleData({...state.productSaleData, customerName: e.target.value})}
                  className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none bg-white text-stone-800 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter phone number (optional)"
                  value={state.productSaleData.customerPhone}
                  onChange={(e) => state.setProductSaleData({...state.productSaleData, customerPhone: e.target.value})}
                  className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none bg-white text-stone-800 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-stone-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">2</span>
              Product Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {state.products.map((product: any) => {
                const selectedProduct = state.productSaleData.products.find((p: any) => p.id === product.id);
                const isSelected = !!selectedProduct;
                const quantity = selectedProduct?.quantity || 0;
                
                return (
                  <div key={product.id} className={`border rounded-lg p-4 transition-all ${isSelected ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              state.setProductSaleData((prev: any) => ({...prev, products: [...prev.products, {id: product.id, quantity: 1}]}));
                            } else {
                              state.setProductSaleData((prev: any) => ({...prev, products: prev.products.filter((p: any) => p.id !== product.id)}));
                            }
                          }}
                          className="rounded border-stone-300 text-stone-600"
                        />
                        <div>
                          <div className="font-medium text-stone-800">{product.name}</div>
                          <div className="text-sm text-stone-500">Hair care product</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-stone-800">Rp {product.basePrice.toLocaleString()}</div>
                        <div className="text-xs text-stone-500">per unit</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center justify-center space-x-3 pt-3 border-t border-stone-200">
                        <button
                          type="button"
                          onClick={() => state.setProductSaleData((prev: any) => ({...prev, products: prev.products.map((p: any) => p.id === product.id ? {...p, quantity: Math.max(1, p.quantity - 1)} : p)}))}
                          className="w-8 h-8 bg-stone-200 hover:bg-stone-300 rounded-lg flex items-center justify-center text-stone-700 font-bold transition-colors"
                        >-</button>
                        <span className="w-12 text-center font-medium text-stone-800">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => state.setProductSaleData((prev: any) => ({...prev, products: prev.products.map((p: any) => p.id === product.id ? {...p, quantity: p.quantity + 1} : p)}))}
                          className="w-8 h-8 bg-stone-200 hover:bg-stone-300 rounded-lg flex items-center justify-center text-stone-700 font-bold transition-colors"
                        >+</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-stone-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">3</span>
              Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Recommend By</label>
                <select
                  value={state.productSaleData.recommendedBy}
                  onChange={(e) => state.setProductSaleData({...state.productSaleData, recommendedBy: e.target.value})}
                  className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none bg-white text-stone-800 transition-all"
                >
                  <option value="">Select recommender</option>
                  {[...state.capsters, ...state.kasirList].map((person: any) => (
                    <option key={person.id} value={person.id}>{person.name}{person.name === state.branchInfo.kasirName ? ' (You)' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Transaction Responsible</label>
                <select
                  value={state.productSaleData.completedBy}
                  onChange={(e) => state.setProductSaleData({...state.productSaleData, completedBy: e.target.value})}
                  className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none bg-white text-stone-800 transition-all"
                >
                  <option value="">Select responsible person</option>
                  {[...state.capsters, ...state.kasirList].map((person: any) => (
                    <option key={person.id} value={person.id}>{person.name}{person.name === state.branchInfo.kasirName ? ' (You)' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">Payment Method</label>
              <div className="space-y-2">
                {['CASH', 'QRIS'].map((method) => (
                  <label key={method} className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${state.productSaleData.paymentMethod === method ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={state.productSaleData.paymentMethod === method}
                      onChange={(e) => state.setProductSaleData({...state.productSaleData, paymentMethod: e.target.value})}
                      className="text-stone-600"
                    />
                    <div>
                      <div className="font-medium text-stone-800">{method}</div>
                      <div className="text-sm text-stone-500">{method === 'CASH' ? 'Cash payment' : 'Digital payment'}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {state.productSaleData.products.length > 0 && (
            <div className="bg-stone-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Bill Summary</h3>
              <div className="space-y-2">
                {state.productSaleData.products.map((selectedProduct: any) => {
                  const product = state.products.find((p: any) => p.id === selectedProduct.id);
                  if (!product) return null;
                  const subtotal = product.basePrice * selectedProduct.quantity;
                  return (
                    <div key={selectedProduct.id} className="flex justify-between">
                      <span>{product.name} x{selectedProduct.quantity}</span>
                      <span>Rp {subtotal.toLocaleString()}</span>
                    </div>
                  );
                })}
                <div className="border-t border-stone-500 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>Rp {state.productSaleData.products.reduce((total: number, selectedProduct: any) => {
                      const product = state.products.find((p: any) => p.id === selectedProduct.id);
                      return total + (product ? product.basePrice * selectedProduct.quantity : 0);
                    }, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-stone-200 px-8 py-6 rounded-b-2xl">
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 text-stone-600 hover:text-stone-800 px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors font-medium">Cancel</button>
            <button onClick={handleSubmit} disabled={!state.productSaleData.customerName || state.productSaleData.products.length === 0 || state.isSubmitting} className="flex-1 bg-stone-600 text-white px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
              {state.isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>📦</span>
                  <span>Complete Sale</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
