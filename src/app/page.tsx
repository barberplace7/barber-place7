'use client';
import React, { useState, useEffect } from 'react';
import { Montserrat } from 'next/font/google';
import Services from '@/components/landing/Services';
import Pricelist from '@/components/landing/Pricelist';
import Gallery from '@/components/landing/Gallery';
import AboutUs from '@/components/landing/AboutUs';
import LocationMaps from '@/components/landing/LocationMaps';
import FAQ from '@/components/landing/FAQ';
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
  const [showBlur, setShowBlur] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 50) {
        setIsNavVisible(true);
        setShowBlur(false);
      } else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true);
        setShowBlur(true);
      } else {
        setIsNavVisible(false);
        setShowBlur(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);



  return (
    <div className="min-h-screen text-white font-sans">
      {/* Navigation */}
      {/* Background blur overlay */}
      <div className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${showBlur ? 'backdrop-blur-md bg-black/20 h-24' : 'h-0'}`}></div>
      
      <nav className={`fixed top-4 left-0 right-0 z-40 px-8 py-3 flex items-center justify-between transition-all duration-300 ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 ml-4 sm:ml-8 md:ml-16">
          <a href="#home" className="relative">
            <img 
              src="/logo_barberplace.png" 
              alt="Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover shadow-2xl hover:scale-105 transition-transform duration-200 cursor-pointer"
            />
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 mr-4 sm:mr-6 md:mr-8">
          {NAVIGATION_ITEMS.map((item, index) => (
            <a key={index} href={item.href} className="text-white hover:text-gray-300 transition text-sm md:text-base lg:text-lg font-medium tracking-wide">
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
        <div className="absolute top-0 left-0 right-0 bg-white z-50 h-4 sm:h-5 md:h-6">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex" style={{width: 'min(21rem, 90vw)'}}>
            <div className="flex-1 bg-red-600"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-blue-700"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-red-600"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-blue-700"></div>
          </div>
        </div>
        
        {/* Bottom Border - full width white only */}
        <div className="absolute bottom-0 left-0 right-0 bg-white z-50 h-4 sm:h-5 md:h-6"></div>
        
        {/* Left Border - full height white with colored pattern in center */}
        <div className="absolute left-0 top-0 bottom-0 bg-white z-50 w-4 sm:w-5 md:w-6">
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex flex-col" style={{height: 'min(21rem, 70vh)'}}>
            <div className="flex-1 bg-red-600"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-blue-700"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-red-600"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-blue-700"></div>
          </div>
        </div>
        
        {/* Right Border - full height white with colored pattern in center */}
        <div className="absolute right-0 top-0 bottom-0 bg-white z-50 w-4 sm:w-5 md:w-6">
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex flex-col" style={{height: 'min(21rem, 70vh)'}}>
            <div className="flex-1 bg-red-600"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-blue-700"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-red-600"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-blue-700"></div>
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
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 pt-60 sm:pt-72 md:pt-80 lg:pt-96 pb-12 sm:pb-16">
          <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl ml-4 sm:ml-6 md:ml-8 lg:ml-16">
            <p className={`text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 leading-relaxed text-left ${montserrat.className}`}>
              Berbagai layanan lengkap untuk kebutuhan grooming dan perawatan rambut Anda dengan standar profesional tertinggi
            </p>
            <div className="flex justify-start mt-4 sm:mt-6 md:mt-8">
              <a href="https://wa.me/6282287443345?text=Halo,%20saya%20mau%20booking%20Barber%20Place%20dengan%20detail%20berikut:%0ANama:%0APaket:%0ATanggal%20%26%20Jam:%0ACabang%20:" target="_blank" rel="noopener noreferrer" className={`group relative px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 border-2 border-white rounded-full text-white text-sm sm:text-base font-medium tracking-wider hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 shadow-2xl hover:shadow-white/20 ${montserrat.className}`}>
                Book Now
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
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
      <div className="bg-gray-50 py-8"></div>

      {/* Gallery Section */}
      <Gallery />

      {/* About Us Section */}
      <AboutUs />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Company Info */}
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">BARBER PLACE</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Barbershop profesional dengan layanan grooming terbaik untuk kebutuhan perawatan rambut dan penampilan Anda.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex justify-start sm:justify-center md:justify-center">
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
                <div className="space-y-1 sm:space-y-2">
                  <a href="#home" className="block text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">Home</a>
                  <a href="#about" className="block text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">Service</a>
                  <a href="#service" className="block text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">Pricelist</a>
                  <a href="#location" className="block text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">About Us</a>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex justify-start sm:justify-end md:justify-end">
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Info</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icon name="whatsapp" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <span className="text-gray-300 text-xs sm:text-sm">{CONTACT_INFO.whatsapp.number}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icon name="instagram" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <span className="text-gray-300 text-xs sm:text-sm">{CONTACT_INFO.instagram.handle}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icon name="clock" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <span className="text-gray-300 text-xs sm:text-sm">10.00 - 22.00 WIB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">&copy; 2024 Barber Place. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}