import { LOCATIONS } from '@/constants/data';
import Icon from '@/components/ui/Icon';



function MapCard({ name, mapUrl }: { name: string; mapUrl: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Icon name="location" className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-bold text-black text-center">{name}</h3>
      </div>
      <div className="rounded-lg overflow-hidden">
        <iframe 
          src={mapUrl}
          width="100%" 
          height="300" 
          style={{border: 0}} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

export default function LocationMaps() {
  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {LOCATIONS.map((location, index) => (
          <MapCard 
            key={index}
            name={location.name}
            mapUrl={location.mapUrl}
          />
        ))}
      </div>
    </div>
  );
}