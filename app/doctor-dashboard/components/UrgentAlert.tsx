"use client";
import { FC, useEffect, useState } from "react";
import { AlertTriangle, Phone, Clock, ShieldCheck, X } from "lucide-react";
import { Appointment } from "./AppointmentCard";

interface Props {
  appointment: Appointment;
  onAcknowledge: (id: string) => void;
}

const UrgentAlert: FC<Props> = ({ appointment, onAcknowledge }) => {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 700);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Red overlay */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${pulse ? "bg-red-600/30" : "bg-red-800/30"}`} />

      {/* Alert card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border-4 border-red-500 overflow-hidden">
        {/* Red header */}
        <div className={`px-6 py-4 flex items-center gap-3 transition-colors duration-700 ${pulse ? "bg-red-500" : "bg-red-600"}`}>
          <AlertTriangle className="w-7 h-7 text-white animate-bounce" />
          <div className="flex-1">
            <p className="text-white font-extrabold text-lg tracking-wide">⚠ CAS URGENT</p>
            <p className="text-red-100 text-sm">Action immédiate requise</p>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <span key={i} className={`w-2 h-2 rounded-full bg-white transition-opacity duration-300`}
                style={{ opacity: pulse ? (i === 0 ? 1 : i === 1 ? 0.5 : 0.2) : (i === 0 ? 0.2 : i === 1 ? 0.5 : 1) }} />
            ))}
          </div>
        </div>

        {/* Patient info */}
        <div className="px-6 py-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">Patient :</span>
            <span className="text-lg font-extrabold text-gray-900">{appointment.patientName}</span>
          </div>

          {appointment.patientDescription && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-semibold text-red-700 mb-1">Motif :</p>
              <p className="text-sm text-red-800">{appointment.patientDescription}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <a href={`tel:${appointment.patientPhone}`} className="text-blue-600 font-semibold text-sm hover:underline">
              {appointment.patientPhone}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {appointment.appointmentDate} à {appointment.appointmentTime}
            </span>
          </div>
        </div>

        {/* Acknowledge button */}
        <div className="px-6 pb-5">
          <button onClick={() => onAcknowledge(appointment._id)}
            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Pris en charge — Confirmer
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">Cette alerte ne peut pas être fermée avant confirmation</p>
        </div>
      </div>
    </div>
  );
};

export default UrgentAlert;
