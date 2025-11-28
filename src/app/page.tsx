'use client';
import React, { useState, useEffect } from 'react';

export default function BarbershopLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const galleryImages = [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=400&fit=crop"
  ];


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
    <div className="min-h-screen bg-black text-white font-sans">
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
          <a href="#home" className="text-white hover:text-gray-300 transition text-lg font-medium tracking-wide">Home</a>
          <a href="#about" className="text-white hover:text-gray-300 transition text-lg font-medium tracking-wide">Service</a>
          <a href="#service" className="text-white hover:text-gray-300 transition text-lg font-medium tracking-wide">Pricelist</a>
          <a href="#gallery" className="text-white hover:text-gray-300 transition text-lg font-medium tracking-wide">Gallery</a>
          <a href="#location" className="text-white hover:text-gray-300 transition text-lg font-medium tracking-wide">About Us</a>
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
            <a href="#home" className="text-white text-xl font-medium" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#about" className="text-white text-xl font-medium" onClick={() => setIsMenuOpen(false)}>Service</a>
            <a href="#service" className="text-white text-xl font-medium" onClick={() => setIsMenuOpen(false)}>Pricelist</a>
            <a href="#gallery" className="text-white text-xl font-medium" onClick={() => setIsMenuOpen(false)}>Gallery</a>
            <a href="#location" className="text-white text-xl font-medium" onClick={() => setIsMenuOpen(false)}>About Us</a>
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight text-left">
              Barber Place
            </h1>
            <p className="text-gray-300 text-sm sm:text-base mb-10 sm:mb-12 leading-relaxed max-w-xl text-left">
              Berbagai layanan lengkap untuk kebutuhan grooming dan perawatan rambut Anda dengan standar profesional tertinggi
            </p>
            <div className="flex justify-start">
              <button className="group relative px-6 sm:px-8 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium tracking-wider hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 shadow-2xl hover:shadow-white/20">
                Book Now
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Section */}
      <div id="about" className="bg-gray-50 py-32 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-black">Service</h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 mx-auto flex">
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 flex flex-col rounded-full" style={{height: '7rem'}}>
                <div className="h-4 bg-blue-700"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-red-600"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-blue-700"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-red-600"></div>
              </div>
              <div className="mb-3">
                <h3 className="text-xl font-bold text-black">Hair Cut</h3>
              </div>
              <p className="text-gray-600">Dari haircut reguler hingga platinum dengan cuci rambut 2x, semua paket dirancang untuk hasil maksimal</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 flex flex-col rounded-full" style={{height: '7rem'}}>
                <div className="h-4 bg-blue-700"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-red-600"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-blue-700"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-red-600"></div>
              </div>
              <div className="mb-3">
                <h3 className="text-xl font-bold text-black">Face & Skin Treatment</h3>
              </div>
              <p className="text-gray-600">Black mask dan gold mask untuk perawatan wajah mendalam, serta facial wash berkualitas tinggi</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 flex flex-col rounded-full" style={{height: '7rem'}}>
                <div className="h-4 bg-blue-700"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-red-600"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-blue-700"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-red-600"></div>
              </div>
              <div className="mb-3">
                <h3 className="text-xl font-bold text-black">Hair Coloring</h3>
              </div>
              <p className="text-gray-600">Layanan coloring profesional mulai dari black colouring hingga full colouring dengan produk premium</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 flex flex-col rounded-full" style={{height: '7rem'}}>
                <div className="h-4 bg-blue-700"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-red-600"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-blue-700"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-red-600"></div>
              </div>
              <div className="mb-3">
                <h3 className="text-xl font-bold text-black">Shaving & Grooming</h3>
              </div>
              <p className="text-gray-600">Pemangkasan dan styling jenggot profesional, plus layanan shaving untuk mustache & beard</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 flex flex-col rounded-full" style={{height: '7rem'}}>
                <div className="h-4 bg-blue-700"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-red-600"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-blue-700"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-red-600"></div>
              </div>
              <div className="mb-3">
                <h3 className="text-xl font-bold text-black">Hair Treatment</h3>
              </div>
              <p className="text-gray-600">Creambath, perm hair & cut, down perm & cut, serta hair wash & styling profesional</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 flex flex-col rounded-full" style={{height: '7rem'}}>
                <div className="h-4 bg-blue-700"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-red-600"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-blue-700"></div>
                <div className="h-4 bg-white"></div>
                <div className="h-4 bg-red-600"></div>
              </div>
              <div className="mb-3">
                <h3 className="text-xl font-bold text-black">Premium Products</h3>
              </div>
              <p className="text-gray-600">Jual pomade, powder, toner, hair tonic, dan produk grooming berkualitas premium pilihan kami</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services & Price Section */}
      <div id="service" className="bg-gray-50 py-32 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-black">Pricelist</h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 mx-auto flex">
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 border-2 border-dashed rounded-lg p-12" style={{borderColor: '#6b7280'}}>
            {/* Hair Cut Packages */}
            <div className="space-y-8 p-8 align-top">
              <h3 className="text-2xl font-bold text-black mb-6 relative z-10">
                Hair Cut
              </h3>
              
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="font-medium text-gray-600">Reguler (Just a Hair Cut)</span>
                <span className="font-bold text-red-600">Rp 30.000</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 gap-4">
                <span className="font-medium text-gray-600">Premium (Cut & Hair Wash)</span>
                <span className="font-bold text-red-600 flex-shrink-0">Rp 40.000</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 gap-4">
                <span className="font-medium text-gray-600">Platinum (Cut & Hair Wash 2x)</span>
                <span className="font-bold text-red-600 flex-shrink-0">Rp 50.000</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="font-medium text-gray-600">Diamond (Cut, Hair Wash & Treatment Face)</span>
                <span className="font-bold text-red-600 flex-shrink-0">Rp 70.000</span>
              </div>
            </div>
            
            {/* Treatment & Services */}
            <div className="space-y-8 p-8 align-top">
              <h3 className="text-2xl font-bold text-black mb-6 relative z-10">
                Treatment
              </h3>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Black Mask</span>
                  <span className="font-bold text-red-600">Rp 40.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Gold Mask</span>
                  <span className="font-bold text-red-600">Rp 50.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3 gap-4">
                  <span className="font-medium text-gray-600">Shaving (Mustache & Beard)</span>
                  <span className="font-bold text-red-600 flex-shrink-0">Rp 10.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Hair Wash & Styling</span>
                  <span className="font-bold text-red-600">Rp 15.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Creambath</span>
                  <span className="font-bold text-red-600">Rp 50.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Black Colouring</span>
                  <span className="font-bold text-red-600">Rp 80.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Highlight Colouring</span>
                  <span className="font-bold text-red-600">Rp 250.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Full Colouring</span>
                  <span className="font-bold text-red-600">Rp 350.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Perm Hair & Cut</span>
                  <span className="font-bold text-red-600">Rp 250.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Down Perm & Cut</span>
                  <span className="font-bold text-red-600">Rp 200.000</span>
                </div>
              </div>
            </div>
            
            {/* Products */}
            <div className="space-y-8 p-8 align-top">
              <h3 className="text-2xl font-bold text-black mb-6 relative z-10">
                Produk
              </h3>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Pomade</span>
                  <span className="font-bold text-red-600">Rp 60.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Powder</span>
                  <span className="font-bold text-red-600">Rp 60.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Toner</span>
                  <span className="font-bold text-red-600">Rp 60.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Micellar Water</span>
                  <span className="font-bold text-red-600">Rp 60.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Hair Tonic</span>
                  <span className="font-bold text-red-600">Rp 35.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Hair Parfume</span>
                  <span className="font-bold text-red-600">Rp 35.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Pomade Spray</span>
                  <span className="font-bold text-red-600">Rp 35.000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-600">Facial Wash</span>
                  <span className="font-bold text-red-600">Rp 70.000</span>
                </div>
              </div>
            </div>
          </div>
          

        </div>
      </div>

      {/* Gallery Section */}
      <div id="gallery" className="bg-gray-50 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-black">Gallery</h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 mx-auto flex">
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
            </div>
          </div>
          
          <div className="overflow-hidden">
            <div className="flex animate-slide space-x-4">
              {/* First set of images */}
              {galleryImages.map((image, index) => (
                <div key={index} className="flex-shrink-0 w-64 h-64">
                  <div className="bg-gray-800 rounded-lg overflow-hidden h-full">
                    <img 
                      src={image} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {galleryImages.map((image, index) => (
                <div key={`duplicate-${index}`} className="flex-shrink-0 w-64 h-64">
                  <div className="bg-gray-800 rounded-lg overflow-hidden h-full">
                    <img 
                      src={image} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <style jsx>{`
            @keyframes slide {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-slide {
              animation: slide 20s linear infinite;
            }
          `}</style>
        </div>
      </div>

      {/* Location & Contact Section */}
      <div id="location" className="bg-gray-50 py-48 px-4 sm:px-8">
        <div className="max-w-full mx-auto px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-black">About Us</h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 mx-auto flex">
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
            </div>
          </div>


          
          {/* Contact & Info Card */}
          <div className="p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Contact */}
              <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 flex flex-col rounded-full" style={{height: '7rem'}}>
                  <div className="h-4 bg-blue-700"></div>
                  <div className="h-4 bg-white"></div>
                  <div className="h-4 bg-red-600"></div>
                  <div className="h-4 bg-white"></div>
                  <div className="h-4 bg-blue-700"></div>
                  <div className="h-4 bg-white"></div>
                  <div className="h-4 bg-red-600"></div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-black mb-4">Contact</h3>
                  <div className="space-y-3">
                    <a href="https://wa.me/6282287443345?text=Halo,%20saya%20mau%20booking%20Barber%20Place%20dengan%20detail%20berikut:%0ANama:%0APaket:%0ATanggal%20%26%20Jam:%0ACabang%20:" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-green-600 hover:underline hover:decoration-gray-400 transition-all duration-200">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                      </svg>
                      <span className="text-base text-black">+6282287443345</span>
                    </a>
                    <a href="https://instagram.com/barberplace7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-pink-600 hover:underline hover:decoration-gray-400 transition-all duration-200">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="text-base text-black">@barberplace7</span>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Location */}
              <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 flex flex-col rounded-full" style={{height: '7rem'}}>
                  <div className="h-4 bg-blue-700"></div>
                  <div className="h-4 bg-white"></div>
                  <div className="h-4 bg-red-600"></div>
                  <div className="h-4 bg-white"></div>
                  <div className="h-4 bg-blue-700"></div>
                  <div className="h-4 bg-white"></div>
                  <div className="h-4 bg-red-600"></div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-black mb-4">Location</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span className="text-base text-black">Barberplace One (Kapugeran)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span className="text-base text-black">Barberplace Venus (Balong)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Operational Hours */}
              <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 flex flex-col rounded-full" style={{height: '7rem'}}>
                  <div className="h-4 bg-blue-700"></div>
                  <div className="h-4 bg-white"></div>
                  <div className="h-4 bg-red-600"></div>
                  <div className="h-4 bg-white"></div>
                  <div className="h-4 bg-blue-700"></div>
                  <div className="h-4 bg-white"></div>
                  <div className="h-4 bg-red-600"></div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-black mb-4">Operational Hours</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                      </svg>
                      <p className="text-base text-black">Open Everyday</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                      </svg>
                      <p className="text-base text-black font-medium">10.00 – 22.00 WIB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Location Maps */}
          <div className="mt-20 -ml-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Branch 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <h3 className="text-xl font-semibold text-black">Barberplace One (Kapugeran)</h3>
              </div>
              <p className="text-black text-left mb-4 text-sm">Jl. Kapugeran No.12 L, RT.008/RW.002, Rangkasbitung Barat, Kec. Rangkasbitung, Kabupaten Lebak, Banten 42312</p>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.243670652527!2d106.2451398753128!3d-6.362501593627568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e4217b01e8a42e3%3A0x809a290030b635c6!2sBARBER%20PLACE!5e0!3m2!1sid!2sid!4v1764303699481!5m2!1sid!2sid" 
                width="100%" 
                height="300" 
                style={{border: 0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
            
            {/* Branch 2 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <h3 className="text-xl font-semibold text-black">Barberplace Venus (Balong)</h3>
              </div>
              <p className="text-black text-left mb-4 text-sm">Jl. Kapugeran No.12 L, RT.008/RW.002, Rangkasbitung Barat, Kec. Rangkasbitung, Kabupaten Lebak, Banten 42312</p>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.243670652527!2d106.2451398753128!3d-6.362501593627568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e4217b01e8a42e3%3A0x809a290030b635c6!2sBARBER%20PLACE!5e0!3m2!1sid!2sid!4v1764303699481!5m2!1sid!2sid" 
                width="100%" 
                height="300" 
                style={{border: 0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
            </div>
          </div>
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
                <a href="https://wa.me/6282287443345?text=Halo,%20saya%20mau%20booking%20Barber%20Place%20dengan%20detail%20berikut:%0ANama:%0APaket:%0ATanggal%20%26%20Jam:%0ACabang%20:" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-600 hover:underline hover:decoration-gray-400 transition-all duration-200">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                  </svg>
                  <span className="text-gray-800 text-sm">+6282287443345</span>
                </a>
                <a href="https://instagram.com/barberplace7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-600 hover:underline hover:decoration-gray-400 transition-all duration-200">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z"/>
                  </svg>
                  <span className="text-gray-800 text-sm">@barberplace7</span>
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="self-start">
              <h3 className="text-lg font-bold mb-3">Operational Hours</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  <p className="text-gray-700 text-sm">Open Everyday</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                  </svg>
                  <p className="text-gray-700 text-sm font-medium">10.00 - 22.00</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="self-start">
              <h3 className="text-lg font-bold mb-3">Location</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span className="text-gray-800 text-sm">Barberplace One (Kapugeran)</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span className="text-gray-800 text-sm">Barberplace Venus (Balong)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 text-center relative">
            <div className="w-full h-0.5 mx-auto flex mb-2">
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-700"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-red-600"></div>
            </div>
            <p className="text-gray-700 text-sm mt-2 mb-4">&copy; 2024 Barber Place. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}