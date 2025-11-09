"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" 
import Link from "next/link"
import BookingCalendar from "@/components/booking-calendar"
import { ChevronLeft, Star, MapPin, Phone, User, Calendar as CalendarIcon, Clock, CheckCircle, FileText, Loader2, Upload, X } from "lucide-react"
import { useParams } from "next/navigation"
import { IDoctorData } from "@/types/doctor"

export default function BookingPage() {
  const params = useParams()
  const doctorId = params.id as string 

  const [doctor, setDoctor] = useState<IDoctorData | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [patientName, setPatientName] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [patientDescription, setPatientDescription] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

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

        // Fetch all bookings for this doctor
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

      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message || "Échec de la récupération des données.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [doctorId])

  // Calculate available slots by filtering out booked times
  const availableSlots = useMemo(() => {
    if (!doctor) return []
    
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
    if (!patientName || !patientPhone || !selectedDate || !selectedTime || !doctor) {
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
            patientName,
            patientPhone,
            appointmentDate: selectedDate,
            appointmentTime: selectedTime,
            patientDescription: patientDescription,
            fee: doctor.fee,
            fileLink: fileLink, // Add the file link to booking data
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
            
            // Reset form
            setSelectedDate(null)
            setSelectedTime(null)
            setPatientName("")
            setPatientPhone("")
            setPatientDescription("")
            setUploadedFile(null)
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

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-2" />
        <span className="text-lg font-semibold text-gray-700">Chargement des données du docteur...</span>
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

  // Show message if no slots available
  if (availableSlots.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-8 md:py-12 px-3 md:px-4">
        <div className="max-w-2xl mx-auto">
          <Link 
            href="/find-doctors" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 w-fit font-semibold transition-colors group mb-6"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm md:text-base">Retour aux Médecins</span>
          </Link>
          <Card className="p-8 md:p-12 text-center bg-white/80 backdrop-blur-sm border-2 border-yellow-100 shadow-lg">
            <h3 className="text-xl md:text-2xl font-bold text-yellow-700 mb-2">Aucune Disponibilité</h3>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              Dr. {doctor.name} n'a actuellement aucun créneau disponible. Veuillez vérifier plus tard ou choisir un autre médecin.
            </p>
            <Link href="/find-doctors">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-5 font-semibold shadow-lg">
                Voir Autres Médecins
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    )
  }

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
          <div className="lg:col-span-1">
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
                  <span className="text-gray-700 font-semibold">Note: {doctor.rating}/5</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-600 leading-tight">{doctor.clinic}</span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-blue-100">
                <p className="text-xs text-gray-500 font-medium mb-1">Frais de Consultation</p>
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                  {doctor.fee} DA
                </p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4 md:space-y-6">
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

            <Card className="p-4 md:p-6 space-y-4 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">Informations du Patient</h3>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs md:text-sm font-semibold text-gray-700 flex items-center gap-1">
                    Nom Complet <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Entrez votre nom complet"
                      className="pl-10 py-4 md:py-5 text-sm md:text-base border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200 bg-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs md:text-sm font-semibold text-gray-700 flex items-center gap-1">
                    Numéro de Téléphone <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+213 XXX XXX XXX"
                      className="pl-10 py-4 md:py-5 text-sm md:text-base border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200 bg-white"
                      required
                    />
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
                  {uploadedFile && (
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="text-gray-600 font-medium">Document:</span>
                      <span className="font-semibold text-gray-900 truncate max-w-[200px]">{uploadedFile.name}</span>
                    </div>
                  )}
                  <div className="pt-3 md:pt-4 flex justify-between items-center">
                    <span className="text-gray-700 font-semibold text-sm md:text-base">Frais Totaux:</span>
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                      {doctor.fee} DA
                    </span>
                  </div>
                </div>
              </Card>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!patientName || !patientPhone || !selectedDate || !selectedTime || isUploading}
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
          </div>
        </div>
      </div>
    </main>
  )
}