import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  bookingId: string;
  type: 'confirmation' | 'reminder' | 'cancellation';
  channel: 'email' | 'sms' | 'both';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { bookingId, type, channel }: NotificationRequest = await req.json();

    console.log("Processing notification:", { bookingId, type, channel });

    // Récupérer les détails de la réservation
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles!bookings_user_id_fkey(first_name, last_name, phone),
        rooms(name, type, price_per_night)
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error('Réservation non trouvée');
    }

    const guestName = `${booking.profiles.first_name} ${booking.profiles.last_name}`;
    const roomName = booking.rooms.name;
    const checkIn = new Date(booking.check_in_date).toLocaleDateString('fr-FR');
    const checkOut = new Date(booking.check_out_date).toLocaleDateString('fr-FR');
    const totalPrice = booking.total_price;

    // Envoyer notification email
    if (channel === 'email' || channel === 'both') {
      const emailSubject = type === 'confirmation' 
        ? 'Confirmation de votre réservation'
        : type === 'reminder'
        ? 'Rappel de votre réservation'
        : 'Annulation de votre réservation';

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d4af37;">${emailSubject}</h1>
          <p>Bonjour ${guestName},</p>
          
          ${type === 'confirmation' ? `
            <p>Votre réservation a été confirmée avec succès!</p>
          ` : type === 'reminder' ? `
            <p>Nous vous rappelons votre réservation à venir.</p>
          ` : `
            <p>Votre réservation a été annulée.</p>
          `}
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Détails de la réservation</h2>
            <p><strong>Chambre:</strong> ${roomName}</p>
            <p><strong>Arrivée:</strong> ${checkIn}</p>
            <p><strong>Départ:</strong> ${checkOut}</p>
            <p><strong>Nombre d'invités:</strong> ${booking.number_of_guests}</p>
            <p><strong>Prix total:</strong> ${totalPrice} FCFA</p>
          </div>
          
          ${type !== 'cancellation' ? `
            <p>Nous avons hâte de vous accueillir!</p>
          ` : ''}
          
          <p>Cordialement,<br>L'équipe de l'hôtel</p>
        </div>
      `;

      const { error: emailError } = await resend.emails.send({
        from: "Hôtel <onboarding@resend.dev>",
        to: [booking.guest_email],
        subject: emailSubject,
        html: emailHtml,
      });

      if (emailError) {
        console.error("Erreur d'envoi email:", emailError);
      } else {
        console.log("Email envoyé avec succès");
      }
    }

    // Envoyer notification SMS
    if ((channel === 'sms' || channel === 'both') && booking.profiles.phone) {
      const smsMessage = type === 'confirmation'
        ? `Réservation confirmée! ${roomName}, ${checkIn} - ${checkOut}. Total: ${totalPrice} FCFA. Merci!`
        : type === 'reminder'
        ? `Rappel: Votre réservation ${roomName} commence le ${checkIn}. À bientôt!`
        : `Votre réservation ${roomName} a été annulée.`;

      // Note: Pour envoyer des SMS au Cameroun, vous devez configurer un service SMS
      // Exemple: Africa's Talking, Twilio, ou un service local camerounais
      console.log("SMS à envoyer:", {
        phone: booking.profiles.phone,
        message: smsMessage
      });

      // TODO: Implémenter l'envoi SMS avec votre service préféré
      // const smsResponse = await fetch('https://api.sms-service.com/send', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${Deno.env.get('SMS_API_KEY')}` },
      //   body: JSON.stringify({
      //     to: booking.profiles.phone,
      //     message: smsMessage
      //   })
      // });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification envoyée" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Erreur dans send-booking-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
