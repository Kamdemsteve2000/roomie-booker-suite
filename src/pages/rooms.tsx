import { useState, useEffect } from "react";
import Navigation from "@/components/ui/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Square, Bed, Bath, Wifi, Car, Coffee, Waves, Utensils, Shield, Dumbbell, UtensilsCrossed } from "lucide-react";
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

const RoomsPage = () => {
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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading rooms...</div>
            </div>
          ) : (
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
                        src={getImageUrl(room)}
                        alt={room.name}
                        className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {room.type === 'suite' && (
                        <Badge className="absolute top-4 left-4 bg-gradient-hero text-white">
                          Most Popular
                        </Badge>
                      )}
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                        <div className="text-lg font-bold">${room.price}</div>
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
                          {room.size}
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
                          <Link to={`/booking?room=${room.id}`}>Book Now</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/room-details/${room.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RoomsPage;