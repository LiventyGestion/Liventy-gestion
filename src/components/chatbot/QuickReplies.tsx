import { Button } from "@/components/ui/button";
import { CHATBOT_CONFIG } from "@/lib/chatbot/config";

interface QuickRepliesProps {
  onSelect: (message: string, intent: string) => void;
  disabled?: boolean;
}

const QuickReplies = ({ onSelect, disabled }: QuickRepliesProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-2">
      {CHATBOT_CONFIG.quickReplies.map((reply) => (
        <Button
          key={reply.id}
          variant="outline"
          size="sm"
          onClick={() => onSelect(reply.label, reply.intent)}
          disabled={disabled}
          className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label={`Seleccionar: ${reply.label}`}
        >
          {reply.label}
        </Button>
      ))}
    </div>
  );
};

export default QuickReplies;
