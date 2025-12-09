export default function AddServiceModal({ state, hairCutServices, treatmentServices }: any) {
  const handleSubmit = async () => {
    if (state.isSubmitting) return;
    
    if (!state.newCustomer.name || state.newCustomer.services.length === 0 || !state.newCustomer.capsterId) {
      alert('Silakan isi nama pelanggan, pilih minimal satu layanan, dan tentukan capster');
      return;
    }
    
    state.setConfirmModal({
      show: true,
      title: 'Mulai Layanan',
      message: `Mulai layanan untuk ${state.newCustomer.name}?`,
      onConfirm: async () => {
        state.setConfirmModal(null);
        state.setIsSubmitting(true);
        try {
          await state.mutations.addCustomer.mutateAsync(state.newCustomer);
          state.setNewCustomer({ name: '', phone: '', services: [], capsterId: '' });
          state.setShowAddService(false);
          state.showToast('Layanan berhasil dimulai!', 'success');
        } catch (error: any) {
          // Check if it's a critical error
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
            state.showToast(error?.message || 'Gagal memulai layanan', 'error');
          }
        } finally {
          state.setIsSubmitting(false);
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✂</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-800">Layanan Baru</h2>
                <p className="text-stone-500 text-sm">Tambah pelanggan baru dan mulai layanan</p>
              </div>
            </div>
            <button 
              onClick={() => {state.setShowAddService(false); state.setNewCustomer({ name: '', phone: '', services: [], capsterId: '' })}}
              className="text-stone-400 hover:text-stone-600 text-2xl w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-stone-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-stone-800 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">1</span>
              Informasi Pelanggan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Nama Pelanggan *</label>
                <input
                  type="text"
                  placeholder="Masukkan nama pelanggan"
                  value={state.newCustomer.name}
                  onChange={(e) => state.setNewCustomer({...state.newCustomer, name: e.target.value})}
                  className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none bg-white text-stone-800 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Nomor Telepon</label>
                <input
                  type="text"
                  placeholder="Masukkan nomor telepon (opsional)"
                  value={state.newCustomer.phone}
                  onChange={(e) => state.setNewCustomer({...state.newCustomer, phone: e.target.value})}
                  className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none bg-white text-stone-800 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-stone-800 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">2</span>
              Pilih Layanan
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Paket Potong Rambut <span className="text-stone-500">(Opsional)</span></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hairCutServices.map((service) => (
                    <label key={service.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                      state.newCustomer.services.includes(service.id) ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={state.newCustomer.services.includes(service.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const nonHaircutServices = state.newCustomer.services.filter(id => {
                                const existingService = state.services.find(s => s.id === id);
                                return existingService?.category !== 'HAIRCUT';
                              });
                              state.setNewCustomer({...state.newCustomer, services: [...nonHaircutServices, service.id]});
                            } else {
                              state.setNewCustomer({...state.newCustomer, services: state.newCustomer.services.filter(id => id !== service.id)});
                            }
                          }}
                          className="rounded border-stone-300 text-stone-800"
                        />
                        <div>
                          <div className="font-medium text-stone-800">{service.name}</div>
                          <div className="text-sm text-stone-500">Layanan potong rambut profesional</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-stone-800">Rp {service.basePrice.toLocaleString()}</div>
                        <div className="text-xs text-stone-500">Harga dasar</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Perawatan Tambahan <span className="text-stone-500">(Opsional)</span></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {treatmentServices.map((service) => (
                    <label key={service.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                      state.newCustomer.services.includes(service.id) ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={state.newCustomer.services.includes(service.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              state.setNewCustomer({...state.newCustomer, services: [...state.newCustomer.services, service.id]});
                            } else {
                              state.setNewCustomer({...state.newCustomer, services: state.newCustomer.services.filter(id => id !== service.id)});
                            }
                          }}
                          className="rounded border-stone-300 text-stone-800"
                        />
                        <div>
                          <div className="font-medium text-stone-800">{service.name}</div>
                          <div className="text-sm text-stone-500">Perawatan premium</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-stone-800">+Rp {service.basePrice.toLocaleString()}</div>
                        <div className="text-xs text-stone-500">Tambahan</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Pilih Capster *</label>
                <div className="space-y-2">
                  {state.capsters.map((capster) => (
                    <label key={capster.id} className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      state.newCustomer.capsterId === capster.id ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                    }`}>
                      <input
                        type="radio"
                        name="capster"
                        value={capster.id}
                        checked={state.newCustomer.capsterId === capster.id}
                        onChange={(e) => state.setNewCustomer({...state.newCustomer, capsterId: e.target.value})}
                        className="text-stone-800"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-stone-800">{capster.name}</div>
                        <div className="text-sm text-stone-500">Tukang cukur profesional</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {state.newCustomer.services.length > 0 && (
            <div className="bg-stone-800 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Ringkasan Layanan</h3>
              <div className="space-y-2">
                {state.newCustomer.services.map(serviceId => {
                  const service = state.services.find(s => s.id === serviceId);
                  return service ? (
                    <div key={serviceId} className="flex justify-between">
                      <span>{service.name}</span>
                      <span>Rp {service.basePrice.toLocaleString()}</span>
                    </div>
                  ) : null;
                })}
                <div className="border-t border-stone-600 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Estimasi Total</span>
                    <span>Rp {state.newCustomer.services.reduce((total, serviceId) => {
                      const service = state.services.find(s => s.id === serviceId);
                      return total + (service?.basePrice || 0);
                    }, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-stone-200 px-8 py-6 rounded-b-2xl">
          <div className="flex gap-4">
            <button 
              onClick={() => {state.setShowAddService(false); state.setNewCustomer({ name: '', phone: '', services: [], capsterId: '' })}}
              className="flex-1 text-stone-600 hover:text-stone-800 px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors font-medium"
            >
              Batal
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!state.newCustomer.name || state.newCustomer.services.length === 0 || !state.newCustomer.capsterId || state.isSubmitting}
              className="flex-1 bg-stone-800 text-white px-6 py-3 rounded-lg hover:bg-stone-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {state.isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Memulai...</span>
                </>
              ) : (
                <>
                  <span>✂</span>
                  <span>Mulai Layanan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
