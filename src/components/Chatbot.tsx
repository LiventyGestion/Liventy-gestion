import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { CHATBOT_CONFIG } from "@/lib/chatbot/config";
import { chatbotAnalytics } from "@/lib/chatbot/analytics";
import { sanitizeMessage, validateSpanishPhone, validateEmail } from "@/lib/chatbot/validation";
import QuickReplies from "./chatbot/QuickReplies";
import ConsentBanner from "./chatbot/ConsentBanner";
import ChatMessage from "./chatbot/ChatMessage";
import TypingIndicator from "./chatbot/TypingIndicator";
import WhatsAppButton from "./chatbot/WhatsAppButton";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  intent?: string;
  redirection?: {
    url: string;
    explanation: string;
    action: string;
  };
  showCTAs?: boolean;
}

interface UserData {
  name: string;
  phone: string;
  email: string;
  userType: 'propietario' | 'inquilino' | 'empresa' | 'general';
  municipio?: string;
  consent: boolean;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(() => {
    return sessionStorage.getItem('chatbot-auto-opened') === 'true';
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem('chatbot-messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(() => {
    return sessionStorage.getItem('chatbot-conversation-id') || null;
  });
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = sessionStorage.getItem('chatbot-user-data');
    return saved ? JSON.parse(saved) : { 
      name: "", 
      phone: "", 
      email: "", 
      userType: "general",
      consent: false 
    };
  });
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Track chat open
  useEffect(() => {
    if (isOpen) {
      chatbotAnalytics.chatOpen();
    }
  }, [isOpen]);

  // Auto-open chatbot based on user engagement
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let scrollTimer: NodeJS.Timeout;
    let hasScrolled = false;

    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 300) {
        hasScrolled = true;
        scrollTimer = setTimeout(() => {
          if (!hasAutoOpened) {
            setIsOpen(true);
            setHasAutoOpened(true);
            sessionStorage.setItem('chatbot-auto-opened', 'true');
          }
        }, 15000);
      }
    };

    timer = setTimeout(() => {
      if (!hasAutoOpened) {
        setIsOpen(true);
        setHasAutoOpened(true);
        sessionStorage.setItem('chatbot-auto-opened', 'true');
      }
    }, 45000);

    if (!hasAutoOpened) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(scrollTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasAutoOpened]);

  // Persist data
  useEffect(() => {
    if (conversationId) {
      sessionStorage.setItem('chatbot-conversation-id', conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    sessionStorage.setItem('chatbot-user-data', JSON.stringify(userData));
  }, [userData]);

  // Check if outside working hours
  const isOutsideWorkingHours = useCallback((): boolean => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    const { workingHours } = CHATBOT_CONFIG;
    
    if (day === 0) return true; // Sunday
    if (day === 6) {
      return !workingHours.saturday || hour < workingHours.saturday.start || hour >= workingHours.saturday.end;
    }
    return hour < workingHours.weekdays.start || hour >= workingHours.weekdays.end;
  }, []);

  const addMessage = useCallback((text: string, isBot: boolean, intent?: string, redirection?: any, showCTAs?: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
      intent,
      redirection,
      showCTAs
    };
    setMessages(prev => {
      const updated = [...prev, newMessage];
      sessionStorage.setItem('chatbot-messages', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addBotMessage = useCallback((text: string, intent?: string, redirection?: any, showCTAs?: boolean) => {
    setTimeout(() => addMessage(text, true, intent, redirection, showCTAs), 500);
  }, [addMessage]);

  const callAI = async (userMessage: string, intent?: string) => {
    setIsLoading(true);
    try {
      console.log('🤖 Calling chatbot AI...');
      
      // Get UTM params
      const params = new URLSearchParams(window.location.search);
      const utmParams = {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
      };
      
      const { data, error } = await supabase.functions.invoke('chatbot-ai', {
        body: {
          message: sanitizeMessage(userMessage),
          sessionId,
          conversationId,
          intent,
          userContext: {
            ...userData,
            sessionId,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            ...utmParams,
            isOutsideHours: isOutsideWorkingHours()
          }
        }
      });

      console.log('📡 AI Response:', data, error);

      if (error) {
        console.error('❌ Supabase function error:', error);
        setFailedAttempts(prev => prev + 1);
        
        if (failedAttempts >= 1) {
          chatbotAnalytics.fallbackNoAnswer();
          addBotMessage(
            "Parece que tengo dificultades para responderte ahora. ¿Por qué no hablamos directamente?",
            'fallback',
            null,
            true
          );
        } else {
          addBotMessage(getLocalFallback(userMessage), 'basic_fallback');
        }
        return;
      }

      const response = data;
      setFailedAttempts(0);
      
      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
      }

      if (response.leadInfo) {
        setUserData(prev => ({
          ...prev,
          ...response.leadInfo
        }));
        
        // Track intent if detected
        if (response.intent) {
          chatbotAnalytics.intentDetected(response.intent, response.leadInfo?.userType);
        }
      }

      // Check if we should show consent banner
      if (response.requiresConsent && !userData.consent) {
        setShowConsentBanner(true);
      }

      // Determine if we should show CTAs
      const shouldShowCTAs = response.showCTAs || 
        (response.intent && ['OWNER_PROSPECT', 'COMPANY'].includes(response.intent));

      addBotMessage(response.message, response.intent, response.redirection, shouldShowCTAs);

    } catch (error) {
      console.error('❌ Error in AI call:', error);
      addBotMessage(getLocalFallback(userMessage), 'fallback');
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalFallback = (message: string): string => {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('hola') || messageLower.includes('hello') || messageLower === '') {
      return `¡Hola! Soy Ana de ${CHATBOT_CONFIG.brand.name}. Gestiono alquileres en ${CHATBOT_CONFIG.brand.coverageMain} y alrededores. ¿En qué puedo ayudarte?`;
    }
    
    if (messageLower.includes('propietario') || messageLower.includes('tengo un piso')) {
      return "Perfecto, eres propietario. Te cuento nuestro proceso:\n• Valoración en 48h\n• Difusión multicanal\n• Firma digital\n• Gestión mensual\n\n¿Te gustaría una valoración gratuita?";
    }
    
    if (messageLower.includes('precio')) {
      const { pricing } = CHATBOT_CONFIG;
      return `Nuestras tarifas:\n• ${pricing.start.name}: ${pricing.start.price}\n• ${pricing.full.name}: ${pricing.full.price}\n• ${pricing.corporate.name}: ${pricing.corporate.price}\n\nNota: seguimiento del cobro ≠ garantía de pago.`;
    }
    
    if (messageLower.includes('zona') || messageLower.includes('cobertura')) {
      return `Cubrimos ${CHATBOT_CONFIG.brand.coverage.join(', ')}. Disponibilidad presencial en Bizkaia.`;
    }
    
    return `Entiendo tu consulta. Para darte la mejor respuesta, ¿podrías contarme más? También puedes llamarnos al ${CHATBOT_CONFIG.brand.phone}.`;
  };

  const handleRedirect = (url: string) => {
    if (url.startsWith('/')) {
      navigate(url);
      setIsOpen(false);
      toast({
        title: "Redirigiendo...",
        description: "Te llevamos a la sección solicitada"
      });
    } else {
      window.open(url, '_blank');
    }
  };

  const handleSendMessage = async (messageText?: string, intent?: string) => {
    const message = messageText || inputText.trim();
    if (!message || isLoading) return;

    addMessage(sanitizeMessage(message), false);
    setInputText("");
    setShowQuickReplies(false);

    // Track quick reply if applicable
    if (intent) {
      chatbotAnalytics.quickReplyClicked(message, intent);
    }

    await callAI(message, intent);
  };

  const handleQuickReply = (label: string, intent: string) => {
    handleSendMessage(label, intent);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConsentAccept = () => {
    setUserData(prev => ({ ...prev, consent: true }));
    setShowConsentBanner(false);
    chatbotAnalytics.consentResponse(true);
    addBotMessage("¡Gracias! Ahora puedo ayudarte mejor. ¿En qué te puedo asistir?");
  };

  const handleConsentDecline = () => {
    setShowConsentBanner(false);
    chatbotAnalytics.consentResponse(false);
    addBotMessage("Entendido. Puedo seguir ayudándote con información general. Para consultas personalizadas, puedes contactarnos directamente.");
  };

  return (
    <>
      {/* Chat toggle button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 sm:w-12 sm:h-12 shadow-lg z-50 bg-primary hover:bg-primary/90 p-0 overflow-hidden"
        size="icon"
        aria-label="Abrir chat de asistencia"
      >
        <img 
          src="/lovable-uploads/b318efa7-5156-4395-9675-30db60a6edc6.png" 
          alt="Ana - Asistente Virtual" 
          className="w-full h-full object-cover"
        />
      </Button>

      {/* Chat window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-[340px] sm:w-80 h-[480px] sm:h-96 bg-background border rounded-lg shadow-xl z-[60] flex flex-col"
          role="dialog"
          aria-label="Chat con Ana, asistente virtual de Liventy"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/b318efa7-5156-4395-9675-30db60a6edc6.png" 
                alt="Ana - Asistente Virtual" 
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-foreground/20"
              />
              <div>
                <h3 className="font-semibold text-sm">Ana</h3>
                <p className="text-xs opacity-90">Asistente Virtual 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <WhatsAppButton className="!text-[10px] !py-1 !px-2" />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
                aria-label="Cerrar chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Welcome message if no messages */}
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-4">
                <p className="font-medium mb-2">¡Hola! Soy Ana 👋</p>
                <p className="text-xs">Tu asistente de {CHATBOT_CONFIG.brand.name}</p>
              </div>
            )}
            
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                text={message.text}
                isBot={message.isBot}
                redirection={message.redirection}
                showCTAs={message.showCTAs}
                onRedirect={handleRedirect}
              />
            ))}
            
            {isLoading && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {showQuickReplies && messages.length === 0 && (
            <QuickReplies onSelect={handleQuickReply} disabled={isLoading} />
          )}

          {/* Consent banner */}
          {showConsentBanner && (
            <ConsentBanner onAccept={handleConsentAccept} onDecline={handleConsentDecline} />
          )}

          {/* Input area */}
          <div className="p-3 border-t">
            {/* Outside hours notice */}
            {isOutsideWorkingHours() && (
              <p className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Fuera de horario. Te responderemos pronto.
              </p>
            )}
            
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 text-sm"
                disabled={isLoading}
                aria-label="Escribe tu mensaje"
              />
              <Button 
                onClick={() => handleSendMessage()} 
                size="icon"
                disabled={!inputText.trim() || isLoading}
                aria-label="Enviar mensaje"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
