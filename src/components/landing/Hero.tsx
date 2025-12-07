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
      <nav className={`fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'backdrop-blur-lg bg-black/20' : ''} ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-2 sm:gap-3 ml-4 sm:ml-8 md:ml-16">
          <a href="#home" className="relative">
            <img 
              src="/logo_barberplace.png" 
              alt="Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full object-cover shadow-2xl cursor-pointer hover:scale-105 transition-transform"
            />
          </a>
        </div>

        <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 mr-4 md:mr-6 lg:mr-8">
          {NAVIGATION_ITEMS.map((item, index) => (
            <a key={index} href={item.href} className="text-white hover:text-gray-300 transition text-sm lg:text-base xl:text-lg font-medium tracking-wide">
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
        <div className="fixed inset-0 bg-black bg-opacity-95 z-30 pt-20 sm:pt-24 px-6 sm:px-8 md:hidden">
          <div className="flex flex-col gap-4 sm:gap-6">
            {NAVIGATION_ITEMS.map((item, index) => (
              <a key={index} href={item.href} className="text-white text-lg sm:text-xl font-medium" onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div id="home" className="relative min-h-screen flex items-center">
        
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&h=900&fit=crop")',
            }}
          ></div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent opacity-80"></div>
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 pt-64 sm:pt-72 md:pt-80 lg:pt-96 pb-12 sm:pb-14 md:pb-16">
          <div className="max-w-2xl ml-4 sm:ml-6 md:ml-8 lg:ml-16">
            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight text-left ${montserrat.className}`}>
              Barber Place
            </h1>
            <p className={`text-gray-300 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-relaxed max-w-xl text-left ${montserrat.className}`}>
              Berbagai layanan lengkap untuk kebutuhan grooming dan perawatan rambut Anda dengan standar profesional tertinggi
            </p>
            <div className="flex justify-start">
              <button 
                onClick={() => window.open(CONTACT_INFO.whatsapp.url, '_blank')}
                className={`group relative px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 border-2 border-white rounded-full text-white text-sm sm:text-base font-medium tracking-wider hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 shadow-2xl hover:shadow-white/20 ${montserrat.className}`}
              >
                Book Now
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
