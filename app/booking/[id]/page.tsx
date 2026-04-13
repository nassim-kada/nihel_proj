"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" 
import Link from "next/link"
import BookingCalendar from "@/components/booking-calendar"
import { ChevronLeft, Star, MapPin, Phone, User, Calendar as CalendarIcon, Clock, CheckCircle, FileText, Loader2, Upload, X, Lock, AlertTriangle, ShieldAlert } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { IDoctorData } from "@/types/doctor"
import { useAuth } from "@/contexts/AuthContext"
import MapDisplay from "@/components/map/MapDisplay"

// Column auth gate for unauthenticated users
function AuthGateColumn() {
  return (
    <Card className="p-8 md:p-12 text-center bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg h-full flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
        <Lock className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Connexion requise</h3>
      <p className="text-sm md:text-base text-gray-600 mb-8 max-w-md mx-auto">
        Vous devez avoir un compte patient pour voir les créneaux et prendre un rendez-vous. La réservation en tant qu'invité n'est pas autorisée.
      </p>
      <div className="space-y-3 w-full max-w-sm mx-auto">
        <Link
          href="/login"
          className="block w-full py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-sky-600 transition-all shadow-md"
        >
          Se connecter
        </Link>
        <Link
          href="/signup/patient"
          className="block w-full py-3 border-2 border-blue-200 text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-all"
        >
          Créer un compte patient
        </Link>
      </div>
    </Card>
  );
}

