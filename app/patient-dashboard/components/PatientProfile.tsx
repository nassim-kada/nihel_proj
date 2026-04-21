"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, MapPin, Camera, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { WILAYAS, getCommunesByWilaya } from "@/data/algeria-locations";
import { useTranslation } from "react-i18next";

interface Patient {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  wilaya: string;
  commune?: string;
  gender?: string;
  profilePhotoUrl?: string;
}

interface Props { patientId: string }

export default function PatientProfile({ patientId }: Props) {
  const { t } = useTranslation();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [communes, setCommunes] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/patients/${patientId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setPatient(data); })
      .finally(() => setLoading(false));
  }, [patientId]);

  useEffect(() => {
    if (patient?.wilaya) setCommunes(getCommunesByWilaya(patient.wilaya));
  }, [patient?.wilaya]);

  const handlePhotoUpload = async (file: File) => {
    setUploadingPhoto(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) setPatient(p => p ? { ...p, profilePhotoUrl: data.url } : p);
    } finally { setUploadingPhoto(false); }
  };

  const handleSave = async () => {
    if (!patient) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: patient.firstName, lastName: patient.lastName,
          phone: patient.phone, wilaya: patient.wilaya, commune: patient.commune,
          gender: patient.gender, dateOfBirth: patient.dateOfBirth,
          profilePhotoUrl: patient.profilePhotoUrl,
        }),
      });
      if (res.ok) setMessage({ type: "success", text: t("profile.success", "Profil mis à jour avec succès !") });
      else setMessage({ type: "error", text: t("profile.error", "Erreur lors de la mise à jour.") });
    } catch { setMessage({ type: "error", text: t("profile.server_error", "Erreur serveur.") }); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  if (!patient) return (
    <div className="text-center text-gray-400 py-16">{t("profile.load_error", "Impossible de charger le profil.")}</div>
  );

  const set = (k: keyof Patient, v: string) => setPatient(p => p ? { ...p, [k]: v } : p);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{t("profile.title", "Mon Profil")}</h2>
        <p className="text-sm text-gray-500">{t("profile.desc", "Gérez vos informations personnelles")}</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Photo */}
      <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl border border-blue-100">
        <div className="relative w-20 h-20">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-blue-400 flex items-center justify-center overflow-hidden">
            {patient.profilePhotoUrl ? (
              <img src={patient.profilePhotoUrl} alt="Photo" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all">
            {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Camera className="w-3.5 h-3.5 text-white" />}
            <input type="file" accept="image/*" className="sr-only" disabled={uploadingPhoto}
              onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }} />
          </label>
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">{patient.firstName} {patient.lastName}</p>
          <p className="text-sm text-gray-500">{patient.email}</p>
          <p className="text-xs text-blue-600 font-medium mt-0.5">{t("profile.patient_label", "Patient")}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("profile.first_name", "Prénom")}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={patient.firstName} onChange={e => set("firstName", e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("profile.last_name", "Nom de famille")}</label>
            <input value={patient.lastName || ""} onChange={e => set("lastName", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("profile.email", "E-mail")}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={patient.email} disabled className="w-full pl-9 pr-3 py-2.5 border border-gray-100 bg-gray-50 rounded-lg text-sm text-gray-500 cursor-not-allowed" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("profile.phone", "Numéro de téléphone")}</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="tel" value={patient.phone} onChange={e => set("phone", e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("profile.dob", "Date de naissance")}</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="date" value={patient.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("profile.gender", "Genre")}</label>
            <div className="flex gap-2">
              {[
                { val: "Homme", label: t("profile.male", "Homme") },
                { val: "Femme", label: t("profile.female", "Femme") }
              ].map(g => (
                <label key={g.val} className={`flex-1 flex items-center justify-center py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-all ${patient.gender === g.val ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-200"}`}>
                  <input type="radio" name="pgender" value={g.val} checked={patient.gender === g.val} onChange={() => set("gender", g.val)} className="sr-only" />
                  {g.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("profile.wilaya", "Wilaya")}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select value={patient.wilaya} onChange={e => set("wilaya", e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 appearance-none bg-white transition">
                {WILAYAS.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("profile.commune", "Commune")}</label>
            <select value={patient.commune || ""} onChange={e => set("commune", e.target.value)} disabled={!communes.length}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 appearance-none bg-white disabled:opacity-50 transition">
              <option value="">{t("profile.select", "Sélectionner")}</option>
              {communes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white rounded-lg font-semibold text-sm shadow-md transition-all disabled:opacity-60">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("profile.saving", "Sauvegarde...")}</> : <><Save className="w-4 h-4" /> {t("profile.save_changes", "Enregistrer les modifications")}</>}
        </button>
      </div>
    </div>
  );
}
