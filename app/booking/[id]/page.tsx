"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DOCTORS } from "@/data/doctors"
import BookingCalendar from "@/components/booking-calendar"
import { ChevronLeft, Star, MapPin } from "lucide-react"
import { useParams } from "next/navigation"

export default function BookingPage() {
  const params = useParams()
  const doctorId = params.id as string
  const doctor = DOCTORS.find((d) => d.id === doctorId)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [patientPhone, setPatientPhone] = useState("")

  if (!doctor) {
    return (
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-muted-foreground">Doctor not found</p>
        </div>
      </main>
    )
  }

  const currentDateSlot = doctor.availableSlots.find((slot) => slot.date === selectedDate)

  const handleSubmit = () => {
    if (patientName && patientEmail && patientPhone && selectedDate && selectedTime) {
      alert(
        `Booking confirmed!\n\nDoctor: ${doctor.name}\nDate: ${selectedDate}\nTime: ${selectedTime}\nName: ${patientName}`,
      )
    }
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/find-doctors" className="flex items-center gap-2 text-primary hover:text-primary/80 w-fit">
          <ChevronLeft className="w-4 h-4" />
          Back to Doctors
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{doctor.name}</h2>
                <p className="text-primary font-medium">{doctor.specialty}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-foreground font-medium">{doctor.rating} rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{doctor.clinic}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Consultation Fee</p>
                <p className="text-2xl font-bold text-foreground">{doctor.fee} DA</p>
              </div>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-foreground">Select Date</h3>
              <BookingCalendar
                slots={doctor.availableSlots}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </Card>

            {/* Time Slots */}
            {selectedDate && currentDateSlot && (
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-foreground">Select Time</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {currentDateSlot.times.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded border-2 font-medium transition-all ${
                        selectedTime === time
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Patient Details */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-foreground">Patient Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+213 XXX XXX XXX"
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </Card>

            {/* Booking Summary */}
            {selectedDate && selectedTime && (
              <Card className="p-6 bg-primary/5 border-2 border-primary space-y-4">
                <h3 className="font-bold text-foreground">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Doctor:</span>
                    <span className="font-medium text-foreground">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium text-foreground">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium text-foreground">{selectedTime}</span>
                  </div>
                  <div className="border-t border-primary/20 pt-2 flex justify-between">
                    <span className="text-muted-foreground">Fee:</span>
                    <span className="font-bold text-primary">{doctor.fee} DA</span>
                  </div>
                </div>
              </Card>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!patientName || !patientEmail || !patientPhone || !selectedDate || !selectedTime}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
