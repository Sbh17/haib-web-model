
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', width = 120, height = 40 }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={theme === 'light' ? '/logo-light.png' : '/logo-dark.png'}
        alt="HAIB Logo"
        width={width}
        height={height}
        className="object-contain"
      />
    </div>
  );
};

export default Logo;
