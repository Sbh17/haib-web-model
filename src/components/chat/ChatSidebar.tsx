import React, { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import ChatMessage, { ChatMessage as ChatMessageType } from './ChatMessage';
import ChatInput from './ChatInput';
import AIBookingAgent from './AIBookingAgent';

interface ChatSidebarProps {
  onBookAppointment?: (bookingData: any) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onBookAppointment }) => {
  const [isOpen, setIsOpen] = useState(false);
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
      const welcomeMessage: ChatMessageType = {
        id: 'welcome',
        content: "✨ Hi there! I'm your AI beauty assistant. I can help you discover the perfect salon, find available appointments, and even book them for you. What kind of beauty experience are you looking for today?",
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
      await new Promise(resolve => setTimeout(resolve, 1200));
      const aiResponse = await aiAgent.processMessage(content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Connection Error",
        description: "I couldn't process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = (bookingData: any) => {
    if (onBookAppointment) {
      onBookAppointment(bookingData);
      setIsOpen(false);
      toast({
        title: "✨ Booking Started",
        description: "Taking you to complete your beautiful appointment...",
      });
    } else {
      toast({
        title: "Booking Coming Soon",
        description: "Advanced booking integration is being prepared!",
      });
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
        <Button
          onClick={toggleChat}
          className={`
            h-14 w-14 rounded-full shadow-xl transition-all duration-500 ease-out
            ${isOpen 
              ? 'bg-muted border-2 border-border rotate-180' 
              : 'bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-2xl hover:scale-110'
            }
          `}
          size="lg"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
          )}
        </Button>
        
        {/* AI Indicator */}
        {!isOpen && (
          <div className="absolute -top-2 -left-2 flex items-center gap-1">
            <Badge variant="secondary" className="px-2 py-1 text-xs font-medium animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              AI
            </Badge>
          </div>
        )}
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={toggleChat}
        />
      )}

      {/* Chat Sidebar */}
      <div className={`
        fixed right-0 top-0 h-full w-96 bg-background border-l shadow-2xl z-40
        transform transition-all duration-500 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          <div className="relative p-6 border-b">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Beauty Assistant</h3>
                  <p className="text-sm text-muted-foreground">Your personal booking expert</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-4">
              <Badge variant="outline" className="text-xs">
                Find Salons
              </Badge>
              <Badge variant="outline" className="text-xs">
                Book Appointments
              </Badge>
              <Badge variant="outline" className="text-xs">
                Get Recommendations
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onBookAppointment={handleBookAppointment}
            />
          ))}
          
          {isLoading && (
            <div className="flex gap-3 mb-4 animate-fade-in">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3 max-w-xs">
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
        <div className="border-t p-4 bg-muted/30">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder="Ask me anything about beauty services..."
          />
          
          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Find hair salons near me",
                  "Book a massage",
                  "Show nail art services"
                ].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleSendMessage(suggestion)}
                  >
                    {suggestion}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;