import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AIChatSidebarProps {
  onBookAppointment?: (bookingData: any) => void;
}

// Remove navigation items - sidebar is chat-only now

const AIChatSidebar: React.FC<AIChatSidebarProps> = ({ onBookAppointment }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hide sidebar on welcome and auth screens
  const hideOnPages = ['/welcome', '/auth', '/register'];
  if (hideOnPages.includes(location.pathname)) {
    return null;
  }

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

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const handleQuickAction = (message: string) => {
    setInputValue(message);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Remove navigation logic - chat-only sidebar

  return (
    <Sidebar className={cn("border-r border-border", collapsed ? "w-16" : "w-80")} collapsible="icon">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center">
            <Bot className="h-4 w-4 text-background animate-pulse" />
          </div>
          {!collapsed && <span className="font-medium text-foreground">Assistant IA DIOR</span>}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col h-full">
        {/* Chat Section - Full sidebar dedicated to chat */}
        {!collapsed && (
          <SidebarGroup className="flex-1 flex flex-col">
            <SidebarGroupLabel>Chat Assistant</SidebarGroupLabel>
            
            {/* Quick Actions */}
            <div className="p-4 space-y-2">
              <Button 
                size="sm"
                variant="outline"
                className="w-full justify-start text-sm"
                onClick={() => handleQuickAction("Réserver une coupe")}
              >
                Réserver un rendez-vous
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="w-full justify-start text-sm"
                onClick={() => handleQuickAction("Trouver un salon")}
              >
                Trouver un salon
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="w-full justify-start text-sm"
                onClick={() => handleQuickAction("Mes rendez-vous")}
              >
                Voir mon agenda
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="h-12 w-12 rounded-full bg-foreground flex items-center justify-center mx-auto mb-4">
                      <Bot className="h-6 w-6 text-background" />
                    </div>
                    <p className="text-sm font-medium mb-2">Bonjour, je suis votre assistante beauté.</p>
                    <p className="text-xs text-muted-foreground">Posez-moi vos questions sur les soins, rendez-vous et salons!</p>
                  </div>
                )}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${!message.isAI ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      !message.isAI 
                        ? 'bg-foreground text-background' 
                        : 'bg-muted border border-border text-foreground'
                    }`}>
                      {!message.isAI ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      !message.isAI 
                        ? 'bg-foreground text-background' 
                        : 'bg-muted/50 text-foreground border border-border'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
                      <Bot className="h-4 w-4 text-foreground animate-pulse" />
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-foreground animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Status Indicators */}
            {(isProcessing || isListening) && (
              <div className="p-4 border-t border-border">
                <div className="text-center w-full">
                  {isProcessing && (
                    <div className="text-xs flex items-center justify-center gap-3 text-muted-foreground">
                      <div className="animate-spin h-3 w-3 rounded-full border border-foreground border-t-transparent"></div>
                      L'IA réfléchit...
                    </div>
                  )}
                  {isListening && (
                    <div className="text-xs flex items-center justify-center gap-3 text-foreground">
                      <div className="animate-pulse h-3 w-3 rounded-full bg-foreground"></div>
                      Écoute en cours... Parlez maintenant
                    </div>
                  )}
                </div>
              </div>
            )}
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Chat Input */}
      {!collapsed && (
        <SidebarFooter className="p-4 border-t border-border">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Posez votre question..."
                className="text-sm pr-20"
                disabled={isProcessing}
                autoComplete="off"
              />
              
              {/* Voice Button */}
              {voiceEnabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceToggle}
                  className="absolute right-10 top-1/2 -translate-y-1/2 h-6 w-6"
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
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AIChatSidebar;