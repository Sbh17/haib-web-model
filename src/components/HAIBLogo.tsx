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
    sm: 'gap-4',
    md: 'gap-6', 
    lg: 'gap-8',
    xl: 'gap-12'
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
        "font-inter font-medium text-white tracking-wider transition-all duration-300",
        sizeClasses[size]
      )}>
        H
      </span>
      
      {/* A letter */}
      <span className={cn(
        "font-inter font-medium text-white tracking-wider transition-all duration-300 underline underline-offset-4",
        sizeClasses[size]
      )}>
        A
      </span>
      
      {/* I letter */}
      <span className={cn(
        "font-inter font-medium text-white tracking-wider transition-all duration-300 underline underline-offset-4",
        sizeClasses[size]
      )}>
        I
      </span>
      
      {/* B letter */}
      <span className={cn(
        "font-inter font-medium text-white tracking-wider transition-all duration-300",
        sizeClasses[size]
      )}>
        B
      </span>
    </div>
  );
};

export default HAIBLogo;