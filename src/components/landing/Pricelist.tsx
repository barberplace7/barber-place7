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
      <span className="text-white font-bold text-lg leading-6">•</span>
      <div className="flex flex-col">
        <span className="text-sm sm:text-base font-medium text-white">{mainName}</span>
        {hasParentheses && (
          <span className="text-xs sm:text-sm text-white/80 mt-0.5">{subName}</span>
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

  const getBgImage = () => {
    if (title.includes('Hair Cut')) return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800';
    if (title.includes('Treatment')) return 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800';
    return 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800';
  };

  return (
    <div className="group backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/50 border-2 border-white hover:border-white h-full relative overflow-hidden cursor-pointer">
      <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-300" style={{backgroundImage: `url('${getBgImage()}')`}}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/75 via-zinc-900/70 to-zinc-800/75"></div>
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-gray-800/30 to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-gray-800/30 to-transparent z-10"></div>
      <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6 pb-3 sm:pb-4 border-b-2 border-dashed border-white">
        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white border-2 border-white rounded-full flex items-center justify-center">
          <i className={`${getIconClass()} text-xl sm:text-2xl text-gray-700`}></i>
        </div>
        <h3 className={`text-base sm:text-lg md:text-xl font-bold text-white ${montserrat.className}`}>
          {title}
        </h3>
      </div>
      <div className="relative z-10 space-y-2 sm:space-y-3">
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