import React, { useState } from 'react';
import { LOCATIONS } from '@/constants/data';
import Icon from '@/components/ui/Icon';



function MapCard({ name, mapUrl }: { name: string; mapUrl: string }) {
  return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 via-white to-red-100 rounded-full flex items-center justify-center">
          <Icon name="location" className="w-5 h-5 text-gray-700" />
        </div>
        <h3 className="text-lg font-bold text-white text-center">{name}</h3>
      </div>
      <div className="rounded-lg overflow-hidden">
        <iframe 
          src={mapUrl}
          width="100%" 
          height="300" 
          style={{border: 0}} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

export default function LocationMaps() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('location-scroll-container');
    if (!container) return;

    const cardWidth = container.offsetWidth * 0.85;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const cardWidth = container.offsetWidth * 0.85;
    const newIndex = Math.round(container.scrollLeft / cardWidth);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="mt-16">
      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8">
        {LOCATIONS.map((location, index) => (
          <MapCard 
            key={index}
            name={location.name}
            mapUrl={location.mapUrl}
          />
        ))}
      </div>

      {/* Mobile Slider */}
      <div className="lg:hidden relative">
        <div 
          id="location-scroll-container"
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-2 mb-0"
          onScroll={handleScroll}
        >
          {LOCATIONS.map((location, index) => (
            <div key={index} className="flex-shrink-0 w-[85vw] snap-center">
              <MapCard 
                name={location.name}
                mapUrl={location.mapUrl}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <button
            onClick={() => scrollContainer('left')}
            className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {currentIndex < LOCATIONS.length - 1 && (
          <button
            onClick={() => scrollContainer('right')}
            className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Dot Navigation */}
        <div className="flex justify-center gap-1.5 mt-3 mb-8">
          {LOCATIONS.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}