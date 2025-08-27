import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PersonaLibrary from "@/components/PersonaLibrary";
import Dashboard from "@/components/Dashboard";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <PersonaLibrary />
      <Dashboard />
      <CTA />
    </div>
  );
};

export default Index;
