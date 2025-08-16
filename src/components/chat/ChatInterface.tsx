import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ChatMessage, { ChatMessage as ChatMessageType } from './ChatMessage';
import ChatInput from './ChatInput';
import AIBookingAgent from './AIBookingAgent';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onBookAppointment?: (bookingData: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isOpen,
  onClose,
  onMinimize,
  onBookAppointment
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAgent] = useState(() => new AIBookingAgent());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize conversation with welcome message
      const welcomeMessage: ChatMessageType = {
        id: 'welcome',
        content: "Hello! I'm your AI booking assistant. I'm here to help you find and book the perfect appointment. What can I help you with today?",
        isAI: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content,
      isAI: false,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate thinking delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = await aiAgent.processMessage(content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Sorry, I couldn't process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = (bookingData: any) => {
    if (onBookAppointment) {
      onBookAppointment(bookingData);
      onClose();
      toast({
        title: "Booking Initiated",
        description: "Redirecting you to complete your appointment booking...",
      });
    } else {
      toast({
        title: "Booking Feature",
        description: "Booking integration will be available soon!",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-end p-4 z-50 animate-fade-in md:items-center md:justify-center">
      <div className="bg-background rounded-2xl shadow-2xl border w-full max-w-md h-[600px] flex flex-col animate-scale-in md:max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary/5 rounded-t-2xl">
          <div>
            <h3 className="font-semibold text-lg">AI Booking Assistant</h3>
            <p className="text-sm text-muted-foreground">Find your perfect appointment</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onBookAppointment={handleBookAppointment}
            />
          ))}
          
          {isLoading && (
            <div className="flex gap-3 mb-4 animate-fade-in">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder="Ask me about your perfect appointment..."
        />
      </div>
    </div>
  );
};

export default ChatInterface;