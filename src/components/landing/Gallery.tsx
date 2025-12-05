'use client';
import { useState } from 'react';
import { Montserrat } from 'next/font/google';
import SectionHeader from '@/components/ui/SectionHeader';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const galleryImages = [
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1622286346003-c8b4473f4c0c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop'
];

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex(currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1);
    } else {
      setCurrentIndex(currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1);
    }
  };

  return (
    <div id="gallery" className="bg-gray-50 py-12 sm:py-14 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Gallery" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <p className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black ${montserrat.className}`}>See Our</p>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black ${montserrat.className}`}>Barberplace</h2>
              <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black ${montserrat.className}`}>Styles</h3>
            </div>
            
            <p className={`text-gray-600 text-base sm:text-lg leading-relaxed ${montserrat.className}`}>
              Check out our Barberplace styles that would best suite you.
            </p>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors cursor-pointer">
                <span className={`text-sm sm:text-base font-bold ${montserrat.className}`}>View More Styles</span>
                <span className="text-sm sm:text-base">⟶</span>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button 
                  onClick={() => handleNavigation('prev')}
                  className="bg-white border-2 border-gray-300 rounded-full p-2 sm:p-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-md"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleNavigation('next')}
                  className="bg-white border-2 border-gray-300 rounded-full p-2 sm:p-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-md"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Images */}
          <div className="relative flex-1">
            <div className="overflow-hidden w-full ml-4 sm:ml-6 md:ml-8">
              <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] rounded-xl sm:rounded-2xl overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 h-full"
                  style={{ transform: `translateX(-${currentIndex * (window.innerWidth < 640 ? 160 : window.innerWidth < 768 ? 200 : window.innerWidth < 1024 ? 240 : window.innerWidth < 1280 ? 280 : 316)}px)` }}
                >
                  {galleryImages.map((image, index) => (
                    <div key={index} className="flex-shrink-0 w-36 sm:w-48 md:w-56 lg:w-68 xl:w-76 h-full mr-2 sm:mr-3">
                      <img 
                        src={image} 
                        alt={`Barber style ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Dots Indicator */}
              <div className="flex justify-center mt-3 sm:mt-4 gap-1 sm:gap-2">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                      index === currentIndex ? 'bg-gray-800' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}