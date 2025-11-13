"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, X, Loader2 } from "lucide-react"
import DoctorGrid from "@/components/doctor-grid"
import { IDoctorData } from "@/types/doctor"
// Assuming DoctorWithSpecialty might be defined here, but we can infer it
// import { DoctorWithSpecialty } from "@/types/doctor" 
import { ISpecialityDocument } from "@/types/speciality"

/**
 * Helper function to safely get a specialty ID from a reference.
 * The reference can be a string, a populated document (object with _id),
 * or an unpopulated ObjectId.
 */
const getSpecialtyId = (specialty: any): string | null => {
  if (!specialty) return null;

  // Case 1: It's a populated document (ISpecialityDocument)
  if (typeof specialty === 'object' && specialty !== null && '_id' in specialty) {
    if (specialty._id === undefined || specialty._id === null) return null;
    return String(specialty._id);
  }

  // Case 2: It's already a string ID
  if (typeof specialty === 'string') {
    return specialty;
  }
  
  // Case 3: It's an ObjectId or other object that can be stringified
  if (typeof specialty === 'object' && specialty !== null && typeof specialty.toString === 'function') {
    const idString = specialty.toString();
    // Avoid returning "[object Object]"
    if (idString !== '[object Object]' && !idString.includes(' ')) {
      return idString;
    }
  }

  // Fallback if it's an unrecognized format
  return null;
};

/**
 * Helper function to safely get a specialty name from a reference.
 * The name only exists on a populated document.
 */
const getSpecialtyName = (specialty: any): string => {
  // Only a populated document (ISpecialityDocument) will have a 'name'
  if (specialty && typeof specialty === 'object' && 'name' in specialty && typeof specialty.name === 'string') {
    return specialty.name.toLowerCase();
  }
  
  // All other cases (string ID, ObjectId, null, undefined) mean we don't have a name.
  return '';
};


export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState<IDoctorData[]>([])
  const [availableSpecialities, setAvailableSpecialities] = useState<ISpecialityDocument[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSpecialitiesLoading, setIsSpecialitiesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Fetch doctors with populated specialty
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/doctors')
        if (!response.ok) throw new Error("Échec de la récupération des docteurs.")
        const data: IDoctorData[] = await response.json()
        setDoctors(data)
      } catch (err: any) {
        setError("Impossible de charger les docteurs.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  // Fetch specialities for filter options
  useEffect(() => {
    const fetchSpecialities = async () => {
      setIsSpecialitiesLoading(true)
      try {
        const response = await fetch('/api/specialities')
        if (!response.ok) throw new Error("Échec de la récupération des spécialités.")
        const data: ISpecialityDocument[] = await response.json()
        setAvailableSpecialities(data)
      } catch (err: any) {
        setError(prev => prev || "Impossible de charger les options de filtre.")
      } finally {
        setIsSpecialitiesLoading(false)
      }
    }
    fetchSpecialities()
  }, [])

  // Filtering logic
  const filteredDoctors = useMemo(() => {
    if (!doctors.length) return []

    return doctors.filter((doctor) => {
      // Search logic - search by name, specialty name, or clinic
      const specialtyName = getSpecialtyName(doctor.specialty); // This line is now safe
      
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialtyName.includes(searchTerm.toLowerCase()) ||
        (doctor.clinic?.toLowerCase() || '').includes(searchTerm.toLowerCase())

      // Filter by specialty ID
      const doctorSpecialtyId = getSpecialtyId(doctor.specialty); // This line is also safe
      const matchesSpecialty = !selectedSpecialtyId || doctorSpecialtyId === selectedSpecialtyId;
      
      return matchesSearch && matchesSpecialty
    })
  }, [doctors, searchTerm, selectedSpecialtyId])
  
  // Transformation logic to prepare data for DoctorGrid
  const gridDoctors = useMemo(() => {
    return filteredDoctors
      .map(doctor => {
        const specialty = doctor.specialty;
        
        // Case 1: It's a populated ISpecialityDocument. This is valid for DoctorGrid.
        if (specialty && typeof specialty === 'object' && '_id' in specialty) {
          return doctor; // Return as is
        }
        
        // Case 2: It's not populated (ObjectId, string, null).
        // Convert it to a string ID.
        const specialtyId = getSpecialtyId(specialty); // This returns `string | null`
        
        return {
          ...doctor,
          specialty: specialtyId // `specialty` is now `string | null`
        };
      })
      // Now, filter out any doctor where specialty is null, because
      // the DoctorGrid type `string | ISpecialityDocument` does not allow null.
      .filter(doctor => doctor.specialty !== null);
      
    // The resulting type is now compatible with DoctorWithSpecialty[]
  }, [filteredDoctors]);


  const activeFiltersCount = selectedSpecialtyId ? 1 : 0
  const isOverallLoading = isLoading || isSpecialitiesLoading;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-6 md:py-12 px-3 md:px-4">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
        {/* Header */}
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
            Trouver Votre Médecin
          </h1>
          <p className="text-sm md:text-lg text-gray-600">Parcourez notre réseau de professionnels de la santé qualifiés</p>
        </div>

        {/* Search Bar */}
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

        {/* Mobile Filter Toggle */}
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
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 space-y-4 md:space-y-6 ${
            showFilters
              ? 'fixed inset-0 z-50 bg-white overflow-y-auto p-4 lg:relative lg:inset-auto lg:z-auto lg:bg-transparent lg:p-0'
              : 'hidden lg:block'
          }`}>
            {/* Mobile Filter Header */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Specialty Filter */}
            <Card className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Filter className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <h3 className="font-bold text-base md:text-lg text-gray-900">Spécialité</h3>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <button
                  onClick={() => {
                    setSelectedSpecialtyId(null)
                    setShowFilters(false)
                  }}
                  className={`w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all ${
                    selectedSpecialtyId === null
                      ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md"
                      : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  Toutes les Spécialités
                </button>
                
                {isSpecialitiesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                ) : (
                  availableSpecialities.map((speciality) => {
                    // Handle cases where speciality or _id might be missing
                    // *** FIX: Corrected typo 'specialdity' to 'speciality' ***
                    if (!speciality || !speciality._id) return null;
                    
                    const id = speciality._id.toString();
                    
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          setSelectedSpecialtyId(id)
                          setShowFilters(false)
                        }}
                        className={`w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-xs md:text-sm font-medium ${
                          selectedSpecialtyId === id
                            ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md"
                            : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                        }`}
                      >
                        {speciality.name}
                      </button>
                    )
                  })
                )}
              </div>
            </Card>

            {/* Mobile Apply Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white py-3 rounded-lg font-semibold shadow-lg"
              >
                Appliquer les Filtres
              </button>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="lg:col-span-3">
            {isOverallLoading && (
              <div className="p-8 md:p-12 text-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-lg text-gray-600">Chargement des données...</p>
              </div>
            )}

            {error && !isOverallLoading && (
              <Card className="p-8 md:p-12 text-center bg-red-50/80 backdrop-blur-sm border-2 border-red-200">
                <h3 className="text-lg md:text-xl font-semibold text-red-700">Erreur de Connexion</h3>
                <p className="text-sm md:text-base text-gray-600">{error}</p>
              </Card>
            )}

            {/* *** FIX: Use `gridDoctors` which is now correctly typed for DoctorGrid *** */}
            {!isOverallLoading && !error && gridDoctors.length > 0 && (
              <DoctorGrid doctors={gridDoctors as any} /> 
            )}

            {/* *** FIX: Check `gridDoctors.length` for consistency *** */}
            {!isOverallLoading && !error && gridDoctors.length === 0 && (
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