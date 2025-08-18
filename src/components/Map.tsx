import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MapProps {
  className?: string;
}

const Map: React.FC<MapProps> = ({ className = "h-64" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.006, 40.7128], // New York coordinates as example
        zoom: 15,
      });

      // Add a marker for the hotel location
      new mapboxgl.Marker({
        color: '#007bff'
      })
        .setLngLat([-74.006, 40.7128])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            '<div class="p-2"><h3 class="font-semibold">Luxe Hotel</h3><p class="text-sm">123 Luxury Boulevard</p></div>'
          )
        )
        .addTo(map.current);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      setShowTokenInput(false);
      toast({
        title: "Map loaded successfully",
        description: "Interactive map is now available",
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error loading map",
        description: "Please check your Mapbox token and try again",
        variant: "destructive",
      });
    }
  };

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) {
      toast({
        title: "Token required",
        description: "Please enter a valid Mapbox token",
        variant: "destructive",
      });
      return;
    }
    initializeMap(mapboxToken);
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <div className={`${className} bg-muted/30 rounded-lg flex flex-col items-center justify-center p-6 space-y-4`}>
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-foreground">Interactive Map</h3>
          <p className="text-sm text-muted-foreground">
            Enter your Mapbox public token to view the interactive map
          </p>
          <p className="text-xs text-muted-foreground">
            Get your token at{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
          <Input
            type="text"
            placeholder="pk.eyJ1Ijoi..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleTokenSubmit} size="sm">
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default Map;