// Column doctor gate (doctors cannot book)
function DoctorGateColumn() {
  return (
    <Card className="p-8 md:p-12 text-center bg-white/80 backdrop-blur-sm border-2 border-red-100 shadow-lg h-full flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
        <AlertTriangle className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-red-700 mb-2">Accès Refusé</h3>
      <p className="text-sm md:text-base text-gray-600 mb-6 max-w-md mx-auto">
        Seuls les patients peuvent prendre un rendez-vous. Votre rôle actuel est "Médecin".
      </p>
      <Link href="/find-doctors">
        <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-5 font-semibold shadow-lg">
          Retour aux Médecins
        </Button>
      </Link>
    </Card>
  );
}

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const doctorId = params.id as string
  const { user, loading: authLoading } = useAuth()

  const [doctor, setDoctor] = useState<IDoctorData | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [patientDescription, setPatientDescription] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)

  // Fetch doctor data
  useEffect(() => {
    if (!doctorId) {
        setError("ID du docteur manquant.")
        setIsLoading(false)
        return
    }

    const fetchData = async () => {
      try {
        // Fetch doctor
        const doctorResponse = await fetch(`/api/doctors/${doctorId}`)
        if (!doctorResponse.ok) {
          if (doctorResponse.status === 404) {
             throw new Error(`Docteur non trouvé. (Erreur HTTP: ${doctorResponse.status})`)
          }
          throw new Error(`Erreur HTTP: ${doctorResponse.status}`)
        }
        const foundDoctor: IDoctorData = await doctorResponse.json()
        setDoctor(foundDoctor)

        // Fetch all bookings for this doctor only if logged in
        if (user) {
          const bookingsResponse = await fetch('/api/bookings')
          if (bookingsResponse.ok) {
            const allBookings = await bookingsResponse.json()
            // Filter bookings for this doctor
            const doctorBookings = allBookings.filter((booking: any) => {
              const bookingDoctorId = booking.doctorId?._id || booking.doctorId
              return bookingDoctorId?.toString() === doctorId
            })
            setBookings(doctorBookings)
          }
        }

      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message || "Échec de la récupération des données.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [doctorId, user])

  // Calculate available slots by filtering out booked times
  const availableSlots = useMemo(() => {
    if (!doctor || !doctor.availableSlots) return []
    
    return doctor.availableSlots.map(slot => {
      // Get all booked times for this date
      const bookedTimes = bookings
        .filter(booking => 
          booking.appointmentDate === slot.date && 
          booking.status !== 'cancelled'
        )
        .map(booking => booking.appointmentTime)
      
      // Filter out booked times from available times
      const availableTimes = slot.times.filter(time => !bookedTimes.includes(time))
      
      return {
        ...slot,
        times: availableTimes
      }
    }).filter(slot => slot.times.length > 0)
  }, [doctor, bookings])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (file.size > maxSize) {
        alert("Le fichier est trop volumineux. La taille maximale est de 5MB.")
        return
      }
      
      setUploadedFile(file)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Échec du téléchargement du fichier')
    }

    const data = await response.json()
    return data.result.secure_url // Return the secure URL from Cloudinary
  }

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !doctor) {
        alert("Veuillez remplir tous les champs requis et sélectionner une date/heure.");
        return;
    }

    setIsUploading(true)

    try {
        let fileLink = ''
        
        // Upload file to Cloudinary if exists
        if (uploadedFile) {
          try {
            fileLink = await uploadFileToCloudinary(uploadedFile)
          } catch (uploadError) {
            alert("Erreur lors du téléchargement du fichier. La réservation continuera sans le document.")
            console.error("File upload error:", uploadError)
          }
        }

        const bookingData = {
            doctorId: doctor._id, 
            patientId: user?.id || undefined, /* Associate exactly with user id */
            patientName: user?.name || "Patient",
            patientPhone: "Via compte patient",
            appointmentDate: selectedDate,
            appointmentTime: selectedTime,
            patientDescription: patientDescription,
            fee: doctor.fee,
            fileLink: fileLink, // Add the file link to booking data
            isUrgent: isUrgent,
            status: 'pending',
        }
        
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData),
        })

        if (response.ok) {
            const newBooking = await response.json()
            // Add the new booking to local state to update availability immediately
            setBookings(prev => [...prev, newBooking.data])
            
            alert(`Réservation confirmée pour Dr. ${doctor.name} le ${selectedDate} à ${selectedTime} !`);
            router.push('/patient-dashboard');
        } else {
            const errorData = await response.json()
            alert(`Échec de la réservation. Veuillez réessayer. Détail: ${errorData.error || 'Erreur inconnue'}`)
        }
    } catch (e) {
        console.error("Booking error:", e)
        alert("Erreur réseau. Vérifiez votre connexion.");
    } finally {
        setIsUploading(false)
    }
  }

  if (isLoading || authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-2" />
        <span className="text-lg font-semibold text-gray-700">Chargement...</span>
      </main>
    )
  }

  if (error || !doctor) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-8 md:py-12 px-3 md:px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 md:p-12 text-center bg-white/80 backdrop-blur-sm border-2 border-red-100 shadow-lg">
            <h3 className="text-xl md:text-2xl font-bold text-red-700 mb-2">Erreur de Données</h3>
            <p className="text-sm md:text-base text-gray-600 mb-6">{error || "Le docteur n'a pas pu être chargé."}</p>
            <Link href="/find-doctors">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-5 font-semibold shadow-lg">
                Retour aux Médecins
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    )
  }
  
  const getSpecialtyName = (specialty: IDoctorData['specialty']) => {
    if (typeof specialty === 'object' && specialty !== null && 'name' in specialty) {
      return specialty.name;
    }
    return 'Spécialité inconnue';
  };

  const currentDateSlot = availableSlots.find((slot) => slot.date === selectedDate)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-6 md:py-12 px-3 md:px-4">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        <Link 
          href="/find-doctors" 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 w-fit font-semibold transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm md:text-base">Retour aux Médecins</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* LEFT COLUMN: Doctor Info (Always Visible) */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4 md:p-6 lg:sticky lg:top-24 space-y-4 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{doctor.name}</h2>
                <p className="text-blue-600 font-semibold text-sm md:text-base">{getSpecialtyName(doctor.specialty)}</p>
              </div>

              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-white text-white" />
                  </div>
                  <span className="text-gray-700 font-semibold">Note: {doctor.rating || '5.0'}/5</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-600 leading-tight">{doctor.clinic || doctor.location || 'Localisation non spécifiée'}</span>
                </div>
              </div>

              {/* Map displaying exactly where the doctor is */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-gray-500 mb-2">Emplacement sur la carte</p>
                <MapDisplay 
                  position={doctor.mapLocation || undefined} 
                  searchQuery={doctor.clinic || doctor.location}
                  fallbackQueries={[doctor.wilaya, doctor.commune, 'Alger'].filter(Boolean) as string[]}
                  title={doctor.name} 
                />
              </div>

              <div className="pt-4 border-t-2 border-blue-100">
                <p className="text-xs text-gray-500 font-medium mb-1">Frais de Consultation</p>
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                  {doctor.fee || 'Non spécifié'} DA
                </p>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Booking Flow or Auth Gate */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {!user ? (
               <AuthGateColumn />
            ) : user.role === 'doctor' ? (
               <DoctorGateColumn />
            ) : availableSlots.length === 0 ? (
               <Card className="p-8 md:p-12 text-center bg-white/80 backdrop-blur-sm border-2 border-yellow-100 shadow-lg h-full flex flex-col items-center justify-center">
                 <h3 className="text-xl md:text-2xl font-bold text-yellow-700 mb-2">Aucune Disponibilité</h3>
                 <p className="text-sm md:text-base text-gray-600 mb-4 max-w-md mx-auto">
                   Dr. {doctor.name} n'a actuellement aucun créneau disponible. Veuillez vérifier plus tard ou choisir un autre médecin.
                 </p>
               </Card>
            ) : (
               <>
                 {/* Calendar Section */}
                 <Card className="p-4 md:p-6 space-y-3 md:space-y-4 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
                       <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                     </div>
                     <h3 className="text-base md:text-lg font-bold text-gray-900">Sélectionner la Date</h3>
                   </div>
                   <BookingCalendar
                     slots={availableSlots}
                     selectedDate={selectedDate}
                     onSelectDate={setSelectedDate}
                   />
                 </Card>

                 {/* Time Selection */}
                 {selectedDate && currentDateSlot && (
                   <Card className="p-4 md:p-6 space-y-3 md:space-y-4 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                     <div className="flex items-center gap-2">
                       <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
                         <Clock className="w-4 h-4 md:w-5 md:h-5 text-white" />
                       </div>
                       <h3 className="text-base md:text-lg font-bold text-gray-900">Sélectionner l'Heure</h3>
                     </div>
                     {currentDateSlot.times.length > 0 ? (
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                         {currentDateSlot.times.map((time) => (
                           <button
                             key={time}
                             onClick={() => setSelectedTime(time)}
                             className={`p-2.5 md:p-3 rounded-lg border-2 font-semibold text-sm md:text-base transition-all ${
                               selectedTime === time
                                 ? "border-blue-500 bg-gradient-to-r from-blue-50 to-sky-50 text-blue-600 shadow-md scale-105"
                                 : "border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 hover:scale-105"
                             }`}
                           >
                             {time}
                           </button>
                         ))}
                       </div>
                     ) : (
                       <p className="text-gray-500 text-center py-4">Aucun créneau disponible pour cette date.</p>
                     )}
                   </Card>
                 )}

                 {/* Patient Info Form */}
                 <Card className="p-4 md:p-6 space-y-4 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
                       <FileText className="w-4 h-4 md:w-5 md:h-5 text-white" />
                     </div>
                     <h3 className="text-base md:text-lg font-bold text-gray-900">Détails de la Consultation</h3>
                   </div>
                    <div className="space-y-3 md:space-y-4">
                      <div className="p-3 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200">
                        <User className="w-4 h-4 inline-block mr-1.5 align-text-bottom" />
                        Rendez-vous pris au nom de : <span className="font-bold">{user?.name}</span>
                      </div>

                      {/* Emergency toggle */}
                      <div
                        onClick={() => setIsUrgent(v => !v)}
                        className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer select-none transition-all duration-300 ${
                          isUrgent
                            ? "border-red-400 bg-gradient-to-r from-red-50 to-orange-50 shadow-red-200 shadow-md"
                            : "border-gray-200 bg-white hover:border-red-200 hover:bg-red-50/30"
                        }`}
                      >
                        {/* Pulse ring when urgent */}
                        {isUrgent && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500" />
                          </span>
                        )}

                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isUrgent
                            ? "bg-gradient-to-br from-red-500 to-orange-400 shadow-lg shadow-red-300"
                            : "bg-gray-100"
                        }`}>
                          <ShieldAlert className={`w-6 h-6 transition-all duration-300 ${isUrgent ? "text-white" : "text-gray-400"}`} />
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                          <p className={`font-bold text-sm md:text-base transition-colors duration-300 ${isUrgent ? "text-red-700" : "text-gray-700"}`}>
                            Cas d'urgence médicale
                          </p>
                          <p className={`text-xs mt-0.5 transition-colors duration-300 ${isUrgent ? "text-red-500" : "text-gray-400"}`}>
                            {isUrgent ? "⚠ Le médecin sera alerté immédiatement" : "Cochez si votre situation requiert une attention immédiate"}
                          </p>
                        </div>

                        {/* Custom checkbox */}
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isUrgent
                            ? "bg-red-500 border-red-500 scale-110"
                            : "border-gray-300 bg-white"
                        }`}>
                          {isUrgent && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>

                     <div className="space-y-2">
                       <Label htmlFor="description" className="text-xs md:text-sm font-semibold text-gray-700 flex items-center gap-1">
                         Motif de Consultation / Description (Optionnel)
                       </Label>
                       <div className="relative">
                         <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                         <Textarea
                           id="description"
                           value={patientDescription}
                           onChange={(e) => setPatientDescription(e.target.value)}
                           placeholder="Décrivez brièvement votre motif de consultation (symptômes, historique, etc.)"
                           className="pl-10 py-3 text-sm md:text-base border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200 bg-white resize-y min-h-[100px]"
                         />
                       </div>
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="file" className="text-xs md:text-sm font-semibold text-gray-700 flex items-center gap-1">
                         Documents Médicaux (PDF Uniquement - Optionnel)
                       </Label>
                       <div className="space-y-2">
                         {!uploadedFile ? (
                           <div className="relative">
                             <input
                               id="file"
                               type="file"
                               accept=".pdf"
                               onChange={handleFileChange}
                               className="hidden"
                             />
                             <label
                               htmlFor="file"
                               className="flex items-center justify-center gap-2 w-full p-4 md:p-5 border-2 border-dashed border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer bg-white"
                             >
                               <Upload className="w-5 h-5 text-blue-500" />
                               <span className="text-sm md:text-base text-gray-600 font-medium">
                                 Cliquez pour télécharger un fichier PDF
                               </span>
                             </label>
                           </div>
                         ) : (
                           <div className="flex items-center justify-between p-3 md:p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                             <div className="flex items-center gap-2 flex-1 min-w-0">
                               <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                               <span className="text-sm md:text-base text-gray-700 font-medium truncate">
                                 {uploadedFile.name}
                               </span>
                               <span className="text-xs text-gray-500 flex-shrink-0">
                                 ({(uploadedFile.size / 1024).toFixed(1)} KB)
                               </span>
                             </div>
                             <button
                               onClick={removeFile}
                               className="ml-2 p-1.5 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                               type="button"
                             >
                               <X className="w-4 h-4 text-red-500" />
                             </button>
                           </div>
                         )}
                         <p className="text-xs text-gray-500">
                           Format accepté: PDF/jpeg .. (max 5MB)
                         </p>
                       </div>
                     </div>
                   </div>
                 </Card>

                 {selectedDate && selectedTime && (
                   <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-300 shadow-lg space-y-3 md:space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                     <div className="flex items-center gap-2">
                       <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                       <h3 className="font-bold text-gray-900 text-base md:text-lg">Résumé de la Réservation</h3>
                     </div>
                     <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                       <div className="flex justify-between items-center py-2 border-b border-blue-200">
                         <span className="text-gray-600 font-medium">Docteur:</span>
                         <span className="font-semibold text-gray-900">{doctor.name}</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-blue-200">
                         <span className="text-gray-600 font-medium">Spécialité:</span>
                         <span className="font-semibold text-blue-600">{getSpecialtyName(doctor.specialty)}</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-blue-200">
                         <span className="text-gray-600 font-medium">Date:</span>
                         <span className="font-semibold text-gray-900">{selectedDate}</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-blue-200">
                         <span className="text-gray-600 font-medium">Heure:</span>
                         <span className="font-semibold text-gray-900">{selectedTime}</span>
                       </div>
                        {isUrgent && (
                          <div className="flex justify-between items-center py-2 border-b border-red-300 bg-red-50 -mx-3 px-3 rounded-lg">
                            <span className="text-red-600 font-bold flex items-center gap-1.5">
                              <ShieldAlert className="w-4 h-4" /> Urgence:
                            </span>
                            <span className="font-bold text-red-600 animate-pulse">CAS URGENT ⚠</span>
                          </div>
                        )}
                        {uploadedFile && (
                          <div className="flex justify-between items-center py-2 border-b border-blue-200">
                            <span className="text-gray-600 font-medium">Document:</span>
                            <span className="font-semibold text-gray-900 truncate max-w-[200px]">{uploadedFile.name}</span>
                          </div>
                        )}
                       <div className="pt-3 md:pt-4 flex justify-between items-center">
                         <span className="text-gray-700 font-semibold text-sm md:text-base">Frais Totaux:</span>
                         <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                           {doctor.fee || 'Non spécifié'} DA
                         </span>
                       </div>
                     </div>
                   </Card>
                 )}

                 <Button
                   onClick={handleSubmit}
                   disabled={!selectedDate || !selectedTime || isUploading}
                   className="w-full h-12 md:h-14 text-sm md:text-base font-bold bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all disabled:hover:shadow-lg"
                 >
                   {isUploading ? (
                     <>
                       <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                       Téléchargement en cours...
                     </>
                   ) : (
                     <>
                       <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                       Confirmer la Réservation
                     </>
                   )}
                 </Button>
               </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}