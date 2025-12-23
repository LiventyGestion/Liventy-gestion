import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { CHATBOT_CONFIG } from "@/lib/chatbot/config";
import { chatbotAnalytics } from "@/lib/chatbot/analytics";

interface ScheduleButtonProps {
  className?: string;
}

const ScheduleButton = ({ className }: ScheduleButtonProps) => {
  const handleClick = () => {
    chatbotAnalytics.scheduleBooked('intro_15');
    window.open(CHATBOT_CONFIG.urls.calendly, '_blank');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={`text-xs ${className}`}
      aria-label="Agendar llamada de 15 minutos"
    >
      <Calendar className="h-3 w-3 mr-1" />
      Agendar llamada
    </Button>
  );
};

export default ScheduleButton;
