import { useState, useCallback, useRef, useEffect } from 'react';
import { EnhancedAIAgent, ChatMessage, UserPreferences } from '@/components/chat/EnhancedAIAgent';
import { VoiceInterface } from '@/utils/VoiceInterface';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface UseEnhancedChatProps {
  onBookAppointment?: (bookingData: any) => void;
  enableVoice?: boolean;
}

export const useEnhancedChat = ({ onBookAppointment, enableVoice = false }: UseEnhancedChatProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(enableVoice);
  
  const agentRef = useRef<EnhancedAIAgent | null>(null);
  const voiceRef = useRef<VoiceInterface | null>(null);
  const { toast } = useToast();
  const { user } = useAuth(); // Get authenticated user from context

  // Initialize AI agent
  useEffect(() => {
    agentRef.current = new EnhancedAIAgent();
    if (enableVoice) {
      voiceRef.current = new VoiceInterface();
      setVoiceEnabled(voiceRef.current.isVoiceSupported());
    }

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: "Welcome to your personal beauty concierge! ✨ I specialize in women's beauty services including hair styling, makeup, skincare, and nail treatments. I can help you book appointments, provide beauty advice, and share the latest trends. What beauty experience would you like to explore today?",
      isAI: true,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [enableVoice]);

  const processMessage = useCallback(async (messageContent: string): Promise<void> => {
    if (!agentRef.current || isProcessing) return;

    setIsProcessing(true);

    try {
      // Create user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: messageContent,
        isAI: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      // Process with AI agent
      const aiResponse = await agentRef.current.processMessage(messageContent, user);
      
      setMessages(prev => [...prev, aiResponse]);

      // Handle voice response
      if (voiceEnabled && voiceRef.current) {
        voiceRef.current.speak(aiResponse.content);
      }

      // Handle booking suggestions
      if (aiResponse.type === 'booking-suggestion' && aiResponse.bookingData && onBookAppointment) {
        onBookAppointment(aiResponse.bookingData);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Service Unavailable",
        description: "Our concierge is momentarily unavailable. Please try again.",
        variant: "destructive"
      });

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing a momentary difficulty. Please rephrase your request, and I'll be delighted to assist you.",
        isAI: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, voiceEnabled, onBookAppointment, toast, user]); // Add user dependency

  const startVoiceInput = useCallback(() => {
    if (!voiceRef.current || !voiceEnabled || isListening) return;

    const started = voiceRef.current.startListening((transcript) => {
      if (transcript.trim()) {
        processMessage(transcript);
        toast({
          title: "Voice Captured",
          description: `"${transcript}"`,
        });
      }
    });

    if (started) {
      setIsListening(true);
      toast({
        title: "Listening",
        description: "Please speak your beauty request...",
      });
    } else {
      toast({
        title: "Voice Unavailable",
        description: "Voice input is not available right now.",
        variant: "destructive"
      });
    }
  }, [voiceEnabled, isListening, processMessage, toast]);

  const stopVoiceInput = useCallback(() => {
    if (voiceRef.current && isListening) {
      voiceRef.current.stopListening();
      setIsListening(false);
    }
  }, [isListening]);

  const toggleVoiceResponse = useCallback(() => {
    setVoiceEnabled(prev => !prev);
    if (voiceRef.current) {
      // Stop any current speech
      window.speechSynthesis?.cancel();
    }
  }, []);

  const getUserPreferences = useCallback((): UserPreferences | null => {
    return agentRef.current?.getPreferences() || null;
  }, []);

  const updateUserPreferences = useCallback((preferences: Partial<UserPreferences>) => {
    if (agentRef.current) {
      agentRef.current.updatePreferences(preferences);
    }
  }, []);

  const resetConversation = useCallback(() => {
    if (agentRef.current) {
      agentRef.current.resetConversation();
      setMessages([]);
      
      // Re-add welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome-reset',
        content: "How wonderful to see you again! I'm your beauty concierge specializing in women's hair, makeup, skincare, and nail services. I can book appointments, share beauty tips, and help you discover the latest trends. What beauty experience shall we create today?",
        isAI: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const getConversationHistory = useCallback((): ChatMessage[] => {
    return agentRef.current?.getConversationHistory() || [];
  }, []);

  return {
    messages,
    isProcessing,
    isListening,
    voiceEnabled,
    processMessage,
    startVoiceInput,
    stopVoiceInput,
    toggleVoiceResponse,
    getUserPreferences,
    updateUserPreferences,
    resetConversation,
    getConversationHistory
  };
};

export default useEnhancedChat;