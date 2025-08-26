import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface HAIBLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const HAIBLogo: React.FC<HAIBLogoProps> = ({ className = '', size = 'lg' }) => {
  const { t, isRTL } = useLanguage();
  
  // Get the letters from the welcome title
  const letters = t.welcomeTitle.split('');
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-20 h-20 text-3xl'
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
      {letters.map((letter, index) => (
        <div
          key={index}
          className={cn(
            "bg-white border-2 border-white/20 flex items-center justify-center font-bold text-black tracking-wider shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
            sizeClasses[size]
          )}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default HAIBLogo;