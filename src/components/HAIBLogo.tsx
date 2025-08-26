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
    sm: 'gap-1',
    md: 'gap-1.5', 
    lg: 'gap-2',
    xl: 'gap-2.5'
  };

  return (
    <div className={cn(
      "flex items-center justify-center",
      gapClasses[size],
      isRTL && "flex-row-reverse",
      className
    )}>
      {/* H letter */}
      <span className={cn(
        "font-luxury font-bold text-white tracking-wider transition-all duration-300",
        sizeClasses[size]
      )}>
        H
      </span>
      
      {/* A and I letters in white square */}
      <div className="bg-white rounded-sm px-1 py-0.5 flex items-center gap-1">
        <span className={cn(
          "font-luxury font-bold text-black tracking-wider transition-all duration-300",
          sizeClasses[size]
        )}>
          A
        </span>
        <span className={cn(
          "font-luxury font-bold text-black tracking-wider transition-all duration-300",
          sizeClasses[size]
        )}>
          I
        </span>
      </div>
      
      {/* B letter */}
      <span className={cn(
        "font-luxury font-bold text-white tracking-wider transition-all duration-300",
        sizeClasses[size]
      )}>
        B
      </span>
    </div>
  );
};

export default HAIBLogo;