"use client";
import { FC, useState, useMemo } from "react";
import { Search, X, Calendar, Loader2, ClipboardList } from "lucide-react";
import AppointmentCard, { Appointment } from "./AppointmentCard";
import { useTranslation } from "react-i18next";

interface Props {
  appointments: Appointment[];
  loading: boolean;
  onStatusChange: (id: string, status: string) => void;
  onTypeChange: (id: string, type: string) => void;
  onDelete: (id: string) => void;
}

type Tab = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const TABS: { key: Tab; label: string; activeColor: string; dot: string }[] = [
  { key: "all",       label: "Tous",       activeColor: "bg-blue-600 text-white shadow-blue-200",   dot: "bg-white" },
  { key: "pending",   label: "En attente", activeColor: "bg-amber-500 text-white shadow-amber-200", dot: "bg-white" },
  { key: "confirmed", label: "Confirmés",  activeColor: "bg-green-500 text-white shadow-green-200", dot: "bg-white" },
  { key: "completed", label: "Terminés",   activeColor: "bg-sky-500 text-white shadow-sky-200",     dot: "bg-white" },
  { key: "cancelled", label: "Annulés",    activeColor: "bg-red-500 text-white shadow-red-200",     dot: "bg-white" },
];

const AppointmentList: FC<Props> = ({ appointments, loading, onStatusChange, onTypeChange, onDelete }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const counts = useMemo<Record<string, number>>(() => {
    const c: Record<string, number> = { all: appointments.length };
    for (const a of appointments) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [appointments]);

  const filtered = useMemo(() => {
    return appointments
      .filter(a => activeTab === "all" || a.status === activeTab)
      .filter(a => !search || a.patientName.toLowerCase().includes(search.toLowerCase()))
      .filter(a => !dateFilter || a.appointmentDate === dateFilter)
      .sort((a, b) => {
        // Urgent pending always first
        if (a.isUrgent && a.status === "pending") return -1;
        if (b.isUrgent && b.status === "pending") return 1;
        // Most recent first (descending by date+time)
        return (
          new Date(b.appointmentDate + "T" + b.appointmentTime).getTime() -
          new Date(a.appointmentDate + "T" + a.appointmentTime).getTime()
        );
      });
  }, [appointments, activeTab, search, dateFilter]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <span className="text-sm text-gray-400">{t("appointments.loading_appointments", "Chargement des rendez-vous...")}</span>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-sky-400 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 leading-tight">{t("nav.appointments", "Rendez-vous")}</h2>
            <p className="text-xs text-gray-400">{appointments.length} {t("appointments.total", "au total")}</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(tab => {
          const count = counts[tab.key] ?? 0;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${
                active
                  ? `${tab.activeColor} shadow-md scale-105`
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {t(`appointments.${tab.key}`, tab.label)}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                active ? "bg-white/25" : "bg-gray-100 text-gray-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + date filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("appointments.search_patient", "Rechercher par nom de patient...")}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="relative sm:w-52">
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          />
          {dateFilter && (
            <button onClick={() => setDateFilter("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {(search || dateFilter) && (
        <p className="text-xs text-gray-400">
          {filtered.length} {t("appointments.results", "résultats pour votre recherche")}
        </p>
      )}

      {/* Card list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 opacity-40" />
          </div>
          <p className="font-semibold text-gray-500">{t("appointments.no_appointments", "Aucun rendez-vous trouvé")}</p>
          <p className="text-sm mt-1">
            {search || dateFilter ? t("appointments.no_results_filters", "Aucun résultat pour ces filtres") : t("appointments.no_results_tab", "Aucun rendez-vous pour cette catégorie")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <AppointmentCard
              key={a._id}
              appointment={a}
              onStatusChange={onStatusChange}
              onTypeChange={onTypeChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
