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
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };
  
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4', 
    lg: 'gap-5',
    xl: 'gap-6'
  };

  return (
    <div className={cn(
      "flex items-center justify-center",
      gapClasses[size],
      isRTL && "flex-row-reverse",
      className
    )}>
      {/* H letter in white square */}
      <div className="bg-white rounded-sm px-2 pb-1 pt-0 flex items-center justify-center">
        <span className={cn(
          "font-luxury font-bold text-black tracking-wider transition-all duration-300",
          sizeClasses[size]
        )}>
          H
        </span>
      </div>
      
      {/* A letter in white square */}
      <div className="bg-white rounded-sm px-2 pb-1 pt-0 flex items-center justify-center">
        <span className={cn(
          "font-luxury font-bold text-black tracking-wider transition-all duration-300",
          sizeClasses[size]
        )}>
          A
        </span>
      </div>
      
      {/* I letter in white square */}
      <div className="bg-white rounded-sm px-2 pb-1 pt-0 flex items-center justify-center">
        <span className={cn(
          "font-luxury font-bold text-black tracking-wider transition-all duration-300",
          sizeClasses[size]
        )}>
          I
        </span>
      </div>
      
      {/* B letter in white square */}
      <div className="bg-white rounded-sm px-2 pb-1 pt-0 flex items-center justify-center">
        <span className={cn(
          "font-luxury font-bold text-black tracking-wider transition-all duration-300",
          sizeClasses[size]
        )}>
          B
        </span>
      </div>
    </div>
  );
};

export default HAIBLogo;