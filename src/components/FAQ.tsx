import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "¿Qué pasa si el inquilino deja de pagar?",
      answer: "Contamos con un seguro de impago que cubre hasta 12 meses de renta. Además, nuestro equipo legal se encarga de todos los procedimientos necesarios sin coste adicional para ti."
    },
    {
      question: "¿Qué incluye exactamente vuestro servicio?",
      answer: "Nuestro servicio incluye búsqueda y selección de inquilinos, gestión de contratos, cobro de rentas, mantenimiento de la propiedad, atención al cliente 24/7 y gestión legal completa."
    },
    {
      question: "¿Firmáis contratos digitales?",
      answer: "Sí, utilizamos tecnología avanzada para la firma digital de contratos, lo que agiliza el proceso y proporciona total seguridad jurídica a todas las partes."
    },
    {
      question: "¿Puedo seguir usando el piso si lo necesito?",
      answer: "Dependiendo del tipo de contrato, podemos establecer cláusulas que permitan el uso ocasional o estacional. Analizamos cada caso de forma personalizada."
    },
    {
      question: "¿Cuál es vuestra comisión por gestión?",
      answer: "Nuestras tarifas son competitivas y transparentes. La comisión varía según los servicios contratados y las características de la propiedad. Te ofrecemos un presupuesto personalizado sin compromiso."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Resolvemos tus dudas</h2>
          <p className="text-muted-foreground text-lg">
            Las preguntas más frecuentes sobre nuestros servicios
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg border px-6">
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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