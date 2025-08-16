import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import ChatMessage, { ChatMessage as ChatMessageType } from './ChatMessage';
import AIBookingAgent from './AIBookingAgent';

interface ChatSidebarProps {
  onBookAppointment?: (bookingData: any) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onBookAppointment }) => {
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
        content: "Hi there! 👋 I'm your AI beauty assistant. I can help you find salons, book appointments, and answer any questions about beauty services. What would you like to do today?",
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
      await new Promise(resolve => setTimeout(resolve, 800));
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed top-1/2 right-0 -translate-y-1/2 z-40">
        <Button
          onClick={toggleChat}
          className={`
            h-16 w-12 rounded-l-2xl rounded-r-none shadow-lg transition-all duration-300
            ${isOpen 
              ? 'bg-muted hover:bg-muted/80 text-muted-foreground translate-x-0' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:w-14'
            }
          `}
        >
          {isOpen ? (
            <ArrowRight className="h-5 w-5" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <MessageSquare className="h-5 w-5" />
              <Badge variant="secondary" className="h-1.5 w-1.5 p-0 bg-green-500" />
            </div>
          )}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-96 bg-card border-l shadow-2xl z-50
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Assistant</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Online</Badge>
                <Badge variant="outline" className="text-xs">Beauty Expert</Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b bg-muted/20">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Find Salons
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Book Appointment
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Hair Services
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-220px)]">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onBookAppointment={handleBookAppointment}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3 max-w-xs">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="p-4 border-t bg-muted/10">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Try asking:</p>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="justify-start text-left h-auto py-2">
                  "Find hair salons near me"
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-left h-auto py-2">
                  "Book a haircut for tomorrow"
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;