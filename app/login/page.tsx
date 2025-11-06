"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Stethoscope, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react"

interface Speciality {
  _id: string
  name: string
}

interface Doctor {
  _id: string;
  email: string;
  password?: string;
  name: string;
  phone: string;
  specialty: string;
}

export default function LoginRegisterPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [specialities, setSpecialities] = useState<Speciality[]>([])
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    specialty: "",
  })

  // Fetch specialties from API
  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/specialities')
        if (response.ok) {
          const data = await response.json()
          setSpecialities(data)
        } else {
          console.error("Failed to fetch specialities")
        }
      } catch (error) {
        console.error("Error fetching specialities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialities()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setSubmitLoading(true)
    
    if (isLogin) {
      // LOGIN LOGIC
      console.log("Connexion attempt for:", formData.email)
      
      try {
        // Fetch all doctors
        const response = await fetch('/api/doctors') 
        if (!response.ok) {
            setMessage({ type: 'error', text: 'Erreur de connexion au serveur de données.' })
            setSubmitLoading(false)
            return
        }

        const doctors: Doctor[] = await response.json()
        
        // Find matching doctor by email and password
        const user = doctors.find(
          (d) => d.email === formData.email && d.password === formData.password
        )

        if (user) {
          // Success: Store user info and redirect
          setMessage({ type: 'success', text: 'Connexion réussie! Redirection...' })
          
          // Optional: Store user info in localStorage or session
          localStorage.setItem('doctorId', user._id)
          localStorage.setItem('doctorName', user.name)
          localStorage.setItem('doctorEmail', user.email)
          
          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            router.push('/doctor-dashboard')
          }, 1000)
        } else {
          // Failure: Display error
          setMessage({ 
            type: 'error', 
            text: 'E-mail ou mot de passe incorrect.' 
          })
          setSubmitLoading(false)
        }
      } catch (error) {
        console.error("Login error:", error)
        setMessage({ 
          type: 'error', 
          text: 'Erreur de connexion au serveur.' 
        })
        setSubmitLoading(false)
      }
      
    } else {
      // REGISTRATION LOGIC
      try {
        const response = await fetch('/api/doctors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (response.ok) {
          setMessage({ type: 'success', text: data.message || 'Médecin enregistré avec succès!' })
          // Switch to login tab after successful registration
          setIsLogin(true) 
          // Clear only registration-specific fields
          setFormData(prev => ({
            ...prev,
            name: "",
            phone: "",
            specialty: "",
          }))
        } else {
          setMessage({ 
            type: 'error', 
            text: data.message || data.error || 'Erreur lors de l\'enregistrement' 
          })
        }
      } catch (error) {
        console.error("Registration error:", error)
        setMessage({ 
          type: 'error', 
          text: 'Erreur de connexion au serveur' 
        })
      } finally {
        setSubmitLoading(false)
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center py-8 md:py-12 px-3 md:px-4">
      
      <div className="max-w-md w-full">
        <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-sm border-2 border-blue-100 shadow-2xl">
          
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              Medcal
            </span>
          </div>

          <div className="flex gap-2 mb-6 md:mb-8 bg-blue-50 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true)
                setMessage(null)
              }}
              className={`flex-1 py-2.5 md:py-3 rounded-md font-semibold text-sm md:text-base transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false)
                setMessage(null)
              }}
              className={`flex-1 py-2.5 md:py-3 rounded-md font-semibold text-sm md:text-base transition-all ${
                !isLogin
                  ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              S'inscrire
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-md text-center ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
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
                      required
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
                      required
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
                  <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                    Mot de passe oublié ?
                  </a>
                </div>

                <Button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white py-5 md:py-6 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {submitLoading ? "Connexion..." : "Se Connecter"}
                </Button>
              </>
            ) : (
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
                      required
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
                      required
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
                      required
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
                    <select
                      id="specialty"
                      required
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full pl-10 md:pl-12 py-5 md:py-6 text-sm md:text-base border-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200 rounded-md bg-white appearance-none"
                    >
                      <option value="">Sélectionnez une spécialité</option>
                      {specialities.map((speciality) => (
                        <option key={speciality._id} value={speciality._id}>
                          {speciality.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  {loading && <p className="text-sm text-gray-500">Chargement des spécialités...</p>}
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
                      required
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
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white py-5 md:py-6 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {submitLoading ? "Enregistrement..." : "Créer un Compte"}
                </Button>
              </>
            )}
          </form>
        </Card>
      </div>
    </main>
  )
}