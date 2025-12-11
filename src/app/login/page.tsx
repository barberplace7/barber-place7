'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Kasir {
  id: string;
  name: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedKasir, setSelectedKasir] = useState('');
  const [kasirList, setKasirList] = useState<Kasir[]>([]);
  const [showKasirSelect, setShowKasirSelect] = useState(false);
  const [branchData, setBranchData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchKasirList = async () => {
    try {
      console.log('Fetching kasir list...');
      const response = await fetch('/api/public/kasir');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Kasir data:', data);
      setKasirList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch kasir:', error);
      setKasirList([]);
    }
  };

  const handleBranchLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (response.status === 401) {
        setErrorMessage('Username atau password salah. Silakan coba lagi.');
        setShowErrorModal(true);
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        if (data.user.role === 'ADMIN') {
          window.location.href = '/admin';
        } else {
          // Branch login successful, show kasir selection
          setBranchData(data);
          setShowKasirSelect(true);
          await fetchKasirList();
        }
      } else {
        setErrorMessage(data.error || 'Login gagal. Silakan coba lagi.');
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan jaringan. Silakan coba lagi.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&h=900&fit=crop")',
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 py-8">
        <div className="w-full max-w-[85vw] sm:max-w-sm">
          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-white/20">
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold mb-2">Login</h1>
              <div className="w-16 h-1 mx-auto flex">
                <div className="flex-1 bg-blue-700"></div>
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-red-600"></div>
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-blue-700"></div>
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-red-600"></div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 sm:mt-3">Portal Akses Staf</p>
            </div>

            {!showKasirSelect ? (
              <form onSubmit={handleBranchLogin} className="space-y-3 sm:space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-2">Nama Pengguna</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama pengguna"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Kata Sandi</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan kata sandi"
                  required
                />
              </div>

              {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-black mr-2"></div>
                      <span className="text-sm sm:text-base">Masuk...</span>
                    </>
                  ) : (
                    'Masuk ke Cabang'
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-medium mb-2">Pilih Akun Kasir Anda</h3>
                  <p className="text-xs sm:text-sm text-gray-300">Cabang: {branchData?.user?.cabangName}</p>
                </div>
                
                <div>
                  <select
                    value={selectedKasir}
                    onChange={(e) => setSelectedKasir(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" className="text-black">Pilih kasir...</option>
                    {kasirList.map((kasir) => (
                      <option key={kasir.id} value={kasir.id} className="text-black">
                        {kasir.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => {setShowKasirSelect(false); setBranchData(null); setSelectedKasir('');}}
                    className="flex-1 bg-gray-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={async () => {
                      if (isStartingSession) return; // Prevent double click
                      
                      if (!selectedKasir) {
                        alert('Silakan pilih kasir');
                        return;
                      }
                      
                      setIsStartingSession(true);
                      
                      try {
                        const response = await fetch('/api/auth/kasir-select', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            kasirId: selectedKasir,
                            branchData: branchData 
                          })
                        });
                        
                        if (response.ok) {
                          window.location.href = '/kasir';
                        } else {
                          alert('Gagal memulai sesi');
                          setIsStartingSession(false);
                        }
                      } catch (error) {
                        alert('Kesalahan jaringan');
                        setIsStartingSession(false);
                      }
                    }}
                    disabled={!selectedKasir || isStartingSession}
                    className="flex-1 bg-white text-black py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                  >
                    {isStartingSession ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-black mr-2"></div>
                        <span className="text-sm sm:text-base">Memulai...</span>
                      </>
                    ) : (
                      'Mulai Sesi'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowErrorModal(false)}></div>
          <div className="relative bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Gagal</h3>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}