import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [processing, setProcessing] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirmBooking = async () => {
      try {
        const pendingBooking = sessionStorage.getItem('pendingBooking');
        if (!pendingBooking) {
          throw new Error("No pending booking found");
        }

        const bookingData = JSON.parse(pendingBooking);
        
        if (!user) {
          throw new Error("User not authenticated");
        }

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

        // Clear pending booking data
        sessionStorage.removeItem('pendingBooking');
        sessionStorage.removeItem('bookingData');

        setBookingConfirmed(true);
        
        toast({
          title: "Payment successful!",
          description: "Your booking has been confirmed.",
        });

      } catch (error: any) {
        console.error("Booking confirmation error:", error);
        toast({
          variant: "destructive",
          title: "Booking confirmation failed",
          description: error.message || "Please contact support.",
        });
      } finally {
        setProcessing(false);
      }
    };

    confirmBooking();
  }, [user, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-12 bg-gradient-luxury">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {processing ? "Processing..." : bookingConfirmed ? "Payment Successful!" : "Payment Processing"}
          </h1>
          <p className="text-muted-foreground">
            {processing ? "Confirming your booking..." : bookingConfirmed ? "Your reservation has been confirmed" : "Please contact support"}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-2xl text-center">
                {bookingConfirmed ? "Booking Confirmed" : "Processing Your Booking"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {processing ? (
                <div className="py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Confirming your booking details...</p>
                </div>
              ) : bookingConfirmed ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800">
                      Your payment has been processed successfully and your booking is confirmed.
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    You will receive a confirmation email shortly with your booking details.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => navigate('/profile')}
                      className="bg-gradient-hero hover:shadow-luxury transition-all duration-300"
                    >
                      View My Bookings
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-yellow-800">
                      There was an issue confirming your booking. Please contact our support team.
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PaymentSuccess;