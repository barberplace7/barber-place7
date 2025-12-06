'use client';

interface Capster {
  id: string;
  name: string;
  phone: string | null;
}

interface CapsterManagerProps {
  capsterList: Capster[];
  showCapsterForm: boolean;
  setShowCapsterForm: (show: boolean) => void;
  newCapster: { name: string; phone: string };
  setNewCapster: (capster: { name: string; phone: string }) => void;
  handleAddCapster: () => void;
  handleDeleteCapster: (id: string) => void;
}

export default function CapsterManager({
  capsterList,
  showCapsterForm,
  setShowCapsterForm,
  newCapster,
  setNewCapster,
  handleAddCapster,
  handleDeleteCapster
}: CapsterManagerProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-black">Manage Capster</h2>
          <p className="text-gray-600 text-sm">Add, edit, and manage your capster team</p>
        </div>
        <button 
          onClick={() => setShowCapsterForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Capster
        </button>
      </div>
      
      {showCapsterForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-bold text-black mb-4">Add New Capster</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter capster name"
                value={newCapster.name}
                onChange={(e) => setNewCapster({...newCapster, name: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={newCapster.phone}
                onChange={(e) => setNewCapster({...newCapster, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button 
              onClick={handleAddCapster}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Save Capster
            </button>
            <button 
              onClick={() => {setShowCapsterForm(false); setNewCapster({name: '', phone: ''})}}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {capsterList.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  No capsters yet. Add your first capster to get started.
                </td>
              </tr>
            ) : (
              capsterList.map((capster) => (
                <tr key={capster.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{capster.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{capster.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleDeleteCapster(capster.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}