import { Montserrat } from 'next/font/google';
import { NAVIGATION_ITEMS, CONTACT_INFO } from '@/constants/data';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

interface HeroProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  isNavVisible: boolean;
  isScrolled: boolean;
}

export default function Hero({ isMenuOpen, setIsMenuOpen, isNavVisible, isScrolled }: HeroProps) {
  return (
    <>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 px-8 py-4 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'backdrop-blur-lg bg-black/20' : ''} ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-3 ml-16">
          <a href="#home" className="relative">
            <img 
              src="/logo_barberplace.png" 
              alt="Logo" 
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full object-cover shadow-2xl cursor-pointer hover:scale-105 transition-transform"
            />
          </a>
        </div>

        <div className="hidden md:flex items-center gap-8 mr-8">
          {NAVIGATION_ITEMS.map((item, index) => (
            <a key={index} href={item.href} className="text-white hover:text-gray-300 transition text-lg font-medium tracking-wide">
              {item.label}
            </a>
          ))}
        </div>

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
        
        <div className="absolute bottom-0 left-0 right-0 bg-white z-50" style={{height: '1.3rem'}}></div>
        
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
        
        <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&h=900&fit=crop")',
            }}
          ></div>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full px-4 md:px-8 pt-80 md:pt-96 pb-16">
          <div className="max-w-2xl ml-8 md:ml-16">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight text-left ${montserrat.className}`}>
              Barber Place
            </h1>
            <p className={`text-gray-300 text-sm sm:text-base mb-10 sm:mb-12 leading-relaxed max-w-xl text-left ${montserrat.className}`}>
              Berbagai layanan lengkap untuk kebutuhan grooming dan perawatan rambut Anda dengan standar profesional tertinggi
            </p>
            <div className="flex justify-start">
              <button 
                onClick={() => window.open(CONTACT_INFO.whatsapp.url, '_blank')}
                className={`group relative px-6 sm:px-8 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium tracking-wider hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 shadow-2xl hover:shadow-white/20 ${montserrat.className}`}
              >
                Book Now
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
