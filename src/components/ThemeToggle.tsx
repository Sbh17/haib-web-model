
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className, 
  variant = 'ghost', 
  size = 'icon' 
}) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={toggleTheme} 
      className={className}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-200" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-200" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
