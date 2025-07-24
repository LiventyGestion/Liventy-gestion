import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RentalSimulator from "@/components/RentalSimulator";

const RentalSimulatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <RentalSimulator />
      </div>
      <Footer />
    </div>
  );
};

export default RentalSimulatorPage;