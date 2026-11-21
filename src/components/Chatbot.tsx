import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function Chatbot() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const { isChatOpen, setChatOpen } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: t('chatbot.welcome'),
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) => (m.id === 'welcome' ? { ...m, text: t('chatbot.welcome') } : m))
    );
  }, [i18n.language, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (isEn) {
      if (lowerMsg.includes('flavor') || lowerMsg.includes('sabor')) {
        return 'We craft 5 artisanal flavors: Strawberry, Wild Blackberry, Tropical Mango, Passion Fruit, and Classic Natural in 200g ($7.000) and 500g ($26.000) presentations! 🍓🫐🥭💛🥛';
      }
      if (lowerMsg.includes('price') || lowerMsg.includes('size') || lowerMsg.includes('cost')) {
        return 'Our presentations are: Small 200g ($7.000 COP) and Family 500g ($26.000 COP). Free shipping over $50.000 COP!';
      }
      if (lowerMsg.includes('velmor10') || lowerMsg.includes('discount') || lowerMsg.includes('promo')) {
        return 'Use code VELMOR10 in the cart to enjoy 10% OFF your order! 🎁';
      }
      if (
        lowerMsg.includes('deliver') ||
        lowerMsg.includes('dosquebradas') ||
        lowerMsg.includes('pereira') ||
        lowerMsg.includes('coffee') ||
        lowerMsg.includes('ship')
      ) {
        return 'We deliver chilled within 24 hours across Dosquebradas, Pereira, and the Coffee Region (Eje Cafetero). Simply enter your delivery details in the cart and send via WhatsApp!';
      }
      return 'Thank you for your message! You can also order or chat directly with our team in Dosquebradas on WhatsApp at +57 317 568 7206. 🏔️';
    }

    if (lowerMsg.includes('sabor') || lowerMsg.includes('variedad')) {
      return 'Elaboramos 5 sabores artesanales: Fresa, Mora Silvestre, Mango Tropical, Maracuyá y Natural Clásico, en presentaciones de 200g ($7.000) y 500g ($26.000). 🍓🫐🥭💛🥛';
    }
    if (lowerMsg.includes('precio') || lowerMsg.includes('tamaño') || lowerMsg.includes('cuánto') || lowerMsg.includes('cuanto')) {
      return 'Nuestras presentaciones son: Pequeño de 200g ($7.000 COP) y Familiar de 500g ($26.000 COP). ¡Envío gratis desde $50.000 COP!';
    }
    if (lowerMsg.includes('velmor10') || lowerMsg.includes('descuento') || lowerMsg.includes('código') || lowerMsg.includes('codigo')) {
      return '¡Usa el código VELMOR10 en tu carrito para recibir un 10% de descuento inmediato! 🎁';
    }
    if (
      lowerMsg.includes('envío') ||
      lowerMsg.includes('envio') ||
      lowerMsg.includes('dosquebradas') ||
      lowerMsg.includes('pereira') ||
      lowerMsg.includes('cafetero') ||
      lowerMsg.includes('domicilio')
    ) {
      return 'Entregamos refrigerado en 24 horas en Dosquebradas, Pereira y todo el Eje Cafetero. Solo añade tus productos al carrito, haz clic en "Ingresar Datos de Entrega" y envía tu pedido a WhatsApp.';
    }
    return '¡Gracias por escribirnos! También puedes hacer tu pedido en Dosquebradas y el Eje Cafetero hablando directamente por WhatsApp al +57 317 568 7206. 🏔️';
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(userMsg.text),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      const userMsg: Message = {
        id: Date.now().toString(),
        text: suggestion,
        isBot: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(suggestion),
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 600);
    }, 50);
    setInputValue('');
  };

  const suggestions = t('chatbot.suggestions', { returnObjects: true }) as string[];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          size="lg"
          onClick={() => setChatOpen(!isChatOpen)}
          className={`rounded-full w-14 h-14 shadow-xl transition-all p-0 ${
            isChatOpen
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-[#004B87] hover:bg-[#003865] text-white'
          }`}
          aria-label={t('chatbot.title')}
        >
          <AnimatePresence mode="wait">
            {isChatOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 w-[350px] sm:w-[390px] bg-white rounded-3xl shadow-2xl border border-[#004B87]/15 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#004B87] to-[#33A6D8] p-4 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/95 p-0.5 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/mascota.png"
                  alt="Vikingo Velmor"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t('chatbot.title')}</h4>
                <p className="text-[11px] text-white/90">{t('chatbot.subtitle')}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${message.isBot ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      message.isBot
                        ? 'bg-white text-[#192434] border border-[#004B87]/10 rounded-tl-none shadow-sm'
                        : 'bg-[#004B87] text-white rounded-tr-none'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {Array.isArray(suggestions) && (
              <div className="px-4 py-2.5 bg-white border-t border-[#004B87]/10">
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#EBF4FA] hover:bg-[#004B87] hover:text-white text-[#004B87] transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 bg-white border-t border-[#004B87]/10 flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 bg-[#FAF8F5] text-sm"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-[#004B87] hover:bg-[#003865] text-white shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
