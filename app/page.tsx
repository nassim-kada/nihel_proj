"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Stethoscope, Users, Calendar, FileText, Building2, TestTube, ScanLine, Droplet, Plane, Home, Check, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-sky-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent leading-tight">
                Healthcare Management Made Simple
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Medcal connects healthcare professionals with patients for seamless medical consultations and care management
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/doctor-dashboard">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white px-8 py-6 text-lg shadow-lg">
                    <Stethoscope className="w-5 h-5 mr-2" />
                      Doctor Login 
                  </Button>
                </Link>
                <Link href="/find-doctors">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                    <Users className="w-5 h-5 mr-2" />
                    Find a Doctor
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 bg-white hover:shadow-xl transition-all border border-blue-100">
                <Stethoscope className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">For Doctors</h3>
                <p className="text-sm text-gray-600">Manage your practice efficiently</p>
              </Card>
              <Card className="p-6 bg-white hover:shadow-xl transition-all border border-sky-100">
                <Users className="w-10 h-10 text-sky-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">For Patients</h3>
                <p className="text-sm text-gray-600">Access quality healthcare</p>
              </Card>
              <Card className="p-6 bg-white hover:shadow-xl transition-all border border-blue-100">
                <Calendar className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Easy Booking</h3>
                <p className="text-sm text-gray-600">Schedule appointments instantly</p>
              </Card>
              <Card className="p-6 bg-white hover:shadow-xl transition-all border border-sky-100">
                <FileText className="w-10 h-10 text-sky-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Digital Records</h3>
                <p className="text-sm text-gray-600">Secure document management</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What is Medcal Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">What is Medcal?</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Medcal is a comprehensive healthcare management platform designed to bridge the gap between healthcare
            professionals and patients. We streamline medical practice management, appointment scheduling, and secure
            document sharing, making healthcare more accessible and efficient for everyone in Algeria.
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">About Us</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            At Medcal, our mission is to revolutionize healthcare delivery in Algeria by providing a seamless digital
            platform that empowers doctors to manage their practices efficiently while giving patients easy access to
            quality healthcare services. We believe in the power of technology to transform patient care and improve
            health outcomes across our communities.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Medcal serves as a comprehensive management application designed to enhance practice efficiency and
              streamline medical record management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Services */}
            <div className="relative bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-blue-200">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Active
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Booking</h3>
              <p className="text-gray-600 text-sm">Schedule appointments at your convenience</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-sky-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-sky-200">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Active
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Digital Prescriptions</h3>
              <p className="text-gray-600 text-sm">Receive prescriptions digitally and securely</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-blue-200">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Active
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Professional Care</h3>
              <p className="text-gray-600 text-sm">Connect with verified healthcare professionals</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-sky-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-sky-200">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Active
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Secure Sharing</h3>
              <p className="text-gray-600 text-sm">Share medical documents safely with doctors</p>
            </div>

            {/* Coming Soon Services */}
            <div className="relative bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-indigo-200 opacity-75">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Soon
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Les Pharmacies</h3>
              <p className="text-gray-600 text-sm">Connect with local pharmacies</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-violet-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-violet-200 opacity-75">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Soon
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-violet-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <TestTube className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Laboratoire</h3>
              <p className="text-gray-600 text-sm">Book laboratory tests easily</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-cyan-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-cyan-200 opacity-75">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Soon
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <ScanLine className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Centre d'Imagerie</h3>
              <p className="text-gray-600 text-sm">Access medical imaging services</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-pink-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-pink-200 opacity-75">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Soon
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Droplet className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Don de Sang</h3>
              <p className="text-gray-600 text-sm">Support blood donation initiatives</p>
            </div>

            <div className="relative bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-indigo-200 opacity-75">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Soon
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Plane className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Médecins à l'Étranger</h3>
              <p className="text-gray-600 text-sm">Consult doctors practicing abroad</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-sky-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-sky-200 opacity-75">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Soon
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Home className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Médecins à Domicile</h3>
              <p className="text-gray-600 text-sm">Request home doctor visits</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}