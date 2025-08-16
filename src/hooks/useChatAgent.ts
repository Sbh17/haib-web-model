import { useState, useCallback } from 'react';
import { ChatMessage } from '@/components/chat/ChatMessage';
import AIBookingAgent, { UserPreferences } from '@/components/chat/AIBookingAgent';

export const useChatAgent = () => {
  const [agent] = useState(() => new AIBookingAgent());
  const [isProcessing, setIsProcessing] = useState(false);

  const processMessage = useCallback(async (message: string): Promise<ChatMessage> => {
    setIsProcessing(true);
    try {
      // Add artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      const response = await agent.processMessage(message);
      return response;
    } finally {
      setIsProcessing(false);
    }
  }, [agent]);

  const getUserPreferences = useCallback((): UserPreferences => {
    return agent.getPreferences();
  }, [agent]);

  const resetConversation = useCallback(() => {
    agent.resetConversation();
  }, [agent]);

  return {
    processMessage,
    getUserPreferences,
    resetConversation,
    isProcessing
  };
};

export default useChatAgent;