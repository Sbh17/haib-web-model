import React, { useState, useRef, useEffect } from 'react';
import { Send, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '@/components/chat/ChatMessage';
import haibLogo from '@/assets/haib-logo-light.png';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatProps {
  onBookAppointment?: (bookingData: any) => void;
}

  const Chat: React.FC<ChatProps> = ({ onBookAppointment }) => {
  
  const [inputValue, setInputValue] = useState('');
  const { 
    messages: chatMessages, 
    processMessage, 
    isProcessing,
    voiceEnabled,
    isListening,
    startVoiceInput,
    stopVoiceInput,
    toggleVoiceResponse
  } = useEnhancedChat({ 
    onBookAppointment: undefined // Don't pass the redirect function to prevent navigation
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatMessages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    const messageText = inputValue.trim();
    setInputValue('');
    
    await processMessage(messageText);
  };

  const handleBookAppointment = (bookingData: any) => {
    if (onBookAppointment) {
      onBookAppointment(bookingData);
    } else {
      // Navigate to search with booking data
      navigate('/search', { 
        state: { 
          aiSuggestion: bookingData,
          fromChat: true 
        } 
      });
    }
    
    toast({
      title: "Booking Suggestion",
      description: "I've prepared your booking details. Let's find the perfect salon for you!",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSuggestions = [
    "Book a haircut and blowout for tomorrow",
    "I need bridal makeup for my wedding",
    "Schedule a gel manicure this week",
    "Find me a facial treatment appointment"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-background">
      {/* Chat Header */}
      <div className="border-b border-border bg-gradient-dior backdrop-blur-xl px-8 py-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-beauty-light hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shadow-elegant">
            <img 
              src={haibLogo} 
              alt="HAIB Logo" 
              className="w-8 h-8 object-contain filter invert"
            />
          </div>
          <div>
            <h1 className="text-xl font-luxury font-medium text-beauty-light tracking-wide">Beauty Concierge</h1>
            <p className="text-sm text-beauty-light/70 font-light">
              {isProcessing ? 'Crafting your experience...' : 'At your service'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-8">
        <div className="py-8 space-y-8">
          {chatMessages.length === 1 && (
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-6 text-left justify-start whitespace-normal bg-card/50 border-border text-foreground hover:bg-card hover:border-border/80 font-light backdrop-blur-sm transition-all duration-300 shadow-soft"
                    onClick={() => setInputValue(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${!message.isAI ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[75%] rounded-3xl px-6 py-4 ${
                  !message.isAI
                    ? 'bg-gradient-champagne text-beauty-dark dark:text-beauty-dark ml-6 shadow-elegant'
                    : 'bg-card/80 border border-border text-foreground mr-6 backdrop-blur-sm shadow-soft'
                }`}
              >
                <p className={`whitespace-pre-wrap leading-relaxed ${!message.isAI ? 'font-medium' : 'font-light'}`}>
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-3 font-light ${
                    !message.isAI
                      ? 'text-beauty-dark/60 dark:text-beauty-dark/60'
                      : 'text-muted-foreground'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-card/80 border border-border rounded-3xl px-6 py-4 mr-6 backdrop-blur-sm shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-muted-foreground font-light">Concierge is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card/20 backdrop-blur-xl p-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your beauty aspirations..."
              className="min-h-[52px] max-h-[120px] resize-none bg-card/50 border-border text-foreground placeholder:text-muted-foreground backdrop-blur-sm focus:bg-card/70 focus:border-ring rounded-2xl px-5 py-4 font-light shadow-soft transition-all duration-300"
              rows={1}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="px-6 py-4 h-[52px] bg-gradient-champagne hover:opacity-90 text-beauty-dark font-medium rounded-2xl shadow-elegant transition-all duration-300 hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;