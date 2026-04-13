"use client"

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default icon path issues with Webpack/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface ClientMapPickerProps {
  initialPosition?: { lat: number, lng: number }
  onLocationSelect: (lat: number, lng: number) => void
  searchQuery?: string;
}

function MapUpdater({ searchQuery, onAutoLocate, hasPosition }: { searchQuery?: string, onAutoLocate: (lat: number, lng: number) => void, hasPosition: boolean }) {
  const map = useMap()
  const initialQuery = React.useRef(searchQuery)
  
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) return;
    
    // Ignore the very first geocode if we already have a position, to prevent panning away from saved pin
    if (hasPosition && searchQuery === initialQuery.current) return;

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery + ', Algeria')}&format=json&limit=1`)
        const data = await res.json()
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat)
          const lon = parseFloat(data[0].lon)
          map.flyTo([lat, lon], 12, { duration: 1.5 })
          if (!hasPosition) {
             onAutoLocate(lat, lon)
          }
        }
      } catch (err) {
        console.error("Geocoding failed", err)
      }
    }, 1000); // 1s debounce to avoid spamming the API

    return () => clearTimeout(timeoutId)
  }, [searchQuery, map, hasPosition, onAutoLocate])

  return null
}

function LocationMarker({ position, onLocationSelect }: { position: L.LatLng | null, onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return position === null ? null : (
    <Marker position={position}></Marker>
  )
}

export default function ClientMapPicker({ initialPosition, onLocationSelect, searchQuery }: ClientMapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialPosition ? new L.LatLng(initialPosition.lat, initialPosition.lng) : null
  )

  const handleLocationSelect = (lat: number, lng: number) => {
    setPosition(new L.LatLng(lat, lng))
    onLocationSelect(lat, lng)
  }

  // Default to Algiers if no initial position
  const defaultCenter = initialPosition || { lat: 36.737, lng: 3.086 }

  // Need this to prevent map from rendering wrongly on first load in some Next.js scenarios
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center rounded-xl border-2 border-gray-200">Chargement de la carte...</div>

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border-2 border-blue-200 shadow-sm relative z-0">
      <MapContainer 
        center={[defaultCenter.lat, defaultCenter.lng]} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onLocationSelect={handleLocationSelect} />
        <MapUpdater searchQuery={searchQuery} onAutoLocate={handleLocationSelect} hasPosition={position !== null} />
      </MapContainer>
    </div>
  )
}
