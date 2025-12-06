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
  const getIcon = () => {
    if (title.includes('Hair Cut')) return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z';
    if (title.includes('Treatment')) return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z';
    return 'M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z';
  };

  return (
    <div className="group bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 h-full">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d={getIcon()} />
          </svg>
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