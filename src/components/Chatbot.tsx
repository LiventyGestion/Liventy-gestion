import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Calendar, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
}

interface UserData {
  name: string;
  phone: string;
  email: string;
  userType: 'propietario' | 'inquilino' | 'general';
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
    return saved ? JSON.parse(saved) : { name: "", phone: "", email: "", userType: "general" };
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-open chatbot based on user engagement
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let scrollTimer: NodeJS.Timeout;
    let hasScrolled = false;

    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 300) {
        hasScrolled = true;
        // Open after user scrolls and shows interest (15 seconds)
        scrollTimer = setTimeout(() => {
          if (!hasAutoOpened) {
            setIsOpen(true);
            setHasAutoOpened(true);
            sessionStorage.setItem('chatbot-auto-opened', 'true');
          }
        }, 15000);
      }
    };

    // Initial timer for users who don't scroll (45 seconds)
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

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("Hola, soy Ana, tu asistente inteligente de Liventy Gestión, en que puedo ayudarte?");
    }
  }, [isOpen]);

  // Persist conversation ID when it changes
  useEffect(() => {
    if (conversationId) {
      sessionStorage.setItem('chatbot-conversation-id', conversationId);
    }
  }, [conversationId]);

  // Persist user data when it changes  
  useEffect(() => {
    sessionStorage.setItem('chatbot-user-data', JSON.stringify(userData));
  }, [userData]);

  const addMessage = (text: string, isBot: boolean, intent?: string, redirection?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
      intent,
      redirection
    };
    setMessages(prev => {
      const updated = [...prev, newMessage];
      sessionStorage.setItem('chatbot-messages', JSON.stringify(updated));
      return updated;
    });
  };

  const addBotMessage = (text: string, intent?: string, redirection?: any) => {
    setTimeout(() => addMessage(text, true, intent, redirection), 500);
  };

  const callAI = async (userMessage: string) => {
    setIsLoading(true);
    try {
      console.log('🤖 Calling chatbot AI...');
      
      const { data, error } = await supabase.functions.invoke('chatbot-ai', {
        body: {
          message: userMessage,
          sessionId,
          conversationId,
          userContext: {
            ...userData,
            sessionId,
            timestamp: new Date().toISOString()
          }
        }
      });

      console.log('📡 AI Response:', data, error);

      if (error) {
        console.error('❌ Supabase function error:', error);
        // Use basic fallback
        addBotMessage(getLocalFallback(userMessage), 'basic_fallback');
        return;
      }

      const response = data;
      
      // Update conversation ID if this is the first message
      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
        console.log('💾 Conversation ID set:', response.conversationId);
      }

      // Update user data from response context if available
      if (response.leadInfo) {
        setUserData(prev => ({
          ...prev,
          ...response.leadInfo
        }));
      }

      // Add bot response with redirection if available
      addBotMessage(response.message, response.intent, response.redirection);

    } catch (error) {
      console.error('❌ Error in AI call:', error);
      
      // Always provide a helpful fallback response
      addBotMessage(getLocalFallback(userMessage), 'fallback');
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalFallback = (message: string): string => {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('hola') || messageLower.includes('hello') || messageLower === '') {
      return "Soy Ana de Liventy Gestión. Me alegra saludarte. Nos especializamos en gestión integral de alquileres en Bilbao y alrededores. ¿En qué puedo ayudarte hoy?";
    }
    
    if (messageLower.includes('propietario') || messageLower.includes('tengo un piso') || messageLower.includes('alquilar mi')) {
      return "Perfecto, eres propietario. En Liventy Gestión nos encargamos de todo: desde encontrar inquilinos de calidad hasta gestionar cobros y mantenimiento. Para más detalles, uno de nuestros especialistas te contactará pronto.";
    }
    
    if (messageLower.includes('precio') || messageLower.includes('valorar') || messageLower.includes('cuánto vale')) {
      return "Te ayudo con la valoración. Tenemos herramientas para calcular el valor de tu propiedad en el mercado actual de Bilbao. ¿Te gustaría que te ayude a conectarte con nuestro equipo de valoración?";
    }
    
    if (messageLower.includes('servicio') || messageLower.includes('qué hacen') || messageLower.includes('cómo funciona')) {
      return "En Liventy Gestión ofrecemos gestión integral de alquileres: encontramos inquilinos de calidad, gestionamos contratos, cobramos las rentas y nos encargamos del mantenimiento. Todo sin que tengas que preocuparte de nada.";
    }
    
    if (messageLower.includes('contacto') || messageLower.includes('teléfono') || messageLower.includes('email')) {
      return "Te ayudo con el contacto. Puedes llamarnos, escribirnos por WhatsApp o rellenar nuestro formulario web. ¿Qué prefieres?";
    }
    
    return "Entiendo tu consulta. En Liventy Gestión somos especialistas en gestión de alquileres en Bizkaia. Para darte la mejor respuesta personalizada, uno de nuestros especialistas se pondrá en contacto contigo pronto. ¿Hay algo más en lo que pueda ayudarte?";
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

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    addMessage(userMessage, false);
    setInputText("");

    // Call AI for response
    await callAI(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50 bg-primary hover:bg-primary/90 p-0 overflow-hidden"
        size="icon"
        aria-label="Abrir chat de asistencia"
      >
        <img 
          src="/lovable-uploads/b318efa7-5156-4395-9675-30db60a6edc6.png" 
          alt="Ana - Asistente Virtual" 
          className="w-full h-full object-cover"
        />
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-background border rounded-lg shadow-xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/b318efa7-5156-4395-9675-30db60a6edc6.png" 
                alt="Ana - Asistente Virtual" 
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-foreground/20"
              />
              <div>
                <h3 className="font-semibold">Ana</h3>
                <p className="text-xs opacity-90">Asistente Virtual 24/7</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
              aria-label="Cerrar chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  {message.redirection && (
                    <Button
                      onClick={() => handleRedirect(message.redirection!.url)}
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Ir ahora
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                  <span className="text-muted-foreground ml-2">Ana está escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon"
                disabled={!inputText.trim()}
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