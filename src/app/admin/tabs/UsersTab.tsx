'use client';
import { useState } from 'react';
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
      <CapsterManager
        capsterList={adminData.capsterList}
        showCapsterForm={showCapsterForm}
        setShowCapsterForm={setShowCapsterForm}
        newCapster={newCapster}
        setNewCapster={setNewCapster}
        handleAddCapster={() => addCapsterMutation.mutate(newCapster)}
        handleDeleteCapster={(id) => {
          if (confirm('Hapus capster?')) deleteCapsterMutation.mutate(id);
        }}
      />
    );
  }

  if (activeTab === 'kasir') {
    return (
      <KasirManager
        kasirList={adminData.kasirList}
        showKasirForm={showKasirForm}
        setShowKasirForm={setShowKasirForm}
        newKasir={newKasir}
        setNewKasir={setNewKasir}
        handleAddKasir={() => addKasirMutation.mutate(newKasir)}
        handleDeleteKasir={(id) => {
          if (confirm('Hapus kasir?')) deleteKasirMutation.mutate(id);
        }}
      />
    );
  }

  if (activeTab === 'branches') {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Akun Login Cabang</h2>
          <button
            onClick={() => setShowBranchForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Tambah Login Cabang
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

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cabang</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Pengguna</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dibuat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminData.branchList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Belum ada akun login.
                  </td>
                </tr>
              ) : (
                adminData.branchList.map((branch: any) => (
                  <tr key={branch.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{branch.branchName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(branch.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          if (confirm('Hapus login cabang?')) deleteBranchMutation.mutate(branch.id);
                        }}
                        disabled={deleteBranchMutation.isPending}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
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
      </div>
    );
  }

  return <div>Tab tidak ditemukan</div>;
}
