import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Mic, MicOff, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PersistentChatBarProps {
  onBookAppointment?: (bookingData: any) => void;
}

const PersistentChatBar: React.FC<PersistentChatBarProps> = ({ onBookAppointment }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
  
  // Hide assistant on welcome and auth screens - AFTER all hooks are called
  const hideOnPages = ['/welcome', '/auth', '/register'];
  if (hideOnPages.includes(location.pathname)) {
    return null;
  }

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

  const handleQuickAction = (message: string) => {
    setInputValue(message);
    if (!isExpanded) {
      setIsExpanded(true);
    }
    // Focus the input and trigger the message
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 100);
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 shadow-elegant">
      {/* AI Assistant Bar - Always Visible */}
      <div 
        className="px-4 py-4 bg-gradient-to-r from-beauty-light/95 to-beauty-cream/90 backdrop-blur-lg border-t border-beauty-accent/30"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          {/* AI Assistant Label */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <User className="h-5 w-5 text-beauty-accent animate-pulse" />
              <Sparkles className="h-2 w-2 text-beauty-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="dior-label text-beauty-dark">AI Assistant</span>
          </div>
          
          {/* Text Input Bar */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyPress}
              placeholder="Demandez conseil à votre assistant beauté..."
              className="beauty-input h-12 text-sm placeholder:text-beauty-dark/60 border-beauty-accent/20 focus:border-beauty-accent bg-beauty-light/50"
              disabled={isProcessing}
              autoComplete="off"
            />
            
            {/* Voice Button */}
            {voiceEnabled && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVoiceToggle}
                className="absolute right-12 top-1/2 -translate-y-1/2 h-8 w-8 text-beauty-dark hover:text-beauty-accent hover:bg-beauty-accent/10 transition-all duration-300"
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}

            {/* Send Button */}
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light hover:shadow-champagne transition-all duration-300 rounded-sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <Button 
              size="sm"
              variant="outline"
              className="dior-body-sm px-4 py-2 h-auto border-beauty-accent/30 text-beauty-dark bg-beauty-light/50 hover:bg-beauty-accent/10 hover:border-beauty-accent transition-all duration-300 rounded-sm backdrop-blur-sm"
              onClick={() => handleQuickAction("Réserver une coupe")}
            >
              Réserver
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="dior-body-sm px-4 py-2 h-auto border-beauty-accent/30 text-beauty-dark bg-beauty-light/50 hover:bg-beauty-accent/10 hover:border-beauty-accent transition-all duration-300 rounded-sm backdrop-blur-sm"
              onClick={() => handleQuickAction("Trouver un salon")}
            >
              Découvrir
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="dior-body-sm px-4 py-2 h-auto border-beauty-accent/30 text-beauty-dark bg-beauty-light/50 hover:bg-beauty-accent/10 hover:border-beauty-accent transition-all duration-300 rounded-sm backdrop-blur-sm"
              onClick={() => handleQuickAction("Mes rendez-vous")}
            >
              Agenda
            </Button>
          </div>

          {/* Expand Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-10 w-10 flex-shrink-0 text-beauty-dark hover:text-beauty-accent hover:bg-beauty-accent/10 transition-all duration-300 rounded-sm"
          >
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {/* Expanded Chat Window */}
      {isExpanded && (
        <div className="max-h-96 flex flex-col bg-gradient-to-b from-beauty-light/95 to-beauty-cream/90 backdrop-blur-lg shadow-elegant">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-beauty-accent/20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-beauty-primary to-beauty-accent flex items-center justify-center">
                <div className="relative">
                  <User className="h-4 w-4 text-beauty-light animate-pulse" />
                  <Sparkles className="h-2 w-2 text-beauty-light absolute -top-0.5 -right-0.5 animate-pulse" />
                </div>
              </div>
              <span className="dior-heading-sm text-beauty-dark">Assistante Beauté DIOR</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8 text-beauty-dark hover:text-beauty-accent hover:bg-beauty-accent/10 transition-all duration-300 rounded-sm"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 max-h-60 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-beauty-primary to-beauty-accent flex items-center justify-center mx-auto mb-4">
                    <div className="relative">
                      <User className="h-6 w-6 text-beauty-light" />
                      <Sparkles className="h-3 w-3 text-beauty-light absolute -top-1 -right-1" />
                    </div>
                  </div>
                  <p className="dior-body text-beauty-dark mb-2">Bonjour, je suis votre assistante beauté.</p>
                  <p className="dior-body-sm text-beauty-dark/70">Posez-moi vos questions sur les soins, rendez-vous et salons!</p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${!message.isAI ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    !message.isAI 
                      ? 'bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light' 
                      : 'bg-beauty-cream border border-beauty-accent/20 text-beauty-dark'
                  }`}>
                    {!message.isAI ? <User className="h-4 w-4" /> : (
                      <div className="relative">
                        <User className="h-4 w-4" />
                        <Sparkles className="h-2 w-2 absolute -top-0.5 -right-0.5" />
                      </div>
                    )}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-lg dior-body ${
                    !message.isAI 
                      ? 'bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light shadow-champagne' 
                      : 'bg-beauty-cream/50 text-beauty-dark border border-beauty-accent/20 backdrop-blur-sm'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-beauty-cream border border-beauty-accent/20 flex items-center justify-center">
                    <div className="relative">
                      <User className="h-4 w-4 text-beauty-dark animate-pulse" />
                      <Sparkles className="h-2 w-2 text-beauty-dark absolute -top-0.5 -right-0.5 animate-pulse" />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-beauty-cream/50 border border-beauty-accent/20 backdrop-blur-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-beauty-accent animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-beauty-accent animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-beauty-accent animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Status Indicators */}
      {isExpanded && (isProcessing || isListening) && (
        <div className="p-4 bg-gradient-to-r from-beauty-light/95 to-beauty-cream/90 backdrop-blur-lg border-t border-beauty-accent/20">
          <div className="text-center w-full">
            {isProcessing && (
              <div className="dior-body-sm flex items-center justify-center gap-3 text-beauty-dark">
                <div className="animate-spin h-4 w-4 rounded-full border-2 border-beauty-accent border-t-transparent"></div>
                L'IA réfléchit...
              </div>
            )}
            {isListening && (
              <div className="dior-body-sm flex items-center justify-center gap-3 text-beauty-accent">
                <div className="animate-pulse h-4 w-4 rounded-full bg-beauty-accent"></div>
                Écoute en cours... Parlez maintenant
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersistentChatBar;