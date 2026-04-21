"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye, EyeOff, Stethoscope, User, Mail, Phone, MapPin, ChevronDown,
  Loader2, CheckCircle, AlertCircle, Plus, Trash2, Upload, Building2, Globe, Clock, Award, Languages
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { WILAYAS, getCommunesByWilaya } from "@/data/algeria-locations";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Diploma { title: string; institution: string; year: string; country: string }
interface ConsultDay { day: string; startTime: string; endTime: string }

const DAYS = ["Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const LANGUAGES_LIST = ["Arabe", "Français", "Anglais", "Tamazight", "Espagnol", "Allemand"];
const SUB_SPECIALTIES = ["Cardiologie pédiatrique", "Chirurgie cardiaque", "Endoscopie", "Échographie", "Médecine du sport", "Médecine d'urgence", "Oncologie", "Neurochirurgie", "Rhumatologie"];

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ current, t }: { current: number, t: any }) {
  const steps = [t("auth.step_personal", "Informations personnelles"), t("auth.step_diploma", "Diplômes & Spécialités"), t("auth.step_clinic", "Détails cabinet")];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow transition-all ${i < current ? "bg-blue-600 text-white" : i === current ? "bg-gradient-to-br from-blue-500 to-sky-400 text-white ring-4 ring-blue-100" : "bg-gray-200 text-gray-500"}`}>
              {i < current ? <CheckCircle className="w-5 h-5" /> : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium hidden sm:block max-w-[90px] text-center ${i === current ? "text-blue-600" : "text-gray-400"}`}>{label}</span>
          </div>
          {i < steps.length - 1 && <div className={`w-16 sm:w-24 h-0.5 mb-4 mx-1 transition-all ${i < current ? "bg-blue-500" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

// ─── Shared Field wrapper ────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition";

// ─── Main page ───────────────────────────────────────────────────────────────
export default function DoctorSignupPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, setUser, loading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [specialties, setSpecialties] = useState<{ _id: string; name: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
       router.push(user.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard");
    }
  }, [user, authLoading, router]);

  // Step 1 state
  const [s1, setS1] = useState({
    type: "Médecin" as "Médecin" | "Clinique",
    hospital: "", firstName: "", lastName: "", phone: "",
    dateOfBirth: "", email: "", wilaya: "", commune: "",
    password: "", confirmPassword: "", gender: "",
  });
  const [communes1, setCommunes1] = useState<string[]>([]);

  // Step 2 state
  const [s2, setS2] = useState({
    specialty: "", subSpecialties: [] as string[], medicalOrderNumber: "",
    experience: "", languages: [] as string[], diplomaFileUrl: "", specialtySearch: "",
  });
  const [diplomas, setDiplomas] = useState<Diploma[]>([{ title: "", institution: "", year: "", country: "Algérie" }]);
  const [uploadingDiploma, setUploadingDiploma] = useState(false);

  // Step 3 state
  const [s3, setS3] = useState({
    clinicName: "", clinicAddress: "", clinicWilaya: "", clinicCommune: "",
    clinicPhone: "", website: "", clinicPhotoUrl: "", acceptTerms: false,
  });
  const [schedule, setSchedule] = useState<ConsultDay[]>([{ day: "Lundi", startTime: "08:00", endTime: "17:00" }]);
  const [communes3, setCommunes3] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => { setCommunes1(s1.wilaya ? getCommunesByWilaya(s1.wilaya) : []); setS1(p => ({ ...p, commune: "" })); }, [s1.wilaya]);
  useEffect(() => { setCommunes3(s3.clinicWilaya ? getCommunesByWilaya(s3.clinicWilaya) : []); setS3(p => ({ ...p, clinicCommune: "" })); }, [s3.clinicWilaya]);

  useEffect(() => {
    fetch("/api/specialities").then(r => r.json()).then(setSpecialties).catch(() => {});
  }, []);

  const filteredSpecialties = specialties.filter(sp =>
    sp.name.toLowerCase().includes(s2.specialtySearch.toLowerCase())
  );

  const toggleMulti = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  // File upload helper using existing /api/upload
  const uploadFile = async (file: File, onDone: (url: string) => void, setUploading: (b: boolean) => void) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) onDone(data.url);
      else setMessage({ type: "error", text: t("auth.err_upload", "Erreur lors de l'upload du fichier.") });
    } catch {
      setMessage({ type: "error", text: t("auth.err_upload", "Erreur upload.") });
    } finally {
      setUploading(false);
    }
  };

  const validateStep = (i: number) => {
    if (i === 0) {
      if (!s1.firstName || !s1.email || !s1.phone || !s1.wilaya || !s1.password) return t("auth.err_fill_required", "Veuillez remplir tous les champs obligatoires.");
      if (s1.password !== s1.confirmPassword) return t("auth.pwd_mismatch", "Les mots de passe ne correspondent pas.");
    }
    if (i === 1) {
      if (!s2.specialty) return t("auth.err_select_specialty", "Veuillez sélectionner une spécialité.");
      if (!s2.medicalOrderNumber) return t("auth.err_medical_order", "Le numéro d'ordre médical est obligatoire.");
    }
    if (i === 2) {
      if (!s3.clinicName || !s3.clinicAddress || !s3.clinicWilaya || !s3.clinicPhone) return t("auth.err_clinic_required", "Veuillez remplir les champs obligatoires de la clinique.");
      if (!s3.acceptTerms) return t("auth.err_accept_terms", "Vous devez accepter les conditions d'utilisation.");
    }
    return null;
  };

  const next = () => {
    const err = validateStep(step);
    if (err) { setMessage({ type: "error", text: err }); return; }
    setMessage(null);
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const err = validateStep(2);
    if (err) { setMessage({ type: "error", text: err }); return; }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/register/doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...s1, ...s2, ...s3,
          diplomas: diplomas.filter(d => d.title),
          consultationSchedule: schedule,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage({ type: "error", text: data.error || "Erreur lors de l'inscription." }); return; }
      setUser(data.user);
      localStorage.setItem("doctorId", data.user.id);
      localStorage.setItem("doctorName", data.user.name);
      localStorage.setItem("doctorEmail", data.user.email);
      setMessage({ type: "success", text: t("auth.success_doctor", "Compte créé avec succès ! Redirection...") });
      setTimeout(() => router.push("/doctor-dashboard"), 1200);
    } catch {
      setMessage({ type: "error", text: t("auth.server_error", "Erreur de connexion au serveur.") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl relative">
        <div className="absolute -top-16 right-0">
          <LanguageSwitcher />
        </div>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-sky-400 rounded-2xl shadow-lg mb-3">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">{t("auth.welcome", "Bienvenue !")}</h1>
          <p className="text-gray-500 mt-1">{t("auth.create_doctor", "Ravi de vous voir. Créez votre espace médecin.")}</p>
          <p className="text-sm text-gray-400 mt-1">
            {t("auth.already_account", "Déjà inscrit ?")}{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">{t("auth.login_btn", "Se connecter")}</Link>
          </p>
        </div>

        <StepBar current={step} t={t} />

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg mb-5 text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {message.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {message.text}
            </div>
          )}

          {/* ── STEP 1 ────────────────────────────────────────────────── */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t("auth.step_personal", "Informations personnelles")}</h2>

              {/* Type toggle */}
              <Field label={t("auth.type", "Type")}>
                <div className="flex gap-2">
                  {[
                    { id: "Médecin", label: t("auth.doctor", "Médecin") },
                    { id: "Clinique", label: t("auth.clinic", "Clinique") }
                  ].map(tType => (
                    <button key={tType.id} type="button" onClick={() => setS1(p => ({ ...p, type: tType.id as "Médecin" | "Clinique" }))}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${s1.type === tType.id ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
                      {tType.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label={t("auth.hospital", "Hôpital / Établissement")}>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={s1.hospital} onChange={e => setS1(p => ({ ...p, hospital: e.target.value }))} placeholder="CHU Mustapha Pacha" className={`${inputCls} pl-9`} />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label={t("auth.first_name", "Prénom")} required>
                  <input required value={s1.firstName} onChange={e => setS1(p => ({ ...p, firstName: e.target.value }))} placeholder="Mohamed" className={inputCls} />
                </Field>
                <Field label={t("auth.last_name", "Nom de famille")}>
                  <input value={s1.lastName} onChange={e => setS1(p => ({ ...p, lastName: e.target.value }))} placeholder="Bensalem" className={inputCls} />
                </Field>
              </div>

              <Field label={t("auth.phone", "Numéro de téléphone")} required>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-100 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">+213</span>
                  <input required type="tel" value={s1.phone} onChange={e => setS1(p => ({ ...p, phone: e.target.value }))} placeholder="555 123 456" className={`${inputCls} flex-1`} />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label={t("auth.dob", "Date de naissance")}>
                  <input type="date" value={s1.dateOfBirth} onChange={e => setS1(p => ({ ...p, dateOfBirth: e.target.value }))} className={inputCls} />
                </Field>
                <Field label={t("auth.gender", "Genre")}>
                  <div className="flex gap-2 mt-0.5">
                    {[
                      { id: "Homme", label: t("auth.male", "Homme") },
                      { id: "Femme", label: t("auth.female", "Femme") }
                    ].map(g => (
                      <label key={g.id} className={`flex-1 flex items-center justify-center py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-all ${s1.gender === g.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
                        <input type="radio" name="gender1" value={g.id} checked={s1.gender === g.id} onChange={() => setS1(p => ({ ...p, gender: g.id }))} className="sr-only" />
                        {g.label}
                      </label>
                    ))}
                  </div>
                </Field>
              </div>

              <Field label={t("auth.email", "E-mail")} required>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required type="email" value={s1.email} onChange={e => setS1(p => ({ ...p, email: e.target.value }))} placeholder="docteur@exemple.com" className={`${inputCls} pl-9`} />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Wilaya" required>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select required value={s1.wilaya} onChange={e => setS1(p => ({ ...p, wilaya: e.target.value }))} className={`${inputCls} pl-9 pr-8 appearance-none`}>
                      <option value="">{t("auth.select", "Sélectionner")}</option>
                      {WILAYAS.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                    </select>
                  </div>
                </Field>
                <Field label={t("auth.commune", "Commune")}>
                  <div className="relative">
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select value={s1.commune} onChange={e => setS1(p => ({ ...p, commune: e.target.value }))} disabled={!communes1.length} className={`${inputCls} pr-8 appearance-none disabled:opacity-50`}>
                      <option value="">{t("auth.select", "Sélectionner")}</option>
                      {communes1.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label={t("auth.password", "Mot de passe")} required>
                  <div className="relative">
                    <input required type={showPassword ? "text" : "password"} value={s1.password} onChange={e => setS1(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" minLength={6} className={`${inputCls} pr-9`} />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
                <Field label={t("auth.confirm_password", "Confirmez le mot de passe")} required>
                  <div className="relative">
                    <input required type={showConfirm ? "text" : "password"} value={s1.confirmPassword} onChange={e => setS1(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="••••••••" className={`${inputCls} pr-9`} />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
              </div>
            </div>
          )}

          {/* ── STEP 2 ────────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t("auth.step_diploma", "Diplômes & Spécialités")}</h2>

              {/* Specialty search */}
              <Field label={t("auth.main_specialty", "Spécialité principale")} required>
                <input value={s2.specialtySearch} onChange={e => setS2(p => ({ ...p, specialtySearch: e.target.value }))}
                  placeholder={t("auth.search_specialty", "Rechercher une spécialité...") as string} className={`${inputCls} mb-2`} />
                <div className="border border-gray-200 rounded-lg max-h-36 overflow-y-auto">
                  {filteredSpecialties.length === 0 ? (
                    <p className="text-sm text-gray-400 p-3">{t("auth.no_specialty_found", "Aucune spécialité trouvée")}</p>
                  ) : filteredSpecialties.map(sp => (
                    <button key={sp._id} type="button" onClick={() => setS2(p => ({ ...p, specialty: sp._id, specialtySearch: sp.name }))}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition ${s2.specialty === sp._id ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"}`}>
                      {sp.name}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Sub-specialties */}
              <Field label={t("auth.sub_specialty", "Sous-spécialités")}>
                <div className="flex flex-wrap gap-2">
                  {SUB_SPECIALTIES.map(ss => (
                    <button key={ss} type="button" onClick={() => setS2(p => ({ ...p, subSpecialties: toggleMulti(p.subSpecialties, ss) }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${s2.subSpecialties.includes(ss) ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-600 hover:border-blue-300"}`}>
                      {ss}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Diplomas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600">{t("auth.diplomas", "Diplôme(s) obtenus")} <span className="text-red-500">*</span></label>
                  <button type="button" onClick={() => setDiplomas(p => [...p, { title: "", institution: "", year: "", country: "Algérie" }])}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold">
                    <Plus className="w-3.5 h-3.5" /> {t("auth.add", "Ajouter")}
                  </button>
                </div>
                {diplomas.map((d, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input value={d.title} onChange={e => setDiplomas(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                        placeholder={t("auth.diploma_title", "Titre du diplôme") as string} className={inputCls} />
                      <input value={d.institution} onChange={e => setDiplomas(prev => prev.map((x, j) => j === i ? { ...x, institution: e.target.value } : x))}
                        placeholder={t("auth.institution", "Établissement") as string} className={inputCls} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input value={d.year} onChange={e => setDiplomas(prev => prev.map((x, j) => j === i ? { ...x, year: e.target.value } : x))}
                        placeholder={t("auth.year", "Année") as string} className={inputCls} />
                      <input value={d.country} onChange={e => setDiplomas(prev => prev.map((x, j) => j === i ? { ...x, country: e.target.value } : x))}
                        placeholder={t("auth.country", "Pays") as string} className={`${inputCls} col-span-2`} />
                    </div>
                    {diplomas.length > 1 && (
                      <button type="button" onClick={() => setDiplomas(prev => prev.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> {t("auth.delete", "Supprimer")}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label={t("auth.medical_order", "Numéro d'ordre médical")} required>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input required value={s2.medicalOrderNumber} onChange={e => setS2(p => ({ ...p, medicalOrderNumber: e.target.value }))} placeholder="ex: 12345" className={`${inputCls} pl-9`} />
                  </div>
                </Field>
                <Field label={t("auth.experience", "Années d'expérience")} required>
                  <input type="number" min="0" value={s2.experience} onChange={e => setS2(p => ({ ...p, experience: e.target.value }))} placeholder="ex: 10" className={inputCls} />
                </Field>
              </div>

              {/* Languages */}
              <Field label={t("auth.languages", "Langues parlées")}>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES_LIST.map(lang => (
                    <button key={lang} type="button" onClick={() => setS2(p => ({ ...p, languages: toggleMulti(p.languages, lang) }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${s2.languages.includes(lang) ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-600 hover:border-blue-300"}`}>
                      {lang}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Diploma upload */}
              <Field label={t("auth.upload_diploma", "Upload scan du diplôme / certificat")}>
                <label className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${uploadingDiploma ? "border-blue-300 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}>
                  {uploadingDiploma ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Upload className="w-5 h-5 text-gray-400" />}
                  <span className="text-sm text-gray-600">{s2.diplomaFileUrl ? `✓ ${t("auth.file_uploaded", "Fichier uploadé")}` : t("auth.click_upload", "Cliquez pour uploader")}</span>
                  <input type="file" accept=".pdf,image/*" className="sr-only"
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f, url => setS2(p => ({ ...p, diplomaFileUrl: url })), setUploadingDiploma); }} />
                </label>
              </Field>
            </div>
          )}

          {/* ── STEP 3 ────────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t("auth.step_clinic", "Détails de la clinique / cabinet")}</h2>

              <Field label={t("auth.clinic_name", "Nom de la clinique / cabinet")} required>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required value={s3.clinicName} onChange={e => setS3(p => ({ ...p, clinicName: e.target.value }))} placeholder="Cabinet Médical Bensalem" className={`${inputCls} pl-9`} />
                </div>
              </Field>

              <Field label={t("auth.clinic_address", "Adresse complète")} required>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required value={s3.clinicAddress} onChange={e => setS3(p => ({ ...p, clinicAddress: e.target.value }))} placeholder="12 Rue Didouche Mourad" className={`${inputCls} pl-9`} />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label={t("auth.wilaya", "Wilaya")} required>
                  <div className="relative">
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select required value={s3.clinicWilaya} onChange={e => setS3(p => ({ ...p, clinicWilaya: e.target.value }))} className={`${inputCls} pr-8 appearance-none`}>
                      <option value="">{t("auth.select", "Sélectionner")}</option>
                      {WILAYAS.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                    </select>
                  </div>
                </Field>
                <Field label={t("auth.commune", "Commune")}>
                  <div className="relative">
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select value={s3.clinicCommune} onChange={e => setS3(p => ({ ...p, clinicCommune: e.target.value }))} disabled={!communes3.length} className={`${inputCls} pr-8 appearance-none disabled:opacity-50`}>
                      <option value="">{t("auth.select", "Sélectionner")}</option>
                      {communes3.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </Field>
              </div>

              <Field label={t("auth.clinic_phone", "Numéro de téléphone de la clinique")} required>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required type="tel" value={s3.clinicPhone} onChange={e => setS3(p => ({ ...p, clinicPhone: e.target.value }))} placeholder="021 ..." className={`${inputCls} pl-9`} />
                </div>
              </Field>

              <Field label={t("auth.website", "Site web (optionnel)")}>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="url" value={s3.website} onChange={e => setS3(p => ({ ...p, website: e.target.value }))} placeholder="https://www.docbensalem.dz" className={`${inputCls} pl-9`} />
                </div>
              </Field>

              {/* Schedule */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t("auth.schedule", "Horaires de consultation")}</label>
                  <button type="button" onClick={() => setSchedule(p => [...p, { day: "Lundi", startTime: "08:00", endTime: "17:00" }])}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> {t("auth.add", "Ajouter")}
                  </button>
                </div>
                {schedule.map((sc, i) => (
                  <div key={i} className="flex gap-2 items-center mb-2">
                    <select value={sc.day} onChange={e => setSchedule(prev => prev.map((x, j) => j === i ? { ...x, day: e.target.value } : x))}
                      className={`${inputCls} flex-1`}>
                      {DAYS.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <input type="time" value={sc.startTime} onChange={e => setSchedule(prev => prev.map((x, j) => j === i ? { ...x, startTime: e.target.value } : x))}
                      className={`${inputCls} w-28`} />
                    <span className="text-gray-400 text-sm">→</span>
                    <input type="time" value={sc.endTime} onChange={e => setSchedule(prev => prev.map((x, j) => j === i ? { ...x, endTime: e.target.value } : x))}
                      className={`${inputCls} w-28`} />
                    {schedule.length > 1 && (
                      <button type="button" onClick={() => setSchedule(prev => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Clinic photo */}
              <Field label={t("auth.clinic_photo", "Photo de la clinique (optionnel)")}>
                <label className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${uploadingPhoto ? "border-blue-300 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}>
                  {uploadingPhoto ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Upload className="w-5 h-5 text-gray-400" />}
                  <span className="text-sm text-gray-600">{s3.clinicPhotoUrl ? `✓ ${t("auth.photo_uploaded", "Photo uploadée")}` : t("auth.click_upload", "Cliquez pour uploader")}</span>
                  <input type="file" accept="image/*" className="sr-only"
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f, url => setS3(p => ({ ...p, clinicPhotoUrl: url })), setUploadingPhoto); }} />
                </label>
              </Field>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={s3.acceptTerms} onChange={e => setS3(p => ({ ...p, acceptTerms: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-blue-600 rounded" />
                <span className="text-xs text-gray-600 leading-relaxed">
                  {t("auth.agree_terms", "J'accepte nos")}{" "}
                  <Link href="/terms" className="text-blue-600 font-semibold hover:underline">règles et conditions d'utilisation</Link>
                </span>
              </label>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(s => s - 1)} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all">
                ← {t("auth.back", "Retour")}
              </button>
            ) : (
              <Link href="/login" className="text-sm text-gray-400 hover:text-gray-600">{t("auth.already_account_link", "Déjà un compte")}</Link>
            )}

            {step < 2 ? (
              <button type="button" onClick={next}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white rounded-lg text-sm font-semibold shadow-md transition-all">
                {t("auth.next", "Suivant")} →
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white rounded-lg text-sm font-semibold shadow-md transition-all disabled:opacity-60 flex items-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("auth.creating", "Création...")}</> : `${t("auth.create_account_btn", "Créer mon compte")} →`}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          {t("auth.are_you_patient", "Vous êtes un patient ?")}{" "}
          <Link href="/signup/patient" className="text-teal-600 font-semibold hover:underline">{t("auth.register_patient", "Inscription patient")}</Link>
        </p>
      </div>
    </main>
  );
}
