import { Montserrat } from 'next/font/google';
import { PRICELIST } from '@/constants/data';
import SectionHeader from '@/components/ui/SectionHeader';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

interface PriceItemProps {
  name: string;
  price: string;
}

function PriceItem({ name, price }: PriceItemProps) {
  // Extract main name and description in parentheses
  const match = name.match(/^([^(]+)\s*\(([^)]+)\)$/);
  const mainName = match ? match[1].trim() : name;
  const description = match ? match[2].trim() : null;
  
  return (
    <div className="group border-b border-gray-100 pb-3 sm:pb-4 pt-1 hover:border-gray-200 transition-all duration-200">
      <div className="flex items-start gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200 leading-relaxed text-sm sm:text-base">
            {mainName}
          </div>
          {description && (
            <div className="text-xs sm:text-sm text-gray-500 mt-1">
              {description}
            </div>
          )}
        </div>
        <div className="w-16 sm:w-20 md:w-24 text-left">
          <span className="font-semibold text-red-600 text-sm sm:text-base">{price}</span>
        </div>
      </div>
    </div>
  );
}

interface PriceCategoryProps {
  title: string;
  items: PriceItemProps[];
}

function PriceCategory({ title, items }: PriceCategoryProps) {
  const getCategoryIcon = (title: string) => {
    if (title.toLowerCase().includes('hair') || title.toLowerCase().includes('cut')) {
      return 'ri-scissors-2-line text-gray-600';
    } else if (title.toLowerCase().includes('treatment')) {
      return 'ri-hand-sanitizer-fill text-gray-600';
    } else {
      return 'ri-shopping-bag-fill text-gray-600';
    }
  };

  const getIconBackgroundColor = (title: string) => {
    return 'bg-gradient-to-br from-white via-blue-50 to-red-50 border-2 border-gray-300/50 group-hover:via-blue-100 group-hover:to-red-100 group-hover:border-gray-400/60';
  };

  const getBorderStyle = (title: string) => {
    return {};
  };

  return (
    <div className="group">
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${getIconBackgroundColor(title)}`}>
          <i className={`${getCategoryIcon(title)} text-lg sm:text-2xl`}></i>
        </div>
        <h3 className={`text-lg sm:text-xl font-bold text-black ${montserrat.className}`}>
          {title}
        </h3>
      </div>
      <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full border border-gray-200" style={getBorderStyle(title)}>
        <div className="space-y-3 sm:space-y-4">
          {items.map((item, index) => (
            <PriceItem key={index} name={item.name} price={item.price} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Pricelist() {
  return (
    <div id="service" className="bg-gray-50 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <SectionHeader title="Pricelist" />
          <p className="text-gray-600 text-sm sm:text-base text-center max-w-5xl mx-auto -mt-12 sm:-mt-14 md:-mt-16 mb-8 sm:mb-12 md:mb-16 px-4">
            Daftar harga layanan lengkap dengan tarif transparan untuk semua kebutuhan grooming Anda
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-stretch">
          <PriceCategory title={PRICELIST.haircut.title} items={PRICELIST.haircut.items} />
          <PriceCategory title={PRICELIST.treatment.title} items={PRICELIST.treatment.items} />
          <PriceCategory title={PRICELIST.products.title} items={PRICELIST.products.items} />
        </div>
      </div>

    </div>
  );
}