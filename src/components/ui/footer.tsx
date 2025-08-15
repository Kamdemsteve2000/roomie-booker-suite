import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const footerLinks = {
    hotel: [
      { name: "About Us", href: "/about" },
      { name: "Rooms & Suites", href: "/rooms" },
      { name: "Amenities", href: "/#amenities" },
      { name: "Contact", href: "/contact" }
    ],
    services: [
      { name: "Reservations", href: "/booking" },
      { name: "Concierge", href: "/contact" },
      { name: "Restaurant", href: "/contact" },
      { name: "Spa & Wellness", href: "/contact" }
    ],
    policies: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cancellation Policy", href: "#" },
      { name: "Accessibility", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Hotel Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">Grand Luxe Hotel</h3>
            <p className="text-muted-foreground leading-relaxed">
              Experience unparalleled luxury and exceptional service in the heart of the city.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">123 Luxury Boulevard, City 12345</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@grandluxehotel.com</span>
              </div>
            </div>
          </div>

          {/* Hotel Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Hotel</h4>
            <ul className="space-y-2">
              {footerLinks.hotel.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Policies</h4>
            <ul className="space-y-2 mb-6">
              {footerLinks.policies.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div>
              <h5 className="font-semibold text-foreground mb-3">Follow Us</h5>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 Grand Luxe Hotel. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacy
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Terms
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}