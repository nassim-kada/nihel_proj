"use client"

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

// Dynamically import the client map picker with SSR disabled
const ClientMapPicker = dynamic(
  () => import('./ClientMapPicker'),
  { 
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center rounded-xl border-2 border-gray-200">Chargement de la carte...</div>
  }
)

interface MapPickerProps {
  initialPosition?: { lat: number, lng: number };
  onLocationSelect: (lat: number, lng: number) => void;
  searchQuery?: string;
}

export default function MapPicker(props: MapPickerProps) {
  return <ClientMapPicker {...props} />
}
