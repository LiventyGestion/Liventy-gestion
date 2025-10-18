import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import OwnerBenefits from "@/components/OwnerBenefits";
import HowItWorks from "@/components/HowItWorks";
import PropertySlider from "@/components/PropertySlider";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactFormSection from "@/components/ContactForm";
import Chatbot from "@/components/Chatbot";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SecondaryCTAs from "@/components/SecondaryCTAs";
import SellCTA from "@/components/SellCTA";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhatWeDo />
      <HowItWorks />
      <SecondaryCTAs />
      <OwnerBenefits />
      <PropertySlider />
      <Stats />
      
      {/* Sección Para Inquilinos */}
      <section className="py-20 bg-gradient-to-br from-[#FFF3E0] via-[#FFECCC] to-[#FFE0B2]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-6 bg-primary text-white px-4 py-2">
              Para inquilinos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Buscas un alquiler sin complicaciones?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Descubre cómo Liventy hace que alquilar sea transparente, fácil y con atención personalizada. Viviendas verificadas, contratos claros y soporte continuo.
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-10 text-lg btn-hover-lift"
              onClick={() => window.location.href = '/inquilinos'}
            >
              Ver más información
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      <Testimonials />
      <FAQ />
      <ContactFormSection />
      <SellCTA />
      <Footer />
      <Chatbot />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
