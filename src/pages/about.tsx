import Navigation from "@/components/ui/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, Clock, Award } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: Star, label: "Years of Excellence", value: "25+" },
    { icon: Users, label: "Happy Guests", value: "50,000+" },
    { icon: Clock, label: "24/7 Service", value: "Always" },
    { icon: Award, label: "Awards Won", value: "15+" }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      position: "General Manager",
      description: "With over 15 years in luxury hospitality, Sarah ensures every guest experience exceeds expectations."
    },
    {
      name: "Michael Chen",
      position: "Head Chef",
      description: "Michelin-trained chef bringing innovative culinary experiences to our restaurant."
    },
    {
      name: "Emily Rodriguez",
      position: "Guest Relations Manager",
      description: "Dedicated to creating personalized experiences that make every stay memorable."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-elegant">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">About Grand Luxe Hotel</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              A legacy of exceptional hospitality, where timeless elegance meets modern luxury
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center text-foreground mb-12">Our Story</h2>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Founded in 1998, Grand Luxe Hotel has been a beacon of luxury and sophistication 
                    in the heart of the city. What started as a vision to create an extraordinary 
                    hospitality experience has evolved into one of the most prestigious hotels in the region.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Our commitment to excellence is reflected in every detail, from our meticulously 
                    designed rooms to our world-class amenities. We believe that luxury is not just 
                    about opulent surroundings, but about creating moments that matter.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Today, we continue to set new standards in hospitality, combining traditional 
                    elegance with modern innovation to provide our guests with unforgettable experiences.
                  </p>
                </div>
                <div className="relative">
                  <img
                    src="/src/assets/hero-image.jpg"
                    alt="Hotel history"
                    className="w-full h-96 object-cover rounded-lg shadow-elegant"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-foreground mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 bg-gradient-elegant rounded-full mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.position}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-foreground mb-12">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Excellence</h3>
                  <p className="text-muted-foreground">
                    We strive for perfection in every aspect of our service, 
                    ensuring each guest receives the highest quality experience.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Innovation</h3>
                  <p className="text-muted-foreground">
                    We continuously evolve and adapt, incorporating the latest 
                    technologies and trends to enhance our guests' stay.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Hospitality</h3>
                  <p className="text-muted-foreground">
                    At our core, we are passionate about creating warm, 
                    welcoming experiences that make every guest feel at home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}