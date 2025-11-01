// page.tsx (Version Française avec Champ Email Supprimé et Champ Description Ajouté)
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" 
import Link from "next/link"
import { DOCTORS } from "@/data/doctors"
import BookingCalendar from "@/components/booking-calendar"
import { ChevronLeft, Star, MapPin, Phone, User, Calendar as CalendarIcon, Clock, CheckCircle, FileText } from "lucide-react" // Mail retiré, FileText ajouté
import { useParams } from "next/navigation"

export default function BookingPage() {
  const params = useParams()
  const doctorId = params.id as string
  const doctor = DOCTORS.find((d) => d.id === doctorId)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [patientName, setPatientName] = useState("")
  // const [patientEmail, setPatientEmail] = useState("") // SUPPRIMÉ
  const [patientPhone, setPatientPhone] = useState("")
  const [patientDescription, setPatientDescription] = useState("") // NOUVEAU

  if (!doctor) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-8 md:py-12 px-3 md:px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 md:p-12 text-center bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Médecin Non Trouvé</h3>
            <p className="text-sm md:text-base text-gray-600 mb-6">Le médecin que vous recherchez n'existe pas ou a été retiré.</p>
            <Link href="/find-doctors">
              <Button className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white px-6 py-5 font-semibold shadow-lg">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Retour aux Médecins
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    )
  }

  const currentDateSlot = doctor.availableSlots.find((slot) => slot.date === selectedDate)

  const handleSubmit = () => {
    // La logique de soumission est mise à jour : patientEmail n'est plus vérifié
    if (patientName && patientPhone && selectedDate && selectedTime) {
      alert(
        `Réservation confirmée !\n\nDocteur: ${doctor.name}\nDate: ${selectedDate}\nHeure: ${selectedTime}\nNom: ${patientName}\nTéléphone: ${patientPhone}\nDescription: ${patientDescription || 'Aucune'}`
      )
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-6 md:py-12 px-3 md:px-4">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Bouton Retour */}
        <Link 
          href="/find-doctors" 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 w-fit font-semibold transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm md:text-base">Retour aux Médecins</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Section Info du Médecin */}
          <div className="lg:col-span-1">
            <Card className="p-4 md:p-6 lg:sticky lg:top-24 space-y-4 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{doctor.name}</h2>
                <p className="text-blue-600 font-semibold text-sm md:text-base">{doctor.specialty}</p>
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

          {/* Section Formulaire de Réservation */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Carte Calendrier */}
            <Card className="p-4 md:p-6 space-y-3 md:space-y-4 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
                  <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">Sélectionner la Date</h3>
              </div>
              <BookingCalendar
                slots={doctor.availableSlots}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </Card>

            {/* Carte Créneaux Horaires */}
            {selectedDate && currentDateSlot && (
              <Card className="p-4 md:p-6 space-y-3 md:space-y-4 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900">Sélectionner l'Heure</h3>
                </div>
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
              </Card>
            )}

            {/* Carte Informations du Patient */}
            <Card className="p-4 md:p-6 space-y-4 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">Informations du Patient</h3>
              </div>
              <div className="space-y-3 md:space-y-4">
                {/* Nom Complet */}
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
                
                {/* Numéro de Téléphone */}
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

                {/* Description (Nouveau Champ) */}
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
              </div>
            </Card>

            {/* Carte Résumé de la Réservation */}
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
                    <span className="font-semibold text-blue-600">{doctor.specialty}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-600 font-medium">Date:</span>
                    <span className="font-semibold text-gray-900">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-600 font-medium">Heure:</span>
                    <span className="font-semibold text-gray-900">{selectedTime}</span>
                  </div>
                  <div className="pt-3 md:pt-4 flex justify-between items-center">
                    <span className="text-gray-700 font-semibold text-sm md:text-base">Frais Totaux:</span>
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                      {doctor.fee} DA
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Bouton Confirmer */}
            <Button
              onClick={handleSubmit}
              // Mise à jour de la condition de désactivation : patientEmail n'est plus requis
              disabled={!patientName || !patientPhone || !selectedDate || !selectedTime}
              className="w-full h-12 md:h-14 text-sm md:text-base font-bold bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all disabled:hover:shadow-lg"
            >
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Confirmer la Réservation
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}