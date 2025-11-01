"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Printer } from "lucide-react"

interface PrescriptionItem {
  id: string
  medication: string
  dosage: string
  frequency: string
  duration: string
}

export default function PrescriptionForm() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { id: "1", medication: "", dosage: "", frequency: "", duration: "" },
  ])
  const [patientName, setPatientName] = useState("")
  const [notes, setNotes] = useState("")

  const addMedication = () => {
    setPrescriptions([
      ...prescriptions,
      { id: Date.now().toString(), medication: "", dosage: "", frequency: "", duration: "" },
    ])
  }

  const removeMedication = (id: string) => {
    setPrescriptions(prescriptions.filter((p) => p.id !== id))
  }

  const updateMedication = (id: string, field: string, value: string) => {
    setPrescriptions(prescriptions.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handlePrint = () => {
    alert("Prescription printed successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Patient Info */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Patient Name</label>
        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Enter patient name"
          className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Medications */}
      <div>
        <h3 className="font-bold text-foreground mb-4">Medications</h3>
        <div className="space-y-4">
          {prescriptions.map((med) => (
            <div key={med.id} className="p-4 border border-border rounded-lg space-y-3">
              <input
                type="text"
                value={med.medication}
                onChange={(e) => updateMedication(med.id, "medication", e.target.value)}
                placeholder="Medication name"
                className="w-full px-3 py-2 border border-input rounded bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={med.dosage}
                  onChange={(e) => updateMedication(med.id, "dosage", e.target.value)}
                  placeholder="Dosage (e.g., 500mg)"
                  className="px-3 py-2 border border-input rounded bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="text"
                  value={med.frequency}
                  onChange={(e) => updateMedication(med.id, "frequency", e.target.value)}
                  placeholder="Frequency (e.g., 2x daily)"
                  className="px-3 py-2 border border-input rounded bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="text"
                  value={med.duration}
                  onChange={(e) => updateMedication(med.id, "duration", e.target.value)}
                  placeholder="Duration (e.g., 7 days)"
                  className="px-3 py-2 border border-input rounded bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => removeMedication(med.id)}
                  className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={addMedication} variant="outline" className="w-full mt-4 gap-2 bg-transparent">
          <Plus className="w-4 h-4" />
          Add Medication
        </Button>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Clinical Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add clinical notes, instructions, or follow-up recommendations..."
          rows={4}
          className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handlePrint} className="flex-1 gap-2 bg-primary hover:bg-primary/90">
          <Printer className="w-4 h-4" />
          Print Prescription
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Send to Patient
        </Button>
      </div>
    </div>
  )
}
