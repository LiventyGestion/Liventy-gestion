import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Plus, 
  MessageCircle,
  Clock,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: string;
  attachments?: string[];
}

interface ChatThread {
  id: string;
  title: string;
  status: 'abierto' | 'en_seguimiento' | 'resuelto';
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

// Mock data
const mockThreads: ChatThread[] = [
  {
    id: '1',
    title: 'Consulta sobre contrato de alquiler',
    status: 'abierto',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:30:00Z',
    messages: [
      {
        id: '1',
        sender: 'user',
        message: 'Hola, tengo una duda sobre las condiciones de mi contrato de alquiler.',
        timestamp: '2024-03-15T10:00:00Z'
      },
      {
        id: '2',
        sender: 'agent',
        message: 'Hola! Estaré encantado de ayudarte con tu consulta sobre el contrato. ¿Podrías ser más específico sobre qué aspecto te gustaría consultar?',
        timestamp: '2024-03-15T10:15:00Z'
      },
      {
        id: '3',
        sender: 'user',
        message: 'Me gustaría saber si puedo tener mascotas en el apartamento.',
        timestamp: '2024-03-15T10:30:00Z'
      }
    ]
  }
];

export default function TenantChat() {
  const [threads, setThreads] = useState<ChatThread[]>(mockThreads);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [showNewThread, setShowNewThread] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedThread?.messages]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'abierto': { variant: 'destructive' as const, label: 'Abierto', icon: MessageCircle },
      'en_seguimiento': { variant: 'secondary' as const, label: 'En Seguimiento', icon: Clock },
      'resuelto': { variant: 'default' as const, label: 'Resuelto', icon: CheckCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.abierto;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return;
    
    setIsLoading(true);
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    // Update thread with new message
    const updatedThread = {
      ...selectedThread,
      messages: [...selectedThread.messages, newMsg],
      updated_at: new Date().toISOString()
    };

    setSelectedThread(updatedThread);
    setThreads(threads.map(t => t.id === selectedThread.id ? updatedThread : t));
    setNewMessage("");
    
    // Simulate agent response
    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        message: 'Gracias por tu mensaje. Te responderemos en breve.',
        timestamp: new Date().toISOString()
      };
      
      const finalThread = {
        ...updatedThread,
        messages: [...updatedThread.messages, agentMsg]
      };
      
      setSelectedThread(finalThread);
      setThreads(threads.map(t => t.id === selectedThread.id ? finalThread : t));
      setIsLoading(false);
    }, 2000);
  };

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim()) return;
    
    const newThread: ChatThread = {
      id: Date.now().toString(),
      title: newThreadTitle,
      status: 'abierto',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: []
    };

    setThreads([newThread, ...threads]);
    setSelectedThread(newThread);
    setNewThreadTitle("");
    setShowNewThread(false);
    
    toast({
      title: "Nueva consulta creada",
      description: "Puedes empezar a escribir tu mensaje.",
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Consulta y Soporte</h1>
        <p className="text-muted-foreground">
          Chatea con nuestro equipo de soporte y mantén un histórico de todas tus consultas
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Thread List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Mis Consultas</h3>
            <Button 
              size="sm" 
              onClick={() => setShowNewThread(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva Consulta
            </Button>
          </div>

          {/* New Thread Form */}
          {showNewThread && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Título de la consulta"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleCreateThread}>
                      Crear
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowNewThread(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Threads */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {threads.map((thread) => (
              <Card 
                key={thread.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedThread?.id === thread.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedThread(thread)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm line-clamp-2">{thread.title}</h4>
                      {getStatusBadge(thread.status)}
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{thread.messages.length} mensajes</span>
                      <span>{formatTimestamp(thread.updated_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {threads.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes consultas</h3>
                <p className="text-muted-foreground mb-4">
                  Crea una nueva consulta para empezar a chatear con soporte
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedThread ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{selectedThread.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Creado el {formatTimestamp(selectedThread.created_at)}
                    </p>
                  </div>
                  {getStatusBadge(selectedThread.status)}
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {selectedThread.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback>
                            {message.sender === 'user' ? 'TU' : 'AG'}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`rounded-lg p-3 ${
                          message.sender === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Escribe tu mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Selecciona una consulta</h3>
                <p className="text-muted-foreground">
                  Elige una consulta existente o crea una nueva para empezar a chatear
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}