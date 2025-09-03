import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import ChatMessage, { ChatMessage as ChatMessageType } from './ChatMessage';
import AIBookingAgent from './AIBookingAgent';

interface SleekChatWidgetProps {
  onBookAppointment?: (bookingData: any) => void;
}

const SleekChatWidget: React.FC<SleekChatWidgetProps> = ({ onBookAppointment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAgent] = useState(() => new AIBookingAgent());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessageType = {
        id: 'welcome',
        content: "✨ Hello! I'm your AI beauty assistant. How can I help you book the perfect appointment today?",
        isAI: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: inputValue,
      isAI: false,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const aiResponse = await aiAgent.processMessage(inputValue);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Couldn't process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBookAppointment = (bookingData: any) => {
    if (onBookAppointment) {
      onBookAppointment(bookingData);
      setIsOpen(false);
      toast({
        title: "Booking Started",
        description: "Redirecting to complete your appointment...",
      });
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Sleek Chat Interface */}
      {isOpen && (
        <div className="mb-6 w-96 h-[500px] bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Minimal Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">AI</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onBookAppointment={handleBookAppointment}
              />
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted/60 rounded-2xl px-4 py-3 max-w-xs backdrop-blur-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Modern Input */}
          <div className="p-6 pt-4">
            <div className="relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="pr-12 h-12 rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="absolute right-2 top-2 h-8 w-8 p-0 rounded-xl"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sleek Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          h-16 w-16 rounded-full shadow-2xl transition-all duration-500 ease-out border-0
          ${isOpen 
            ? 'bg-muted/80 hover:bg-muted text-muted-foreground backdrop-blur-xl rotate-0' 
            : 'bg-gradient-to-br from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/90 hover:to-primary/80 text-primary-foreground hover:scale-110 hover:shadow-primary/25'
          }
        `}
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-300" />
        ) : (
          <div className="relative">
            <span className="h-7 w-7 font-bold text-sm flex items-center justify-center transition-transform duration-300">AI</span>
            {/* Pulsing indicator */}
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-green-400 rounded-full animate-ping" />
          </div>
        )}
      </Button>
    </div>
  );
};

export default SleekChatWidget;