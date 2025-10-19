import Hero from "@/components/Hero";
import SubdomainGenerator from "@/components/SubdomainGenerator";
import SetupGuide from "@/components/SetupGuide";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <SubdomainGenerator />
      <SetupGuide />
    </main>
  );
};

export default Index;
