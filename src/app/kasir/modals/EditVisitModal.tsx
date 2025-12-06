'use client';

export default function EditVisitModal({ state, onClose }: any) {
  const handleSubmit = async () => {
    if (!state.editingVisit || state.isSubmitting) return;
    
    state.setConfirmModal({
      show: true,
      title: 'Update Services',
      message: `Update services for ${state.editingVisit?.customerName}?`,
      onConfirm: async () => {
        state.setConfirmModal(null);
        state.setIsSubmitting(true);
        try {
          await state.mutations.editVisit.mutateAsync({
            visitId: state.editingVisit.id,
            services: state.editServices
          });
          state.setEditingVisit(null);
          state.setEditServices([]);
          onClose();
          state.showToast('Layanan berhasil diupdate!', 'success');
        } catch (error: any) {
          state.showToast(error?.message || 'Gagal mengupdate layanan', 'error');
        } finally {
          state.setIsSubmitting(false);
        }
      }
    });
  };

  const hairCutServices = state.services.filter((s: any) => s.category === 'HAIRCUT');
  const treatmentServices = state.services.filter((s: any) => s.category === 'TREATMENT');

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-800">Edit Services - {state.editingVisit?.customerName}</h2>
              <p className="text-stone-500 text-sm">Modify services for ongoing visit</p>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl w-8 h-8 flex items-center justify-center">×</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-stone-800 mb-4">Edit Services</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-stone-700">Haircut Package <span className="text-stone-500">(Optional)</span></label>
                  {state.editServices.some((id: string) => {
                    const service = state.services.find((s: any) => s.id === id);
                    return service?.category === 'HAIRCUT';
                  }) && (
                    <button
                      type="button"
                      onClick={() => {
                        const nonHaircutServices = state.editServices.filter((id: string) => {
                          const service = state.services.find((s: any) => s.id === id);
                          return service?.category !== 'HAIRCUT';
                        });
                        state.setEditServices(nonHaircutServices);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >Clear Haircut</button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hairCutServices.map((service: any) => (
                    <label key={service.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${state.editServices.includes(service.id) ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'}`}>
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="editHaircut"
                          checked={state.editServices.includes(service.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const nonHaircutServices = state.editServices.filter((id: string) => {
                                const existingService = state.services.find((s: any) => s.id === id);
                                return existingService?.category !== 'HAIRCUT';
                              });
                              state.setEditServices([...nonHaircutServices, service.id]);
                            } else {
                              state.setEditServices(state.editServices.filter((id: string) => id !== service.id));
                            }
                          }}
                          className="text-stone-800"
                        />
                        <div>
                          <div className="font-medium text-stone-800">{service.name}</div>
                          <div className="text-sm text-stone-500">Professional haircut service</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-stone-800">Rp {service.basePrice.toLocaleString()}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Additional Treatments <span className="text-stone-500">(Optional)</span></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {treatmentServices.map((service: any) => (
                    <label key={service.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${state.editServices.includes(service.id) ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-200' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'}`}>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={state.editServices.includes(service.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              state.setEditServices([...state.editServices, service.id]);
                            } else {
                              state.setEditServices(state.editServices.filter((id: string) => id !== service.id));
                            }
                          }}
                          className="rounded border-stone-300 text-stone-800"
                        />
                        <div>
                          <div className="font-medium text-stone-800">{service.name}</div>
                          <div className="text-sm text-stone-500">Premium treatment</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-stone-800">+Rp {service.basePrice.toLocaleString()}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {state.editServices.length > 0 && (
            <div className="bg-stone-800 rounded-xl p-4 text-white">
              <h4 className="font-medium mb-2">Updated Services</h4>
              <div className="space-y-1">
                {state.editServices.map((serviceId: string) => {
                  const service = state.services.find((s: any) => s.id === serviceId);
                  return service ? (
                    <div key={serviceId} className="flex justify-between text-sm">
                      <span>{service.name}</span>
                      <span>Rp {service.basePrice.toLocaleString()}</span>
                    </div>
                  ) : null;
                })}
                <div className="border-t border-stone-600 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>Rp {state.editServices.reduce((total: number, serviceId: string) => {
                      const service = state.services.find((s: any) => s.id === serviceId);
                      return total + (service?.basePrice || 0);
                    }, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-stone-200 px-6 py-4 rounded-b-2xl">
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 text-stone-600 hover:text-stone-800 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={state.editServices.length === 0 || state.isSubmitting} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {state.isSubmitting && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
              {state.isSubmitting ? 'Updating...' : 'Update Services'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
