import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Settings, FileText, Home, Euro, HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      icon: Shield,
      question: "¿Qué pasa si el inquilino deja de pagar?",
      answer: "Contamos con un seguro de impago que cubre hasta 12 meses de renta. Además, nuestro equipo legal se encarga de todos los procedimientos necesarios sin coste adicional para ti."
    },
    {
      icon: Settings,
      question: "¿Qué incluye exactamente vuestro servicio?",
      answer: "Nuestro servicio incluye búsqueda y selección de inquilinos, gestión de contratos, cobro de rentas, mantenimiento de la propiedad, atención al cliente 24/7 y gestión legal completa."
    },
    {
      icon: FileText,
      question: "¿Firmáis contratos digitales?",
      answer: "Sí, utilizamos tecnología avanzada para la firma digital de contratos, lo que agiliza el proceso y proporciona total seguridad jurídica a todas las partes."
    },
    {
      icon: Home,
      question: "¿Puedo seguir usando el piso si lo necesito?",
      answer: "Dependiendo del tipo de contrato, podemos establecer cláusulas que permitan el uso ocasional o estacional. Analizamos cada caso de forma personalizada."
    },
    {
      icon: Euro,
      question: "¿Cuál es vuestra comisión por gestión?",
      answer: "Nuestras tarifas son competitivas y transparentes. La comisión varía según los servicios contratados y las características de la propiedad. Te ofrecemos un presupuesto personalizado sin compromiso."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Resolvemos tus dudas</h2>
          <p className="text-muted-foreground text-base">
            Las preguntas más frecuentes sobre nuestros servicios
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg border px-6">
                <AccordionTrigger className="text-left font-semibold">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <faq.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-11">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;