'use client';
import React, { useState, useEffect } from 'react';
import Hero from '@/components/landing/Hero';
import Services from '@/components/landing/Services';
import Pricelist from '@/components/landing/Pricelist';
import Gallery from '@/components/landing/Gallery';
import AboutUs from '@/components/landing/AboutUs';
import LocationMaps from '@/components/landing/LocationMaps';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function BarbershopLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 50) {
        setIsNavVisible(true);
        setIsScrolled(false);
      } else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true);
        setIsScrolled(true);
      } else {
        setIsNavVisible(false);
        setIsScrolled(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);



  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden">
      <Hero isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isNavVisible={isNavVisible} isScrolled={isScrolled} />

      <div className="h-4 sm:h-6 md:h-8 bg-gradient-to-b from-white to-gray-50"></div>

      <Services />

      <div className="py-12 bg-gray-50"></div>

      <Pricelist />

      <div className="py-12 bg-gray-50"></div>

      <Gallery />

      <div className="py-12 bg-gray-50"></div>

      <div id="location" className="bg-gray-50 py-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <AboutUs />
          
          <div className="mt-16"></div>
          
          <LocationMaps />
        </div>
      </div>

      <div id="faq" className="bg-gray-50 pt-24 pb-24 px-4 sm:px-6 md:px-8">
        <FAQ />
      </div>

      <Footer />
    </div>
  );
}