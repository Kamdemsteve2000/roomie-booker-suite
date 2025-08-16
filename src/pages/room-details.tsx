import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/ui/navigation";
import { ArrowLeft, Wifi, Car, Coffee, Dumbbell, Users, Bed, UtensilsCrossed, Waves } from "lucide-react";
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

export default function RoomDetailsPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (error) throw error;
      setRoom(data);
    } catch (error) {
      console.error('Error fetching room:', error);
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
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading room details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Room not found</h1>
          <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/rooms')}
          className="mb-6 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Room Image */}
          <div className="relative">
            <img
              src={getImageUrl(room)}
              alt={room.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-elegant"
            />
          </div>

          {/* Room Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{room.name}</h1>
              <p className="text-2xl font-semibold text-primary">${room.price}/night</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">{room.description}</p>

            {/* Room Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-muted-foreground">
                <Users className="w-5 h-5 mr-2" />
                Up to {room.capacity} guests
              </div>
              <div className="flex items-center text-muted-foreground">
                <Bed className="w-5 h-5 mr-2" />
                {room.size}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Amenities</h3>
              <div className="grid grid-cols-3 gap-4">
                {room.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Coffee;
                  return (
                    <div key={amenity} className="flex items-center text-primary">
                      <Icon className="h-5 w-5 mr-2" />
                      <span className="capitalize">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Room Features</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {room.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Actions */}
            <div className="space-y-4 pt-6">
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => navigate(`/booking?room=${room.id}`)}
              >
                <Bed className="mr-2 h-4 w-4" />
                Book This Room
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={() => navigate('/rooms')}
              >
                <Users className="mr-2 h-4 w-4" />
                Compare Rooms
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}