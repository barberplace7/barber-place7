'use client';
import { useState, useEffect } from 'react';
import { Montserrat } from 'next/font/google';
import { GALLERY_IMAGES } from '@/constants/data';
import SectionHeader from '@/components/ui/SectionHeader';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState(GALLERY_IMAGES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Clone first image at the end for infinite loop
  const slides = [...galleryImages, galleryImages[0]];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery');
        const images = await response.json();
        if (images.length > 0) {
          setGalleryImages(images);
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      }
    };

    fetchGallery();
  }, []);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev + 1);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev - 1);
  };
  
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentSlide === slides.length - 1) {
      setCurrentSlide(0);
    } else if (currentSlide === -1) {
      setCurrentSlide(galleryImages.length - 1);
    }
  };

  return (
    <div id="gallery" className="bg-transparent py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Gallery" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <p className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white ${montserrat.className}`}>See Our</p>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white ${montserrat.className}`}>Barberplace</h2>
              <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white ${montserrat.className}`}>Styles</h3>
            </div>
            
            <p className={`text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed ${montserrat.className}`}>
              Check out our Legendary styles that would best suite you.
            </p>
            
            <div className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors cursor-pointer">
              <span className={`text-xs sm:text-sm font-bold ${montserrat.className}`}>View More Styles</span>
              <span className="text-sm">⟶</span>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex gap-2 pt-2 sm:pt-4">
              <button 
                className="bg-gray-800/50 border-2 border-gray-600 rounded-full p-2 sm:p-3 hover:bg-gray-700 transition-all duration-200"
                onClick={handlePrev}
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                className="bg-gray-800/50 border-2 border-gray-600 rounded-full p-2 sm:p-3 hover:bg-gray-700 transition-all duration-200"
                onClick={handleNext}
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right Images */}
          <div className="relative flex-1">
            <div className="overflow-hidden w-full ml-0 sm:ml-4 md:ml-8">
              <div 
                className="flex"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none'
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {slides.map((image, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[500px]"
                  >
                    <img 
                      src={image} 
                      alt={`Style ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}