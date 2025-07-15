
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', width = 80, height = 28 }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={theme === 'light' ? '/lovable-uploads/739bb5af-9ea5-4ded-95b2-f6d17624d5fd.png' : '/lovable-uploads/60d9893d-80ac-4542-a763-2085e426d7a5.png'}
        alt="HAIB Logo"
        width={width}
        height={height}
        className="object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
};

export default Logo;
