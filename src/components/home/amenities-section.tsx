import { Card, CardContent } from "@/components/ui/card";
import {
  Waves,
  Utensils,
  Dumbbell,
  Wifi,
  Car,
  Coffee,
  Headphones,
  Shield,
} from "lucide-react";

const amenities = [
  {
    icon: Waves,
    title: "Infinity Pool",
    description: "Relax in our rooftop infinity pool with panoramic city views.",
  },
  {
    icon: Utensils,
    title: "Fine Dining",
    description: "Award-winning restaurants serving world-class cuisine.",
  },
  {
    icon: Dumbbell,
    title: "Fitness Center",
    description: "State-of-the-art gym equipment available 24/7.",
  },
  {
    icon: Wifi,
    title: "High-Speed WiFi",
    description: "Complimentary high-speed internet throughout the hotel.",
  },
  {
    icon: Car,
    title: "Valet Parking",
    description: "Secure valet parking service for your convenience.",
  },
  {
    icon: Coffee,
    title: "Coffee Lounge",
    description: "Artisan coffee and light refreshments all day.",
  },
  {
    icon: Headphones,
    title: "Concierge Service",
    description: "Personal concierge to assist with all your needs.",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description: "Round-the-clock security for your peace of mind.",
  },
];

const AmenitiesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            World-Class Amenities
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience exceptional services and facilities designed to exceed
            your expectations and create memorable moments.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <Card
              key={index}
              className="group text-center hover:shadow-card transition-all duration-300 transform hover:-translate-y-1 border-0 bg-accent/50"
            >
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <amenity.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  {amenity.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {amenity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;