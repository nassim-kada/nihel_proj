"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Stethoscope, Menu, X, User as UserIcon, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const isActive = (path: string) => pathname === path
  const isDashboardActive = isActive("/doctor-dashboard") || isActive("/patient-dashboard")

  // Hide global nav on dashboard pages — they have their own sidebar
  if (pathname?.startsWith("/doctor-dashboard") || pathname?.startsWith("/patient-dashboard")) {
    return null
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              Medcal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/find-doctors"
              className={`text-sm font-semibold transition-all relative ${
                isActive("/find-doctors")
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Trouver un Médecin
              {isActive("/find-doctors") && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full" />
              )}
            </Link>
            {user ? (
              <>
                <Link
                  href={user.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"}
                  className={`text-sm font-semibold transition-all relative flex items-center gap-1.5 ${
                    isDashboardActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  Mon Espace
                  {isDashboardActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full" />
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-semibold text-red-500 hover:text-red-600 transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`text-sm font-semibold transition-all relative ${
                  isActive("/login")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Connexion
                {isActive("/login") && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full" />
                )}
              </Link>
            )}
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-700 hover:border-blue-300 font-semibold"
              >
                Accueil
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-blue-100 pt-4">
            <Link
              href="/find-doctors"
              className={`block px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive("/find-doctors")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Trouver un Médecin
            </Link>
            {user ? (
              <>
                <Link
                  href={user.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isDashboardActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon className="w-4 h-4" />
                  Mon Espace
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`block px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive("/login")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Connexion
              </Link>
            )}
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold"
              >
                Accueil
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}