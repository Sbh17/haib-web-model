import React, { useState } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInterface from './ChatInterface';

interface FloatingChatButtonProps {
  onBookAppointment?: (bookingData: any) => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onBookAppointment }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setIsMinimized(false);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setIsMinimized(false);
  };

  const handleMinimizeChat = () => {
    setIsChatOpen(false);
    setIsMinimized(true);
  };

  const handleRestoreChat = () => {
    setIsChatOpen(true);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          {isMinimized && (
            <div className="mb-3 animate-fade-in">
              <Button
                onClick={handleRestoreChat}
                className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300 bg-secondary hover:bg-secondary/90"
                size="sm"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          )}
          
          <Button
            onClick={handleOpenChat}
            className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90"
            size="lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          {/* Pulsing indicator */}
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        onMinimize={handleMinimizeChat}
        onBookAppointment={onBookAppointment}
      />
    </>
  );
};

export default FloatingChatButton;