"use client"

import dynamic from 'next/dynamic'

// Dynamically import the client map display with SSR disabled
const ClientMapDisplay = dynamic(
  () => import('./ClientMapDisplay'),
  { 
    ssr: false,
    loading: () => <div className="h-[250px] w-full bg-gray-100 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500">Chargement de la carte...</div>
  }
)

interface MapDisplayProps {
  position?: { lat: number, lng: number };
  searchQuery?: string;
  fallbackQueries?: string[];
  title?: string;
}

export default function MapDisplay(props: MapDisplayProps) {
  return <ClientMapDisplay {...props} />
}
