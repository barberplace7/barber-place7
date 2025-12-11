'use client';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AddKasbonModal from '../components/kasbon/AddKasbonModal';

export default function KasbonTab({ adminData }: any) {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data: advances = [], isLoading } = useQuery({
    queryKey: ['admin', 'advances'],
    queryFn: async () => {
      const res = await fetch('/api/admin/advances');
      if (!res.ok) throw new Error('Failed to fetch advances');
      return res.json();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/advances?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'advances'] });
    }
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to add');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'advances'] });
      setShowAddModal(false);
    }
  });

  const totalOutstanding = advances.reduce((sum: number, adv: any) => sum + adv.remainingAmount, 0);

  // Pagination logic
  const paginatedAdvances = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: advances.slice(startIndex, endIndex),
      totalPages: Math.ceil(advances.length / itemsPerPage),
      totalItems: advances.length
    };
  }, [advances, currentPage]);

  return (
    <div>
      {showAddModal && (
        <AddKasbonModal
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => addMutation.mutate(data)}
          isSubmitting={addMutation.isPending}
          capsters={adminData.capsterList}
          kasirList={adminData.kasirList}
          cabangList={adminData.cabangList}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-black">Kasbon Management</h2>
          <p className="text-gray-600 text-sm">
            Menampilkan {paginatedAdvances.data.length} dari {paginatedAdvances.totalItems} kasbon
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 min-h-[44px] justify-center"
        >
          <span className="text-xl">+</span>
          <span className="hidden sm:inline">Tambah Kasbon</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      <div className="mb-6 p-6 bg-orange-50 rounded-lg border border-orange-200">
        <h3 className="font-bold text-black mb-2">Total Outstanding Kasbon</h3>
        <div className="text-3xl font-bold text-orange-600">
          Rp {totalOutstanding.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600 mt-1">{advances.length} kasbon aktif</div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading kasbon data...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Role</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kasbon</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Tanggal</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Catatan</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAdvances.totalItems === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 sm:px-6 py-12 text-center text-gray-500">
                    Tidak ada kasbon aktif
                  </td>
                </tr>
              ) : (
                paginatedAdvances.data.map((advance: any) => (
                  <tr key={advance.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <div className="font-bold text-black">{advance.staffName}</div>
                      <div className="sm:hidden mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          advance.staffRole === 'CAPSTER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {advance.staffRole}
                        </span>
                      </div>
                      <div className="md:hidden text-xs text-gray-500 mt-1">
                        {new Date(advance.createdAt).toLocaleDateString('id-ID')} • {advance.givenByName}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm hidden sm:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        advance.staffRole === 'CAPSTER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {advance.staffRole}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <div className="text-gray-700 font-medium">
                        Total: Rp {advance.amount.toLocaleString()}
                      </div>
                      <div className={`text-sm font-bold mt-1 ${
                        advance.remainingAmount === 0 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        Sisa: Rp {advance.remainingAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      <div>{new Date(advance.createdAt).toLocaleDateString('id-ID')}</div>
                      <div className="text-xs mt-1">{advance.givenByName}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      <div className="max-w-xs truncate">{advance.note || '-'}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <button
                        onClick={() => {
                          if (confirm(`Hapus kasbon ${advance.staffName}?`)) {
                            deleteMutation.mutate(advance.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
        {paginatedAdvances.totalPages > 1 && (
          <div className="px-3 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700">
                Halaman {currentPage} dari {paginatedAdvances.totalPages}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginatedAdvances.totalPages))}
                  disabled={currentPage === paginatedAdvances.totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
