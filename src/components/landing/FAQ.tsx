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
  {
    question: "Bagaimana cara booking?",
    answer: "Anda bisa booking melalui Instagram @barberplace7 atau datang langsung ke barbershop kami. Kami juga menerima booking via WhatsApp di nomor yang ada di website kami."
  },
  {
    question: "Berapa lama waktu untuk potong rambut?",
    answer: "Waktu untuk setiap layanan berbeda-beda. Potong rambut biasa membutuhkan 20-30 menit, sementara treatment dan coloring bisa membutuhkan 1-3 jam tergantung jenis layanannya."
  },
  {
    question: "Apakah bisa walk-in tanpa booking?",
    answer: "Ya, kami menerima walk-in. Namun kami menyarankan untuk booking terlebih dahulu untuk menghindari antrian yang panjang, terutama pada hari-hari ramai."
  },
  {
    question: "Apakah produk yang digunakan aman?",
    answer: "Semua produk yang kami gunakan adalah produk premium berkualitas tinggi dan aman untuk semua jenis rambut. Kami selalu menggunakan produk terbaik untuk hasil maksimal."
  },
  {
    question: "Berapa harga untuk setiap layanan?",
    answer: "Harga-harga untuk semua layanan sudah kami cantumkan di halaman 'Price List'. Harga sangat kompetitif untuk kualitas yang kami berikan."
  },
  {
    question: "Apakah tersedia parkir untuk kendaraan?",
    answer: "Ya, kami memiliki area parkir yang cukup untuk motor dan mobil. Lokasi kami juga strategis dan mudah diakses dari berbagai arah."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="bg-gray-50 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="FAQ" />
        <p className="text-gray-600 text-sm sm:text-base text-center max-w-5xl mx-auto -mt-12 sm:-mt-14 md:-mt-16 mb-8 sm:mb-12 md:mb-16 px-4">
          Pertanyaan yang sering diajukan seputar layanan dan kebijakan Barber Place
        </p>
        
        <div className="space-y-3 sm:space-y-4">
          {FAQ_DATA.map((faq, index) => (
            <div key={index} className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <button
                className="w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 text-left flex items-center justify-between focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className={`text-base sm:text-lg font-semibold text-black group-hover:text-gray-700 transition-colors duration-200 ${montserrat.className} pr-4`}>
                  {faq.question}
                </h3>
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-white via-blue-50 to-red-50 border-2 border-gray-200/30 group-hover:border-gray-300/50 group-hover:via-blue-100 group-hover:to-red-100 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0">
                  <svg 
                    className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-600 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 pb-4 sm:pb-5 md:pb-6' : 'max-h-0'}`}>
                <div className="px-4 sm:px-5 md:px-6">
                  <p className={`text-gray-600 leading-relaxed text-sm sm:text-base ${montserrat.className}`}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}