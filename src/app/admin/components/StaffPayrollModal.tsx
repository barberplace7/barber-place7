'use client';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';

interface StaffPayrollModalProps {
  staff: any;
  dateFrom: string;
  dateTo: string;
  onClose: () => void;
}

export default function StaffPayrollModal({ staff, dateFrom, dateTo, onClose }: StaffPayrollModalProps) {
  if (!staff) return null;

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['staff-transactions', staff.capsterId || staff.staffId, dateFrom, dateTo],
    queryFn: () => adminApi.getStaffTransactionDetails({ capsterId: staff.capsterId || staff.staffId, dateFrom, dateTo }),
    enabled: !!(staff.capsterId || staff.staffId),
  });

  const totalCommission = (staff.serviceCommission || 0) + (staff.productCommission || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 print:hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-black">Staff Payroll Details</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="px-6 py-6 print:p-8" id="payroll-content">
          {/* Header */}
          <div className="text-center mb-6 pb-4 border-b-2 border-black">
            <h1 className="text-3xl font-bold text-black mb-3">BARBER PLACE</h1>
            <div className="mt-4">
              <p className="text-lg font-bold text-black">SALARY SLIP</p>
              <p className="text-sm text-gray-600 mt-1">
                Period: {new Date(dateFrom).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} - {new Date(dateTo).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Staff Info */}
          <div className="mb-6 border border-gray-300 rounded-lg">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <p className="font-bold text-black text-sm">EMPLOYEE INFORMATION</p>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 w-1/3">Employee Name</td>
                    <td className="py-2 font-bold text-black">: {staff.capsterName}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600">Position</td>
                    <td className="py-2 font-medium text-black">: {staff.role || 'CAPSTER'}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600">Branch</td>
                    <td className="py-2 font-medium text-black">: {staff.branchName}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Payment Date</td>
                    <td className="py-2 font-medium text-black">: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="mb-6 border border-gray-300 rounded-lg">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <p className="font-bold text-black text-sm">TRANSACTION DETAILS</p>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No transactions found</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr className="border-b border-gray-300">
                      <th className="py-3 px-4 text-left text-gray-600 font-semibold">Type</th>
                      <th className="py-3 px-4 text-left text-gray-600 font-semibold">Item Name</th>
                      <th className="py-3 px-4 text-center text-gray-600 font-semibold">Transactions</th>
                      <th className="py-3 px-4 text-right text-gray-600 font-semibold">Total Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.type === 'SERVICE' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 font-medium">{item.itemName}</td>
                        <td className="py-3 px-4 text-center text-gray-700">{item.count}x</td>
                        <td className="py-3 px-4 text-right font-bold text-green-600">Rp {item.totalCommission.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Commission Summary */}
          <div className="mb-6 border border-gray-300 rounded-lg">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <p className="font-bold text-black text-sm">EARNINGS SUMMARY</p>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-700">Service Commission</td>
                    <td className="py-3 text-gray-500 text-xs">({staff.serviceCount || 0} transactions)</td>
                    <td className="py-3 text-right font-bold text-black">Rp {(staff.serviceCommission || 0).toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-700">Product Commission</td>
                    <td className="py-3 text-gray-500 text-xs">({staff.productCount || 0} transactions)</td>
                    <td className="py-3 text-right font-bold text-black">Rp {(staff.productCommission || 0).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="mb-8 border-2 border-black rounded-lg bg-gray-50">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-black">TOTAL NET SALARY</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {(staff.serviceCount || 0) + (staff.productCount || 0)} total transactions
                  </p>
                </div>
                <p className="text-3xl font-bold text-black">
                  Rp {totalCommission.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
            <p className="font-medium">This is an official salary slip from Barber Place</p>
            <p className="mt-1">Generated on {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p className="mt-2 text-xs">For inquiries, please contact HR Department</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save as PDF
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #payroll-content, #payroll-content * {
            visibility: visible;
          }
          #payroll-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-8 {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
