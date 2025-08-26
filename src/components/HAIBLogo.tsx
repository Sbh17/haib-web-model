import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface HAIBLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const HAIBLogo: React.FC<HAIBLogoProps> = ({ className = '', size = 'lg' }) => {
  const { t, isRTL } = useLanguage();
  
  const sizeClasses = {
    sm: { text: 'text-2xl', square: 'w-12 h-8 text-sm px-2' },
    md: { text: 'text-4xl', square: 'w-16 h-12 text-lg px-3' },
    lg: { text: 'text-6xl', square: 'w-20 h-16 text-2xl px-4' },
    xl: { text: 'text-8xl', square: 'w-24 h-20 text-3xl px-5' }
  };
  
  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-2', 
    lg: 'gap-3',
    xl: 'gap-4'
  };

  return (
    <div className={cn(
      "flex items-center justify-center",
      gapClasses[size],
      isRTL && "flex-row-reverse",
      className
    )}>
      {/* H */}
      <span className={cn(
        "dior-heading-xl text-beauty-light font-bold tracking-luxury",
        sizeClasses[size].text
      )}>
        H
      </span>
      
      {/* AI in white square */}
      <div className={cn(
        "bg-white border-2 border-white/20 flex items-center justify-center font-bold text-black tracking-wider shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
        sizeClasses[size].square
      )}>
        AI
      </div>
      
      {/* B */}
      <span className={cn(
        "dior-heading-xl text-beauty-light font-bold tracking-luxury",
        sizeClasses[size].text
      )}>
        B
      </span>
    </div>
  );
};

export default HAIBLogo;