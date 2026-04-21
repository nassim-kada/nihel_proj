"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar, Clock, PlusSquare, User, BarChart3, ClipboardEdit,
  FileSliders, Loader2
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import AppointmentList from "./components/AppointmentList";
import UrgentAlert from "./components/UrgentAlert";
import UrgentToast from "./components/UrgentToast";
import { Appointment } from "./components/AppointmentCard";
import SharedFilesView from "@/components/sharedfiles";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";


// ── Lazy-imported heavy sub-views (kept from original) ────────────────────────
import ManageProfileView from "./views/ManageProfileView";
import SlotsView from "./views/SlotsView";
import StatisticsView from "./views/StatisticsView";
import PrescriptionView from "./views/PrescriptionView";

// ── Nav items ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "appointments", label: "Rendez-vous",       icon: Calendar },
  { id: "add_slots",    label: "Mes Disponibilités", icon: PlusSquare },
  { id: "manage_profile", label: "Mon Profil",      icon: User },
  { id: "sharedfiles", label: "Partage de Fichiers", icon: FileSliders },
  { id: "statistics",  label: "Statistiques",       icon: BarChart3 },
  { id: "prescription",label: "Ordonnances",        icon: ClipboardEdit },
];

export default function DoctorDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading: authLoading, logout } = useAuth();
  const [view, setView] = useState("appointments");
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [doctor, setDoctor] = useState<{ _id: string; name: string; specialty?: any; fee?: string; experience?: number; patients?: number; maxPatients?: number; location?: string; clinic?: string } | null>(null);
  const [specialties, setSpecialties] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [apptLoading, setApptLoading] = useState(true);
  const [acknowledgedUrgent, setAcknowledgedUrgent] = useState<Set<string>>(new Set());

  // ── Auth / load doctor ────────────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "doctor") {
      router.push("/");
      return;
    }
    
    const id = user.id;
    const name = user.name;
    setDoctorId(id);

    Promise.all([
      fetch(`/api/doctors/${id}`).then(r => r.ok ? r.json() : { _id: id, name }),
      fetch("/api/specialities").then(r => r.ok ? r.json() : []),
    ]).then(([doc, specs]) => {
      setDoctor(doc);
      setSpecialties(specs);
    }).finally(() => setLoading(false));
  }, [user, authLoading, router]);

  // ── Load appointments ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!doctorId) return;
    fetch("/api/bookings")
      .then(r => r.ok ? r.json() : [])
      .then((all: Appointment[]) => {
        const mine = all.filter(b => {
          const bid = typeof b.doctorId === "object" ? b.doctorId._id : b.doctorId;
          return bid?.toString() === doctorId;
        });
        setAppointments(mine);
      })
      .finally(() => setApptLoading(false));
  }, [doctorId]);

  // ── Urgent unacknowledged appointments ────────────────────────────────────
  const urgentPending = useMemo(() =>
    appointments.find(a => a.isUrgent && a.status === "pending" && !acknowledgedUrgent.has(a._id)),
    [appointments, acknowledgedUrgent]
  );

  const handleAcknowledge = async (id: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" }),
    }).then(r => r.ok ? r.json() : null).then(updated => {
      if (updated) setAppointments(prev => prev.map(a => a._id === id ? updated : a));
    });
    setAcknowledgedUrgent(prev => new Set([...prev, id]));
  };

  const handleUrgentAccept = async (id: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" }),
    }).then(r => r.ok ? r.json() : null).then(updated => {
      if (updated) setAppointments(prev => prev.map(a => a._id === id ? updated : a));
    });
    setAcknowledgedUrgent(prev => new Set([...prev, id]));
  };

  const handleUrgentDecline = async (id: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    }).then(r => r.ok ? r.json() : null).then(updated => {
      if (updated) setAppointments(prev => prev.map(a => a._id === id ? updated : a));
    });
    setAcknowledgedUrgent(prev => new Set([...prev, id]));
  };

  // ── Status / type mutations ────────────────────────────────────────────────
  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { const updated = await res.json(); setAppointments(prev => prev.map(a => a._id === id ? updated : a)); }
  };

  const handleTypeChange = async (id: string, type: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointementType: type }),
    });
    if (res.ok) { const updated = await res.json(); setAppointments(prev => prev.map(a => a._id === id ? updated : a)); }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setAppointments(prev => prev.filter(a => a._id !== id));
    }
  };


  // ── Specialty name helper ─────────────────────────────────────────────────
  const specialtyName = useMemo(() => {
    if (!doctor?.specialty) return "";
    if (typeof doctor.specialty === "object") return doctor.specialty.name ?? "";
    return specialties.find(s => s._id === doctor.specialty)?.name ?? "";
  }, [doctor, specialties]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 mx-auto flex items-center justify-center">
            <span className="text-white font-black text-lg">M</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">{t("appointments.loading", "Chargement...")}</span>
          </div>
        </div>
      </main>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Urgent full-screen alert overlay (legacy – kept for non-toast fallback) */}
      {urgentPending && <UrgentAlert appointment={urgentPending} onAcknowledge={handleAcknowledge} />}

      {/* Urgent toast stack – one card per unacknowledged urgent pending booking */}
      <UrgentToast
        appointments={appointments.filter(a => a.isUrgent && a.status === "pending" && !acknowledgedUrgent.has(a._id))}
        onAccept={handleUrgentAccept}
        onDecline={handleUrgentDecline}
      />

      {/* Sidebar */}
      <Sidebar
        navItems={NAV_ITEMS}
        activeView={view}
        onNav={setView}
        doctorName={doctor?.name ?? ""}
        doctorSpecialty={specialtyName}
        onLogout={handleLogout}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">{t("doctor_dashboard.title", "Tableau de Bord Médical")}</h1>
            {doctor && <p className="text-sm text-gray-500">{t("doctor_dashboard.dr", "Dr.") as string} {doctor.name} · {t(`specialties.${specialtyName}`, { defaultValue: specialtyName }) as string}</p>}
          </div>
          <div className="flex items-center gap-3">
            {doctor?.fee && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{doctor.fee} DA</span>
            )}
            {(doctor?.experience ?? 0) > 0 && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">🏆 {doctor?.experience} {t("doctor_dashboard.years", "ans")}</span>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* Stats always visible on dashboard */}
          {view === "appointments" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <AppointmentList
                appointments={appointments}
                loading={apptLoading}
                onStatusChange={handleStatusChange}
                onTypeChange={handleTypeChange}
                onDelete={handleDelete}
              />
            </div>
          )}

          {view === "add_slots" && doctor && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <SlotsView currentDoctorId={doctor._id} />
            </div>
          )}

          {view === "manage_profile" && doctor && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <ManageProfileView currentDoctor={doctor as any} updateDoctorInfo={d => setDoctor(prev => ({ ...prev!, ...d }))} specialties={specialties} />
            </div>
          )}

          {view === "sharedfiles" && doctor && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <SharedFilesView currentDoctorId={doctor._id} />
            </div>
          )}

          {view === "statistics" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <StatisticsView appointments={appointments} />
            </div>
          )}

          {view === "prescription" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <PrescriptionView />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}