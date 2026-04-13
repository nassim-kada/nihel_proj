"use client";
import { FC, useEffect, useState } from "react";
import { ShieldAlert, CheckCircle, XCircle, Clock, Phone, User, X } from "lucide-react";
import { Appointment } from "./AppointmentCard";

interface Props {
  appointments: Appointment[]; // all pending urgent appointments not yet acted on
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

const UrgentToast: FC<Props> = ({ appointments, onAccept, onDecline }) => {
  const [pulse, setPulse] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 600);
    return () => clearInterval(t);
  }, []);

  // Only show toasts for urgent pending appointments that haven't been dismissed locally
  const visible = appointments.filter(
    a => a.isUrgent && a.status === "pending" && !dismissed.has(a._id)
  );

  if (!visible.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm">
      {visible.map(appt => (
        <div
          key={appt._id}
          className={`relative rounded-2xl overflow-hidden shadow-2xl border-2 transition-all duration-500 ${
            pulse ? "border-red-500" : "border-red-400"
          }`}
          style={{ animation: "slideInRight 0.4s ease" }}
        >
          {/* Animated top bar */}
          <div
            className={`h-1.5 w-full transition-colors duration-600 ${pulse ? "bg-red-500" : "bg-orange-400"}`}
          />

          {/* Header */}
          <div
            className={`px-4 py-3 flex items-center gap-3 transition-colors duration-600 ${
              pulse ? "bg-red-600" : "bg-red-700"
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-white animate-bounce shrink-0" />
            <div className="flex-1">
              <p className="text-white font-extrabold text-sm tracking-wide">⚠ CAS URGENT</p>
              <p className="text-red-200 text-xs">Demande de rendez-vous d'urgence</p>
            </div>
            {/* Pulse dots */}
            <div className="flex gap-1 shrink-0">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white transition-opacity duration-300"
                  style={{
                    opacity: pulse
                      ? i === 0 ? 1 : i === 1 ? 0.5 : 0.2
                      : i === 0 ? 0.2 : i === 1 ? 0.5 : 1,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-4 py-3 space-y-2.5">
            {/* Patient */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0">
                {appt.patientName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{appt.patientName}</p>
                {appt.patientPhone && (
                  <a
                    href={`tel:${appt.patientPhone}`}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> {appt.patientPhone}
                  </a>
                )}
              </div>
            </div>

            {/* Date / time */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {appt.appointmentDate} à {appt.appointmentTime}
            </div>

            {/* Description */}
            {appt.patientDescription && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-xs font-semibold text-red-700 mb-0.5">Motif :</p>
                <p className="text-xs text-red-800 line-clamp-3">{appt.patientDescription}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-0.5">
              <button
                onClick={() => onAccept(appt._id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:shadow-md"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Accepter
              </button>
              <button
                onClick={() => onDecline(appt._id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:shadow-md"
              >
                <XCircle className="w-3.5 h-3.5" />
                Refuser
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 pb-0.5">
              Cette alerte restera visible jusqu'à votre réponse
            </p>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default UrgentToast;
