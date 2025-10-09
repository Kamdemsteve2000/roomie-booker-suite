import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  className?: string;
}

const Map: React.FC<MapProps> = ({ className = "h-64" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Use a public Mapbox token - You should add yours in Supabase Secrets
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [11.5564, 3.8480], // Yaoundé, Cameroun coordinates
      zoom: 15,
    });

    // Add a custom marker for the hotel location
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.backgroundColor = 'hsl(var(--primary))';
    el.style.borderRadius = '50%';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.fontSize = '20px';
    el.innerHTML = '🏨';

    new mapboxgl.Marker(el)
      .setLngLat([11.5564, 3.8480])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="padding: 12px; text-align: center;">
            <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #333;">Grand Luxe Hotel</h3>
            <p style="margin: 0; color: #666; font-size: 14px;">Yaoundé, Cameroun</p>
            <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Quartier Central</p>
          </div>`
        )
      )
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className={`${className} relative rounded-lg overflow-hidden`}>
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;