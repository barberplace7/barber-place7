'use client';
import { useState, useMemo } from 'react';
import { useDateFilter } from '@/hooks/useDateFilter';
import { useAdminCommission } from '@/hooks/useAdminQueries';
import { DateFilter } from '@/components/shared/DateFilter';
import StaffPayrollModal from '../components/StaffPayrollModal';

export default function CommissionTab({ adminData }: any) {
  const [capsterId, setCapsterId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  const { datePreset, dateFrom, dateTo, setDatePreset, setCustomDates } = useDateFilter('7days');
  const { data: commissionData = [], isLoading } = useAdminCommission({ dateFrom, dateTo, capsterId, branchId });

  // Pagination logic
  const paginatedCommissions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: commissionData.slice(startIndex, endIndex),
      totalPages: Math.ceil(commissionData.length / itemsPerPage),
      totalItems: commissionData.length
    };
  }, [commissionData, currentPage]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-black">Monitor Komisi</h2>
          <p className="text-gray-600 text-sm">
            Menampilkan {paginatedCommissions.data.length} dari {paginatedCommissions.totalItems} data komisi
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <DateFilter
          datePreset={datePreset}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onPresetChange={setDatePreset}
          onDateChange={setCustomDates}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staf</label>
            <select
              value={capsterId}
              onChange={(e) => setCapsterId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
            >
              <option value="">Semua Staf</option>
              <optgroup label="Capsters">
                {adminData.capsterList.map((capster: any) => (
                  <option key={capster.id} value={capster.id}>{capster.name}</option>
                ))}
              </optgroup>
              <optgroup label="Kasirs">
                {adminData.kasirList.map((kasir: any) => (
                  <option key={kasir.id} value={kasir.id}>{kasir.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cabang</label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
            >
              <option value="">Semua Cabang</option>
              {adminData.cabangList.map((cabang: any) => (
                <option key={cabang.id} value={cabang.id}>{cabang.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-bold text-black mb-4">Ringkasan Komisi</h3>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-8 bg-gray-300 rounded mb-2 mx-auto w-32"></div>
                <div className="h-4 bg-gray-200 rounded mx-auto w-28"></div>
              </div>
            ))}
          </div>
        ) : commissionData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                Rp {commissionData.reduce((sum, item) => sum + (item.serviceCommission || 0) + (item.productCommission || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Komisi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Rp {commissionData.reduce((sum, item) => sum + (item.serviceCommission || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Komisi Layanan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                Rp {commissionData.reduce((sum, item) => sum + (item.productCommission || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Komisi Produk</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">No data available</div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Memuat data komisi...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staf</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Peran</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Cabang</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Komisi</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Transaksi</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCommissions.totalItems === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 sm:px-6 py-12 text-center text-gray-500">
                    Tidak ada data komisi untuk periode yang dipilih.
                  </td>
                </tr>
              ) : (
                paginatedCommissions.data.map((item: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <div className="font-bold text-black">{item.capsterName}</div>
                      <div className="sm:hidden mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.role === 'CAPSTER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.role || 'CAPSTER'}
                        </span>
                      </div>
                      <div className="md:hidden text-xs text-gray-500 mt-1">{item.branchName}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm hidden sm:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.role === 'CAPSTER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.role || 'CAPSTER'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{item.branchName}</td>
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <div className="text-green-600 font-bold">
                        Rp {((item.serviceCommission || 0) + (item.productCommission || 0)).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Layanan: Rp {(item.serviceCommission || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Produk: Rp {(item.productCommission || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      {item.serviceCount || 0} layanan, {item.productCount || 0} produk
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedStaff(item)}
                        className="px-3 py-2 border border-green-400 text-green-600 rounded-lg hover:bg-green-50 text-xs font-medium transition-colors flex items-center gap-2 min-h-[44px] justify-center w-full"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Penggajian</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {paginatedCommissions.totalPages > 1 && (
          <div className="px-3 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700">
                Halaman {currentPage} dari {paginatedCommissions.totalPages}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginatedCommissions.totalPages))}
                  disabled={currentPage === paginatedCommissions.totalPages}
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

      {selectedStaff && (
        <StaffPayrollModal
          staff={selectedStaff}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  );
}
