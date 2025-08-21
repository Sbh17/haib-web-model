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
    <div className="fixed bottom-0 left-0 right-0 z-40" style={{ backgroundColor: 'rgb(255, 255, 255)', borderTop: '1px solid rgb(229, 231, 235)' }}>
      {/* Expanded Chat Window */}
      {isExpanded && (
        <div className="max-h-96 flex flex-col" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3" style={{ backgroundColor: 'rgb(249, 250, 251)', borderBottom: '1px solid rgb(229, 231, 235)' }}>
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 animate-pulse" style={{ color: 'rgb(220, 162, 67)' }} />
              <span className="text-sm font-medium" style={{ color: 'rgb(17, 24, 39)' }}>AI Beauty Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6"
              style={{ color: 'rgb(107, 114, 128)' }}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 max-h-60 p-3" ref={scrollRef} style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
            <div className="space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <Bot className="h-8 w-8 mx-auto mb-2" style={{ color: 'rgba(220, 162, 67, 0.5)' }} />
                  <p style={{ color: 'rgb(107, 114, 128)', fontSize: '14px' }}>Hi! I'm your AI beauty assistant.</p>
                  <p style={{ color: 'rgb(107, 114, 128)', fontSize: '14px' }}>Ask me about appointments, salons, or services!</p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${!message.isAI ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  )} style={{
                    backgroundColor: !message.isAI ? 'rgb(220, 162, 67)' : 'rgb(243, 244, 246)',
                    color: !message.isAI ? 'rgb(255, 255, 255)' : 'rgb(107, 114, 128)',
                    border: !message.isAI ? 'none' : '1px solid rgb(229, 231, 235)'
                  }}>
                    {!message.isAI ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>
                  <div className={cn("max-w-[80%] p-2 rounded-lg text-sm")} style={{
                    backgroundColor: !message.isAI ? 'rgb(220, 162, 67)' : 'rgb(249, 250, 251)',
                    color: !message.isAI ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)',
                    border: !message.isAI ? 'none' : '1px solid rgba(229, 231, 235, 0.5)'
                  }}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(243, 244, 246)', border: '1px solid rgb(229, 231, 235)' }}>
                    <Bot className="h-3 w-3 animate-pulse" style={{ color: 'rgb(107, 114, 128)' }} />
                  </div>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgb(249, 250, 251)', border: '1px solid rgba(229, 231, 235, 0.5)' }}>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'rgb(220, 162, 67)' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'rgb(220, 162, 67)', animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'rgb(220, 162, 67)', animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat Input Bar */}
        <div className="p-3" style={{ backgroundColor: '#ffffff' }}>
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            {/* AI Indicator */}
            <div className="flex items-center gap-2 text-sm" style={{ color: '#6b7280' }}>
              <Bot className="h-4 w-4" style={{ color: '#dca243' }} />
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
                className="pr-20 transition-all duration-200 text-gray-900 placeholder-gray-500"
                style={{
                  backgroundColor: '#ffffff',
                  border: isExpanded ? '2px solid rgba(220, 162, 67, 0.2)' : '1px solid #e5e7eb',
                  color: '#111827'
                }}
                disabled={isProcessing}
                autoComplete="off"
              />
              
              {/* Voice Button */}
              {voiceEnabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceToggle}
                  className="absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7"
                  style={{
                    color: isListening ? '#ef4444' : '#6b7280'
                  }}
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
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                style={{
                  backgroundColor: '#dca243',
                  color: '#ffffff'
                }}
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
              style={{ color: '#6b7280' }}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>

          {/* Status Indicators */}
          {(isProcessing || isListening) && (
            <div className="mt-2 text-center">
              {isProcessing && (
                <div className="text-xs flex items-center justify-center gap-2" style={{ color: '#6b7280' }}>
                  <div className="animate-spin h-3 w-3 rounded-full" style={{ border: '2px solid #dca243', borderTopColor: 'transparent' }}></div>
                  AI is thinking...
                </div>
              )}
              {isListening && (
                <div className="text-xs flex items-center justify-center gap-2" style={{ color: '#ef4444' }}>
                  <div className="animate-pulse h-3 w-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
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