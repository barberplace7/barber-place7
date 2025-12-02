import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export default function SectionHeader({ title, className = "" }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-20 sm:mb-24 ${className}`}>
      <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-black ${montserrat.className}`}>
        {title}
      </h2>
      <div className="w-16 sm:w-20 md:w-24 h-1 mx-auto flex">
        <div className="flex-1 bg-blue-700"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-red-600"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-blue-700"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-red-600"></div>
      </div>
    </div>
  );
}