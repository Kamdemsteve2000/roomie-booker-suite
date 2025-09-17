import Navigation from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Users, Minus, Plus, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BookingPage = () => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedSubRoom, setSelectedSubRoom] = useState("");
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [subRooms, setSubRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user profile and rooms data
  useEffect(() => {
    fetchRooms();
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Update guest names array when total guests change
  useEffect(() => {
    const totalGuests = adults + children;
    const newGuestNames = Array(totalGuests).fill('').map((_, index) => 
      guestNames[index] || ''
    );
    setGuestNames(newGuestNames);
  }, [adults, children]);

  // Update sub-rooms when room selection changes
  useEffect(() => {
    if (selectedRoom) {
      fetchSubRooms(selectedRoom);
    }
  }, [selectedRoom]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('available', true);
      
      if (!error && data) {
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!error && data) {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setPhone(data.phone || '');
      }
      
      // Set email from user object
      if (user.email) {
        setEmail(user.email);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchSubRooms = async (roomId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('room_units')
        .select('*')
        .eq('room_id', roomId)
        .eq('status', 'available');
      
      if (!error && data) {
        setSubRooms(data);
        setSelectedSubRoom(''); // Reset sub-room selection
      }
    } catch (error) {
      console.error('Error fetching sub-rooms:', error);
    }
  };

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateTotal = () => {
    const selectedRoomData = rooms.find(room => room.id === selectedRoom);
    if (selectedRoomData) {
      return selectedRoomData.price * calculateNights();
    }
    return 0;
  };

  const updateGuestName = (index: number, name: string) => {
    const newGuestNames = [...guestNames];
    newGuestNames[index] = name;
    setGuestNames(newGuestNames);
  };

  const handleProceedToPayment = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to continue with your booking.",
      });
      navigate('/auth');
      return;
    }

    if (!checkIn || !checkOut || !selectedRoom || !selectedSubRoom || !firstName || !lastName || !email) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields to continue.",
      });
      return;
    }

    // Store booking data in session storage for payment page
    const bookingData = {
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      adults,
      children,
      selectedRoom,
      selectedSubRoom,
      guestNames,
      firstName,
      lastName,
      email,
      phone,
      specialRequests,
      totalPrice: calculateTotal() + Math.round(calculateTotal() * 0.12)
    };

    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-luxury">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Book Your Stay
          </h1>
          <p className="text-muted-foreground text-lg">
            Reserve your perfect room and create unforgettable memories at Luxe Hotel.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Reservation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkin">Check-in Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkIn && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="checkout">Check-out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkOut && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                            disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Adults</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="flex-1 text-center py-2">{adults}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdults(adults + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Children</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="flex-1 text-center py-2">{children}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setChildren(children + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Room Selection */}
                  <div>
                    <Label>Room Type</Label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select a room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name} - ${room.price}/night
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sub-Room Selection */}
                  {selectedRoom && subRooms.length > 0 && (
                    <div>
                      <Label>Specific Room Unit</Label>
                      <Select value={selectedSubRoom} onValueChange={setSelectedSubRoom}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select specific room unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {subRooms.map((subRoom) => (
                            <SelectItem key={subRoom.id} value={subRoom.id}>
                              <div className="flex items-center">
                                <Home className="w-4 h-4 mr-2" />
                                {subRoom.code}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Guest Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name" 
                        className="mt-1" 
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name" 
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email" 
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number" 
                      className="mt-1" 
                    />
                  </div>

                  {/* Guest Names */}
                  {guestNames.length > 0 && (
                    <div>
                      <Label>Guest Names</Label>
                      <div className="space-y-2 mt-1">
                        {guestNames.map((name, index) => (
                          <Input
                            key={index}
                            value={name}
                            onChange={(e) => updateGuestName(index, e.target.value)}
                            placeholder={`Guest ${index + 1} name`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea 
                      id="specialRequests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requests or requirements..."
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-card sticky top-24">
                <CardHeader>
                  <CardTitle className="font-display text-xl">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {checkIn && checkOut && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dates:</span>
                      <span>{format(checkIn, "MMM dd")} - {format(checkOut, "MMM dd")}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nights:</span>
                    <span>{calculateNights()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Guests:</span>
                    <span>
                      <Users className="inline w-4 h-4 mr-1" />
                      {adults + children}
                    </span>
                  </div>

                  {selectedRoom && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Room:</span>
                      <span>{rooms.find(r => r.id === selectedRoom)?.name}</span>
                    </div>
                  )}

                  {selectedSubRoom && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Unit:</span>
                      <span>{subRooms.find(r => r.id === selectedSubRoom)?.code}</span>
                    </div>
                  )}

                  {selectedRoom && calculateNights() > 0 && (
                    <>
                      <hr className="my-4" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          ${rooms.find(r => r.id === selectedRoom)?.price} × {calculateNights()} nights
                        </span>
                        <span>${calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxes & Fees</span>
                        <span>${Math.round(calculateTotal() * 0.12)}</span>
                      </div>
                      <hr className="my-4" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${calculateTotal() + Math.round(calculateTotal() * 0.12)}</span>
                      </div>
                    </>
                  )}

                  <Button 
                    className="w-full bg-gradient-hero hover:shadow-luxury transition-all duration-300 mt-6"
                    disabled={!checkIn || !checkOut || !selectedRoom || !selectedSubRoom || !firstName || !lastName || !email || loading}
                    onClick={handleProceedToPayment}
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Free cancellation within 24 hours of booking
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;