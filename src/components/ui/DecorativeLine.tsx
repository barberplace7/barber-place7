interface DecorativeLineProps {
  className?: string;
}

export default function DecorativeLine({ className = "" }: DecorativeLineProps) {
  return (
    <div className={`w-full h-0.5 mx-auto flex ${className}`}>
      {Array.from({ length: 50 }, (_, i) => (
        <div key={i} className={`flex-1 ${i % 4 === 0 ? 'bg-blue-700' : i % 4 === 1 ? 'bg-white' : i % 4 === 2 ? 'bg-red-600' : 'bg-white'}`}></div>
      ))}
    </div>
  );
}