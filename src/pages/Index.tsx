import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/home/hero-section";
import FeaturedRooms from "@/components/home/featured-rooms";
import AmenitiesSection from "@/components/home/amenities-section";
import { Footer } from "@/components/ui/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedRooms />
        <AmenitiesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
