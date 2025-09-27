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

    console.log("Creating CinePay payment for user:", user.email);

    const { amount, currency = "XOF", paymentMethod, phoneNumber, bookingData } = await req.json();
    
    const cinepayApiKey = Deno.env.get("CINEPAY_API_KEY");
    if (!cinepayApiKey) {
      throw new Error("CinePay API key not configured");
    }

    // CinePay API endpoint
    const cinepayUrl = "https://api-checkout.cinetpay.com/v2/payment";
    
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

    // Generate unique transaction ID
    const transactionId = `booking_${booking.id}_${Date.now()}`;
    
    const paymentData = {
      apikey: cinepayApiKey,
      site_id: Deno.env.get("CINEPAY_SITE_ID") || "1", // You'll need to add this
      transaction_id: transactionId,
      amount: parseInt(amount),
      currency: currency,
      description: `Hotel booking for ${bookingData?.roomName || 'Room'}`,
      return_url: `${req.headers.get("origin")}/payment-success?booking_id=${booking.id}`,
      notify_url: `${req.headers.get("origin")}/api/cinepay-webhook`,
      metadata: JSON.stringify({ ...bookingData, booking_id: booking.id, user_id: user.id }),
      customer_surname: bookingData?.lastName || "",
      customer_name: bookingData?.firstName || "",
      customer_email: bookingData?.email || "",
      customer_phone_number: phoneNumber || bookingData?.phone || "",
      customer_address: "",
      customer_city: "",
      customer_country: "CI", // Côte d'Ivoire
      customer_state: "",
      customer_zip_code: "",
    };

    // Add payment method specific data
    if (paymentMethod === "ORANGE_MONEY_CI") {
      paymentData.channels = "ORANGE_MONEY_CI";
    } else if (paymentMethod === "MTN_MONEY_CI") {
      paymentData.channels = "MTN_MONEY_CI";
    }

    console.log("Creating CinePay payment:", { transactionId, amount, paymentMethod });

    const response = await fetch(cinepayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const responseData = await response.json();
    
    if (!response.ok || responseData.code !== "201") {
      throw new Error(`CinePay error: ${responseData.message || 'Payment creation failed'}`);
    }

    console.log("CinePay payment created:", responseData.data?.transaction_id);

    return new Response(JSON.stringify({
      url: responseData.data?.payment_url,
      transactionId: responseData.data?.transaction_id,
      paymentToken: responseData.data?.payment_token
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating CinePay payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});