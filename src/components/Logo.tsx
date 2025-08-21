
import React from 'react';
import darkLogo from '@/assets/haib-logo-dark.png';
import lightLogo from '@/assets/haib-logo-light.png';
import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', width = 120, height = 40 }) => {
  const { theme } = useTheme();
  
  // Use dark logo for light theme, light logo for dark theme
  const logoSrc = theme === 'light' ? darkLogo : lightLogo;
  
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="HAIB Logo"
        width={width}
        height={height}
        className="object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
};

export default Logo;
