import Navigation from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Map from "@/components/Map";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.phone'),
      details: ["+237 6 XX XX XX XX", "+237 6 YY YY YY YY"]
    },
    {
      icon: Mail,
      title: t('contact.email'),
      details: ["info@grandluxehotel.cm", "reservations@grandluxehotel.cm"]
    },
    {
      icon: MapPin,
      title: t('contact.address'),
      details: ["Yaoundé, Cameroun", "Quartier Central"]
    },
    {
      icon: Clock,
      title: t('contact.hours'),
      details: ["Réception 24/7", "Conciergerie: 6h - 23h"]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message
        });

      if (dbError) throw dbError;

      // Send email notification to admin
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the whole process if email fails
      }

      toast({
        title: t('contact.successTitle'),
        description: t('contact.successDesc'),
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: t('contact.errorTitle'),
        description: t('contact.errorDesc'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-elegant">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">{t('contact.title')}</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </div>
        </section>

        {/* Contact Info & Form Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">{t('contact.getInTouch')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {t('contact.description')}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">{info.title}</h3>
                          </div>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground text-sm">
                              {detail}
                            </p>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Interactive Map */}
                <Card>
                  <CardContent className="p-0">
                    <Map className="h-64" />
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">{t('contact.sendMessage')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                            {t('contact.firstName')} *
                          </label>
                          <Input 
                            id="firstName" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                            {t('contact.lastName')} *
                          </label>
                          <Input 
                            id="lastName" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          {t('contact.emailAddress')} *
                        </label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                          {t('contact.phoneNumber')}
                        </label>
                        <Input 
                          id="phone" 
                          name="phone"
                          type="tel" 
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                          {t('contact.subject')} *
                        </label>
                        <Input 
                          id="subject" 
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                          {t('contact.message')} *
                        </label>
                        <Textarea 
                          id="message" 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required 
                          rows={6}
                          placeholder={t('contact.messagePlaceholder')}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? t('contact.sending') : t('contact.send')}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">{t('contact.quickActions')}</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">{t('contact.makeReservation')}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{t('contact.makeReservationDesc')}</p>
                  <Button variant="outline" size="sm">{t('contact.bookNow')}</Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">{t('contact.specialOffers')}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{t('contact.specialOffersDesc')}</p>
                  <Button variant="outline" size="sm">{t('contact.viewOffers')}</Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">{t('contact.concierge')}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{t('contact.conciergeDesc')}</p>
                  <Button variant="outline" size="sm">{t('contact.learnMore')}</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}