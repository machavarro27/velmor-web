import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { ChatMessage } from '@/types';

interface UseChatbotReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (text: string) => void;
  clearChat: () => void;
}

export function useChatbot(): UseChatbotReturn {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        isBot: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: t('chatbot.welcome'),
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      }, 600);
    },
    [t]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
  };
}
