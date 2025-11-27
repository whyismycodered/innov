import Link from 'next/link';
import type { ReactNode } from 'react';

type ServiceCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  target?: string; // Made it optional with ?
};

export default function ServiceCard({ icon, title, description, href, target }: ServiceCardProps) {
  const gradientClasses = 'bg-gradient-to-r from-[#009EFF] to-[#66c5ff]';
  
  return (
    <Link 
      href={href} 
      className="group block"
      target={target} 
      rel={target === "_blank" ? "noopener noreferrer" : undefined} 
    >
      {/* Outer wrapper with gradient border */}
      <div className={`p-[1px] rounded-full ${gradientClasses} shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out`}>
        {/* Inner content with white background */}
        <div className="flex items-center gap-3 bg-white rounded-full px-6 py-4 hover:scale-105 transition-transform duration-300 ease-in-out">
          {/* Icon */}
          <div className="bg-gradient-to-r from-[#009EFF] to-[#66c5ff] text-white p-2 rounded-full flex-shrink-0">
            {icon}
          </div>
          
          {/* Text */}
          <div className="flex flex-col items-start text-left">
            <h3 className="font-bold text-sm text-blue-400 uppercase tracking-wide">
              {title}
            </h3>
            <p className="text-blue-400 text-xs">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}