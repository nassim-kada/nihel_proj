"use client"

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default icon path issues with Webpack/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface ClientMapDisplayProps {
  position?: { lat: number, lng: number }
  searchQuery?: string
  fallbackQueries?: string[]
  title?: string
}

function MapRelocator({ center }: { center: { lat: number, lng: number } }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([center.lat, center.lng], 13, { animate: false })
  }, [center, map])
  return null
}

export default function ClientMapDisplay({ position, searchQuery, fallbackQueries, title }: ClientMapDisplayProps) {
  const [mounted, setMounted] = useState(false)
  const defaultCenter = position || { lat: 36.737, lng: 3.086 }
  const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number} | null>(position || null)
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number}>(defaultCenter)

  useEffect(() => {
    setMounted(true)
    if (!position && (searchQuery || (fallbackQueries && fallbackQueries.length > 0))) {
      const timeoutId = setTimeout(async () => {
        const queriesToTry = [searchQuery, ...(fallbackQueries || [])].filter(q => q && q.length > 2)
        
        for (const query of queriesToTry) {
           try {
             const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Algeria')}&format=json&limit=1`)
             const data = await res.json()
             if (data && data.length > 0) {
               const lat = parseFloat(data[0].lat)
               const lon = parseFloat(data[0].lon)
               setCurrentPosition({ lat, lng: lon })
               setMapCenter({ lat, lng: lon })
               break; // Success! Stop trying fallbacks.
             }
           } catch (err) {
             console.error("Geocoding try failed for query: " + query, err)
           }
        }
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [position, searchQuery, fallbackQueries])

  if (!mounted) return <div className="h-[250px] w-full bg-gray-100 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500">Chargement de la carte...</div>

  return (
    <div className="h-[250px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer 
        center={[mapCenter.lat, mapCenter.lng]} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {currentPosition && (
          <Marker position={[currentPosition.lat, currentPosition.lng]} title={title || "Position"} />
        )}
        <MapRelocator center={mapCenter} />
      </MapContainer>
    </div>
  )
}
