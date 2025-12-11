'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Property } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Only initialize Leaflet icons on the client side
if (typeof window !== 'undefined') {
  const DefaultIcon = L.icon({
    iconUrl: icon.src,
    iconRetinaUrl: iconRetina.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  L.Marker.prototype.options.icon = DefaultIcon;
}

// Create custom marker icons
const createNumberedIcon = (price: number, isActive: boolean = false) => {
  const priceText = price >= 1000000
    ? `₦${(price / 1000000).toFixed(1)}M`
    : `₦${(price / 1000).toFixed(0)}K`;

  return L.divIcon({
    html: `
      <div style="
        background: ${isActive ? '#0B3D2C' : 'white'};
        color: ${isActive ? 'white' : '#0B3D2C'};
        border: 2px solid ${isActive ? '#B87333' : '#0B3D2C'};
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 13px;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transform: ${isActive ? 'scale(1.1)' : 'scale(1)'};
        transition: all 0.2s ease;
        cursor: pointer;
      ">
        ${priceText}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [60, 30],
    iconAnchor: [30, 15],
  });
};

interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
}

function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 0.5
    });
  }, [center, zoom, map]);

  return null;
}

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string;
  hoveredPropertyId?: string;
  onPropertyClick: (propertyId: string) => void;
  onPropertyHover?: (propertyId: string | null) => void;
}

export default function PropertyMap({
  properties,
  selectedPropertyId,
  hoveredPropertyId,
  onPropertyClick,
  onPropertyHover,
}: PropertyMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate center based on all properties
  const center: [number, number] = useMemo(() => {
    if (selectedPropertyId) {
      const property = properties.find(p => p.id === selectedPropertyId);
      if (property) {
        return [property.latitude, property.longitude];
      }
    }

    if (properties.length === 0) {
      return [6.5244, 3.3792]; // Lagos default
    }

    const avgLat = properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length;
    const avgLng = properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length;
    return [avgLat, avgLng];
  }, [properties, selectedPropertyId]);

  const zoom = useMemo(() => {
    return selectedPropertyId ? 14 : 11;
  }, [selectedPropertyId]);

  if (!isMounted) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={center} zoom={zoom} />

        {properties.map((property) => {
          const isActive = hoveredPropertyId === property.id || selectedPropertyId === property.id;

          return (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createNumberedIcon(property.price, isActive)}
              eventHandlers={{
                click: () => onPropertyClick(property.id),
                mouseover: () => onPropertyHover?.(property.id),
                mouseout: () => onPropertyHover?.(null),
              }}
            >
              <Popup>
                <div className="p-2">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-48 h-32 object-cover rounded mb-2"
                  />
                  <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
                  <p className="text-xs text-gray-600 mb-1">{property.address}</p>
                  <p className="font-bold" style={{ color: '#0B3D2C' }}>
                    ₦{property.price.toLocaleString('en-NG')}/mo
                  </p>
                  <button
                    onClick={() => onPropertyClick(property.id)}
                    className="mt-2 w-full text-xs px-3 py-1 rounded text-white hover:opacity-90"
                    style={{ backgroundColor: '#0B3D2C' }}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
