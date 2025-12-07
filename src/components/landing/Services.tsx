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
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSliderNavigation = (direction: 'prev' | 'next') => {
    const container = document.getElementById('serviceSlider')?.parentElement;
    if (!container) return;

    const isMobile = window.innerWidth < 640;
    
    if (isMobile) {
      const cardWidth = window.innerWidth * 0.85 + 16;
      const newIndex = direction === 'prev' 
        ? Math.max(currentIndex - 1, 0) 
        : Math.min(currentIndex + 1, SERVICE_CARDS.length - 1);
      container.scrollTo({ left: cardWidth * newIndex, behavior: 'smooth' });
      setCurrentIndex(newIndex);
    } else {
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
        const maxScroll = -(cardWidth * (totalCards - 3.2));
        const newX = Math.max(currentX - cardWidth, maxScroll);
        if (newX >= maxScroll) {
          slider.style.transform = `translateX(${newX}px)`;
        }
      }
    }
  };

  return (
    <div id="about" className="bg-gray-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-full mx-auto">
        <SectionHeader title="Service" />
        
        <div className="relative">
          <div 
            className="overflow-x-auto overflow-y-visible px-4 sm:px-8 md:px-16 snap-x snap-mandatory scrollbar-hide md:overflow-hidden"
            onScroll={(e) => {
              if (window.innerWidth >= 640) return;
              const cardWidth = window.innerWidth * 0.85 + 16;
              const scrollLeft = e.currentTarget.scrollLeft;
              const newIndex = Math.round(scrollLeft / cardWidth);
              setCurrentIndex(newIndex);
            }}
          >
            <div 
              id="serviceSlider" 
              className="flex space-x-4 sm:space-x-6 mb-0 md:mb-4 md:transition-transform md:duration-300"
            >
              {SERVICE_CARDS.map((service, index) => (
                <div key={index} className="group flex-shrink-0 w-[85vw] sm:w-80 md:w-96 h-auto sm:h-[26rem] md:h-[28rem] bg-white p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-gray-200 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-3 hover:border-gray-300 hover:scale-105 snap-center">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      {service.icon.startsWith('ri-') ? (
                        <i className={`${service.icon} text-2xl sm:text-3xl md:text-4xl text-gray-600 transition-colors duration-300 group-hover:text-gray-800`}></i>
                      ) : (
                        <svg className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 text-gray-600 transition-colors duration-300 group-hover:text-gray-800" fill="currentColor" viewBox="0 0 24 24">
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
          
          {currentIndex > 0 && (
            <button 
              className="absolute left-0 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white/10 border border-gray-200/50 rounded-full p-2 sm:p-3 text-gray-600 active:bg-white/90 active:border-gray-300 transition-all duration-200 z-10 backdrop-blur-sm md:bg-white/60 md:hover:bg-white md:hover:border-gray-300"
              onClick={() => handleSliderNavigation('prev')}
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {currentIndex < SERVICE_CARDS.length - 1 && (
            <button 
              className="absolute right-0 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white/10 border border-gray-200/50 rounded-full p-2 sm:p-3 text-gray-600 active:bg-white/90 active:border-gray-300 transition-all duration-200 z-10 backdrop-blur-sm md:bg-white/60 md:hover:bg-white md:hover:border-gray-300"
              onClick={() => handleSliderNavigation('next')}
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Dot Navigation */}
        <div className="flex justify-center gap-1.5 mt-3 mb-8 md:hidden">
          {SERVICE_CARDS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const container = document.getElementById('serviceSlider')?.parentElement;
                if (!container) return;
                const cardWidth = window.innerWidth * 0.85 + 16;
                container.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
                setCurrentIndex(index);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'bg-gray-800 w-4' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}