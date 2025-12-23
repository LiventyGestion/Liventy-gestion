import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import OwnerBenefits from "@/components/OwnerBenefits";
import HowItWorks from "@/components/HowItWorks";
import ComparisonTable from "@/components/ComparisonTable";
import PropertySlider from "@/components/PropertySlider";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactFormSection from "@/components/ContactForm";
import Chatbot from "@/components/Chatbot";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SellCTA from "@/components/SellCTA";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
        <WhatWeDo />
      </div>
      <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
        <HowItWorks />
      </div>
      <div className="animate-fade-up" style={{ animationDelay: '150ms' }}>
        <ComparisonTable />
      </div>
      <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
        <OwnerBenefits />
      </div>
      <div className="animate-fade-up" style={{ animationDelay: '250ms' }}>
        <PropertySlider />
      </div>
      <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
        <Stats />
      </div>
      
      <section className="py-16 bg-gradient-to-br from-background to-muted/20 animate-fade-up" style={{ animationDelay: '350ms' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="mb-4">
              Para inquilinos
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat">
              ¿Buscas tu próximo hogar?
            </h2>
            <p className="text-lg text-muted-foreground font-lato">
              Descubre nuestras propiedades disponibles y encuentra el lugar perfecto para ti. 
              Con Liventy, alquilar es sencillo, transparente y sin complicaciones.
            </p>
            <Button size="lg" asChild className="mt-6">
              <Link to="/inquilinos">
                Quiero inscribirme <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <div className="animate-fade-up" style={{ animationDelay: '400ms' }}>
        <Testimonials />
      </div>
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
