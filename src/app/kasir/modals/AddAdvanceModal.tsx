import { useState } from 'react';

interface AddAdvanceModalProps {
  onClose: () => void;
  onSubmit: (data: { staffId: string; staffRole: string; staffName: string; amount: string; note: string }) => void;
  isSubmitting: boolean;
  capsters: any[];
  kasirList: any[];
}

export default function AddAdvanceModal({ onClose, onSubmit, isSubmitting, capsters, kasirList }: AddAdvanceModalProps) {
  const [formData, setFormData] = useState({
    staffId: '',
    staffRole: 'CAPSTER',
    staffName: '',
    amount: '',
    note: ''
  });

  const allStaff = [
    ...capsters.map(c => ({ id: c.id, name: c.name, role: 'CAPSTER' })),
    ...kasirList.map(k => ({ id: k.id, name: k.name, role: 'KASIR' }))
  ];

  const handleStaffChange = (staffId: string) => {
    const staff = allStaff.find(s => s.id === staffId);
    if (staff) {
      setFormData({ ...formData, staffId, staffRole: staff.role, staffName: staff.name });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-black">Kasbon Staff</h3>
          <p className="text-sm text-gray-500">Input kasbon untuk staff</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Staff</label>
              <select
                value={formData.staffId}
                onChange={(e) => handleStaffChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">-- Pilih Staff --</option>
                <optgroup label="Capster">
                  {capsters.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Kasir">
                  {kasirList.map(k => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nominal (Rp)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
                placeholder="50000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (Optional)</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
                placeholder="Keperluan..."
                rows={3}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Kasbon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
