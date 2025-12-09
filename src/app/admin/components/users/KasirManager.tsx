'use client';

interface Kasir {
  id: string;
  name: string;
  phone: string | null;
}

interface KasirManagerProps {
  kasirList: Kasir[];
  showKasirForm: boolean;
  setShowKasirForm: (show: boolean) => void;
  newKasir: { name: string; phone: string };
  setNewKasir: (kasir: { name: string; phone: string }) => void;
  handleAddKasir: () => void;
  handleDeleteKasir: (id: string) => void;
}

export default function KasirManager({
  kasirList,
  showKasirForm,
  setShowKasirForm,
  newKasir,
  setNewKasir,
  handleAddKasir,
  handleDeleteKasir
}: KasirManagerProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-black">Kelola Kasir</h2>
        <button 
          onClick={() => setShowKasirForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Tambah Kasir Baru
        </button>
      </div>
      
      {showKasirForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-bold text-black mb-4">Tambah Kasir Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama kasir"
                value={newKasir.name}
                onChange={(e) => setNewKasir({...newKasir, name: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-green-500 focus:outline-none bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Nomor Telepon</label>
              <input
                type="text"
                placeholder="Masukkan nomor telepon"
                value={newKasir.phone}
                onChange={(e) => setNewKasir({...newKasir, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-green-500 focus:outline-none bg-white text-black"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button 
              onClick={handleAddKasir}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Simpan Kasir
            </button>
            <button 
              onClick={() => {setShowKasirForm(false); setNewKasir({name: '', phone: ''})}}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {kasirList.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  Belum ada kasir. Tambahkan kasir pertama untuk memulai.
                </td>
              </tr>
            ) : (
              kasirList.map((kasir) => (
                <tr key={kasir.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{kasir.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kasir.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleDeleteKasir(kasir.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
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