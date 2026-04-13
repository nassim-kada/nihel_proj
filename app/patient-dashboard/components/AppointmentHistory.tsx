"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Loader2, Bell } from "lucide-react";

interface Appointment {
  _id: string;
  doctorId: string | { _id: string; name?: string };
  patientName: string;
  patientId?: string;
  appointmentDate: string;
  appointmentTime: string;
  appointementType?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  fee: string;
  createdAt?: string;
}

interface Props { patientId: string; patientName: string }

const STATUS_CONFIG = {
  pending:   { label: "En attente",  bg: "bg-amber-100",  text: "text-amber-700",  icon: Clock },
  confirmed: { label: "Confirmé",    bg: "bg-green-100",  text: "text-green-700",  icon: CheckCircle },
  cancelled: { label: "Annulé",      bg: "bg-red-100",    text: "text-red-700",    icon: XCircle },
  completed: { label: "Terminé",     bg: "bg-blue-100",   text: "text-blue-700",   icon: CheckCircle },
};

function isUpcoming(appt: Appointment): boolean {
  if (appt.status !== "confirmed") return false;
  const apptDate = new Date(`${appt.appointmentDate}T${appt.appointmentTime}`);
  return apptDate > new Date();
}

const REMINDER_KEY = (id: string) => `mc_reminder_dismissed_${id}`;

export default function AppointmentHistory({ patientId, patientName }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load dismissed state from localStorage
    const dismissed = new Set<string>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("mc_reminder_dismissed_")) dismissed.add(key.replace("mc_reminder_dismissed_", ""));
    }
    setDismissedReminders(dismissed);
  }, []);

  useEffect(() => {
    fetch("/api/bookings")
      .then(r => r.ok ? r.json() : [])
      .then((all: Appointment[]) => {
        const mine = all.filter(b => b.patientId && b.patientId === patientId);
        const sorted = mine.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
        setAppointments(sorted);

        // Clean up dismissed reminders for past/cancelled appointments
        sorted.forEach(a => {
          if (!isUpcoming(a)) {
            localStorage.removeItem(REMINDER_KEY(a._id));
          }
        });
      })
      .finally(() => setLoading(false));
  }, [patientName]);

  const dismissReminder = (id: string) => {
    localStorage.setItem(REMINDER_KEY(id), "1");
    setDismissedReminders(prev => new Set([...prev, id]));
  };

  const upcomingWithReminders = appointments.filter(a => isUpcoming(a) && !dismissedReminders.has(a._id));

  const formatDate = (d: string) => new Date(d + "T00:00").toLocaleDateString("fr-DZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  if (loading) return <div className="flex items-center justify-center h-48"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Historique des rendez-vous</h2>
        <p className="text-sm text-gray-500">Tous vos rendez-vous passés et à venir</p>
      </div>

      {/* Reminder banners */}
      {upcomingWithReminders.map(a => (
        <div key={a._id} className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-300 rounded-xl shadow-sm">
          <div className="flex-shrink-0 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-green-800">Rappel de rendez-vous</p>
            <p className="text-sm text-green-700 mt-0.5">
              Vous avez un rendez-vous confirmé le <strong>{formatDate(a.appointmentDate)}</strong> à <strong>{a.appointmentTime}</strong>.
            </p>
            {a.appointementType && <p className="text-xs text-green-600 mt-0.5">Type : {a.appointementType}</p>}
          </div>
          <button onClick={() => dismissReminder(a._id)} className="text-green-500 hover:text-green-700 text-lg leading-none font-bold">×</button>
        </div>
      ))}

      {/* Appointment list */}
      {appointments.length === 0 ? (
        <div className="text-center py-14 text-gray-400 bg-white rounded-xl border border-gray-100">
          <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Aucun rendez-vous trouvé</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map(a => {
            const cfg = STATUS_CONFIG[a.status];
            const StatusIcon = cfg.icon;
            const upcoming = isUpcoming(a);
            return (
              <div key={a._id} className={`bg-white rounded-xl border p-4 transition-all ${upcoming ? "border-green-300 shadow-sm" : "border-gray-100"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${cfg.bg}`}>
                      <StatusIcon className={`w-4 h-4 ${cfg.text}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{a.appointementType || "Consultation"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(a.appointmentDate)} à {a.appointmentTime}</p>
                      {a.fee && <p className="text-xs text-gray-400 mt-0.5">Frais : {a.fee} DA</p>}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                </div>
                {upcoming && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" /> Rendez-vous à venir — pensez à préparer vos documents
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
