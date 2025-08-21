
import React from 'react';
import blackLogo from '@/assets/haib-logo-black.png';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', width = 120, height = 40 }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={blackLogo}
        alt="HAIB Logo"
        width={width}
        height={height}
        className="object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
};

export default Logo;
