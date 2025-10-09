import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.rooms': 'Rooms',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': "We're here to help make your stay exceptional. Reach out to us anytime.",
    'contact.getInTouch': 'Get in Touch',
    'contact.description': 'Our dedicated team is available 24/7 to assist you with reservations, special requests, or any questions about your stay.',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.address': 'Address',
    'contact.hours': 'Hours',
    'contact.sendMessage': 'Send us a Message',
    'contact.firstName': 'First Name',
    'contact.lastName': 'Last Name',
    'contact.emailAddress': 'Email Address',
    'contact.phoneNumber': 'Phone Number',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.messagePlaceholder': 'Tell us how we can help you...',
    'contact.sending': 'Sending...',
    'contact.send': 'Send Message',
    'contact.quickActions': 'Quick Actions',
    'contact.makeReservation': 'Make a Reservation',
    'contact.makeReservationDesc': 'Book your perfect room today',
    'contact.bookNow': 'Book Now',
    'contact.specialOffers': 'Special Offers',
    'contact.specialOffersDesc': 'Discover our current deals',
    'contact.viewOffers': 'View Offers',
    'contact.concierge': 'Concierge Services',
    'contact.conciergeDesc': 'Let us plan your experience',
    'contact.learnMore': 'Learn More',
    'contact.successTitle': 'Message sent successfully!',
    'contact.successDesc': 'We will reply to you as soon as possible.',
    'contact.errorTitle': 'Error sending message',
    'contact.errorDesc': 'Please try again later or contact us directly.',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.rooms': 'Chambres',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    'nav.profile': 'Profil',
    'nav.logout': 'Déconnexion',
    
    // Contact Page
    'contact.title': 'Contactez-nous',
    'contact.subtitle': 'Nous sommes là pour rendre votre séjour exceptionnel. Contactez-nous à tout moment.',
    'contact.getInTouch': 'Entrer en contact',
    'contact.description': 'Notre équipe dédiée est disponible 24h/24 et 7j/7 pour vous aider avec les réservations, les demandes spéciales ou toute question concernant votre séjour.',
    'contact.phone': 'Téléphone',
    'contact.email': 'Email',
    'contact.address': 'Adresse',
    'contact.hours': 'Horaires',
    'contact.sendMessage': 'Envoyez-nous un message',
    'contact.firstName': 'Prénom',
    'contact.lastName': 'Nom',
    'contact.emailAddress': 'Adresse Email',
    'contact.phoneNumber': 'Numéro de téléphone',
    'contact.subject': 'Sujet',
    'contact.message': 'Message',
    'contact.messagePlaceholder': 'Dites-nous comment nous pouvons vous aider...',
    'contact.sending': 'Envoi en cours...',
    'contact.send': 'Envoyer le message',
    'contact.quickActions': 'Actions rapides',
    'contact.makeReservation': 'Faire une réservation',
    'contact.makeReservationDesc': 'Réservez votre chambre parfaite aujourd\'hui',
    'contact.bookNow': 'Réserver maintenant',
    'contact.specialOffers': 'Offres spéciales',
    'contact.specialOffersDesc': 'Découvrez nos offres actuelles',
    'contact.viewOffers': 'Voir les offres',
    'contact.concierge': 'Services de conciergerie',
    'contact.conciergeDesc': 'Laissez-nous planifier votre expérience',
    'contact.learnMore': 'En savoir plus',
    'contact.successTitle': 'Message envoyé avec succès!',
    'contact.successDesc': 'Nous vous répondrons dans les plus brefs délais.',
    'contact.errorTitle': 'Erreur lors de l\'envoi',
    'contact.errorDesc': 'Veuillez réessayer plus tard ou nous contacter directement.',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
