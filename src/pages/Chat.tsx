import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatAgent } from '@/hooks/useChatAgent';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '@/components/chat/ChatMessage';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { processMessage, isProcessing } = useChatAgent();
  const { toast } = useToast();
  const navigate = useNavigate();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Welcome message on mount
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: "Hi! I'm your beauty assistant. I can help you find salons, book appointments, and answer questions about beauty services. What would you like to do today?",
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const aiResponse = await processMessage(userMessage.content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Handle booking if AI suggests it
      if (aiResponse.bookingData && onBookAppointment) {
        handleBookAppointment(aiResponse.bookingData);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    }
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
    "Find a nearby salon for haircut",
    "Book a manicure appointment",
    "Show me spa treatments",
    "What services are popular?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-gradient-dior">
      {/* Chat Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-champagne flex items-center justify-center shadow-dior">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-luxury font-medium text-white tracking-wide">Beauty Concierge</h1>
            <p className="text-sm text-white/60 font-light">
              {isProcessing ? 'Crafting your experience...' : 'At your service'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-8">
        <div className="py-8 space-y-8">
          {messages.length === 1 && (
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-6 text-left justify-start whitespace-normal bg-white/5 border-white/20 text-white/90 hover:bg-white/10 hover:border-white/30 font-light backdrop-blur-sm transition-all duration-300 shadow-soft"
                    onClick={() => setInputValue(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[75%] rounded-3xl px-6 py-4 ${
                  message.sender === 'user'
                    ? 'bg-gradient-champagne text-black ml-6 shadow-elegant'
                    : 'bg-white/10 border border-white/20 text-white mr-6 backdrop-blur-sm shadow-dior'
                }`}
              >
                <p className={`whitespace-pre-wrap leading-relaxed ${message.sender === 'user' ? 'font-medium' : 'font-light'}`}>
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-3 font-light ${
                    message.sender === 'user'
                      ? 'text-black/60'
                      : 'text-white/50'
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
              <div className="bg-white/10 border border-white/20 rounded-3xl px-6 py-4 mr-6 backdrop-blur-sm shadow-dior">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-white/70 font-light">Concierge is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-xl p-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your beauty aspirations..."
              className="min-h-[52px] max-h-[120px] resize-none bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm focus:bg-white/15 focus:border-white/30 rounded-2xl px-5 py-4 font-light shadow-inner transition-all duration-300"
              rows={1}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="px-6 py-4 h-[52px] bg-gradient-champagne hover:opacity-90 text-black font-medium rounded-2xl shadow-elegant transition-all duration-300 hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;