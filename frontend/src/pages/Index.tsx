import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";
import { SocialProofPopup } from "@/components/SocialProofPopup";

const Index = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero onVideoClick={() => setIsVideoOpen(true)} />
      <ProductGrid />
      <Footer />
      <VideoPlayer isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
      <SocialProofPopup />
    </div>
  );
};

export default Index;
