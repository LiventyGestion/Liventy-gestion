import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import PropertySlider from "@/components/PropertySlider";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <PropertySlider />
      <Stats />
      <Testimonials />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
