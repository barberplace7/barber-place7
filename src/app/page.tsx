'use client';
import React, { useState, useEffect } from 'react';
import { Montserrat } from 'next/font/google';
import Services from '@/components/landing/Services';
import Pricelist from '@/components/landing/Pricelist';
import Gallery from '@/components/landing/Gallery';
import LocationMaps from '@/components/landing/LocationMaps';
import SectionHeader from '@/components/ui/SectionHeader';
import DecorativeLine from '@/components/ui/DecorativeLine';
import Icon from '@/components/ui/Icon';
import { NAVIGATION_ITEMS, CONTACT_INFO } from '@/constants/data';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function BarbershopLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 50) {
        setIsNavVisible(true);
      } else {
        setIsNavVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);



  return (
    <div className="min-h-screen text-white font-sans">
      {/* Navigation */}
      <nav className={`fixed top-4 left-4 right-4 z-40 px-8 py-4 flex items-center justify-between transition-transform duration-300 rounded-2xl ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 ml-16">
          <div className="relative">
            <img 
              src="/logo_barberplace.png" 
              alt="Logo" 
              className="w-22 h-22 rounded-full object-cover shadow-2xl"
            />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 mr-8">
          {NAVIGATION_ITEMS.map((item, index) => (
            <a key={index} href={item.href} className="text-white hover:text-gray-300 transition text-lg font-medium tracking-wide">
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-30 pt-24 px-8 md:hidden">
          <div className="flex flex-col gap-6">
            {NAVIGATION_ITEMS.map((item, index) => (
              <a key={index} href={item.href} className="text-white text-xl font-medium" onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div id="home" className="relative min-h-screen flex items-center">
        {/* Top Border - full width white with colored pattern in center */}
        <div className="absolute top-0 left-0 right-0 bg-white z-50" style={{height: '1.3rem'}}>
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex" style={{width: 'min(21rem, 90vw)'}}>
            <div className="w-8 sm:w-10 md:w-12 bg-red-600"></div>
            <div className="w-8 sm:w-10 md:w-12 bg-white"></div>
            <div className="w-8 sm:w-10 md:w-12 bg-blue-700"></div>
            <div className="w-8 sm:w-10 md:w-12 bg-white"></div>
            <div className="w-8 sm:w-10 md:w-12 bg-red-600"></div>
            <div className="w-8 sm:w-10 md:w-12 bg-white"></div>
            <div className="w-8 sm:w-10 md:w-12 bg-blue-700"></div>
          </div>
        </div>
        
        {/* Bottom Border - full width white only */}
        <div className="absolute bottom-0 left-0 right-0 bg-white z-50" style={{height: '1.3rem'}}></div>
        
        {/* Left Border - full height white with colored pattern in center */}
        <div className="absolute left-0 top-0 bottom-0 bg-white z-50" style={{width: '1.3rem'}}>
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex flex-col" style={{height: 'min(21rem, 70vh)'}}>
            <div className="h-8 sm:h-10 md:h-12 bg-red-600"></div>
            <div className="h-8 sm:h-10 md:h-12 bg-white"></div>
            <div className="h-8 sm:h-10 md:h-12 bg-blue-700"></div>
            <div className="h-8 sm:h-10 md:h-12 bg-white"></div>
            <div className="h-8 sm:h-10 md:h-12 bg-red-600"></div>
            <div className="h-8 sm:h-10 md:h-12 bg-white"></div>
            <div className="h-8 sm:h-10 md:h-12 bg-blue-700"></div>
          </div>
        </div>
        
        {/* Right Border - full height white with colored pattern in center */}
        <div className="absolute right-0 top-0 bottom-0 bg-white z-50" style={{width: '1.3rem'}}>
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex flex-col" style={{height: 'min(21rem, 70vh)'}}>
            <div className="h-8 sm:h-10 md:h-12 bg-red-600"></div>
            <div className="h-8 sm:h-10 md:h-12 bg-white"></div>
            <div className="h-8 sm:h-10 md:h-12 bg-blue-700"></div>
            <div className="h-8 sm:h-10 md:h-12 bg-white"></div>
            <div className="h-8 sm:h-10 md:h-12 bg-red-600"></div>
            <div className="h-8 sm:h-10 md:h-12 bg-white"></div>
            <div className="h-8 sm:h-10 md:h-12 bg-blue-700"></div>
          </div>
        </div>
        
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&h=900&fit=crop")',
            }}
          ></div>
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-4 md:px-8 pt-80 md:pt-96 pb-16">
          <div className="max-w-2xl ml-8 md:ml-16">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight text-left ${montserrat.className}`}>
              Barber Place
            </h1>
            <p className={`text-gray-300 text-sm sm:text-base mb-10 sm:mb-12 leading-relaxed max-w-xl text-left ${montserrat.className}`}>
              Berbagai layanan lengkap untuk kebutuhan grooming dan perawatan rambut Anda dengan standar profesional tertinggi
            </p>
            <div className="flex justify-start">
              <button className={`group relative px-6 sm:px-8 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium tracking-wider hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 shadow-2xl hover:shadow-white/20 ${montserrat.className}`}>
                Book Now
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Gradient Transition */}
      <div className="h-8 bg-gradient-to-b from-white to-gray-50"></div>

      {/* Service Section */}
      <Services />

      {/* Pricelist Section */}
      <Pricelist />

      {/* Spacer */}
      <div className="bg-gray-50 py-16"></div>

      {/* Gallery Section */}
      <Gallery />

      {/* Location & Contact Section */}
      <div id="location" className="bg-gray-50 py-48 px-4 sm:px-8">
        <div className="max-w-full mx-auto px-8">
          <SectionHeader title="About Us" />
          
          {/* About Content */}
          <div className="mb-12">
            <h3 className={`text-2xl font-bold text-black mb-4 ${montserrat.className}`}>About Barberplace</h3>
            <p className={`text-black text-base mb-8 ${montserrat.className}`}>Barberplace since 2021 commite to give service all customer</p>
            
            {/* Operational Hours */}
            <div className="mb-6">
              <h4 className={`text-lg font-bold text-black mb-3 ${montserrat.className}`}>Operational Hours</h4>
              <div className="flex items-center gap-2">
                <Icon name="clock" className="w-4 h-4 text-gray-600" />
                <span className={`text-sm text-black ${montserrat.className}`}>Open Everyday, 10.00-22.00 WIB</span>
              </div>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className={`text-lg font-bold text-black mb-3 ${montserrat.className}`}>Contact</h4>
              <div className="space-y-2">
                <a href={CONTACT_INFO.whatsapp.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-black hover:text-green-600 transition-colors ${montserrat.className}`}>
                  <Icon name="whatsapp" className="w-4 h-4" />
                  <span className="text-sm">WA</span>
                </a>
                <a href={CONTACT_INFO.instagram.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-black hover:text-pink-600 transition-colors ${montserrat.className}`}>
                  <Icon name="instagram" className="w-4 h-4" />
                  <span className="text-sm">Instagram</span>
                </a>
              </div>
            </div>
          </div>


          
          {/* Location Maps */}
          <LocationMaps />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 text-black py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Company Info */}
            <div className="self-start">
              <h3 className="text-lg font-bold">BARBER PLACE</h3>
            </div>

            {/* Contact Info */}
            <div className="self-start">
              <h3 className="text-lg font-bold mb-3">Contact</h3>
              <div className="space-y-3">
                <a href={CONTACT_INFO.whatsapp.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-600 hover:underline hover:decoration-gray-400 transition-all duration-200">
                  <Icon name="whatsapp" className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800 text-sm">{CONTACT_INFO.whatsapp.number}</span>
                </a>
                <a href={CONTACT_INFO.instagram.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-600 hover:underline hover:decoration-gray-400 transition-all duration-200">
                  <Icon name="instagram" className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800 text-sm">{CONTACT_INFO.instagram.handle}</span>
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="self-start">
              <h3 className="text-lg font-bold mb-3">Operational Hours</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon name="calendar" className="w-5 h-5 text-gray-600" />
                  <p className="text-gray-700 text-sm">Open Everyday</p>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="clock" className="w-5 h-5 text-gray-600" />
                  <p className="text-gray-700 text-sm font-medium">{CONTACT_INFO.hours}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="self-start">
              <h3 className="text-lg font-bold mb-3">Location</h3>
              <div className="space-y-3">
                {CONTACT_INFO.locations.map((location, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icon name="location" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800 text-sm">{location}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 text-center relative">
            <DecorativeLine className="mb-2" />
            <p className="text-gray-700 text-sm mt-2 mb-4">&copy; 2024 Barber Place. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}