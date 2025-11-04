"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, X, Loader2 } from "lucide-react"
import DoctorGrid from "@/components/doctor-grid"
import { IDoctorData } from "@/types/doctor" 

export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState<IDoctorData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/doctors') 
        
        if (!response.ok) {
          throw new Error("Échec de la récupération des données via l'API.")
        }

        const data: IDoctorData[] = await response.json() 
        setDoctors(data)

      } catch (err: any) {
        console.error("Erreur de connexion DB:", err)
        setError("Impossible de charger les docteurs. Veuillez vérifier la connexion à la base de données.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const filteredDoctors = useMemo(() => {
    if (!doctors.length) return []

    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.clinic.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty
      
      return matchesSearch && matchesSpecialty
    })
  }, [doctors, searchTerm, selectedSpecialty])

  const specialties = useMemo(() => {
    return Array.from(new Set(doctors.map((d) => d.specialty))).sort()
  }, [doctors])
  
  const activeFiltersCount = selectedSpecialty ? 1 : 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-6 md:py-12 px-3 md:px-4">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
            Trouver Votre Médecin
          </h1>
          <p className="text-sm md:text-lg text-gray-600">Parcourez notre réseau de professionnels de la santé qualifiés</p>
        </div>

        <Card className="p-3 md:p-6 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, spécialité ou clinique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 md:pl-12 py-4 md:py-6 text-sm md:text-base border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
            />
          </div>
        </Card>

        <div className="lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white py-3 rounded-lg font-semibold shadow-lg"
          >
            <Filter className="w-4 h-4" />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <div className={`lg:col-span-1 space-y-4 md:space-y-6 ${
            showFilters 
              ? 'fixed inset-0 z-50 bg-white overflow-y-auto p-4 lg:relative lg:inset-auto lg:z-auto lg:bg-transparent lg:p-0' 
              : 'hidden lg:block'
          }`}>
            <div className="lg:hidden flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <Card className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Filter className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <h3 className="font-bold text-base md:text-lg text-gray-900">Spécialité</h3>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <button
                  onClick={() => {
                    setSelectedSpecialty(null)
                    setShowFilters(false)
                  }}
                  className={`w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all ${
                    selectedSpecialty === null
                      ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md"
                      : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  Toutes les Spécialités
                </button>
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => {
                      setSelectedSpecialty(specialty)
                      setShowFilters(false)
                    }}
                    className={`w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-xs md:text-sm font-medium ${
                      selectedSpecialty === specialty
                        ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md"
                        : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </Card>

            <div className="lg:hidden">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white py-3 rounded-lg font-semibold shadow-lg"
              >
                Appliquer les Filtres
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            {isLoading && (
              <div className="p-8 md:p-12 text-center">
                 <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                 <p className="text-lg text-gray-600">Chargement des docteurs...</p>
              </div>
            )}

            {error && (
              <Card className="p-8 md:p-12 text-center bg-red-50/80 backdrop-blur-sm border-2 border-red-200">
                <h3 className="text-lg md:text-xl font-semibold text-red-700">Erreur de Connexion</h3>
                <p className="text-sm md:text-base text-gray-600">{error}</p>
              </Card>
            )}

            {!isLoading && !error && filteredDoctors.length > 0 && (
              <DoctorGrid doctors={filteredDoctors} />
            )}

            {!isLoading && !error && filteredDoctors.length === 0 && (
              <Card className="p-8 md:p-12 text-center bg-white/80 backdrop-blur-sm border-2 border-blue-100">
                <div className="space-y-3 md:space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">Aucun médecin trouvé</h3>
                  <p className="text-sm md:text-base text-gray-600">Essayez d'ajuster votre recherche ou vos filtres</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}