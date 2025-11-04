"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Stethoscope, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react"

export default function LoginRegisterPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    specialty: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Gestion de la soumission du formulaire
    console.log("Formulaire soumis :", formData)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center py-8 md:py-12 px-3 md:px-4">
      
      {/* Carte du Formulaire Centré */}
      <div className="max-w-md w-full">
        <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-sm border-2 border-blue-100 shadow-2xl">
          
          {/* Logo en haut du formulaire centré */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              Medcal
            </span>
          </div>

          {/* Onglets de Bascule */}
          <div className="flex gap-2 mb-6 md:mb-8 bg-blue-50 p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 md:py-3 rounded-md font-semibold text-sm md:text-base transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 md:py-3 rounded-md font-semibold text-sm md:text-base transition-all ${
                !isLogin
                  ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              S'inscrire
            </button>
          </div>

          <div className="space-y-4 md:space-y-5">
            {/* Formulaire de Connexion */}
            {isLogin ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base font-medium text-gray-700">
                    Adresse E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="docteur@exemple.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 md:pl-12 py-5 md:py-6 text-sm md:text-base border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm md:text-base font-medium text-gray-700">
                    Mot de Passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 md:pl-12 pr-10 md:pr-12 py-5 md:py-6 text-sm md:text-base border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs md:text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-200" />
                    <span className="text-gray-600">Se souvenir de moi</span>
                  </label>
                  <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white py-5 md:py-6 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Se Connecter
                </Button>
              </>
            ) : (
              /* Formulaire d'Inscription */
              <>
                <div className="space-y-2">
                  <Label htmlFor="reg-name" className="text-sm md:text-base font-medium text-gray-700">
                    Nom Complet
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="Dr. Kada"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 md:pl-12 py-5 md:py-6 text-sm md:text-base border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-sm md:text-base font-medium text-gray-700">
                    Adresse E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="docteur@exemple.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 md:pl-12 py-5 md:py-6 text-sm md:text-base border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-phone" className="text-sm md:text-base font-medium text-gray-700">
                    Numéro de Téléphone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="+213 555 123 456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10 md:pl-12 py-5 md:py-6 text-sm md:text-base border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty" className="text-sm md:text-base font-medium text-gray-700">
                    Spécialité
                  </Label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <Input
                      id="specialty"
                      type="text"
                      placeholder="Cardiologie"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="pl-10 md:pl-12 py-5 md:py-6 text-sm md:text-base border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-sm md:text-base font-medium text-gray-700">
                    Mot de Passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 md:pl-12 pr-10 md:pr-12 py-5 md:py-6 text-sm md:text-base border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs md:text-sm">
                  <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-blue-300 text-blue-600 focus:ring-blue-200" />
                  <span className="text-gray-600">
                    J'accepte les{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                      Conditions d'Utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                      Politique de Confidentialité
                    </Link>
                  </span>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white py-5 md:py-6 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Créer un Compte
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}