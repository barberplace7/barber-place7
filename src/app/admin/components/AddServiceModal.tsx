import { useState } from 'react';

interface AddServiceModalProps {
  onClose: () => void;
  onSubmit: (data: { name: string; category: string; basePrice: number; commissionAmount: number }) => void;
  isSubmitting: boolean;
}

export default function AddServiceModal({ onClose, onSubmit, isSubmitting }: AddServiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'HAIRCUT',
    basePrice: '',
    commissionAmount: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      category: formData.category,
      basePrice: parseInt(formData.basePrice),
      commissionAmount: parseInt(formData.commissionAmount)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-black">Add New Service</h3>
          <p className="text-sm text-gray-500">Create a new service package</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Premium Haircut"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
              >
                <option value="HAIRCUT">Hair Cut</option>
                <option value="TREATMENT">Treatment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (Rp)</label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
                placeholder="50000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commission Amount (Rp)</label>
              <input
                type="number"
                value={formData.commissionAmount}
                onChange={(e) => setFormData({ ...formData, commissionAmount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
                placeholder="5000"
                required
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
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? 'Adding...' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
