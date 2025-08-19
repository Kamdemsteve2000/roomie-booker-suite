import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { MapPin } from 'lucide-react';

interface MapProps {
  className?: string;
}

const Map: React.FC<MapProps> = ({ className = "h-64" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [loading, setLoading] = useState(false);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;
    
    setLoading(true);

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.006, 40.7128], // NYC coordinates as example
        zoom: 15,
      });

      // Add a custom marker for the hotel location
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundColor = '#007bff';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = 'white';
      el.innerHTML = '🏨';

      new mapboxgl.Marker(el)
        .setLngLat([-74.006, 40.7128])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 12px; text-align: center;">
              <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #333;">Grand Luxe Hotel</h3>
              <p style="margin: 0; color: #666; font-size: 14px;">123 Luxury Boulevard</p>
              <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Downtown District, City</p>
            </div>`
          )
        )
        .addTo(map.current);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Wait for the map to load
      map.current.on('load', () => {
        setLoading(false);
        setShowTokenInput(false);
        toast({
          title: "Carte chargée avec succès",
          description: "La carte interactive est maintenant disponible",
        });
      });

      // Handle errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setLoading(false);
        toast({
          title: "Erreur de chargement",
          description: "Vérifiez votre token Mapbox et réessayez",
          variant: "destructive",
        });
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setLoading(false);
      toast({
        title: "Erreur de chargement",
        description: "Vérifiez votre token Mapbox et réessayez",
        variant: "destructive",
      });
    }
  };

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) {
      toast({
        title: "Token requis",
        description: "Veuillez entrer un token Mapbox valide",
        variant: "destructive",
      });
      return;
    }
    initializeMap(mapboxToken);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTokenSubmit();
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <div className={`${className} bg-muted/30 rounded-lg flex flex-col items-center justify-center p-6 space-y-4`}>
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Carte Interactive</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Entrez votre token public Mapbox pour afficher notre localisation
          </p>
          <p className="text-xs text-muted-foreground">
            Obtenez votre token sur{' '}
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline font-medium"
            >
              account.mapbox.com
            </a>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
          <Input
            type="text"
            placeholder="pk.eyJ1Ijoi..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={loading}
          />
          <Button 
            onClick={handleTokenSubmit} 
            size="sm"
            disabled={loading || !mapboxToken.trim()}
          >
            {loading ? "Chargement..." : "Charger"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default Map;