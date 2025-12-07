'use client';
import { useState } from 'react';
import { Montserrat } from 'next/font/google';
import SectionHeader from '@/components/ui/SectionHeader';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const FAQ_DATA = [
  { q: "Bagaimana cara booking?", a: "Anda bisa booking melalui Instagram @barberplace7 atau datang langsung ke barbershop kami. Kami juga menerima booking via WhatsApp di nomor yang ada di website kami." },
  { q: "Berapa lama waktu untuk potong rambut?", a: "Waktu untuk setiap layanan berbeda-beda. Potong rambut biasa membutuhkan 20-30 menit, sementara treatment dan coloring bisa membutuhkan 1-3 jam tergantung jenis layanannya." },
  { q: "Apakah bisa walk-in tanpa booking?", a: "Ya, kami menerima walk-in. Namun kami menyarankan untuk booking terlebih dahulu untuk menghindari antrian yang panjang, terutama pada hari-hari ramai." },
  { q: "Apakah produk yang digunakan aman?", a: "Semua produk yang kami gunakan adalah produk premium berkualitas tinggi dan aman untuk semua jenis rambut. Kami selalu menggunakan produk terbaik untuk hasil maksimal." },
  { q: "Berapa harga untuk setiap layanan?", a: "Harga-harga untuk semua layanan sudah kami cantumkan di halaman 'Price List'. Harga sangat kompetitif untuk kualitas yang kami berikan." },
  { q: "Apakah tersedia parkir untuk kendaraan?", a: "Ya, kami memiliki area parkir yang cukup untuk motor dan mobil. Lokasi kami juga strategis dan mudah diakses dari berbagai arah." }
];

export default function FAQ() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div>
      <SectionHeader title="FAQ" />
      <div className="max-w-6xl mx-auto mt-4 sm:mt-5 md:mt-6 space-y-3 sm:space-y-3.5 md:space-y-4 px-2 sm:px-4 md:px-0">
        {FAQ_DATA.map((faq, index) => (
          <div key={index} className="group bg-zinc-900 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/50 border-2 border-gray-400 hover:border-gray-600 overflow-hidden cursor-pointer">
            <button
              onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between transition-all duration-300"
            >
              <h3 className={`text-sm sm:text-base font-bold text-white text-left transition-colors ${montserrat.className}`}>{faq.q}</h3>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-100 via-white to-red-100 flex items-center justify-center flex-shrink-0 ml-3 sm:ml-4 group-hover:scale-110 transition-transform duration-300`}>
                <svg
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-700 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-96' : 'max-h-0'}`}
            >
              <div className="px-4 sm:px-6 md:px-8 pb-3 sm:pb-4 md:pb-5 pt-2 bg-zinc-800/50">
                <p className={`text-xs sm:text-sm text-gray-300 leading-relaxed ${montserrat.className}`}>{faq.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
