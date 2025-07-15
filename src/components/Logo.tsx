
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import lightLogo from '@/assets/haib-logo-light.png';
import darkLogo from '@/assets/haib-logo-dark.png';

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
        src={theme === 'light' ? lightLogo : darkLogo}
        alt="HAIB Logo"
        width={width}
        height={height}
        className="object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
};

export default Logo;
