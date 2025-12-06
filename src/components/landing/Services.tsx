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
    <div id="about" className="bg-gray-50 py-16 px-8">
      <div className="max-w-full mx-auto">
        <SectionHeader title="Service" />
        
        <div className="relative">
          <div className="overflow-visible px-16 py-4">
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
                <div key={index} className="group flex-shrink-0 w-96 h-[28rem] bg-white p-12 rounded-3xl border border-gray-200 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-3 hover:border-gray-300 hover:scale-105">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-full flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <svg className="w-10 h-10 text-gray-600 transition-colors duration-300 group-hover:text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d={service.icon} />
                      </svg>
                    </div>
                    <h3 className={`text-xl font-bold text-black mb-6 ${montserrat.className}`}>
                      {service.title}
                    </h3>
                    <p className={`text-black text-sm leading-relaxed text-justify font-extralight ${montserrat.className}`}>
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/60 border border-gray-200/50 rounded-full p-3 hover:bg-white hover:border-gray-300 transition-all duration-200 z-10"
            onClick={() => handleSliderNavigation('prev')}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/60 border border-gray-200/50 rounded-full p-3 hover:bg-white hover:border-gray-300 transition-all duration-200 z-10"
            onClick={() => handleSliderNavigation('next')}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}