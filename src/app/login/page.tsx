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
        alert('Login failed: ' + data.error);
      }
    } catch (error) {
      alert('Login error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 bg-white z-50" style={{height: '1.3rem'}}>
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex" style={{width: 'min(21rem, 90vw)'}}>
          <div className="w-8 sm:w-10 md:w-12 bg-red-600"></div>
          <div className="w-8 sm:w-10 md:w-12 bg-white"></div>
          <div className="w-8 sm:w-10 md:w-12 bg-blue-700"></div>
          <div className="w-8 sm:w-10 md:w-12 bg-white"></div>
          <div className="w-8 sm:w-10 md:w-12 bg-red-600"></div>
          <div className="w-8 sm:w-10 md:w-12 bg-white"></div>
          <div className="w-8 sm:w-10 md:w-12 bg-blue-700"></div>
        </div>
      </div>
      
      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 bg-white z-50" style={{height: '1.3rem'}}></div>
      
      {/* Left Border */}
      <div className="absolute left-0 top-0 bottom-0 bg-white z-50" style={{width: '1.3rem'}}>
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex flex-col" style={{height: 'min(21rem, 70vh)'}}>
          <div className="h-8 sm:h-10 md:h-12 bg-red-600"></div>
          <div className="h-8 sm:h-10 md:h-12 bg-white"></div>
          <div className="h-8 sm:h-10 md:h-12 bg-blue-700"></div>
          <div className="h-8 sm:h-10 md:h-12 bg-white"></div>
          <div className="h-8 sm:h-10 md:h-12 bg-red-600"></div>
          <div className="h-8 sm:h-10 md:h-12 bg-white"></div>
          <div className="h-8 sm:h-10 md:h-12 bg-blue-700"></div>
        </div>
      </div>
      
      {/* Right Border */}
      <div className="absolute right-0 top-0 bottom-0 bg-white z-50" style={{width: '1.3rem'}}>
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex flex-col" style={{height: 'min(21rem, 70vh)'}}>
          <div className="h-8 sm:h-10 md:h-12 bg-red-600"></div>
          <div className="h-8 sm:h-10 md:h-12 bg-white"></div>
          <div className="h-8 sm:h-10 md:h-12 bg-blue-700"></div>
          <div className="h-8 sm:h-10 md:h-12 bg-white"></div>
          <div className="h-8 sm:h-10 md:h-12 bg-red-600"></div>
          <div className="h-8 sm:h-10 md:h-12 bg-white"></div>
          <div className="h-8 sm:h-10 md:h-12 bg-blue-700"></div>
        </div>
      </div>

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
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Login</h1>
              <div className="w-16 h-1 mx-auto flex">
                <div className="flex-1 bg-blue-700"></div>
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-red-600"></div>
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-blue-700"></div>
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-red-600"></div>
              </div>
              <p className="text-gray-300 mt-4">Staff Access Portal</p>
            </div>

            {!showKasirSelect ? (
              <form onSubmit={handleBranchLogin} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Logging in...
                    </>
                  ) : (
                    'Login to Branch'
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Pilih Akun Kasir Anda</h3>
                  <p className="text-sm text-gray-300">Cabang: {branchData?.user?.cabangName}</p>
                </div>
                
                <div>
                  <select
                    value={selectedKasir}
                    onChange={(e) => setSelectedKasir(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" className="text-black">Select a kasir...</option>
                    {kasirList.map((kasir) => (
                      <option key={kasir.id} value={kasir.id} className="text-black">
                        {kasir.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {setShowKasirSelect(false); setBranchData(null); setSelectedKasir('');}}
                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={async () => {
                      if (!selectedKasir) {
                        alert('Please select a kasir');
                        return;
                      }
                      
                      setIsStartingSession(true);
                      
                      // Update session with selected kasir
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
                          alert('Failed to start session');
                        }
                      } catch (error) {
                        alert('Network error');
                      } finally {
                        setIsStartingSession(false);
                      }
                    }}
                    disabled={!selectedKasir || isStartingSession}
                    className="flex-1 bg-white text-black py-3 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                  >
                    {isStartingSession ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                        Starting...
                      </>
                    ) : (
                      'Start Session'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}