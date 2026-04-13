"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, FolderOpen, Calendar, LayoutDashboard, LogOut, Loader2, Stethoscope } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PatientProfile from "./components/PatientProfile";
import DossierMedical from "./components/DossierMedical";
import AppointmentHistory from "./components/AppointmentHistory";
import FindDoctorsPage from "@/app/find-doctors/page";

type View = "find-doctors" | "profile" | "dossier" | "appointments";

const NAV_ITEMS: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "find-doctors", label: "Trouver un médecin",  icon: Stethoscope },
  { id: "profile",      label: "Mon Profil",          icon: User },
  { id: "dossier",      label: "Dossier Médical",     icon: FolderOpen },
  { id: "appointments", label: "Mes Rendez-vous",     icon: Calendar },
];

export default function PatientDashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [view, setView] = useState<View>("find-doctors");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "patient")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Chargement...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-200 flex flex-col shadow-sm transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}>
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">Medcal</span>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-400 flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-blue-600 font-medium">Patient</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button key={item.id} onClick={() => { 
                  setView(item.id); 
                  setMobileMenuOpen(false); 
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-gradient-to-r from-blue-500 to-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between lg:hidden">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600" />
          </button>
          <span className="font-bold text-gray-800">Espace Patient</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
            {user.name.charAt(0)}
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8">
          {view === "find-doctors" && (
            <div className="-m-6 lg:-m-8">
              <FindDoctorsPage />
            </div>
          )}

          {view === "profile" && <PatientProfile patientId={user.id} />}
          {view === "dossier" && <DossierMedical patientId={user.id} />}
          {view === "appointments" && <AppointmentHistory patientId={user.id} patientName={user.name} />}
        </div>
      </div>
    </main>
  );
}
