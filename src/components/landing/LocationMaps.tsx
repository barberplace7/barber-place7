import { LOCATIONS } from '@/constants/data';
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
      <div className="space-y-8">
        {/* First Location */}
        <MapCard 
          name={LOCATIONS[0].name}
          address={LOCATIONS[0].address}
          mapUrl={LOCATIONS[0].mapUrl}
          contact={LOCATIONS[0].contact}
          instagram={LOCATIONS[0].instagram}
          hours={LOCATIONS[0].hours}
        />
        
        {/* Second Location */}
        <MapCard 
          name={LOCATIONS[1].name}
          address={LOCATIONS[1].address}
          mapUrl={LOCATIONS[1].mapUrl}
          contact={LOCATIONS[1].contact}
          instagram={LOCATIONS[1].instagram}
          hours={LOCATIONS[1].hours}
        />
      </div>
    </div>
  );
}