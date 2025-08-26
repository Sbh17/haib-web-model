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
    sm: { text: 'text-2xl', square: 'w-12 h-8 text-sm px-2', bigText: 'text-4xl' },
    md: { text: 'text-4xl', square: 'w-16 h-10 text-base px-3', bigText: 'text-6xl' },
    lg: { text: 'text-6xl', square: 'w-20 h-12 text-xl px-4', bigText: 'text-8xl' },
    xl: { text: 'text-8xl', square: 'w-24 h-16 text-3xl px-5', bigText: 'text-9xl' }
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
      {/* H - white text, no square, bigger size */}
      <span className={cn(
        "dior-heading-xl text-white font-bold tracking-luxury",
        sizeClasses[size].bigText
      )}>
        H
      </span>
      
      {/* A in white square */}
      <div className={cn(
        "bg-white border-2 border-white/20 flex items-center justify-center font-bold text-black tracking-wider shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
        sizeClasses[size].square
      )}>
        A
      </div>
      
      {/* I in white square */}
      <div className={cn(
        "bg-white border-2 border-white/20 flex items-center justify-center font-bold text-black tracking-wider shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
        sizeClasses[size].square
      )}>
        I
      </div>
      
      {/* B - white text, no square, bigger size */}
      <span className={cn(
        "dior-heading-xl text-white font-bold tracking-luxury",
        sizeClasses[size].bigText
      )}>
        B
      </span>
    </div>
  );
};

export default HAIBLogo;