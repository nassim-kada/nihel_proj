"use client";
import { FC } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Appointment } from "../components/AppointmentCard";
import { useTranslation } from "react-i18next";

const StatisticsView: FC<{ appointments: Appointment[] }> = ({ appointments }) => {
  const { t } = useTranslation();
  const confirmed = appointments.filter(a => a.status === "confirmed").length;
  const cancelled = appointments.filter(a => a.status === "cancelled").length;
  const completed = appointments.filter(a => a.status === "completed").length;

  const MONTH_DATA = [
    { month: t("doctor_dashboard.statistics.months.jan", "Jan"), confirmes: 45, annules: 8, enAttente: 12 },
    { month: t("doctor_dashboard.statistics.months.feb", "Fév"), confirmes: 52, annules: 6, enAttente: 15 },
    { month: t("doctor_dashboard.statistics.months.mar", "Mar"), confirmes: 61, annules: 10, enAttente: 18 },
    { month: t("doctor_dashboard.statistics.months.apr", "Avr"), confirmes: 48, annules: 7, enAttente: 14 },
    { month: t("doctor_dashboard.statistics.months.may", "Mai"), confirmes: 70, annules: 5, enAttente: 20 },
    { month: t("doctor_dashboard.statistics.months.jun", "Jun"), confirmes: 65, annules: 9, enAttente: 16 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">{t("doctor_dashboard.statistics.title", "Statistiques")}</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("doctor_dashboard.statistics.patients_30d", "Patients (30j)"), value: appointments.length + 100, color: "text-green-600", bg: "bg-green-50" },
          { label: t("doctor_dashboard.statistics.completion_rate", "Taux de complétion"), value: appointments.length ? `${Math.round((completed / appointments.length) * 100)}%` : "—", color: "text-blue-600", bg: "bg-blue-50" },
          { label: t("doctor_dashboard.statistics.revenue", "Revenus simulés"), value: `${(confirmed + completed) * 3000} DZD`, color: "text-purple-600", bg: "bg-purple-50" },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-xl border ${s.bg}`}>
            <p className="text-xs font-semibold text-gray-500">{s.label}</p>
            <p className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="h-72">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">{t("doctor_dashboard.statistics.activity", "Activité des rendez-vous (exemple)")}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MONTH_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
            <Legend iconType="rect" wrapperStyle={{ paddingTop: 16 }} />
            <Bar dataKey="confirmes" fill="#3b82f6" name={t("doctor_dashboard.statistics.confirmed", "Confirmés")} radius={[4, 4, 0, 0]} />
            <Bar dataKey="annules" fill="#ef4444" name={t("doctor_dashboard.statistics.cancelled", "Annulés")} radius={[4, 4, 0, 0]} />
            <Bar dataKey="enAttente" fill="#f59e0b" name={t("doctor_dashboard.statistics.pending", "En Attente")} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default StatisticsView;
