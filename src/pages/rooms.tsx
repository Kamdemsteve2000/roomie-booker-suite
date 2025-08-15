import Navigation from "@/components/ui/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Square, Bed, Bath, Wifi, Car, Coffee, Waves, Utensils, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import roomSuite from "@/assets/room-suite.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomStandard from "@/assets/room-standard.jpg";

const rooms = [
  {
    id: 1,
    name: "Presidential Suite",
    image: roomSuite,
    price: 899,
    originalPrice: 1199,
    capacity: 4,
    size: 120,
    bedType: "King Bed + Sofa Bed",
    bathrooms: 2,
    features: ["Ocean View", "Private Balcony", "Jacuzzi", "Butler Service", "Living Room", "Dining Area"],
    amenities: ["High-Speed WiFi", "Valet Parking", "Room Service", "Infinity Pool Access", "Fine Dining", "24/7 Security"],
    description: "Experience ultimate luxury in our flagship suite with panoramic ocean views, private balcony, and exclusive butler service. Perfect for special occasions and VIP guests.",
    popular: true,
  },
  {
    id: 2,
    name: "Deluxe Room",
    image: roomDeluxe,
    price: 399,
    originalPrice: 499,
    capacity: 2,
    size: 45,
    bedType: "King Bed",
    bathrooms: 1,
    features: ["City View", "Marble Bathroom", "Minibar", "Work Desk", "Seating Area"],
    amenities: ["High-Speed WiFi", "Valet Parking", "Coffee Machine", "Room Service"],
    description: "Elegant comfort meets modern convenience in our spacious deluxe accommodations with stunning city views and marble bathroom finishes.",
    popular: false,
  },
  {
    id: 3,
    name: "Standard Room",
    image: roomStandard,
    price: 249,
    originalPrice: 299,
    capacity: 2,
    size: 32,
    bedType: "Queen Bed",
    bathrooms: 1,
    features: ["Garden View", "Work Desk", "Coffee Machine", "Climate Control"],
    amenities: ["High-Speed WiFi", "Coffee Service", "Room Service"],
    description: "Comfortable and stylish rooms perfect for business travelers and couples, featuring garden views and modern amenities.",
    popular: false,
  },
  {
    id: 4,
    name: "Executive Suite",
    image: roomSuite,
    price: 649,
    originalPrice: 799,
    capacity: 3,
    size: 75,
    bedType: "King Bed + Day Bed",
    bathrooms: 1,
    features: ["Panoramic Views", "Separate Living Area", "Executive Lounge Access", "Premium Minibar"],
    amenities: ["High-Speed WiFi", "Valet Parking", "Coffee Machine", "Pool Access", "Concierge Service"],
    description: "Sophisticated accommodations with separate living areas and exclusive executive lounge access for business travelers.",
    popular: false,
  },
];

const amenityIcons: { [key: string]: any } = {
  "High-Speed WiFi": Wifi,
  "Valet Parking": Car,
  "Coffee Machine": Coffee,
  "Coffee Service": Coffee,
  "Room Service": Utensils,
  "Infinity Pool Access": Waves,
  "Pool Access": Waves,
  "Fine Dining": Utensils,
  "24/7 Security": Shield,
  "Concierge Service": Shield,
};

const RoomsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Rooms & Suites
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our exquisite collection of rooms and suites, each thoughtfully
            designed to provide the perfect blend of luxury, comfort, and functionality.
          </p>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="group overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {room.popular && (
                      <Badge className="absolute top-4 left-4 bg-gradient-hero text-white">
                        Most Popular
                      </Badge>
                    )}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                      <div className="text-lg font-bold">${room.price}</div>
                      {room.originalPrice && (
                        <div className="text-xs line-through opacity-75">
                          ${room.originalPrice}
                        </div>
                      )}
                      <div className="text-xs">per night</div>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-6">
                    <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                      {room.name}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {room.description}
                    </p>

                    {/* Room Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        {room.capacity} guests
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Square className="w-4 h-4 mr-2" />
                        {room.size} sqm
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Bed className="w-4 h-4 mr-2" />
                        {room.bedType}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Bath className="w-4 h-4 mr-2" />
                        {room.bathrooms} bathroom{room.bathrooms > 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2 text-sm">Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {room.features.slice(0, 4).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {room.features.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.features.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-2 text-sm">Amenities</h4>
                      <div className="flex items-center gap-3">
                        {room.amenities.slice(0, 4).map((amenity) => {
                          const Icon = amenityIcons[amenity] || Shield;
                          return (
                            <div
                              key={amenity}
                              className="flex items-center text-muted-foreground"
                              title={amenity}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                          );
                        })}
                        {room.amenities.length > 4 && (
                          <span className="text-muted-foreground text-xs">
                            +{room.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-hero hover:shadow-luxury transition-all duration-300"
                        asChild
                      >
                        <Link to="/booking">Book Now</Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomsPage;