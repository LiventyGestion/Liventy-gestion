import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentBanner = ({ onAccept, onDecline }: ConsentBannerProps) => {
  return (
    <div className="p-3 bg-muted/50 border-t border-border">
      <div className="flex items-start gap-2 text-xs text-muted-foreground mb-2">
        <Shield className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
        <p>
          Usaremos tus datos para gestionar tu solicitud y contactarte. 
          Más info en{" "}
          <a href="/politica-privacidad" className="underline hover:text-primary" target="_blank" rel="noopener">
            Privacidad
          </a>{" "}
          y{" "}
          <a href="/politica-cookies" className="underline hover:text-primary" target="_blank" rel="noopener">
            Cookies
          </a>
          . ¿Aceptas el tratamiento de datos?
        </p>
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDecline}
          className="text-xs"
          aria-label="Rechazar tratamiento de datos"
        >
          No
        </Button>
        <Button
          size="sm"
          onClick={onAccept}
          className="text-xs"
          aria-label="Aceptar tratamiento de datos"
        >
          Sí, acepto
        </Button>
      </div>
    </div>
  );
};

export default ConsentBanner;
