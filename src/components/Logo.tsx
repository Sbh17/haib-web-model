
import React from 'react';
import haibLogo from '/lovable-uploads/0d3558d9-bc4c-4700-92c4-a2959fffbaad.png';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', width = 100, height = 32 }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={haibLogo}
        alt="HAIB Logo"
        width={width}
        height={height}
        className="object-contain drop-shadow-elegant transition-all duration-300 hover:drop-shadow-champagne"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
      />
    </div>
  );
};

export default Logo;
