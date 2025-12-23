import { Info } from "lucide-react";

interface DisclaimerProps {
  variant?: 'inline' | 'box';
  className?: string;
}

const Disclaimer = ({ variant = 'box', className = '' }: DisclaimerProps) => {
  const text = "El servicio incluye seguimiento del cobro y comunicación. No constituye garantía de pago salvo contratación y aceptación de coberturas externas.";

  if (variant === 'inline') {
    return (
      <p className={`text-xs text-muted-foreground ${className}`}>
        * {text}
      </p>
    );
  }

  return (
    <div className={`flex items-start gap-3 bg-gray-100 p-4 rounded-lg ${className}`}>
      <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
      <p className="text-sm text-muted-foreground">
        {text}
      </p>
    </div>
  );
};

export default Disclaimer;
