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
  return (
    <div className="flex justify-between items-center border-b border-gray-200 pb-3 gap-4">
      <span className="font-medium text-gray-600">{name}</span>
      <span className="font-bold text-red-600 flex-shrink-0">{price}</span>
    </div>
  );
}

interface PriceCategoryProps {
  title: string;
  items: PriceItemProps[];
}

function PriceCategory({ title, items }: PriceCategoryProps) {
  return (
    <div>
      <h3 className={`text-xl font-bold text-black mb-4 text-center ${montserrat.className}`}>
        {title}
      </h3>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-lg border border-gray-200 h-full">
        <div className="space-y-4">
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
    <div id="service" className="bg-gray-50 py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Pricelist" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <PriceCategory title={PRICELIST.haircut.title} items={PRICELIST.haircut.items} />
          <PriceCategory title={PRICELIST.treatment.title} items={PRICELIST.treatment.items} />
          <PriceCategory title={PRICELIST.products.title} items={PRICELIST.products.items} />
        </div>
      </div>
    </div>
  );
}