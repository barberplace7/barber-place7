import { useState } from 'react';

export default function AddServiceModal({ state, hairCutServices, treatmentServices }: any) {
  const [showHaircut, setShowHaircut] = useState(true);
  const [showTreatment, setShowTreatment] = useState(false);
  
  const handleSubmit = async () => {
    if (state.isSubmitting) return;
    
    const pairs = state.newCustomer.serviceCapsterPairs || [];
    if (!state.newCustomer.name || pairs.length === 0) {
      alert('Silakan isi nama pelanggan dan pilih minimal satu layanan dengan capster');
      return;
    }
    
    // Validate all pairs have both service and capster
    const invalidPairs = pairs.some(pair => !pair.serviceId || !pair.capsterId);
    if (invalidPairs) {
      alert('Pastikan semua layanan memiliki capster yang dipilih');
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
          state.setNewCustomer({ name: '', phone: '', serviceCapsterPairs: [] });
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
              onClick={() => {state.setShowAddService(false); state.setNewCustomer({ name: '', phone: '', serviceCapsterPairs: [] })}}
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

          <div className="bg-stone-50 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-stone-800 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">2</span>
              Layanan & Capster
            </h3>
            
            {/* Fixed Height Scrollable Area */}
            <div className="h-64 overflow-y-auto space-y-2 pr-2">
              {(state.newCustomer.serviceCapsterPairs || []).map((pair, index) => {
                const service = state.services.find(s => s.id === pair.serviceId);
                const capster = state.capsters.find(c => c.id === pair.capsterId);
                const isComplete = pair.serviceId && pair.capsterId;
                
                return (
                  <div key={index} className={`bg-white rounded-lg border transition-all ${
                    isComplete ? 'border-green-200 bg-green-50' : 'border-stone-200'
                  }`}>
                    {isComplete ? (
                      /* Compact Summary for Completed */
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm text-stone-800">{service?.name}</div>
                              <div className="text-xs text-stone-500 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                                {capster?.name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-semibold text-stone-800">
                              Rp {service?.basePrice.toLocaleString()}
                            </div>
                            {(state.newCustomer.serviceCapsterPairs || []).length > 1 && (
                              <button
                                onClick={() => {
                                  const currentPairs = state.newCustomer.serviceCapsterPairs || [];
                                  const newPairs = currentPairs.filter((_, i) => i !== index);
                                  state.setNewCustomer({...state.newCustomer, serviceCapsterPairs: newPairs});
                                }}
                                className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Full Form for Incomplete */
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-stone-700">Layanan #{index + 1}</span>
                          {index > 0 && (
                            <button
                              onClick={() => {
                                const currentPairs = state.newCustomer.serviceCapsterPairs || [];
                                const newPairs = currentPairs.filter((_, i) => i !== index);
                                state.setNewCustomer({...state.newCustomer, serviceCapsterPairs: newPairs});
                              }}
                              className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                              </svg>
                            </button>
                          )}
                        </div>
                        
                        {/* Haircut Services */}
                        <div className="mb-3">
                          <button
                            onClick={() => setShowHaircut(!showHaircut)}
                            className="w-full flex items-center justify-between p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors mb-2"
                          >
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                              </svg>
                              <span className="text-sm font-semibold text-blue-700">Potong Rambut</span>
                            </div>
                            <svg className={`w-4 h-4 text-blue-700 transition-transform ${showHaircut ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                            </svg>
                          </button>
                          {showHaircut && (
                            <div className="grid grid-cols-2 gap-2">
                              {hairCutServices.map(serviceOption => {
                                const isSelected = pair.serviceId === serviceOption.id;
                                return (
                                  <button
                                    key={serviceOption.id}
                                    onClick={() => {
                                      const currentPairs = state.newCustomer.serviceCapsterPairs || [];
                                      const newPairs = [...currentPairs];
                                      newPairs[index].serviceId = serviceOption.id;
                                      state.setNewCustomer({...state.newCustomer, serviceCapsterPairs: newPairs});
                                    }}
                                    className={`p-2 rounded-lg border text-left text-xs transition-all ${
                                      isSelected 
                                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-300' 
                                        : 'border-stone-200 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                                  >
                                    <div className="font-semibold text-stone-800">{serviceOption.name}</div>
                                    <div className="text-stone-500 mt-1">
                                      Rp {serviceOption.basePrice.toLocaleString()}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        
                        {/* Treatment Services */}
                        <div className="mb-3">
                          <button
                            onClick={() => setShowTreatment(!showTreatment)}
                            className="w-full flex items-center justify-between p-2 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors mb-2"
                          >
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                              <span className="text-sm font-semibold text-purple-700">Treatment</span>
                            </div>
                            <svg className={`w-4 h-4 text-purple-700 transition-transform ${showTreatment ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                            </svg>
                          </button>
                          {showTreatment && (
                            <div className="grid grid-cols-2 gap-2">
                              {treatmentServices.map(serviceOption => {
                                const isSelected = pair.serviceId === serviceOption.id;
                                return (
                                  <button
                                    key={serviceOption.id}
                                    onClick={() => {
                                      const currentPairs = state.newCustomer.serviceCapsterPairs || [];
                                      const newPairs = [...currentPairs];
                                      newPairs[index].serviceId = serviceOption.id;
                                      state.setNewCustomer({...state.newCustomer, serviceCapsterPairs: newPairs});
                                    }}
                                    className={`p-2 rounded-lg border text-left text-xs transition-all ${
                                      isSelected 
                                        ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-300' 
                                        : 'border-stone-200 hover:border-purple-300 hover:bg-purple-50'
                                    }`}
                                  >
                                    <div className="font-semibold text-stone-800">{serviceOption.name}</div>
                                    <div className="text-stone-500 mt-1">
                                      Rp {serviceOption.basePrice.toLocaleString()}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        
                        {/* Capster Selection */}
                        {pair.serviceId && (
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-2">Pilih Capster</label>
                            <div className="grid grid-cols-2 gap-2">
                              {state.capsters.map(capsterOption => {
                                const isSelected = pair.capsterId === capsterOption.id;
                                return (
                                  <button
                                    key={capsterOption.id}
                                    onClick={() => {
                                      const currentPairs = state.newCustomer.serviceCapsterPairs || [];
                                      const newPairs = [...currentPairs];
                                      newPairs[index].capsterId = capsterOption.id;
                                      state.setNewCustomer({...state.newCustomer, serviceCapsterPairs: newPairs});
                                    }}
                                    className={`p-2 rounded-lg border text-left text-xs transition-all ${
                                      isSelected 
                                        ? 'border-stone-500 bg-stone-100 ring-1 ring-stone-300' 
                                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-stone-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">
                                          {capsterOption.name.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <span className="font-semibold text-stone-800">{capsterOption.name}</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Add Service Button - Only show if at least one service is complete */}
              {(() => {
                const completedServices = (state.newCustomer.serviceCapsterPairs || []).filter(pair => pair.serviceId && pair.capsterId);
                return completedServices.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-200">
                    <button
                      onClick={() => {
                        const currentPairs = state.newCustomer.serviceCapsterPairs || [];
                        const newPairs = [...currentPairs, { serviceId: '', capsterId: '' }];
                        state.setNewCustomer({...state.newCustomer, serviceCapsterPairs: newPairs});
                      }}
                      className="w-full bg-gradient-to-r from-stone-700 to-stone-800 text-white py-3 px-4 rounded-lg hover:from-stone-800 hover:to-stone-900 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      <span className="font-semibold">Tambah Layanan Lagi</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>

          {(state.newCustomer.serviceCapsterPairs || []).length > 0 && (
            <div className="bg-stone-800 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Ringkasan Layanan</h3>
              <div className="space-y-2">
                {(state.newCustomer.serviceCapsterPairs || []).map((pair, index) => {
                  const service = state.services.find(s => s.id === pair.serviceId);
                  const capster = state.capsters.find(c => c.id === pair.capsterId);
                  return service && capster ? (
                    <div key={index} className="flex justify-between">
                      <span>{service.name} <span className="text-stone-300">({capster.name})</span></span>
                      <span>Rp {service.basePrice.toLocaleString()}</span>
                    </div>
                  ) : null;
                })}
                <div className="border-t border-stone-600 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Estimasi Total</span>
                    <span>Rp {(state.newCustomer.serviceCapsterPairs || []).reduce((total, pair) => {
                      const service = state.services.find(s => s.id === pair.serviceId);
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
              onClick={() => {state.setShowAddService(false); state.setNewCustomer({ name: '', phone: '', serviceCapsterPairs: [] })}}
              className="flex-1 text-stone-600 hover:text-stone-800 px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors font-medium"
            >
              Batal
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!state.newCustomer.name || (state.newCustomer.serviceCapsterPairs || []).length === 0 || state.isSubmitting}
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
