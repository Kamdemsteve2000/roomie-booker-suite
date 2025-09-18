import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = "XOF", paymentMethod, phoneNumber, bookingData } = await req.json();
    
    const cinepayApiKey = Deno.env.get("CINEPAY_API_KEY");
    if (!cinepayApiKey) {
      throw new Error("CinePay API key not configured");
    }

    // CinePay API endpoint
    const cinepayUrl = "https://api-checkout.cinetpay.com/v2/payment";
    
    // Generate unique transaction ID
    const transactionId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentData = {
      apikey: cinepayApiKey,
      site_id: Deno.env.get("CINEPAY_SITE_ID") || "1", // You'll need to add this
      transaction_id: transactionId,
      amount: parseInt(amount),
      currency: currency,
      description: `Hotel booking for ${bookingData?.roomName || 'Room'}`,
      return_url: `${req.headers.get("origin")}/payment-success`,
      notify_url: `${req.headers.get("origin")}/api/cinepay-webhook`,
      metadata: JSON.stringify(bookingData),
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