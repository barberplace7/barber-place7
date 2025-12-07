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

function PriceItem({ name }: { name: string }) {
  const hasParentheses = name.includes('(');
  const mainName = hasParentheses ? name.split('(')[0].trim() : name;
  const subName = hasParentheses ? '(' + name.split('(')[1] : '';

  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-400 mt-1">•</span>
      <div className="flex flex-col">
        <span className="text-sm sm:text-base font-medium text-gray-300">{mainName}</span>
        {hasParentheses && (
          <span className="text-xs sm:text-sm text-gray-400 mt-0.5">{subName}</span>
        )}
      </div>
    </div>
  );
}

interface PriceCategoryProps {
  title: string;
  items: PriceItemProps[];
}

function PriceCategory({ title, items }: PriceCategoryProps) {
  const getIconClass = () => {
    if (title.includes('Hair Cut')) return 'ri-scissors-2-fill';
    if (title.includes('Treatment')) return 'ri-user-heart-fill';
    return 'ri-shopping-bag-fill';
  };

  return (
    <div className="group bg-zinc-900 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/50 border-2 border-gray-400 hover:border-gray-600 h-full relative overflow-hidden cursor-pointer">
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-gray-800/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-gray-800/30 to-transparent"></div>
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6 pb-3 sm:pb-4 border-b-2 border-dashed border-gray-700">
        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-blue-100 via-white to-red-100 rounded-full flex items-center justify-center">
          <i className={`${getIconClass()} text-xl sm:text-2xl text-gray-700`}></i>
        </div>
        <h3 className={`text-base sm:text-lg md:text-xl font-bold text-white ${montserrat.className}`}>
          {title}
        </h3>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {items.map((item, index) => (
          <PriceItem key={index} name={item.name} />
        ))}
      </div>
    </div>
  );
}

export default function Pricelist() {
  return (
    <div id="service" className="bg-transparent py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Our Services" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-8">
          <PriceCategory title={PRICELIST.haircut.title} items={PRICELIST.haircut.items} />
          <PriceCategory title={PRICELIST.treatment.title} items={PRICELIST.treatment.items} />
          <PriceCategory title={PRICELIST.products.title} items={PRICELIST.products.items} />
        </div>
      </div>
    </div>
  );
}