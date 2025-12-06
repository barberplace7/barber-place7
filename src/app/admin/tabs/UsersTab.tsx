'use client';
import { useState } from 'react';
import CapsterManager from '../components/users/CapsterManager';
import KasirManager from '../components/users/KasirManager';

export default function UsersTab({ activeTab, adminData }: any) {
  const [showCapsterForm, setShowCapsterForm] = useState(false);
  const [showKasirForm, setShowKasirForm] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [newCapster, setNewCapster] = useState({ name: '', phone: '' });
  const [newKasir, setNewKasir] = useState({ name: '', phone: '' });
  const [newBranch, setNewBranch] = useState({ cabangId: '', username: '', password: '' });

  if (activeTab === 'capster') {
    return (
      <CapsterManager
        capsterList={adminData.capsterList}
        showCapsterForm={showCapsterForm}
        setShowCapsterForm={setShowCapsterForm}
        newCapster={newCapster}
        setNewCapster={setNewCapster}
        handleAddCapster={() => console.log('API disabled')}
        handleDeleteCapster={() => console.log('API disabled')}
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
        handleAddKasir={() => console.log('API disabled')}
        handleDeleteKasir={() => console.log('API disabled')}
      />
    );
  }

  if (activeTab === 'branches') {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Branch Login Accounts</h2>
          <button
            onClick={() => setShowBranchForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add Branch Login
          </button>
        </div>

        {showBranchForm && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-black">Create Branch Login Account</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Branch</label>
                <select
                  value={newBranch.cabangId}
                  onChange={(e) => setNewBranch({ ...newBranch, cabangId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="">-- Select Branch --</option>
                  {adminData.cabangList.map((cabang: any) => (
                    <option key={cabang.id} value={cabang.id}>{cabang.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={newBranch.username}
                  onChange={(e) => setNewBranch({ ...newBranch, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newBranch.password}
                  onChange={(e) => setNewBranch({ ...newBranch, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Enter password"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => console.log('API disabled')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Account
                </button>
                <button
                  onClick={() => {
                    setShowBranchForm(false);
                    setNewBranch({ cabangId: '', username: '', password: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Login Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminData.branchList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No login accounts yet.
                  </td>
                </tr>
              ) : (
                adminData.branchList.map((branch: any) => (
                  <tr key={branch.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{branch.branchName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(branch.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return <div>Tab not found</div>;
}
