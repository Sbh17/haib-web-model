
import React from 'react';
import haibLogo from '/lovable-uploads/0d3558d9-bc4c-4700-92c4-a2959fffbaad.png';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', width = 120, height = 40 }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={haibLogo}
        alt="HAIB Logo"
        width={width}
        height={height}
        className="object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
};

export default Logo;
