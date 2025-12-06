'use client';
import { useState } from 'react';
import { useDateFilter } from '@/hooks/useDateFilter';
import { useAdminCommission } from '@/hooks/useAdminQueries';
import { DateFilter } from '@/components/shared/DateFilter';
import StaffPayrollModal from '../components/StaffPayrollModal';

export default function CommissionTab({ adminData }: any) {
  const [capsterId, setCapsterId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  
  const { datePreset, dateFrom, dateTo, setDatePreset, setCustomDates } = useDateFilter('7days');
  const { data: commissionData = [], isLoading } = useAdminCommission({ dateFrom, dateTo, capsterId, branchId });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-black">Commission Monitor</h2>
          <p className="text-gray-600 text-sm">Track capster commissions and performance</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff</label>
            <select
              value={capsterId}
              onChange={(e) => setCapsterId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
            >
              <option value="">All Staff</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none bg-white text-black"
            >
              <option value="">All Branches</option>
              {adminData.cabangList.map((cabang: any) => (
                <option key={cabang.id} value={cabang.id}>{cabang.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-bold text-black mb-4">Commission Summary</h3>
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
              <div className="text-sm text-gray-600">Total Commission</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Rp {commissionData.reduce((sum, item) => sum + (item.serviceCommission || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Service Commission</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                Rp {commissionData.reduce((sum, item) => sum + (item.productCommission || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Product Commission</div>
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
            <p className="text-gray-600 font-medium">Loading commission data...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commissionData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No commission data found for the selected period.
                </td>
              </tr>
            ) : (
              commissionData.map((item: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{item.capsterName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.role === 'CAPSTER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.role || 'CAPSTER'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.branchName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    Rp {(item.serviceCommission || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                    Rp {(item.productCommission || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                    Rp {((item.serviceCommission || 0) + (item.productCommission || 0)).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.serviceCount || 0} services, {item.productCount || 0} products
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedStaff(item)}
                      className="px-3 py-1.5 border-2 border-green-400 text-green-600 rounded-lg hover:bg-green-50 text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Payroll
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
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
