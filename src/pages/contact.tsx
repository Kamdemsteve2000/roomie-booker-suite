import Navigation from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 123-4568"]
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@grandluxehotel.com", "reservations@grandluxehotel.com"]
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["123 Luxury Boulevard", "Downtown District, City 12345"]
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["24/7 Front Desk", "Concierge: 6 AM - 11 PM"]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to Supabase for form submission
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-elegant">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Contact Us</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              We're here to help make your stay exceptional. Reach out to us anytime.
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
                  <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    Our dedicated team is available 24/7 to assist you with reservations, 
                    special requests, or any questions about your stay.
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

                {/* Map Placeholder */}
                <Card>
                  <CardContent className="p-0">
                    <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p className="text-muted-foreground">Interactive Map</p>
                        <p className="text-sm text-muted-foreground">123 Luxury Boulevard</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                            First Name *
                          </label>
                          <Input id="firstName" required />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                            Last Name *
                          </label>
                          <Input id="lastName" required />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email Address *
                        </label>
                        <Input id="email" type="email" required />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        <Input id="phone" type="tel" />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                          Subject *
                        </label>
                        <Input id="subject" required />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                          Message *
                        </label>
                        <Textarea 
                          id="message" 
                          required 
                          rows={6}
                          placeholder="Tell us how we can help you..."
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        Send Message
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
            <h2 className="text-3xl font-bold text-foreground mb-8">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Make a Reservation</h3>
                  <p className="text-muted-foreground text-sm mb-4">Book your perfect room today</p>
                  <Button variant="outline" size="sm">Book Now</Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Special Offers</h3>
                  <p className="text-muted-foreground text-sm mb-4">Discover our current deals</p>
                  <Button variant="outline" size="sm">View Offers</Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Concierge Services</h3>
                  <p className="text-muted-foreground text-sm mb-4">Let us plan your experience</p>
                  <Button variant="outline" size="sm">Learn More</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}