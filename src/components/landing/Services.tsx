'use client';
import { useState, useEffect } from 'react';
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
  const [desktopPosition, setDesktopPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cardWidth = 384 + 24;
  const maxScroll = -(cardWidth * (SERVICE_CARDS.length - 3.2));

  const handleSliderNavigation = (direction: 'prev' | 'next') => {
    const container = document.getElementById('serviceSlider')?.parentElement;
    if (!container) return;

    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);
    
    if (mobile) {
      const cardWidth = window.innerWidth * 0.85 + 16;
      const newIndex = direction === 'prev' 
        ? Math.max(currentIndex - 1, 0) 
        : Math.min(currentIndex + 1, SERVICE_CARDS.length - 1);
      container.scrollTo({ left: cardWidth * newIndex, behavior: 'smooth' });
      setCurrentIndex(newIndex);
    } else {
      const slider = document.getElementById('serviceSlider');
      if (!slider) return;
      const currentTransform = slider.style.transform || 'translateX(0px)';
      const currentX = parseInt(currentTransform.match(/-?\d+/) || [0]);
      
      const newIndex = direction === 'prev' 
        ? Math.max(currentIndex - 1, 0) 
        : Math.min(currentIndex + 1, SERVICE_CARDS.length - 1);
      
      if (direction === 'prev') {
        const newX = Math.min(currentX + cardWidth, 0);
        slider.style.transform = `translateX(${newX}px)`;
        setDesktopPosition(newX);
        setCurrentIndex(newIndex);
      } else {
        const newX = Math.max(currentX - cardWidth, maxScroll);
        slider.style.transform = `translateX(${newX}px)`;
        setDesktopPosition(newX);
        setCurrentIndex(newIndex);
      }
    }
  };

  return (
    <div id="about" className="bg-transparent py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
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
                <div key={index} className="group flex-shrink-0 w-[85vw] sm:w-80 md:w-96 h-auto sm:h-[26rem] md:h-[28rem] bg-zinc-900 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border-2 border-gray-400 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/50 hover:border-gray-600 snap-center cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 bg-gradient-to-br from-blue-100 via-white to-red-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      {service.icon.startsWith('ri-') ? (
                        <i className={`${service.icon} text-2xl sm:text-3xl md:text-4xl text-gray-700 transition-colors duration-300 group-hover:text-gray-900`}></i>
                      ) : (
                        <svg className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 text-gray-700 transition-colors duration-300 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                          <path d={service.icon} />
                        </svg>
                      )}
                    </div>
                    <h3 className={`text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 md:mb-6 ${montserrat.className}`}>
                      {service.title}
                    </h3>
                    <p className={`text-gray-300 text-xs sm:text-sm leading-relaxed text-justify font-extralight ${montserrat.className}`}>
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {((isMobile && currentIndex > 0) || (!isMobile && desktopPosition < 0)) && (
            <button 
              className="absolute left-0 sm:left-2 top-1/2 transform -translate-y-1/2 bg-gray-800/50 border border-gray-600/50 rounded-full p-2 sm:p-3 text-gray-300 hover:bg-gray-700 hover:border-gray-500 active:bg-gray-700 active:border-gray-500 transition-all duration-200 z-10 backdrop-blur-sm"
              onClick={() => handleSliderNavigation('prev')}
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {((isMobile && currentIndex < SERVICE_CARDS.length - 1) || (!isMobile && desktopPosition > maxScroll)) && (
            <button 
              className="absolute right-0 sm:right-2 top-1/2 transform -translate-y-1/2 bg-gray-800/50 border border-gray-600/50 rounded-full p-2 sm:p-3 text-gray-300 hover:bg-gray-700 hover:border-gray-500 active:bg-gray-700 active:border-gray-500 transition-all duration-200 z-10 backdrop-blur-sm"
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
                const mobile = window.innerWidth < 640;
                if (mobile) {
                  const container = document.getElementById('serviceSlider')?.parentElement;
                  if (!container) return;
                  const cardWidth = window.innerWidth * 0.85 + 16;
                  container.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
                } else {
                  const slider = document.getElementById('serviceSlider');
                  if (!slider) return;
                  const newX = -(cardWidth * index);
                  slider.style.transform = `translateX(${newX}px)`;
                  setDesktopPosition(newX);
                }
                setCurrentIndex(index);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === index ? 'bg-white w-4' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}