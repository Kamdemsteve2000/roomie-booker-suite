import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, Car, Coffee, Waves, Utensils, Dumbbell, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import roomSuite from "@/assets/room-suite.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomStandard from "@/assets/room-standard.jpg";

interface Room {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  capacity: number;
  size: string;
  image_url: string | null;
  features: string[];
  amenities: string[];
  available: boolean;
}

const amenityIcons: { [key: string]: any } = {
  wifi: Wifi,
  parking: Car,
  coffee: Coffee,
  fitness: Dumbbell,
  pool: Waves,
  restaurant: UtensilsCrossed,
};

const FeaturedRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('available', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (room: Room) => {
    if (room.type === 'suite') return roomSuite;
    if (room.type === 'deluxe') return roomDeluxe;
    return roomStandard;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading rooms...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-luxury">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Luxury Accommodations
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our carefully curated selection of rooms and suites,
            each designed to provide the ultimate in comfort and elegance.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="group overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={getImageUrl(room)}
                  alt={room.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {room.type === 'suite' && (
                  <Badge className="absolute top-4 left-4 bg-gradient-hero text-white">
                    Most Popular
                  </Badge>
                )}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  ${room.price}/night
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {room.name}
                  </h3>
                  <span className="text-muted-foreground text-sm">
                    {room.size}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {room.description}
                </p>

                {/* Capacity */}
                <div className="flex items-center text-muted-foreground text-sm mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  Up to {room.capacity} guests
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {room.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {room.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{room.features.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Amenities Icons */}
                <div className="flex items-center gap-3 mb-6">
                  {room.amenities.slice(0, 4).map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || Users;
                    return (
                      <Icon
                        key={index}
                        className="w-4 h-4 text-muted-foreground"
                      />
                    );
                  })}
                  {room.amenities.length > 4 && (
                    <span className="text-muted-foreground text-xs">
                      +{room.amenities.length - 4}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-hero hover:shadow-luxury transition-all duration-300"
                    asChild
                  >
                    <Link to="/booking">Book Now</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/room-details/${room.id}`}>Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/rooms">View All Rooms & Suites</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;