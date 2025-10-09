import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authentication required");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    console.log("Creating Monétbil payment for user:", user.email);

    const { amount, phoneNumber, bookingData } = await req.json();
    
    const monetbilServiceKey = Deno.env.get("MONETBIL_SERVICE_KEY");
    if (!monetbilServiceKey) {
      throw new Error("Monétbil service key not configured");
    }

    // Create booking record first
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert({
        user_id: user.id,
        room_id: bookingData.selectedRoom,
        check_in_date: bookingData.checkIn.split('T')[0],
        check_out_date: bookingData.checkOut.split('T')[0],
        adults: bookingData.adults,
        children: bookingData.children,
        total_price: amount,
        status: 'pending',
        guest_first_name: bookingData.firstName,
        guest_last_name: bookingData.lastName,
        guest_email: bookingData.email,
        guest_phone: bookingData.phone,
        special_requests: bookingData.specialRequests
      })
      .select()
      .single();

    if (bookingError) {
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    console.log("Booking created:", booking.id);

    // Monétbil API endpoint
    const monetbilUrl = "https://api.monetbil.com/payment/v1/placePayment";
    
    const paymentData = {
      service: monetbilServiceKey,
      amount: Number(amount),
      phonenumber: phoneNumber || bookingData.phone || "",
      item_ref: `booking_${booking.id}`,
      user: user.id,
      first_name: bookingData.firstName || "",
      last_name: bookingData.lastName || "",
      email: bookingData.email || user.email,
      return_url: `${req.headers.get("origin") || Deno.env.get("FRONTEND_URL") || "http://localhost:8080"}/payment-success?booking_id=${booking.id}`,
      notify_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/monetbil-webhook`,
    };

    console.log("Creating Monétbil payment:", { booking_id: booking.id, amount });

    const response = await fetch(monetbilUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const responseData = await response.json();
    
    if (!response.ok || !responseData.payment_url) {
      throw new Error(`Monétbil error: ${responseData.message || 'Payment creation failed'}`);
    }

    console.log("Monétbil payment created successfully");

    return new Response(JSON.stringify({
      url: responseData.payment_url,
      paymentRef: responseData.payment_ref
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error creating Monétbil payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
