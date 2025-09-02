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
import FinalCTA from "@/components/FinalCTA";
import ContactFormSection from "@/components/ContactForm";
import Chatbot from "@/components/Chatbot";
import SecondaryCTAs from "@/components/SecondaryCTAs";

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
      <Testimonials />
      <FAQ />
      <ContactFormSection />
      <FinalCTA />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
