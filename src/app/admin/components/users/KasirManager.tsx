'use client';
import { useState, useMemo } from 'react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Pagination logic
  const paginatedKasirs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: kasirList.slice(startIndex, endIndex),
      totalPages: Math.ceil(kasirList.length / itemsPerPage),
      totalItems: kasirList.length
    };
  }, [kasirList, currentPage]);
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-black">Kelola Kasir</h2>
          <p className="text-gray-600 text-sm">
            Menampilkan {paginatedKasirs.data.length} dari {paginatedKasirs.totalItems} kasir
          </p>
        </div>
        <button 
          onClick={() => setShowKasirForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 min-h-[44px] justify-center"
        >
          <span className="text-xl">+</span>
          <span className="hidden sm:inline">Tambah Kasir Baru</span>
          <span className="sm:hidden">Tambah</span>
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
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Telepon</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedKasirs.totalItems === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 sm:px-6 py-12 text-center text-gray-500">
                    Belum ada kasir. Tambahkan kasir pertama untuk memulai.
                  </td>
                </tr>
              ) : (
                paginatedKasirs.data.map((kasir) => (
                  <tr key={kasir.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <div className="font-bold text-black">{kasir.name}</div>
                      <div className="sm:hidden text-xs text-gray-500 mt-1">{kasir.phone || 'Tidak ada telepon'}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{kasir.phone || '-'}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteKasir(kasir.id)}
                        className="text-red-600 hover:text-red-900 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {paginatedKasirs.totalPages > 1 && (
          <div className="px-3 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700">
                Halaman {currentPage} dari {paginatedKasirs.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginatedKasirs.totalPages))}
                  disabled={currentPage === paginatedKasirs.totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}