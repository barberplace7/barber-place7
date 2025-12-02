import { ICONS } from '@/constants/data';

interface IconProps {
  name: keyof typeof ICONS;
  className?: string;
}

export default function Icon({ name, className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d={ICONS[name]} />
    </svg>
  );
}