import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Luxury hotel lobby"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-white/90 text-sm font-medium">
              5-Star Luxury Experience
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Experience
            <span className="block text-primary-glow">Luxury</span>
            Redefined
          </h1>

          {/* Description */}
          <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
            Discover unparalleled elegance and comfort at Luxe Hotel. Where
            every detail is crafted to perfection, and every moment becomes
            an unforgettable memory.
          </p>

          {/* Location */}
          <div className="flex items-center space-x-2 mb-8">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-white/90">Downtown Metropolitan Area</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-hero hover:shadow-luxury transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link to="/booking">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Stay
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              asChild
            >
              <Link to="/rooms">Explore Rooms</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;