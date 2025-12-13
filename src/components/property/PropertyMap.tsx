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
  selectedPropertyId?: string | null;
  hoveredPropertyId?: string | null;
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
      if (property && property.latitude && property.longitude) {
        return [property.latitude, property.longitude];
      }
    }

    if (properties.length === 0) {
      return [6.5244, 3.3792]; // Lagos default
    }

    const validProperties = properties.filter(p => p.latitude !== undefined && p.longitude !== undefined);
    if (validProperties.length === 0) {
      return [6.5244, 3.3792]; // Lagos default
    }

    const avgLat = validProperties.reduce((sum, p) => sum + (p.latitude || 0), 0) / validProperties.length;
    const avgLng = validProperties.reduce((sum, p) => sum + (p.longitude || 0), 0) / validProperties.length;
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

        {properties.filter(p => p.latitude && p.longitude).map((property) => {
          const isActive = hoveredPropertyId === property.id || selectedPropertyId === property.id;

          return (
            <Marker
              key={property.id}
              position={[property.latitude!, property.longitude!]}
              icon={createNumberedIcon(property.price, isActive)}
              eventHandlers={{
                click: () => onPropertyClick(property.id),
                mouseover: () => onPropertyHover?.(property.id),
                mouseout: () => onPropertyHover?.(null),
              }}
            >
              <Popup className="property-map-popup">
                <a 
                  href={`/property/${property.id}`}
                  className="block bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
                  style={{ minWidth: '280px' }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Verified Badge */}
                    {property.verified && (
                      <div className="absolute top-2 left-2">
                        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-primary flex items-center gap-1">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          Verified
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-3 bg-white">
                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{property.city}</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2">
                      {property.title}
                    </h3>
                    
                    {/* Rating and Price */}
                    <div className="flex items-center justify-between">
                      {property.rating ? (
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 fill-black text-black" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-900">
                            {property.rating.toFixed(1)}
                          </span>
                          {property.reviewCount > 0 && (
                            <span className="text-xs text-gray-500">
                              ({property.reviewCount})
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">New listing</div>
                      )}
                      
                      {/* Price */}
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-semibold text-gray-900">
                          ₦{property.price.toLocaleString('en-NG')}
                        </span>
                        <span className="text-xs text-gray-600">/mo</span>
                      </div>
                    </div>
                  </div>
                </a>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
