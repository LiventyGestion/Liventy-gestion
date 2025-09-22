import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import OwnerBenefits from "@/components/OwnerBenefits";
import HowItWorks from "@/components/HowItWorks";
import PropertySlider from "@/components/PropertySlider";
import Stats from "@/components/Stats";
import ComparisonTable from "@/components/ComparisonTable";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactFormSection from "@/components/ContactForm";
import Chatbot from "@/components/Chatbot";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SecondaryCTAs from "@/components/SecondaryCTAs";
import SellCTA from "@/components/SellCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhatWeDo />
      <HowItWorks />
      <ComparisonTable />
      <SecondaryCTAs />
      <OwnerBenefits />
      <PropertySlider />
      <Stats />
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
