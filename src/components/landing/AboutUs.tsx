import React from 'react';
import { Montserrat } from 'next/font/google';
import SectionHeader from '@/components/ui/SectionHeader';
import Icon from '@/components/ui/Icon';
import { CONTACT_INFO } from '@/constants/data';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function AboutUs() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const totalCards = 3;

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('aboutUsScroll');
    if (!container) return;
    const cardWidth = window.innerWidth * 0.85 + 16;
    const newIndex = direction === 'left' 
      ? Math.max(currentIndex - 1, 0) 
      : Math.min(currentIndex + 1, totalCards - 1);
    container.scrollTo({ left: cardWidth * newIndex, behavior: 'smooth' });
    setCurrentIndex(newIndex);
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="px-4 sm:px-6 md:px-8">
        <SectionHeader title="About Us" />
        <div className="mb-6 sm:mb-7 md:mb-8"></div>
      </div>
      
      <div className="relative">
        <div 
          id="aboutUsScroll" 
          className="overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible px-4 sm:px-6 md:px-8"
          onScroll={(e) => {
            if (window.innerWidth >= 768) return;
            const cardWidth = window.innerWidth * 0.85 + 16;
            const scrollLeft = e.currentTarget.scrollLeft;
            const newIndex = Math.round(scrollLeft / cardWidth);
            setCurrentIndex(newIndex);
          }}
        >
          <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-0 md:mb-8 min-w-max md:min-w-0">
        {/* Contact */}
        <div className="group flex-shrink-0 w-[85vw] md:w-auto bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 snap-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon name="whatsapp" className="w-7 h-7 text-gray-600" />
            </div>
          </div>
          <h4 className={`text-lg font-bold text-black mb-3 text-center ${montserrat.className}`}>Contact</h4>
          <div className="space-y-1 mt-8">
            <a href={CONTACT_INFO.whatsapp.url} target="_blank" rel="noopener noreferrer" className={`flex items-start gap-2 text-gray-700 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100 ${montserrat.className}`}>
              <Icon name="whatsapp" className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-600" />
              <span className="text-sm font-medium">{CONTACT_INFO.whatsapp.number}</span>
            </a>
            <a href={CONTACT_INFO.instagram.url} target="_blank" rel="noopener noreferrer" className={`flex items-start gap-2 text-gray-700 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100 ${montserrat.className}`}>
              <Icon name="instagram" className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-600" />
              <span className="text-sm font-medium">{CONTACT_INFO.instagram.handle}</span>
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="group flex-shrink-0 w-[85vw] md:w-auto bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 snap-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon name="location" className="w-7 h-7 text-gray-600" />
            </div>
          </div>
          <h4 className={`text-lg font-bold text-black mb-3 text-center ${montserrat.className}`}>Location</h4>
          <div className="space-y-1 mt-6">
            {CONTACT_INFO.locations.map((location, index) => (
              <div key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Icon name="location" className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <span className={`text-sm text-gray-700 ${montserrat.className}`}>{location}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Hours */}
        <div className="group flex-shrink-0 w-[85vw] md:w-auto bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 snap-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon name="clock" className="w-7 h-7 text-gray-600" />
            </div>
          </div>
          <h4 className={`text-lg font-bold text-black mb-3 text-center ${montserrat.className}`}>Operational Hours</h4>
          <div className="space-y-1 mt-6">
            <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Icon name="calendar" className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
              <span className={`text-sm text-gray-700 font-medium ${montserrat.className}`}>Open Everyday</span>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Icon name="clock" className="w-4 h-4 text-gray-600" />
              <span className={`text-sm text-gray-700 font-medium ${montserrat.className}`}>{CONTACT_INFO.hours} WIB</span>
            </div>
          </div>
        </div>
          </div>
        </div>
        
        {/* Navigation Buttons - Mobile Only */}
        {currentIndex > 0 && (
          <button 
            onClick={() => scrollContainer('left')}
            className="md:hidden absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/10 border border-gray-200/50 rounded-full p-2 text-gray-600 active:bg-white/90 active:border-gray-300 transition-all duration-200 z-10 backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {currentIndex < totalCards - 1 && (
          <button 
            onClick={() => scrollContainer('right')}
            className="md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/10 border border-gray-200/50 rounded-full p-2 text-gray-600 active:bg-white/90 active:border-gray-300 transition-all duration-200 z-10 backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
        {/* Dot Navigation */}
        <div className="flex justify-center gap-1.5 mt-3 mb-8 md:hidden">
          {Array.from({ length: totalCards }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const container = document.getElementById('aboutUsScroll');
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
