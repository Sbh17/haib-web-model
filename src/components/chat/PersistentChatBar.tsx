import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Mic, MicOff, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PersistentChatBarProps {
  onBookAppointment?: (bookingData: any) => void;
}

const PersistentChatBar: React.FC<PersistentChatBarProps> = ({ onBookAppointment }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
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
  } = useEnhancedChat({ 
    onBookAppointment: (bookingData) => {
      navigate('/search', { 
        state: { 
          aiSuggestion: bookingData,
          fromChat: true 
        } 
      });
    },
    enableVoice: true 
  });

  // Auto scroll to bottom when expanded
  useEffect(() => {
    if (scrollRef.current && isExpanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isExpanded]);

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

  const handleInputFocus = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isExpanded && e.target.value) {
      setIsExpanded(true);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput();
      if (!isExpanded) {
        setIsExpanded(true);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border">
      {/* Expanded Chat Window */}
      {isExpanded && (
        <div className="max-h-96 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">AI Beauty Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 max-h-60 p-3" ref={scrollRef}>
            <div className="space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-4">
                  <Bot className="h-8 w-8 mx-auto mb-2 text-primary/50" />
                  <p>Hi! I'm your AI beauty assistant.</p>
                  <p>Ask me about appointments, salons, or services!</p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${!message.isAI ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                    !message.isAI 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground border border-border'
                  )}>
                    {!message.isAI ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-2 rounded-lg text-sm",
                    !message.isAI
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/80 text-foreground border border-border/50'
                  )}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center">
                    <Bot className="h-3 w-3 text-muted-foreground animate-pulse" />
                  </div>
                  <div className="bg-muted/80 p-2 rounded-lg border border-border/50">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-3">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          {/* AI Indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bot className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Ask AI</span>
          </div>

          {/* Input Field */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyPress}
              placeholder="Ask about beauty services, book appointments..."
              className={cn(
                "pr-20 transition-all duration-200 bg-background/80",
                isExpanded ? "ring-2 ring-primary/20" : ""
              )}
              disabled={isProcessing}
              autoComplete="off"
            />
            
            {/* Voice Button */}
            {voiceEnabled && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVoiceToggle}
                className={cn(
                  "absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7",
                  isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground hover:text-primary'
                )}
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
              </Button>
            )}

            {/* Send Button */}
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 bg-primary hover:bg-primary/90"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>

          {/* Expand Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>

        {/* Status Indicators */}
        {(isProcessing || isListening) && (
          <div className="mt-2 text-center">
            {isProcessing && (
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full"></div>
                AI is thinking...
              </div>
            )}
            {isListening && (
              <div className="text-xs text-red-500 flex items-center justify-center gap-2">
                <div className="animate-pulse h-3 w-3 bg-red-500 rounded-full"></div>
                Listening... Speak now
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersistentChatBar;