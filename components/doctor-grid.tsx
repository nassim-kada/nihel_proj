import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, MapPin, Clock, Users } from "lucide-react"
import type { IDoctorData } from "@/types/doctor" 
import type { ISpecialityDocument } from "@/types/speciality"

// Type for doctor with populated specialty
type DoctorWithSpecialty = Omit<IDoctorData, 'specialty'> & {
    specialty: ISpecialityDocument | string; // Can be either populated object or ID string
}

// Utility function to safely get specialty name
const getSpecialtyName = (specialty: ISpecialityDocument | string | any): string => {
    // If specialty is a populated object with name property
    if (specialty && typeof specialty === 'object' && 'name' in specialty) {
        return specialty.name;
    }
    // If it's just an ID string (fallback)
    if (typeof specialty === 'string') {
        return 'Spécialité non définie';
    }
    return 'Non spécifiée';
};

export default function DoctorGrid({ doctors }: { doctors: DoctorWithSpecialty[] }) {
  if (doctors.length === 0) {
    return (
      <div className="grid place-items-center min-h-96">
        <div className="text-center space-y-3 px-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
          </div>
          <p className="text-lg md:text-xl font-semibold text-gray-900">Aucun médecin trouvé</p>
          <p className="text-sm md:text-base text-gray-600">Essayez d'ajuster votre recherche ou vos filtres</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {doctors.map((doctor) => (
        <Card 
          key={doctor._id?.toString() || doctor.id} 
          className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all space-y-3 md:space-y-4 group"
        >
          {/* Header with Name and Rating */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5 md:space-y-1 flex-1 min-w-0">
              <h3 className="text-base md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {doctor.name}
              </h3>
              {/* Display specialty name using the utility function */}
              <p className="text-sm md:text-base text-blue-600 font-semibold truncate">
                {getSpecialtyName(doctor.specialty)}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-400 px-2 md:px-3 py-1 md:py-1.5 rounded-lg shadow-md flex-shrink-0">
              <Star className="w-3 h-3 md:w-4 md:h-4 fill-white text-white" />
              <span className="font-bold text-white text-sm md:text-base">{doctor.rating}</span>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
            <div className="flex items-center gap-2 md:gap-3 text-gray-700">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
              </div>
              <span className="font-medium truncate">{doctor.clinic}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-gray-700">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
              </div>
              <span className="font-medium">{doctor.experience} ans d'expérience</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-gray-700">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
              </div>
              <span className="font-medium">{doctor.patients} patients</span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1 md:pt-2 line-clamp-2 md:line-clamp-none">
            {doctor.bio}
          </p>

          {/* Footer with Fee and Action */}
          <div className="flex items-center justify-between pt-3 md:pt-4 border-t-2 border-blue-100 gap-3">
            <div className="space-y-0.5 md:space-y-1">
              <p className="text-xs text-gray-500 font-medium">Frais de Consultation</p>
              <p className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                {doctor.fee} 
              </p>
            </div>
            <Link href={`/booking/${doctor._id?.toString() || doctor.id}`}>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all px-4 py-4 md:px-6 md:py-5 font-semibold text-sm md:text-base"
              >
                Réserver Maintenant
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  )
}