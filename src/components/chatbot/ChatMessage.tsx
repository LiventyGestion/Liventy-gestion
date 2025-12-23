import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import ScheduleButton from "./ScheduleButton";

interface ChatMessageProps {
  text: string;
  isBot: boolean;
  redirection?: {
    url: string;
    explanation?: string;
    action?: string;
  };
  showCTAs?: boolean;
  onRedirect: (url: string) => void;
}

const ChatMessage = ({ text, isBot, redirection, showCTAs, onRedirect }: ChatMessageProps) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[85%] p-3 rounded-lg text-sm ${
          isBot
            ? 'bg-muted text-foreground'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        <div className="whitespace-pre-wrap">{text}</div>
        
        {/* Redirection button */}
        {redirection && (
          <Button
            onClick={() => onRedirect(redirection.url)}
            variant="outline"
            size="sm"
            className="mt-2 text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            {redirection.explanation || "Ir ahora"}
          </Button>
        )}
        
        {/* Show CTAs for bot messages when appropriate */}
        {isBot && showCTAs && (
          <div className="flex gap-2 mt-3 flex-wrap">
            <ScheduleButton />
            <WhatsAppButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
