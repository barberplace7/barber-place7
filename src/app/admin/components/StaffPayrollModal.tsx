'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';

interface StaffPayrollModalProps {
  staff: any;
  dateFrom: string;
  dateTo: string;
  onClose: () => void;
}

export default function StaffPayrollModal({ staff, dateFrom, dateTo, onClose }: StaffPayrollModalProps) {
  const queryClient = useQueryClient();
  const [deductKasbon, setDeductKasbon] = useState(false);
  const [deductAmount, setDeductAmount] = useState('');
  const [deductedKasbon, setDeductedKasbon] = useState<any>(null);
  
  if (!staff) return null;

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['staff-transactions', staff.capsterId || staff.staffId, dateFrom, dateTo],
    queryFn: () => adminApi.getStaffTransactionDetails({ capsterId: staff.capsterId || staff.staffId, dateFrom, dateTo }),
    enabled: !!(staff.capsterId || staff.staffId),
  });

  const { data: advances = [] } = useQuery({
    queryKey: ['staff-advances', staff.capsterId || staff.staffId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/advances?staffId=${staff.capsterId || staff.staffId}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!(staff.capsterId || staff.staffId),
  });

  // Fetch deductions dalam periode payroll
  const { data: deductions = [] } = useQuery({
    queryKey: ['staff-deductions', staff.capsterId || staff.staffId, dateFrom, dateTo],
    queryFn: async () => {
      const res = await fetch(`/api/admin/deductions?staffId=${staff.capsterId || staff.staffId}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!(staff.capsterId || staff.staffId),
  });

  const deductMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/advances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to deduct');
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['staff-advances'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'advances'] });
      queryClient.invalidateQueries({ queryKey: ['staff-deductions'] });
      setDeductedKasbon({
        amount: variables.amount,
        date: new Date().toISOString()
      });
      setDeductKasbon(false);
      setDeductAmount('');
    }
  });

  const totalCommission = (staff.serviceCommission || 0) + (staff.productCommission || 0);
  const totalKasbon = advances.reduce((sum: number, adv: any) => sum + adv.remainingAmount, 0);
  const maxDeduct = Math.min(totalCommission, totalKasbon);
  
  // Hitung total deduction dari database atau state baru
  const totalDeductionsFromDB = deductions.reduce((sum: number, ded: any) => sum + ded.amount, 0);
  const kasbonDeduction = deductedKasbon ? deductedKasbon.amount : totalDeductionsFromDB;
  const netSalary = totalCommission - kasbonDeduction;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 print:hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-black">Detail Penggajian Staf</h3>
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
            <img src="/logo_barberplace.png" alt="Barber Place" className="h-20 mx-auto mb-3" />
            <div className="mt-4">
              <p className="text-lg font-bold text-black">SLIP GAJI</p>
              <p className="text-sm text-gray-600 mt-1">
                Periode: {new Date(dateFrom).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} - {new Date(dateTo).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Staff Info */}
          <div className="mb-6 border border-gray-300 rounded-lg">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <p className="font-bold text-black text-sm">INFORMASI KARYAWAN</p>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 w-1/3">Nama Karyawan</td>
                    <td className="py-2 font-bold text-black">: {staff.capsterName}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600">Posisi</td>
                    <td className="py-2 font-medium text-black">: {staff.role || 'CAPSTER'}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600">Cabang</td>
                    <td className="py-2 font-medium text-black">: {staff.branchName}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Tanggal Pembayaran</td>
                    <td className="py-2 font-medium text-black">: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="mb-6">
            <div className="bg-gray-100 px-4 py-2 border border-gray-300 rounded-t-lg">
              <p className="font-bold text-black text-sm">DETAIL TRANSAKSI</p>
            </div>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500 border border-t-0 border-gray-300 rounded-b-lg">Memuat transaksi...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border border-t-0 border-gray-300 rounded-b-lg">Tidak ada transaksi ditemukan</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-t-0 border-gray-300 rounded-b-lg">
                {/* Services Section */}
                <div className="border border-gray-300 rounded-lg">
                  <div className="bg-blue-50 px-3 py-2 border-b border-gray-300">
                    <p className="font-bold text-blue-700 text-xs">LAYANAN</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr className="border-b border-gray-200">
                          <th className="py-2 px-2 text-left text-gray-600 font-semibold">Nama Layanan</th>
                          <th className="py-2 px-2 text-center text-gray-600 font-semibold">Jml</th>
                          <th className="py-2 px-2 text-right text-gray-600 font-semibold">Komisi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.filter((item: any) => item.type === 'SERVICE').length === 0 ? (
                          <tr>
                            <td colSpan={3} className="py-4 text-center text-gray-400 text-xs">Tidak ada transaksi layanan</td>
                          </tr>
                        ) : (
                          transactions.filter((item: any) => item.type === 'SERVICE').map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-2 text-gray-700">{item.itemName}</td>
                              <td className="py-2 px-2 text-center text-gray-700">{item.count}x</td>
                              <td className="py-2 px-2 text-right font-bold text-blue-600">Rp {item.totalCommission.toLocaleString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Products Section */}
                <div className="border border-gray-300 rounded-lg">
                  <div className="bg-orange-50 px-3 py-2 border-b border-gray-300">
                    <p className="font-bold text-orange-700 text-xs">PRODUK</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr className="border-b border-gray-200">
                          <th className="py-2 px-2 text-left text-gray-600 font-semibold">Nama Produk</th>
                          <th className="py-2 px-2 text-center text-gray-600 font-semibold">Jml</th>
                          <th className="py-2 px-2 text-right text-gray-600 font-semibold">Komisi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.filter((item: any) => item.type === 'PRODUCT').length === 0 ? (
                          <tr>
                            <td colSpan={3} className="py-4 text-center text-gray-400 text-xs">Tidak ada transaksi produk</td>
                          </tr>
                        ) : (
                          transactions.filter((item: any) => item.type === 'PRODUCT').map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-2 text-gray-700">{item.itemName}</td>
                              <td className="py-2 px-2 text-center text-gray-700">{item.count}x</td>
                              <td className="py-2 px-2 text-right font-bold text-orange-600">Rp {item.totalCommission.toLocaleString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Commission Summary */}
          <div className="mb-6 border border-gray-300 rounded-lg">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <p className="font-bold text-black text-sm">RINGKASAN PENDAPATAN</p>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-700">Komisi Layanan</td>
                    <td className="py-3 text-gray-500 text-xs">({staff.serviceCount || 0} transaksi)</td>
                    <td className="py-3 text-right font-bold text-black">Rp {(staff.serviceCommission || 0).toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-700">Komisi Produk</td>
                    <td className="py-3 text-gray-500 text-xs">({staff.productCount || 0} transaksi)</td>
                    <td className="py-3 text-right font-bold text-black">Rp {(staff.productCommission || 0).toLocaleString()}</td>
                  </tr>
                  <tr className="border-b-2 border-gray-300">
                    <td className="py-3 text-gray-700 font-bold" colSpan={2}>Gaji Kotor</td>
                    <td className="py-3 text-right font-bold text-black">Rp {totalCommission.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Deductions Section */}
          {kasbonDeduction > 0 && (
            <div className="mb-6 border-2 border-red-300 rounded-lg bg-red-50">
              <div className="bg-red-100 px-4 py-2 border-b border-red-300">
                <p className="font-bold text-red-800 text-sm">POTONGAN</p>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    {deductedKasbon ? (
                      <tr>
                        <td className="py-2 text-gray-700">Kasbon Advance Deduction</td>
                        <td className="py-2 text-gray-500 text-xs">Dipotong: {new Date(deductedKasbon.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="py-2 text-right font-bold text-red-600">- Rp {deductedKasbon.amount.toLocaleString()}</td>
                      </tr>
                    ) : (
                      deductions.map((ded: any, idx: number) => (
                        <tr key={idx} className={idx > 0 ? 'border-t border-red-200' : ''}>
                          <td className="py-2 text-gray-700">Potongan Kasbon</td>
                          <td className="py-2 text-gray-500 text-xs">Dipotong: {new Date(ded.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td className="py-2 text-right font-bold text-red-600">- Rp {ded.amount.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                    {deductions.length > 1 && !deductedKasbon && (
                      <tr className="border-t-2 border-red-400">
                        <td className="py-2 text-gray-700 font-bold" colSpan={2}>Total Potongan</td>
                        <td className="py-2 text-right font-bold text-red-600">- Rp {kasbonDeduction.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Kasbon Section - Only show in print if there's remaining kasbon */}
          {totalKasbon > 0 && (
            <div className="mb-6 border-2 border-orange-300 rounded-lg bg-orange-50">
              <div className="bg-orange-100 px-4 py-2 border-b border-orange-300">
                <p className="font-bold text-orange-800 text-sm">⚠️ SISA KASBON</p>
              </div>
              <div className="p-4">
                {/* Always show remaining kasbon amount */}
                <div className="mb-3">
                  <p className="text-sm text-gray-700">Sisa Kasbon: <span className="font-bold text-orange-600">Rp {totalKasbon.toLocaleString()}</span></p>
                </div>
                
                {/* Checkbox and input - HIDDEN in print */}
                <div className="print:hidden">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      id="deductKasbon"
                      checked={deductKasbon}
                      onChange={(e) => {
                        setDeductKasbon(e.target.checked);
                        if (e.target.checked) {
                          setDeductAmount(maxDeduct.toString());
                        } else {
                          setDeductAmount('');
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <label htmlFor="deductKasbon" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Potong kasbon dari gaji ini?
                    </label>
                  </div>
                  {deductKasbon && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Potongan (Maks: Rp {maxDeduct.toLocaleString()})</label>
                      <input
                        type="number"
                        value={deductAmount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setDeductAmount(Math.min(val, maxDeduct).toString());
                        }}
                        max={maxDeduct}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                      />
                      <button
                        onClick={async () => {
                          if (!deductAmount || parseInt(deductAmount) <= 0) return;
                          const advance = advances[0];
                          if (!advance) return;
                          if (confirm(`Potong kasbon Rp ${parseInt(deductAmount).toLocaleString()}?`)) {
                            try {
                              await deductMutation.mutateAsync({
                                advanceId: advance.id,
                                amount: parseInt(deductAmount),
                                deductedBy: 'admin',
                                deductedByName: 'Admin'
                              });
                              alert('Kasbon berhasil dipotong! Detail tersimpan di slip gaji.');
                            } catch (error) {
                              alert('Gagal memotong kasbon');
                            }
                          }
                        }}
                        disabled={deductMutation.isPending}
                        className="mt-2 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                      >
                        {deductMutation.isPending ? 'Memproses...' : 'Konfirmasi Potong Kasbon'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="mb-8 border-2 border-black rounded-lg bg-gray-50">
            <div className="p-4">
              {kasbonDeduction > 0 && (
                <div className="mb-3 pb-3 border-b border-gray-300">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Gaji Kotor</span>
                    <span className="font-bold text-black">Rp {totalCommission.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600 mt-1">
                    <span>Potongan Kasbon</span>
                    <span className="font-bold">- Rp {kasbonDeduction.toLocaleString()}</span>
                  </div>
                  {deductedKasbon?.date && (
                    <div className="text-xs text-gray-500 mt-1">
                      Dipotong: {new Date(deductedKasbon.date).toLocaleDateString('id-ID')}
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-black">TOTAL GAJI BERSIH</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {(staff.serviceCount || 0) + (staff.productCount || 0)} total transaksi
                    {kasbonDeduction > 0 && (
                      <span className="text-red-600 font-medium"> • {deductions.length || 1} potongan kasbon</span>
                    )}
                  </p>
                </div>
                <p className="text-3xl font-bold text-black">
                  Rp {netSalary.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
            <p className="font-medium">Ini adalah slip gaji resmi dari Barber Place</p>
            <p className="mt-1">Dibuat pada {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            {kasbonDeduction > 0 && (
              <p className="mt-2 text-xs text-red-600 font-medium">
                ⚠️ Potongan kasbon sebesar Rp {kasbonDeduction.toLocaleString()} telah diterapkan pada penggajian ini
              </p>
            )}
            <p className="mt-2 text-xs">Untuk pertanyaan, silakan hubungi Bagian SDM</p>
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
            Cetak / Simpan sebagai PDF
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            Tutup
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
