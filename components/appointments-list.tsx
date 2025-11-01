"use client"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle } from "lucide-react"

interface Appointment {
  id: string
  patientName: string
  date: string
  time: string
  reason: string
  status: "confirmed" | "pending" | "completed"
}

const APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    patientName: "Amina Belhadj",
    date: "2024-11-05",
    time: "09:00",
    reason: "Heart checkup and blood pressure monitoring",
    status: "confirmed",
  },
  {
    id: "2",
    patientName: "Youssef Menai",
    date: "2024-11-05",
    time: "10:00",
    reason: "Follow-up on previous ECG results",
    status: "confirmed",
  },
  {
    id: "3",
    patientName: "Fatima Zahra",
    date: "2024-11-05",
    time: "14:00",
    reason: "Initial consultation for chest pain",
    status: "pending",
  },
  {
    id: "4",
    patientName: "Mohammed Kouris",
    date: "2024-11-05",
    time: "15:30",
    reason: "Medication adjustment consultation",
    status: "confirmed",
  },
  {
    id: "5",
    patientName: "Leila Mami",
    date: "2024-11-06",
    time: "10:00",
    reason: "Routine cardiac examination",
    status: "confirmed",
  },
]

export default function AppointmentsList() {
  return (
    <div className="space-y-4">
      {APPOINTMENTS.map((apt) => (
        <div key={apt.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-foreground">{apt.patientName}</h3>
              <p className="text-sm text-muted-foreground">{apt.reason}</p>
            </div>
            {apt.status === "confirmed" && (
              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                Confirmed
              </div>
            )}
            {apt.status === "pending" && (
              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs font-medium">
                <Clock className="w-3 h-3" />
                Pending
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {apt.date} at {apt.time}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">
              View Details
            </Button>
            <Button size="sm" variant="outline" className="text-xs bg-transparent">
              Reschedule
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
