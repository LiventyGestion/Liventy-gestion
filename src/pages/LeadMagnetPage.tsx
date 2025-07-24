import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadMagnet from "@/components/LeadMagnet";

const LeadMagnetPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <LeadMagnet />
      </div>
      <Footer />
    </div>
  );
};

export default LeadMagnetPage;