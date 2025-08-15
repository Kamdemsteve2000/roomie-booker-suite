import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/ui/navigation";
import { ArrowLeft, Wifi, Car, Coffee, Dumbbell, Users, Bed } from "lucide-react";

// Mock room data - in real app this would come from Supabase
const roomsData = {
  standard: {
    id: "standard",
    name: "Standard Room",
    image: "/src/assets/room-standard.jpg",
    price: 150,
    description: "Our comfortable Standard Rooms offer everything you need for a pleasant stay. Featuring modern amenities and elegant décor, these rooms provide the perfect balance of comfort and value.",
    features: [
      "Queen-size bed",
      "32-inch flat-screen TV",
      "Free Wi-Fi",
      "Air conditioning",
      "Private bathroom",
      "Work desk",
      "Mini refrigerator",
      "Coffee maker"
    ],
    amenities: ["wifi", "parking", "coffee", "fitness"]
  },
  deluxe: {
    id: "deluxe",
    name: "Deluxe Room",
    image: "/src/assets/room-deluxe.jpg",
    price: 250,
    description: "Experience enhanced comfort in our spacious Deluxe Rooms. With premium furnishings and additional amenities, these rooms are perfect for guests seeking a more luxurious experience.",
    features: [
      "King-size bed",
      "42-inch smart TV",
      "Free high-speed Wi-Fi",
      "Premium air conditioning",
      "Marble bathroom with rainfall shower",
      "Executive work area",
      "Mini-bar",
      "Nespresso machine",
      "City view"
    ],
    amenities: ["wifi", "parking", "coffee", "fitness"]
  },
  suite: {
    id: "suite",
    name: "Executive Suite",
    image: "/src/assets/room-suite.jpg",
    price: 400,
    description: "Indulge in the ultimate luxury with our Executive Suites. Featuring separate living areas, premium amenities, and stunning views, these suites provide an unforgettable experience.",
    features: [
      "Separate bedroom and living area",
      "King-size bed with premium linens",
      "55-inch smart TV in both rooms",
      "Free premium Wi-Fi",
      "Climate control",
      "Marble bathroom with jacuzzi",
      "Executive lounge access",
      "Premium mini-bar",
      "Espresso machine",
      "Panoramic city view",
      "24/7 concierge service"
    ],
    amenities: ["wifi", "parking", "coffee", "fitness"]
  }
};

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  coffee: Coffee,
  fitness: Dumbbell
};

export default function RoomDetailsPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const room = roomId ? roomsData[roomId as keyof typeof roomsData] : null;

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
              src={room.image}
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

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Amenities</h3>
              <div className="flex space-x-4">
                {room.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                  return (
                    <div key={amenity} className="flex items-center text-primary">
                      <Icon className="h-5 w-5" />
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