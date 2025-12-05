'use client';
import { useState } from 'react';
import { Montserrat } from 'next/font/google';
import { SERVICE_CARDS } from '@/constants/data';
import SectionHeader from '@/components/ui/SectionHeader';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function Services() {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleSliderNavigation = (direction: 'prev' | 'next') => {
    const slider = document.getElementById('serviceSlider');
    if (!slider) return;

    const cardWidth = 384 + 24;
    const currentTransform = slider.style.transform || 'translateX(0px)';
    const currentX = parseInt(currentTransform.match(/-?\d+/) || [0]);

    if (direction === 'prev') {
      const newX = Math.min(currentX + cardWidth, 0);
      slider.style.transform = `translateX(${newX}px)`;
    } else {
      const totalCards = SERVICE_CARDS.length;
      const visibleCards = 3.2;
      const maxScroll = -(cardWidth * (totalCards - visibleCards));
      const newX = Math.max(currentX - cardWidth, maxScroll);
      if (newX >= maxScroll) {
        slider.style.transform = `translateX(${newX}px)`;
      }
    }
  };

  return (
    <div id="about" className="bg-gray-50 py-12 sm:py-14 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-full mx-auto">
        <SectionHeader title="Service" />
        <p className="text-gray-600 text-sm sm:text-base text-center max-w-5xl mx-auto -mt-12 sm:-mt-14 md:-mt-16 mb-8 sm:mb-12 md:mb-16 px-4">
          Berbagai layanan lengkap untuk kebutuhan grooming dan perawatan rambut Anda dengan standar profesional tertinggi
        </p>
        
        <div className="relative mt-6 sm:mt-8">
          <div className="overflow-hidden px-8 sm:px-12 md:px-16">
            <div 
              id="serviceSlider" 
              className="flex space-x-6 transition-transform duration-300 cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => {
                setIsDragging(true);
                setStartX(e.pageX);
                const slider = document.getElementById('serviceSlider');
                const currentTransform = slider?.style.transform || 'translateX(0px)';
                setScrollLeft(parseInt(currentTransform.match(/-?\d+/) || [0]));
                if (slider) slider.style.transition = 'none';
              }}
              onMouseMove={(e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.pageX;
                const walk = (x - startX) * 1;
                const slider = document.getElementById('serviceSlider');
                const cardWidth = 384 + 24;
                const totalCards = SERVICE_CARDS.length;
                const visibleCards = 3.2;
                const maxScroll = -(cardWidth * (totalCards - visibleCards));
                const newX = Math.max(Math.min(scrollLeft + walk, 0), maxScroll);
                if (slider) slider.style.transform = `translateX(${newX}px)`;
              }}
              onMouseUp={() => {
                setIsDragging(false);
                const slider = document.getElementById('serviceSlider');
                if (slider) slider.style.transition = 'transform 0.3s';
              }}
              onMouseLeave={() => {
                setIsDragging(false);
                const slider = document.getElementById('serviceSlider');
                if (slider) slider.style.transition = 'transform 0.3s';
              }}
            >
              {SERVICE_CARDS.map((service, index) => (
                <div key={index} className="group flex-shrink-0 w-72 sm:w-80 md:w-96 h-96 sm:h-[26rem] md:h-[28rem] bg-white p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-white via-blue-50 to-red-50 border-2 border-gray-200/30 group-hover:border-gray-300/50 group-hover:via-blue-100 group-hover:to-red-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-8 transition-all duration-300">
                      {service.icon.startsWith('ri-') ? (
                        <i className={`${service.icon} text-2xl sm:text-3xl md:text-4xl text-gray-600`}></i>
                      ) : (
                        <svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d={service.icon} />
                        </svg>
                      )}
                    </div>
                    <h3 className={`text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4 md:mb-6 ${montserrat.className}`}>
                      {service.title}
                    </h3>
                    <p className={`text-black text-xs sm:text-sm leading-relaxed text-justify font-extralight ${montserrat.className}`}>
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white/60 border border-gray-200/50 rounded-full p-2 sm:p-3 hover:bg-white hover:border-gray-300 transition-all duration-200 z-10"
            onClick={() => handleSliderNavigation('prev')}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white/60 border border-gray-200/50 rounded-full p-2 sm:p-3 hover:bg-white hover:border-gray-300 transition-all duration-200 z-10"
            onClick={() => handleSliderNavigation('next')}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}