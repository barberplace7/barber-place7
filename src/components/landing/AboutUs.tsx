import { Montserrat } from 'next/font/google';
import SectionHeader from '@/components/ui/SectionHeader';
import Icon from '@/components/ui/Icon';
import { CONTACT_INFO } from '@/constants/data';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function AboutUs() {
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
      <SectionHeader title="About Us" />
      
      <div className="mb-6 sm:mb-7 md:mb-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
        {/* Contact */}
        <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon name="whatsapp" className="w-7 h-7 text-gray-600" />
            </div>
          </div>
          <h4 className={`text-lg font-bold text-black mb-4 text-center ${montserrat.className}`}>Contact</h4>
          <div className="space-y-2">
            <a href={CONTACT_INFO.whatsapp.url} target="_blank" rel="noopener noreferrer" className={`flex items-start gap-2 text-gray-700 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100 ${montserrat.className}`}>
              <Icon name="whatsapp" className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-600" />
              <span className="text-xs font-medium">{CONTACT_INFO.whatsapp.number}</span>
            </a>
            <a href={CONTACT_INFO.instagram.url} target="_blank" rel="noopener noreferrer" className={`flex items-start gap-2 text-gray-700 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100 ${montserrat.className}`}>
              <Icon name="instagram" className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-600" />
              <span className="text-xs font-medium">{CONTACT_INFO.instagram.handle}</span>
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon name="location" className="w-7 h-7 text-gray-600" />
            </div>
          </div>
          <h4 className={`text-lg font-bold text-black mb-4 text-center ${montserrat.className}`}>Location</h4>
          <div className="space-y-2">
            {CONTACT_INFO.locations.map((location, index) => (
              <div key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Icon name="location" className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <span className={`text-xs text-gray-700 ${montserrat.className}`}>{location}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Hours */}
        <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon name="clock" className="w-7 h-7 text-gray-600" />
            </div>
          </div>
          <h4 className={`text-lg font-bold text-black mb-4 text-center ${montserrat.className}`}>Operational Hours</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Icon name="calendar" className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
              <span className={`text-xs text-gray-700 font-medium ${montserrat.className}`}>Open Everyday</span>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Icon name="clock" className="w-4 h-4 text-gray-600" />
              <span className={`text-xs text-gray-700 font-medium ${montserrat.className}`}>{CONTACT_INFO.hours} WIB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
