import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Calendar } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface UserData {
  name: string;
  phone: string;
  userType: 'propietario' | 'inquilino' | '';
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
  const [isCollectingData, setIsCollectingData] = useState(false);
  const [userData, setUserData] = useState<UserData>({ name: "", phone: "", userType: "" });
  const [dataStep, setDataStep] = useState(0); // 0: name, 1: phone, 2: userType
  const [isCalendarMode, setIsCalendarMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const faqs = [
    {
      keywords: ['pago', 'cobro', 'dinero', 'rentabilidad'],
      answer: 'Nosotros nos encargamos de todos los cobros y te garantizamos el pago puntual. Además, optimizamos la rentabilidad de tu propiedad con precios de mercado actualizados.'
    },
    {
      keywords: ['inquilino', 'selección', 'filtro', 'elegir'],
      answer: 'Realizamos una selección rigurosa de inquilinos verificando ingresos, referencias laborales, historial crediticio y garantías. Solo te presentamos candidatos pre-aprobados.'
    },
    {
      keywords: ['mantenimiento', 'reparación', 'incidencia', 'problema'],
      answer: 'Gestionamos todas las incidencias y mantenimiento de la propiedad. Tenemos una red de profesionales de confianza y resolvemos los problemas de forma rápida y eficiente.'
    },
    {
      keywords: ['contrato', 'legal', 'documentación'],
      answer: 'Nos encargamos de toda la gestión legal: contratos, inventarios, fianzas, documentación oficial. Todo digitalizado y con total transparencia.'
    },
    {
      keywords: ['precio', 'coste', 'tarifa', 'comisión'],
      answer: 'Nuestras tarifas son transparentes y competitivas. Te ofrecemos diferentes planes según tus necesidades. ¿Te gustaría que te enviemos información detallada?'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-open chatbot after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAutoOpened) {
        setIsOpen(true);
        setHasAutoOpened(true);
        sessionStorage.setItem('chatbot-auto-opened', 'true');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasAutoOpened]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("👋 Hola, soy Ana, tu asistente personal de Liventy Gestión. ¿En qué puedo ayudarte?");
    }
  }, [isOpen]);

  const addMessage = (text: string, isBot: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date()
    };
    setMessages(prev => {
      const updated = [...prev, newMessage];
      sessionStorage.setItem('chatbot-messages', JSON.stringify(updated));
      return updated;
    });
  };

  const addBotMessage = (text: string) => {
    setTimeout(() => addMessage(text, true), 500);
  };

  const findFAQAnswer = (userMessage: string): string | null => {
    const messageLower = userMessage.toLowerCase();
    for (const faq of faqs) {
      if (faq.keywords.some(keyword => messageLower.includes(keyword))) {
        return faq.answer;
      }
    }
    return null;
  };

  const detectUserIntent = (message: string): 'propietario' | 'inquilino' | 'general' => {
    const messageLower = message.toLowerCase();
    if (messageLower.includes('tengo un piso') || messageLower.includes('alquilar mi') || messageLower.includes('propietario') || messageLower.includes('mi propiedad')) {
      return 'propietario';
    }
    if (messageLower.includes('busco piso') || messageLower.includes('alquiler') && messageLower.includes('busco') || messageLower.includes('inquilino')) {
      return 'inquilino';
    }
    return 'general';
  };

  const handleDataCollection = (message: string) => {
    if (dataStep === 0) {
      setUserData(prev => ({ ...prev, name: message }));
      setDataStep(1);
      addBotMessage(`Perfecto, ${message}. Ahora necesito tu número de teléfono para poder contactarte.`);
    } else if (dataStep === 1) {
      setUserData(prev => ({ ...prev, phone: message }));
      setDataStep(2);
      addBotMessage("¿Eres propietario de una vivienda que quieres alquilar o estás buscando un piso en alquiler? Escribe 'propietario' o 'inquilino'.");
    } else if (dataStep === 2) {
      const userType = message.toLowerCase().includes('propietario') ? 'propietario' : 'inquilino';
      setUserData(prev => ({ ...prev, userType }));
      setIsCollectingData(false);
      setDataStep(0);
      
      if (userType === 'propietario') {
        addBotMessage(`Gracias ${userData.name}. Como propietario, podemos ayudarte a gestionar tu alquiler sin complicaciones. ¿Te gustaría agendar una reunión para valorar tu propiedad o prefieres que te contactemos primero?`);
      } else {
        addBotMessage(`Gracias ${userData.name}. Aunque nos especializamos en gestión para propietarios, podemos ayudarte a encontrar propiedades gestionadas por nosotros. Te recomendamos contactar directamente con nuestro equipo.`);
      }
      
      setTimeout(() => {
        addBotMessage("¿Cómo prefieres que te contactemos?\n\n1️⃣ WhatsApp\n2️⃣ Llamada telefónica\n3️⃣ Correo electrónico\n\nEscribe el número de tu opción preferida.");
      }, 1000);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addMessage(inputText, false);
    const userMessage = inputText.trim();
    setInputText("");

    // Si estamos recolectando datos
    if (isCollectingData) {
      handleDataCollection(userMessage);
      return;
    }

    // Manejar opciones de contacto
    if (userMessage === "1" || userMessage.toLowerCase().includes("whatsapp")) {
      addBotMessage("Perfecto, te contactaremos por WhatsApp al número que nos proporcionaste. Nuestro equipo se pondrá en contacto contigo en las próximas horas.");
      toast({ title: "Contacto programado", description: "Te contactaremos por WhatsApp pronto." });
      return;
    }
    
    if (userMessage === "2" || userMessage.toLowerCase().includes("llamada") || userMessage.toLowerCase().includes("teléfono")) {
      addBotMessage("Genial, te llamaremos al número que nos diste. Recibirás nuestra llamada en horario comercial.");
      toast({ title: "Llamada programada", description: "Te llamaremos pronto." });
      return;
    }
    
    if (userMessage === "3" || userMessage.toLowerCase().includes("correo") || userMessage.toLowerCase().includes("email")) {
      addBotMessage("Te enviaremos toda la información por correo electrónico. Revisa tu bandeja de entrada en las próximas horas.");
      toast({ title: "Email programado", description: "Recibirás un email con la información." });
      return;
    }

    // Detectar intención de contratación o ser cliente
    if (userMessage.toLowerCase().includes('empezar') || userMessage.toLowerCase().includes('contratar') || 
        userMessage.toLowerCase().includes('interesa') || userMessage.toLowerCase().includes('quiero') ||
        userMessage.toLowerCase().includes('cliente') || userMessage.toLowerCase().includes('servicio')) {
      addBotMessage("¡Genial! Puedes empezar ahora rellenando un formulario rápido en este enlace: /contact");
      setTimeout(() => {
        addBotMessage("O si prefieres, puedo ayudarte aquí mismo. ¿Cuál es tu nombre?");
        setIsCollectingData(true);
        setDataStep(0);
      }, 1000);
      return;
    }

    // Detectar solicitud de cita o reunión
    if (userMessage.toLowerCase().includes('cita') || userMessage.toLowerCase().includes('reunión') ||
        userMessage.toLowerCase().includes('agendar') || userMessage.toLowerCase().includes('agenda')) {
      setIsCalendarMode(true);
      addBotMessage("Perfecto, puedo ayudarte a agendar una reunión. Aquí tienes 3 horarios disponibles esta semana:");
      setTimeout(() => {
        const today = new Date();
        const option1 = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
        const option2 = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
        const option3 = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
        
        addBotMessage(`📅 Opciones disponibles:\n\n1️⃣ ${option1.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} a las 10:00\n2️⃣ ${option2.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} a las 16:00\n3️⃣ ${option3.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} a las 11:30\n\nEscribe el número de tu opción preferida o dime otra fecha/hora que te convenga.`);
      }, 1000);
      return;
    }

    // Manejar selección de cita si estamos en modo calendario
    if (isCalendarMode) {
      if (userMessage === "1" || userMessage === "2" || userMessage === "3") {
        addBotMessage(`¡Perfecto! He reservado esa cita para ti. Te enviaremos una confirmación por email con todos los detalles y el enlace de la reunión.`);
        toast({ title: "Cita agendada", description: "Recibirás una confirmación por email." });
        setIsCalendarMode(false);
        return;
      } else {
        addBotMessage(`Entiendo que prefieres otra fecha/hora. He anotado tu preferencia: "${userMessage}". Nuestro equipo revisará la disponibilidad y te contactará para confirmar esta cita alternativa.`);
        toast({ title: "Solicitud de cita", description: "Te contactaremos para confirmar la fecha." });
        setIsCalendarMode(false);
        return;
      }
    }

    // Detectar tipo de usuario y orientar
    const intent = detectUserIntent(userMessage);
    if (intent === 'propietario') {
      addBotMessage("Veo que eres propietario. ¡Perfecto! Nos especializamos en gestión integral de alquileres para propietarios. Nos encargamos de todo: desde encontrar inquilinos de calidad hasta gestionar cobros y mantenimiento.");
      setTimeout(() => {
        addBotMessage("¿Te gustaría conocer más detalles o prefieres que empecemos con una valoración de tu propiedad?");
      }, 1500);
      return;
    }
    
    if (intent === 'inquilino') {
      addBotMessage("Entiendo que buscas un piso en alquiler. Aunque nuestro servicio principal es para propietarios, gestionamos propiedades de calidad que podrían interesarte.");
      setTimeout(() => {
        addBotMessage("Te recomiendo contactar directamente con nuestro equipo para conocer las propiedades disponibles.");
      }, 1500);
      return;
    }

    // Buscar respuesta en FAQs
    const faqAnswer = findFAQAnswer(userMessage);
    if (faqAnswer) {
      addBotMessage(faqAnswer);
      setTimeout(() => {
        addBotMessage("¿Te resuelve esta información? ¿Hay algo más específico que te gustaría saber?");
      }, 1500);
      return;
    }

    // Respuesta genérica y derivación
    addBotMessage("Esa es una excelente pregunta. Para darte una respuesta más precisa y personalizada, creo que sería mejor que hables directamente con uno de nuestros especialistas.");
    setTimeout(() => {
      addBotMessage("¿Cómo prefieres que te contactemos?\n\n1️⃣ WhatsApp\n2️⃣ Llamada telefónica\n3️⃣ Correo electrónico\n\nO si prefieres, puedes darme tus datos y te contactamos nosotros.");
    }, 1500);
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
                  {message.text}
                </div>
              </div>
            ))}
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