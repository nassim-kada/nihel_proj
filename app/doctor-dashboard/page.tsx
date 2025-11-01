"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppointmentsList from "@/components/appointments-list"
import PrescriptionForm from "@/components/prescription-form"
import FileSharing from "@/components/file-sharing"
import { Calendar, FileText, Share2, Users } from "lucide-react"

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("appointments")

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Dr. Ahmed Bennani - Cardiology</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Appointments</p>
                  <p className="text-3xl font-bold text-foreground mt-2">5</p>
                </div>
                <Calendar className="w-8 h-8 text-primary opacity-50" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-3xl font-bold text-foreground mt-2">1,230</p>
                </div>
                <Users className="w-8 h-8 text-accent opacity-50" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Prescriptions Issued</p>
                  <p className="text-3xl font-bold text-foreground mt-2">847</p>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-50" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Files Shared</p>
                  <p className="text-3xl font-bold text-foreground mt-2">342</p>
                </div>
                <Share2 className="w-8 h-8 text-accent opacity-50" />
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="files">Share Files</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4 mt-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Appointments</h2>
              <AppointmentsList />
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4 mt-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Create Prescription</h2>
              <PrescriptionForm />
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-4 mt-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Share Medical Files</h2>
              <FileSharing />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
