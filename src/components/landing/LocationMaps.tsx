import { LOCATIONS, CONTACT_INFO } from '@/constants/data';
import Icon from '@/components/ui/Icon';

interface MapCardProps {
  name: string;
  address: string;
  mapUrl: string;
  contact: string;
  instagram: string;
  hours: string;
}

function MapCard({ name, address, mapUrl, contact, instagram, hours }: MapCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Icon name="location" className="w-5 h-5 text-gray-600" />
            <h3 className="text-xl font-bold text-black">{name}</h3>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{address}</p>
          
          <div>
            <h4 className="text-sm font-semibold text-black mb-1">Operational Hours</h4>
            <div className="flex items-center gap-2">
              <Icon name="clock" className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">10.00 - 22.00 WIB</span>
            </div>
          </div>
        </div>
        
        {/* Right - Map */}
        <div>
          <iframe 
            src={mapUrl}
            width="100%" 
            height="250" 
            style={{border: 0}} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}

export default function LocationMaps() {
  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left - Maps */}
        <div className="space-y-12">
          {/* Barberplace One */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Icon name="location" className="w-5 h-5 text-red-600" />
              <span className="text-lg font-semibold text-black">Barberplace One</span>
            </div>
            <p className="text-sm text-gray-600 ml-8">Jl. Kapugeran No.12 L, RT.008/RW.002, Rangkasbitung, Lebak, Banten</p>
            <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200">
              <iframe 
                src={LOCATIONS[0].mapUrl}
                width="100%" 
                height="200" 
                style={{border: 0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              />
            </div>
          </div>
          
          {/* Barberplace Venus */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Icon name="location" className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold text-black">Barberplace Venus</span>
            </div>
            <p className="text-sm text-gray-600 ml-8">Jl. Kapugeran No.12 L, RT.008/RW.002, Rangkasbitung, Lebak, Banten</p>
            <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200">
              <iframe 
                src={LOCATIONS[1].mapUrl}
                width="100%" 
                height="200" 
                style={{border: 0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Right - Info */}
        <div className="flex items-center justify-center">
          <div className="text-center space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-black">We Are Open Everyday!</h3>
            <p className="text-lg leading-relaxed text-black">10.00 - 22.00 WIB</p>
            
            <div className="space-y-4 mt-8">
              <p className="text-lg font-semibold text-black">Mau booking? Hubungi kontak ini:</p>
              
              <div className="space-y-3">
                <a href={CONTACT_INFO.whatsapp.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 p-3 hover:text-gray-600 transition-colors">
                  <Icon name="whatsapp" className="w-6 h-6 text-black" />
                  <span className="text-black font-medium">{CONTACT_INFO.whatsapp.number}</span>
                </a>
                
                <a href={CONTACT_INFO.instagram.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 p-3 hover:text-gray-600 transition-colors">
                  <Icon name="instagram" className="w-6 h-6 text-black" />
                  <span className="text-black font-medium">{CONTACT_INFO.instagram.handle}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}