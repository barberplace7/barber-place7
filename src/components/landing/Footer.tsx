import { Montserrat } from 'next/font/google';
import Icon from '@/components/ui/Icon';
import { CONTACT_INFO } from '@/constants/data';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 text-gray-800 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-300 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo_barberplace.png" 
                alt="Logo" 
                className="w-12 h-12 rounded-full object-cover shadow-lg"
              />
              <h3 className={`text-2xl font-bold text-gray-800 ${montserrat.className}`}>
                BARBER PLACE
              </h3>
            </div>
            <p className={`text-gray-600 text-sm leading-relaxed ${montserrat.className}`}>
              Your trusted barbershop for premium grooming and styling services.
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className={`text-lg font-bold text-gray-800 mb-4 ${montserrat.className}`}>Contact Us</h3>
            <div className="space-y-3">
              <a 
                href={CONTACT_INFO.whatsapp.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-3 hover:translate-x-1 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gray-300/50 rounded-lg flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                  <Icon name="whatsapp" className="w-5 h-5 text-gray-600" />
                </div>
                <span className={`text-gray-600 text-sm group-hover:text-gray-800 ${montserrat.className}`}>
                  {CONTACT_INFO.whatsapp.number}
                </span>
              </a>
              <a 
                href={CONTACT_INFO.instagram.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-3 hover:translate-x-1 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gray-300/50 rounded-lg flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                  <Icon name="instagram" className="w-5 h-5 text-gray-600" />
                </div>
                <span className={`text-gray-600 text-sm group-hover:text-gray-800 ${montserrat.className}`}>
                  {CONTACT_INFO.instagram.handle}
                </span>
              </a>
            </div>
          </div>

          {/* Hours Section */}
          <div className="space-y-4">
            <h3 className={`text-lg font-bold text-gray-800 mb-4 ${montserrat.className}`}>Opening Hours</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300/50 rounded-lg flex items-center justify-center">
                  <Icon name="calendar" className="w-5 h-5 text-gray-600" />
                </div>
                <p className={`text-gray-600 text-sm ${montserrat.className}`}>Open Everyday</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300/50 rounded-lg flex items-center justify-center">
                  <Icon name="clock" className="w-5 h-5 text-gray-600" />
                </div>
                <p className={`text-gray-600 text-sm font-medium ${montserrat.className}`}>{CONTACT_INFO.hours} WIB</p>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className={`text-lg font-bold text-gray-800 mb-4 ${montserrat.className}`}>Our Locations</h3>
            <div className="space-y-3">
              {CONTACT_INFO.locations.map((location, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-300/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="location" className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className={`text-gray-600 text-sm leading-relaxed ${montserrat.className}`}>{location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8">
          <div className="h-1 flex mb-8 overflow-hidden">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="flex flex-shrink-0">
                <div className="w-4 bg-blue-700"></div>
                <div className="w-4 bg-white"></div>
                <div className="w-4 bg-red-600"></div>
                <div className="w-4 bg-white"></div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-gray-600 text-sm ${montserrat.className}`}>
              &copy; 2024 Barber Place. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#home" className={`text-gray-600 hover:text-gray-800 text-sm transition-colors ${montserrat.className}`}>Home</a>
              <a href="#about" className={`text-gray-600 hover:text-gray-800 text-sm transition-colors ${montserrat.className}`}>Service</a>
              <a href="#gallery" className={`text-gray-600 hover:text-gray-800 text-sm transition-colors ${montserrat.className}`}>Gallery</a>
              <a href="#location" className={`text-gray-600 hover:text-gray-800 text-sm transition-colors ${montserrat.className}`}>About</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
