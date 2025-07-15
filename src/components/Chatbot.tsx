import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-card border rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Asistente Virtual 24/7</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 h-80 flex items-center justify-center text-muted-foreground">
            <p>¡Hola! ¿En qué puedo ayudarte hoy?</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;