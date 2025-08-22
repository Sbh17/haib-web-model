import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Mic, X, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { ChatMessage } from '@/components/chat/ChatMessage';
import useChatAgent from '@/hooks/useChatAgent';
import { toast } from '@/hooks/use-toast';

interface AppChatSidebarProps {
  onBookAppointment?: (bookingData: any) => void;
}

const AppChatSidebar: React.FC<AppChatSidebarProps> = ({ onBookAppointment }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { processMessage, isProcessing } = useChatAgent();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  useEffect(() => {
    // Initialize with welcome message only if no messages exist
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        content: "Hi! I'm your AI assistant. I can help you book appointments, find salons, and answer questions about beauty services. How can I help you today?",
        isAI: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    console.log('handleSendMessage called with:', inputValue);
    if (!inputValue.trim() || isProcessing) {
      console.log('Message blocked - empty or processing');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isAI: false,
      timestamp: new Date(),
      type: 'text'
    };

    console.log('Adding user message:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    try {
      console.log('Processing message with AI...');
      const response = await processMessage(currentInput);
      console.log('AI response received:', response);
      setMessages(prev => [...prev, response]);

      // Handle booking appointments
      if (response.type === 'booking-suggestion' && response.bookingData) {
        onBookAppointment?.(response.bookingData);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        isAI: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Voice Recording",
        description: "Voice recording started. Speak now...",
        duration: 2000,
      });
    } else {
      toast({
        title: "Voice Recording",
        description: "Recording stopped. Processing...",
        duration: 2000,
      });
    }
  };

  const quickActions = [
    "Book a haircut appointment",
    "Find nail salons near me",
    "Show today's appointments",
    "Browse promotions"
  ];

  if (collapsed) {
    return (
      <Sidebar className="w-14 border-r border-border">
        <div className="flex flex-col items-center py-4">
          <SidebarTrigger className="mb-4 hover:bg-accent rounded-md p-2">
            <MessageCircle className="h-6 w-6" />
          </SidebarTrigger>
          <div className="text-xs text-center text-muted-foreground px-1">
            Chat
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="w-80 border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <User className="h-6 w-6 text-primary" />
              <Sparkles className="h-3 w-3 text-primary absolute -top-1 -right-1" />
            </div>
            <h2 className="font-semibold text-lg">AI Assistant</h2>
          </div>
          <SidebarTrigger>
            <X className="h-4 w-4" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid gap-2 p-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto py-2 px-3 whitespace-normal hover:bg-primary/10 hover:border-primary/20"
                  onClick={() => {
                    setInputValue(action);
                    // Auto-focus the input after setting the value
                    setTimeout(() => {
                      const input = document.querySelector('input[placeholder*="Type your message"]') as HTMLInputElement;
                      if (input) input.focus();
                    }, 100);
                  }}
                >
                  {action}
                </Button>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Conversation</SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 px-2" ref={scrollRef}>
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${!message.isAI ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      !message.isAI 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {!message.isAI ? <User className="h-4 w-4" /> : (
                        <div className="relative">
                          <User className="h-4 w-4" />
                          <Sparkles className="h-2 w-2 absolute -top-0.5 -right-0.5" />
                        </div>
                      )}
                    </div>
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                      !message.isAI
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <div className="relative">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Sparkles className="h-2 w-2 text-muted-foreground absolute -top-0.5 -right-0.5" />
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-3 border-t border-border bg-background">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 focus:ring-2 focus:ring-primary/20"
                  disabled={isProcessing}
                  autoComplete="off"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleRecording}
                  className={`transition-all duration-200 ${isRecording ? 'bg-red-100 text-red-600 border-red-300' : 'hover:bg-accent'}`}
                  title="Voice recording"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  size="icon"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  title="Send message"
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
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppChatSidebar;