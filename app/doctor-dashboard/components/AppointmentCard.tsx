"use client";
import { FC, useState } from "react";
import {
  CheckCircle, Clock, XCircle, Stethoscope, Activity, AlertCircle,
  Scissors, FileText, ExternalLink, Image as ImageIcon, Phone, Calendar, Banknote, Trash2
} from "lucide-react";

export interface Appointment {
  _id: string;
  patientName: string;
  patientPhone: string;
  patientDescription?: string;
  appointmentDate: string;
  appointmentTime: string;
  appointementType?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  fee: string;
  fileLink?: string;
  isUrgent?: boolean;
  doctorId: string | { _id: string };
  createdAt?: string;
}

const TYPE_CONFIG: Record<string, { icon: FC<{ className?: string }>; color: string }> = {
  "Consultation":               { icon: Stethoscope, color: "text-blue-600 bg-blue-100" },
  "Consultation de Controle":   { icon: Activity,    color: "text-emerald-600 bg-emerald-100" },
  "Examen":                     { icon: CheckCircle, color: "text-violet-600 bg-violet-100" },
  "Radiologie/Imagerie":        { icon: ImageIcon,   color: "text-indigo-600 bg-indigo-100" },
  "Urgence":                    { icon: AlertCircle, color: "text-red-600 bg-red-100" },
  "Intervention":               { icon: Scissors,    color: "text-orange-600 bg-orange-100" },
};

const STATUS_CONFIG: Record<string, { label: string; pill: string; dot: string }> = {
  pending:   { label: "En attente",  pill: "bg-amber-100 text-amber-700 border-amber-200",   dot: "bg-amber-400" },
  confirmed: { label: "Confirmé",    pill: "bg-green-100 text-green-700 border-green-200",   dot: "bg-green-400" },
  completed: { label: "Terminé",     pill: "bg-sky-100 text-sky-700 border-sky-200",         dot: "bg-sky-400" },
  cancelled: { label: "Annulé",      pill: "bg-red-100 text-red-700 border-red-200",         dot: "bg-red-400" },
};

const TYPES = ["Consultation", "Consultation de Controle", "Examen", "Radiologie/Imagerie", "Urgence", "Intervention"];

interface Props {
  appointment: Appointment;
  onStatusChange: (id: string, status: string) => void;
  onTypeChange: (id: string, type: string) => void;
  onDelete: (id: string) => void;
}

const AppointmentCard: FC<Props> = ({ appointment: a, onStatusChange, onTypeChange, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const type = a.appointementType?.trim() || "Consultation";
  const typeConf = TYPE_CONFIG[type] ?? TYPE_CONFIG["Consultation"];
  const TypeIcon = typeConf.icon;
  const statusConf = STATUS_CONFIG[a.status];

  const initials = a.patientName
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(a._id);
    } else {
      setConfirmDelete(true);
      // Auto-reset confirm state after 3s
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg ${
      a.isUrgent ? "border-red-300 shadow-red-100 shadow-md" : "border-gray-100 shadow-sm hover:border-blue-200"
    }`}>
      {/* Urgent stripe */}
      {a.isUrgent && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-400 rounded-t-2xl" />
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
            a.isUrgent ? "bg-red-500 text-white" : "bg-gradient-to-br from-blue-500 to-sky-400 text-white"
          }`}>
            {initials || "?"}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Row 1: Name + urgent + status + delete */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-bold text-gray-900 text-base truncate">{a.patientName}</h3>
                {a.isUrgent && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse shrink-0">URGENT</span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConf.pill}`}>
                  {statusConf.label}
                </span>
                {/* Delete button */}
                <button
                  onClick={handleDelete}
                  title={confirmDelete ? "Cliquer encore pour confirmer" : "Supprimer ce rendez-vous"}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    confirmDelete
                      ? "bg-red-600 text-white scale-105 animate-pulse"
                      : "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {confirmDelete ? "Confirmer ?" : "Supprimer"}
                </button>
              </div>
            </div>

            {/* Row 2: Date, time, phone, fee */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                {a.appointmentDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                {a.appointmentTime}
              </span>
              <a href={`tel:${a.patientPhone}`} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                {a.patientPhone}
              </a>
              <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                <Banknote className="w-3.5 h-3.5 text-green-500 shrink-0" />
                {a.fee} DA
              </span>
            </div>

            {/* Description */}
            {a.patientDescription && (
              <p className="text-sm text-gray-500 italic bg-gray-50 rounded-lg px-3 py-2 mb-3 border-l-2 border-blue-200">
                "{a.patientDescription}"
              </p>
            )}

            {/* Row 3: Type selector + file + actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left: type badge + file */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${typeConf.color}`}>
                  <TypeIcon className="w-3.5 h-3.5" />
                  <select
                    value={a.appointementType || "Consultation"}
                    onChange={e => onTypeChange(a._id, e.target.value)}
                    className="bg-transparent border-none outline-none cursor-pointer font-semibold text-xs text-gray-900"
                  >
                    {TYPES.map(t => (
                      <option key={t} value={t} className="text-gray-900 bg-white">{t}</option>
                    ))}
                  </select>
                </div>

                {a.fileLink && (
                  <a
                    href={a.fileLink}
                    download
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3 h-3" /> Fichier
                  </a>
                )}
              </div>

              {/* Right: action buttons */}
              <div className="flex items-center gap-2">
                {a.status === "pending" && (
                  <>
                    <button
                      onClick={() => onStatusChange(a._id, "confirmed")}
                      className="px-3.5 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:shadow-md"
                    >
                      ✓ Confirmer
                    </button>
                    <button
                      onClick={() => onStatusChange(a._id, "cancelled")}
                      className="px-3.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:shadow-md"
                    >
                      ✕ Annuler
                    </button>
                  </>
                )}
                {a.status === "confirmed" && (
                  <button
                    onClick={() => onStatusChange(a._id, "completed")}
                    className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:shadow-md"
                  >
                    ✓ Terminer
                  </button>
                )}
                {(a.status === "completed" || a.status === "cancelled") && (
                  <span className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConf.pill} border`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                    {statusConf.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
