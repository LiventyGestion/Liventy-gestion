import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { CHATBOT_CONFIG } from "@/lib/chatbot/config";
import { chatbotAnalytics } from "@/lib/chatbot/analytics";

interface WhatsAppButtonProps {
  className?: string;
}

const WhatsAppButton = ({ className }: WhatsAppButtonProps) => {
  const handleClick = () => {
    chatbotAnalytics.whatsappClick();
    window.open(CHATBOT_CONFIG.urls.whatsapp, '_blank');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={`text-xs bg-[#25D366] hover:bg-[#128C7E] text-white border-none ${className}`}
      aria-label="Hablar por WhatsApp"
    >
      <MessageCircle className="h-3 w-3 mr-1" />
      WhatsApp
    </Button>
  );
};

export default WhatsAppButton;
