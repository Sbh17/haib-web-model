import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Mic, MicOff, Volume2, VolumeX, Minimize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import { useNavigate } from 'react-router-dom';

interface GlobalAIChatFooterProps {
  onBookAppointment?: (bookingData: any) => void;
}

const GlobalAIChatFooter: React.FC<GlobalAIChatFooterProps> = ({ onBookAppointment }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isProcessing,
    isListening,
    voiceEnabled,
    processMessage,
    startVoiceInput,
    stopVoiceInput,
    toggleVoiceResponse,
    resetConversation
  } = useEnhancedChat({ 
    onBookAppointment: (bookingData) => {
      // Navigate to booking page with AI suggestion
      navigate('/search', { 
        state: { 
          aiSuggestion: bookingData,
          fromChat: true 
        } 
      });
    },
    enableVoice: true 
  });

  const [inputValue, setInputValue] = useState('');

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const messageToSend = inputValue;
    setInputValue('');
    await processMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput();
    }
  };

  const quickActions = [
    "Book a haircut appointment",
    "Find nail salons near me", 
    "Show my appointments",
    "Browse promotions",
    "Find beauty services"
  ];

  // Floating button when closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 md:h-16 md:w-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:scale-105 group"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 md:h-7 md:w-7 transition-transform group-hover:scale-110" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
        </Button>
      </div>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-80 shadow-2xl border-2 border-primary/20">
        <CardHeader className="pb-3 px-4 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <div className="relative">
                <User className="h-4 w-4 text-primary animate-pulse" />
                <Sparkles className="h-2 w-2 text-primary absolute -top-0.5 -right-0.5 animate-pulse" />
              </div>
              AI Beauty Assistant
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(false)}
                className="h-6 w-6"
              >
                <MessageCircle className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm md:w-96 h-[75vh] md:h-[600px] shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-3 px-4 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <User className="h-5 w-5 text-primary animate-pulse" />
              <Sparkles className="h-2 w-2 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            AI Beauty Assistant
          </CardTitle>
          <div className="flex gap-1">
            {voiceEnabled && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVoiceResponse}
                className="h-7 w-7"
                title="Toggle voice response"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="h-7 w-7"
              title="Minimize"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[calc(100%-64px)] md:h-[calc(100%-80px)]">
        {/* Quick Actions */}
        <div className="p-3 md:p-4 border-b bg-muted/30">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Quick Actions</h4>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.slice(0, 3).map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto py-2 px-3 text-xs leading-tight hover:bg-primary/5 border-primary/20"
                onClick={() => {
                  setInputValue(action);
                  inputRef.current?.focus();
                }}
              >
                {action}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-3 md:p-4" ref={scrollRef}>
          <div className="space-y-3 md:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 md:gap-3 ${!message.isAI ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  !message.isAI 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-muted text-muted-foreground border border-border'
                }`}>
                  {!message.isAI ? <User className="h-3 w-3 md:h-4 md:w-4" /> : (
                    <div className="relative">
                      <User className="h-3 w-3 md:h-4 md:w-4" />
                      <Sparkles className="h-1 w-1 md:h-2 md:w-2 absolute -top-0 -right-0 md:-top-0.5 md:-right-0.5" />
                    </div>
                  )}
                </div>
                <div className={`max-w-[75%] md:max-w-[70%] p-3 rounded-2xl shadow-sm ${
                  !message.isAI
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/80 text-foreground border border-border/50'
                }`}>
                  <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className="text-[10px] md:text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-2 md:gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted border border-border flex items-center justify-center">
                  <div className="relative">
                    <User className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground animate-pulse" />
                    <Sparkles className="h-1 w-1 md:h-2 md:w-2 text-muted-foreground absolute -top-0 -right-0 md:-top-0.5 md:-right-0.5 animate-pulse" />
                  </div>
                </div>
                <div className="bg-muted/80 p-3 rounded-2xl border border-border/50">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-3 md:p-4 border-t bg-background/80 backdrop-blur-sm">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about beauty services..."
                className="pr-12 focus:ring-2 focus:ring-primary/20 text-sm border-border/50 bg-background/80"
                disabled={isProcessing}
                autoComplete="off"
              />
              {voiceEnabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceToggle}
                  className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 ${
                    isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground hover:text-primary'
                  }`}
                  disabled={isProcessing}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 shadow-sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {isProcessing && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
              <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full"></div>
              AI is thinking...
            </div>
          )}
          {isListening && (
            <div className="mt-2 text-xs text-red-500 flex items-center gap-2">
              <div className="animate-pulse h-3 w-3 bg-red-500 rounded-full"></div>
              Listening... Speak now
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalAIChatFooter;