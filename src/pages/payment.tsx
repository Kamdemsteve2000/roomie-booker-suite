import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const PaymentPage = () => {
  const [bookingData, setBookingData] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState("stripe");
  const [processing, setProcessing] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = sessionStorage.getItem('bookingData');
    if (storedData) {
      setBookingData(JSON.parse(storedData));
      fetchRooms();
    } else {
      navigate('/booking');
    }
  }, [navigate]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*');
      
      if (!error && data) {
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handlePayment = async () => {
    if (!user || !bookingData) return;

    setProcessing(true);

    try {
      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          room_id: bookingData.selectedRoom,
          check_in_date: new Date(bookingData.checkIn).toISOString().split('T')[0],
          check_out_date: new Date(bookingData.checkOut).toISOString().split('T')[0],
          adults: bookingData.adults,
          children: bookingData.children,
          total_price: bookingData.totalPrice,
          guest_first_name: bookingData.firstName,
          guest_last_name: bookingData.lastName,
          guest_email: bookingData.email,
          guest_phone: bookingData.phone,
          special_requests: bookingData.specialRequests,
          status: 'confirmed'
        })
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }

      // Update room unit status to booked
      const { error: unitError } = await (supabase as any)
        .from('room_units')
        .update({ status: 'booked' })
        .eq('id', bookingData.selectedSubRoom);

      if (unitError) {
        console.error('Error updating room unit:', unitError);
      }

      // Clear booking data
      sessionStorage.removeItem('bookingData');

      toast({
        title: "Booking confirmed!",
        description: "Your reservation has been successfully created.",
      });

      navigate('/profile');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  const selectedRoomData = rooms.find(r => r.id === bookingData.selectedRoom);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="py-12 bg-gradient-luxury">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/booking')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Booking
            </Button>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Payment & Confirmation
          </h1>
          <p className="text-muted-foreground">
            Complete your booking with secure payment
          </p>
        </div>
      </section>

      {/* Payment Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedPayment} onValueChange={setSelectedPayment}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="stripe">Cards & Digital</TabsTrigger>
                      <TabsTrigger value="mobile">Mobile Money</TabsTrigger>
                    </TabsList>

                    <TabsContent value="stripe" className="space-y-4">
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-16 p-4"
                          onClick={() => setSelectedPayment("stripe")}
                        >
                          <CreditCard className="w-6 h-6 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
                          </div>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-16 p-4"
                          onClick={() => setSelectedPayment("paypal")}
                        >
                          <div className="w-6 h-6 mr-3 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                            PP
                          </div>
                          <div className="text-left">
                            <div className="font-medium">PayPal</div>
                            <div className="text-sm text-muted-foreground">Pay with your PayPal account</div>
                          </div>
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="mobile" className="space-y-4">
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-16 p-4"
                          onClick={() => setSelectedPayment("orange")}
                        >
                          <Smartphone className="w-6 h-6 mr-3 text-orange-500" />
                          <div className="text-left">
                            <div className="font-medium">Orange Money</div>
                            <div className="text-sm text-muted-foreground">Pay with Orange Money</div>
                          </div>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-16 p-4"
                          onClick={() => setSelectedPayment("mtn")}
                        >
                          <Smartphone className="w-6 h-6 mr-3 text-yellow-500" />
                          <div className="text-left">
                            <div className="font-medium">MTN Money</div>
                            <div className="text-sm text-muted-foreground">Pay with MTN Mobile Money</div>
                          </div>
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-8 p-4 bg-muted rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="font-medium">Secure Payment</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your payment information is encrypted and secure. We never store your payment details.
                    </p>
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
                  {selectedRoomData && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-muted-foreground">Room:</span>
                        <div className="text-right">
                          <div className="font-medium">{selectedRoomData.name}</div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {bookingData.selectedSubRoom}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Check-in:</span>
                        <span>{format(new Date(bookingData.checkIn), "MMM dd, yyyy")}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Check-out:</span>
                        <span>{format(new Date(bookingData.checkOut), "MMM dd, yyyy")}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Guests:</span>
                        <span>{bookingData.adults + bookingData.children} guests</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Guest:</span>
                        <span>{bookingData.firstName} {bookingData.lastName}</span>
                      </div>

                      <hr className="my-4" />

                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>${bookingData.totalPrice}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full bg-gradient-hero hover:shadow-luxury transition-all duration-300 mt-6"
                    disabled={processing}
                    onClick={handlePayment}
                  >
                    {processing ? 'Processing...' : `Pay $${bookingData.totalPrice}`}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By completing this booking, you agree to our terms and conditions.
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

export default PaymentPage;