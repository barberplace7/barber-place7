'use client';
import { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CapsterManager from '../components/users/CapsterManager';
import KasirManager from '../components/users/KasirManager';

export default function UsersTab({ activeTab, adminData }: any) {
  const queryClient = useQueryClient();
  const [showCapsterForm, setShowCapsterForm] = useState(false);
  const [showKasirForm, setShowKasirForm] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [newCapster, setNewCapster] = useState({ name: '', phone: '' });
  const [newKasir, setNewKasir] = useState({ name: '', phone: '' });
  const [newBranch, setNewBranch] = useState({ cabangId: '', username: '', password: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, type: 'capster'|'kasir'|'branch', id: string, name: string}>({show: false, type: 'capster', id: '', name: ''});
  const [branchPage, setBranchPage] = useState(1);
  const itemsPerPage = 15;

  // Pagination logic for branches
  const paginatedBranches = useMemo(() => {
    const branches = adminData.branchList || [];
    const startIndex = (branchPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: branches.slice(startIndex, endIndex),
      totalPages: Math.ceil(branches.length / itemsPerPage),
      totalItems: branches.length
    };
  }, [adminData.branchList, branchPage]);

  const addCapsterMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/capster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'capster'] });
      setShowCapsterForm(false);
      setNewCapster({ name: '', phone: '' });
    }
  });

  const deleteCapsterMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/capster?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'capster'] });
    }
  });

  const addKasirMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/kasir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'kasir'] });
      setShowKasirForm(false);
      setNewKasir({ name: '', phone: '' });
    }
  });

  const deleteKasirMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/kasir?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'kasir'] });
    }
  });

  const addBranchMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/branch-logins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'branch-logins'] });
      setShowBranchForm(false);
      setNewBranch({ cabangId: '', username: '', password: '' });
    }
  });

  const deleteBranchMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/branch-logins?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'branch-logins'] });
    }
  });

  if (activeTab === 'capster') {
    return (
      <>
        <CapsterManager
          capsterList={adminData.capsterList}
          showCapsterForm={showCapsterForm}
          setShowCapsterForm={setShowCapsterForm}
          newCapster={newCapster}
          setNewCapster={setNewCapster}
          handleAddCapster={() => addCapsterMutation.mutate(newCapster)}
          handleDeleteCapster={(id) => {
            const capster = adminData.capsterList.find((c: any) => c.id === id);
            setDeleteConfirm({show: true, type: 'capster', id, name: capster?.name || 'capster'});
          }}
        />
        
        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm({show: false, type: 'capster', id: '', name: ''})}></div>
            <div className="relative bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Capster</h3>
                <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus "{deleteConfirm.name}"? Tindakan ini tidak dapat dibatalkan.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm({show: false, type: 'capster', id: '', name: ''})}
                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      deleteCapsterMutation.mutate(deleteConfirm.id);
                      setDeleteConfirm({show: false, type: 'capster', id: '', name: ''});
                    }}
                    className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (activeTab === 'kasir') {
    return (
      <>
        <KasirManager
          kasirList={adminData.kasirList}
          showKasirForm={showKasirForm}
          setShowKasirForm={setShowKasirForm}
          newKasir={newKasir}
          setNewKasir={setNewKasir}
          handleAddKasir={() => addKasirMutation.mutate(newKasir)}
          handleDeleteKasir={(id) => {
            const kasir = adminData.kasirList.find((k: any) => k.id === id);
            setDeleteConfirm({show: true, type: 'kasir', id, name: kasir?.name || 'kasir'});
          }}
        />
        
        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm({show: false, type: 'kasir', id: '', name: ''})}></div>
            <div className="relative bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Kasir</h3>
                <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus "{deleteConfirm.name}"? Tindakan ini tidak dapat dibatalkan.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm({show: false, type: 'kasir', id: '', name: ''})}
                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      deleteKasirMutation.mutate(deleteConfirm.id);
                      setDeleteConfirm({show: false, type: 'kasir', id: '', name: ''});
                    }}
                    className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (activeTab === 'branches') {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-black">Akun Login Cabang</h2>
            <p className="text-sm text-gray-600 mt-1">
              Menampilkan {paginatedBranches.data.length} dari {paginatedBranches.totalItems} akun
            </p>
          </div>
          <button
            onClick={() => setShowBranchForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 min-h-[44px] justify-center"
          >
            <span className="text-xl">+</span>
            <span className="hidden sm:inline">Tambah Login Cabang</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>

        {showBranchForm && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-black">Buat Akun Login Cabang</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Cabang</label>
                <select
                  value={newBranch.cabangId}
                  onChange={(e) => setNewBranch({ ...newBranch, cabangId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="">-- Pilih Cabang --</option>
                  {adminData.cabangList.map((cabang: any) => (
                    <option key={cabang.id} value={cabang.id}>{cabang.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengguna</label>
                <input
                  type="text"
                  value={newBranch.username}
                  onChange={(e) => setNewBranch({ ...newBranch, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Masukkan nama pengguna"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
                <input
                  type="password"
                  value={newBranch.password}
                  onChange={(e) => setNewBranch({ ...newBranch, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Masukkan kata sandi"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addBranchMutation.mutate(newBranch)}
                  disabled={!newBranch.cabangId || !newBranch.username || !newBranch.password || addBranchMutation.isPending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {addBranchMutation.isPending ? 'Membuat...' : 'Buat Akun'}
                </button>
                <button
                  onClick={() => {
                    setShowBranchForm(false);
                    setNewBranch({ cabangId: '', username: '', password: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cabang</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Username</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Dibuat</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBranches.totalItems === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 sm:px-6 py-12 text-center text-gray-500">
                      Belum ada akun login.
                    </td>
                  </tr>
                ) : (
                  paginatedBranches.data.map((branch: any) => (
                    <tr key={branch.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 text-sm">
                        <div className="font-bold text-black">{branch.branchName}</div>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">
                          {branch.username} • {new Date(branch.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{branch.username}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{new Date(branch.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setDeleteConfirm({show: true, type: 'branch', id: branch.id, name: branch.branchName})}
                          disabled={deleteBranchMutation.isPending}
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
          {paginatedBranches.totalPages > 1 && (
            <div className="px-3 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-700">
                  Halaman {branchPage} dari {paginatedBranches.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBranchPage(prev => Math.max(prev - 1, 1))}
                    disabled={branchPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setBranchPage(prev => Math.min(prev + 1, paginatedBranches.totalPages))}
                    disabled={branchPage === paginatedBranches.totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm({show: false, type: 'branch', id: '', name: ''})}></div>
            <div className="relative bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Login Cabang</h3>
                <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus login cabang "{deleteConfirm.name}"? Tindakan ini tidak dapat dibatalkan.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm({show: false, type: 'branch', id: '', name: ''})}
                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      deleteBranchMutation.mutate(deleteConfirm.id);
                      setDeleteConfirm({show: false, type: 'branch', id: '', name: ''});
                    }}
                    className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div>Tab tidak ditemukan</div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm({show: false, type: 'capster', id: '', name: ''})}></div>
          <div className="relative bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus {deleteConfirm.type === 'capster' ? 'Capster' : deleteConfirm.type === 'kasir' ? 'Kasir' : 'Login Cabang'}</h3>
              <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus "{deleteConfirm.name}"? Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm({show: false, type: 'capster', id: '', name: ''})}
                  className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm.type === 'capster') {
                      deleteCapsterMutation.mutate(deleteConfirm.id);
                    } else if (deleteConfirm.type === 'kasir') {
                      deleteKasirMutation.mutate(deleteConfirm.id);
                    } else {
                      deleteBranchMutation.mutate(deleteConfirm.id);
                    }
                    setDeleteConfirm({show: false, type: 'capster', id: '', name: ''});
                  }}
                  className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
