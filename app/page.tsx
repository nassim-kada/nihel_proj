"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Stethoscope, Users, Calendar, FileText, Building2, TestTube, ScanLine, Droplet, Plane, Home, Check, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Section Héro avec Fond Dégradé */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-sky-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenu Gauche */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent leading-tight">
                Gestion des Soins de Santé Simplifiée
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Medcal connecte les professionnels de la santé aux patients pour des consultations médicales et une gestion des soins fluides.
              </p>
              
              {/* Boutons CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white px-8 py-6 text-lg shadow-lg">
                    <Stethoscope className="w-5 h-5 mr-2" />
                      Connexion Médecin 
                  </Button>
                </Link>
                <Link href="/find-doctors">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
                    <Users className="w-5 h-5 mr-2" />
                    Trouver un Médecin
                  </Button>
                </Link>
              </div>
            </div>

            {/* Côtés Droit - Cartes */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 bg-white hover:shadow-xl transition-all border border-blue-100">
                <Stethoscope className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Pour les Médecins</h3>
                <p className="text-sm text-gray-600">Gérez votre cabinet efficacement</p>
              </Card>
              <Card className="p-6 bg-white hover:shadow-xl transition-all border border-sky-100">
                <Users className="w-10 h-10 text-sky-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Pour les Patients</h3>
                <p className="text-sm text-gray-600">Accédez à des soins de qualité</p>
              </Card>
              <Card className="p-6 bg-white hover:shadow-xl transition-all border border-blue-100">
                <Calendar className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Réservation Facile</h3>
                <p className="text-sm text-gray-600">Planifiez vos rendez-vous instantanément</p>
              </Card>
              <Card className="p-6 bg-white hover:shadow-xl transition-all border border-sky-100">
                <FileText className="w-10 h-10 text-sky-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Dossiers Numériques</h3>
                <p className="text-sm text-gray-600">Gestion sécurisée des documents</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section Qu'est-ce que Medcal */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Qu'est-ce que Medcal ?</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Medcal est une plateforme complète de gestion des soins de santé conçue pour combler le fossé entre les professionnels
            de la santé et les patients. Nous simplifions la gestion des cabinets médicaux, la planification des rendez-vous et le
            partage sécurisé de documents, rendant les soins de santé plus accessibles et efficaces pour tous en Algérie.
          </p>
        </div>
      </section>

      {/* Section À Propos de Nous */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">À Propos de Nous</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Chez Medcal, notre mission est de révolutionner la prestation des soins de santé en Algérie en fournissant une plateforme
            numérique transparente qui permet aux médecins de gérer leurs pratiques efficacement tout en offrant aux patients un accès
            facile à des services de santé de qualité. Nous croyons au pouvoir de la technologie pour transformer les soins aux patients
            et améliorer les résultats de santé au sein de nos communautés.
          </p>
        </div>
      </section>

      {/* Section Nos Services */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Nos Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Medcal est une application de gestion complète conçue pour améliorer l'efficacité de la pratique et
              rationaliser la gestion des dossiers médicaux.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Services Actifs */}
            <div className="relative bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-blue-200">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Actif
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Réservation Facile</h3>
              <p className="text-gray-600 text-sm">Planifiez des rendez-vous à votre convenance</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-sky-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-sky-200">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Actif
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Ordonnances Numériques</h3>
              <p className="text-gray-600 text-sm">Recevez des ordonnances numériquement et en toute sécurité</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-blue-200">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Actif
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Soins Professionnels</h3>
              <p className="text-gray-600 text-sm">Connectez-vous avec des professionnels de la santé vérifiés</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-sky-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-sky-200">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Actif
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Partage Sécurisé</h3>
              <p className="text-gray-600 text-sm">Partagez des documents médicaux en toute sécurité avec les médecins</p>
            </div>

            {/* Services Bientôt Disponibles */}
            <div className="relative bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-indigo-200 opacity-75">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Bientôt
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Les Pharmacies</h3>
              <p className="text-gray-600 text-sm">Connectez-vous avec les pharmacies locales</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-violet-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-violet-200 opacity-75">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Bientôt
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-violet-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <TestTube className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Laboratoire</h3>
              <p className="text-gray-600 text-sm">Réservez facilement des tests de laboratoire</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-cyan-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-cyan-200 opacity-75">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Bientôt
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <ScanLine className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Centre d'Imagerie</h3>
              <p className="text-gray-600 text-sm">Accédez aux services d'imagerie médicale</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-pink-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-pink-200 opacity-75">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Bientôt
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Droplet className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Don de Sang</h3>
              <p className="text-gray-600 text-sm">Soutenez les initiatives de don de sang</p>
            </div>

            <div className="relative bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-indigo-200 opacity-75">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Bientôt
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Plane className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Médecins à l'Étranger</h3>
              <p className="text-gray-600 text-sm">Consultez des médecins exerçant à l'étranger</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-sky-50 to-white p-8 rounded-xl hover:shadow-xl transition-all border-2 border-sky-200 opacity-75">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Bientôt
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Home className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Médecins à Domicile</h3>
              <p className="text-gray-600 text-sm">Demandez des visites de médecin à domicile</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}