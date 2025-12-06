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
  const hasParentheses = name.includes('(');
  const mainName = hasParentheses ? name.split('(')[0].trim() : name;
  const subName = hasParentheses ? '(' + name.split('(')[1] : '';

  return (
    <div className="border-b border-gray-200 pb-3">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col">
          <span className="font-medium text-gray-600">{mainName}</span>
          {hasParentheses && (
            <span className="text-sm text-gray-500 mt-1">{subName}</span>
          )}
        </div>
        <span className="font-bold text-red-600 flex-shrink-0">{price}</span>
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
    <div className="group bg-white p-6 rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-dashed border-gray-300 h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-gray-50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-gray-50 to-transparent"></div>
      <div className="flex items-center justify-center gap-3 mb-6 pb-4 border-b-2 border-dashed border-gray-200">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 via-red-50 to-blue-50 rounded-full flex items-center justify-center">
          <i className={`${getIconClass()} text-2xl text-gray-600`}></i>
        </div>
        <h3 className={`text-xl font-bold text-gray-700 ${montserrat.className}`}>
          {title}
        </h3>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <PriceItem key={index} name={item.name} price={item.price} />
        ))}
      </div>
    </div>
  );
}

export default function Pricelist() {
  return (
    <div id="service" className="bg-gray-50 py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Pricelist" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PriceCategory title={PRICELIST.haircut.title} items={PRICELIST.haircut.items} />
          <PriceCategory title={PRICELIST.treatment.title} items={PRICELIST.treatment.items} />
          <PriceCategory title={PRICELIST.products.title} items={PRICELIST.products.items} />
        </div>
      </div>
    </div>
  );
}