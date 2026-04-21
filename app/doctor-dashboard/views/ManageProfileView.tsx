"use client";
import { FC, useState, useEffect } from "react";
import { User, Users, Banknote, MapPin, Award, CheckCircle, AlertTriangle, Loader2, Save } from "lucide-react";
import MapPicker from "@/components/map/MapPicker";
import { useTranslation } from "react-i18next";

interface IDoctor {
  _id: string; name: string; specialty?: any; maxPatients?: number; patients?: number;
  fee?: string; experience?: number; location?: string; clinic?: string;
  mapLocation?: { lat: number; lng: number };
}
interface ISpecialty { _id: string; name: string }
interface Props { currentDoctor: IDoctor; updateDoctorInfo: (d: IDoctor) => void; specialties: ISpecialty[] }

const ManageProfileView: FC<Props> = ({ currentDoctor, updateDoctorInfo, specialties }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<{
    maxPatients: string; fee: string; experience: string; location: string;
    mapLocation: { lat: number; lng: number } | null;
  }>({ maxPatients: "", fee: "", experience: "", location: "", mapLocation: null });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success"|"error"; text: string }|null>(null);

  useEffect(() => {
    setForm({
      maxPatients: currentDoctor.maxPatients?.toString() ?? currentDoctor.patients?.toString() ?? "",
      fee: currentDoctor.fee ?? "",
      experience: currentDoctor.experience?.toString() ?? "",
      location: currentDoctor.location ?? currentDoctor.clinic ?? "",
      mapLocation: currentDoctor.mapLocation ?? null,
    });
  }, [currentDoctor]);

  const getSpecialty = () => {
    if (!currentDoctor.specialty) return t("doctor_dashboard.manage_profile.unspecified", "Non spécifiée");
    if (typeof currentDoctor.specialty === "object") return currentDoctor.specialty.name ?? t("doctor_dashboard.manage_profile.unspecified", "Non spécifiée");
    return specialties.find(s => s._id === currentDoctor.specialty)?.name ?? t("doctor_dashboard.manage_profile.unspecified", "Non spécifiée");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      const body: Record<string, unknown> = {};
      if (form.maxPatients) body.maxPatients = parseInt(form.maxPatients);
      if (form.fee) body.fee = form.fee.trim();
      if (form.experience) body.experience = parseInt(form.experience);
      if (form.location) body.location = form.location.trim();
      if (form.mapLocation) body.mapLocation = form.mapLocation;
      const res = await fetch(`/api/doctors/${currentDoctor._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { const d = await res.json(); updateDoctorInfo(d); setMsg({ type: "success", text: t("doctor_dashboard.manage_profile.success", "Profil mis à jour !") }); }
      else { const d = await res.json(); setMsg({ type: "error", text: d.error ?? t("doctor_dashboard.manage_profile.error", "Erreur.") }); }
    } catch { setMsg({ type: "error", text: t("doctor_dashboard.manage_profile.server_error", "Erreur serveur.") }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-bold text-gray-800">{t("doctor_dashboard.manage_profile.title", "Mon Profil Médical")}</h2>
      <div className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border border-blue-200">
        <p className="text-lg font-bold text-gray-800">{t("doctor_dashboard.dr", "Dr.")} {currentDoctor.name}</p>
        <p className="text-sm text-blue-600 font-medium">{getSpecialty()}</p>
      </div>
      {msg && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {msg.text}
        </div>
      )}
      <form onSubmit={handleSave} className="space-y-4">
        {[
          { key: "maxPatients", label: t("doctor_dashboard.manage_profile.max_patients", "Patients max / jour"), icon: Users, placeholder: "50", type: "number" },
          { key: "fee", label: t("doctor_dashboard.manage_profile.fee", "Honoraires"), icon: Banknote, placeholder: "3000 DZD", type: "text" },
          { key: "experience", label: t("doctor_dashboard.manage_profile.experience", "Années d'expérience"), icon: Award, placeholder: "10", type: "number" },
          { key: "location", label: t("doctor_dashboard.manage_profile.location", "Localisation du cabinet"), icon: MapPin, placeholder: "Alger, Centre", type: "text" },
        ].map(f => {
          const Icon = f.icon;
          return (
            <div key={f.key}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Icon className="w-4 h-4 text-blue-500" /> {f.label}
              </label>
              <input type={f.type} value={form[f.key as keyof typeof form] as string}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
            </div>
          );
        })}
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
            <MapPin className="w-4 h-4 text-blue-500" /> {t("doctor_dashboard.manage_profile.map_location", "Position Exacte sur la Carte")}
          </label>
          <p className="text-xs text-gray-500 mb-2">{t("doctor_dashboard.manage_profile.map_desc", "Cliquez sur la carte pour définir ou modifier votre position exacte.")}</p>
          <MapPicker 
            initialPosition={form.mapLocation || undefined} 
            searchQuery={form.location}
            onLocationSelect={(lat, lng) => setForm(p => ({ ...p, mapLocation: { lat, lng } }))} 
          />
        </div>

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-lg font-semibold text-sm shadow transition-all disabled:opacity-60">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("doctor_dashboard.manage_profile.saving", "Sauvegarde...")}</> : <><Save className="w-4 h-4" /> {t("doctor_dashboard.manage_profile.save", "Enregistrer")}</>}
        </button>
      </form>
    </div>
  );
};
export default ManageProfileView;
