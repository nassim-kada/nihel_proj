"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Stethoscope, User, Mail, Phone, Calendar, MapPin, ChevronDown, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { WILAYAS, getCommunesByWilaya } from "@/data/algeria-locations";

export default function PatientSignupPage() {
  const router = useRouter();
  const { user, setUser, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [communes, setCommunes] = useState<string[]>([]);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
       router.push(user.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard");
    }
  }, [user, authLoading, router]);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dateOfBirth: "", wilaya: "", commune: "", gender: "",
    password: "", confirmPassword: "", acceptTerms: false,
  });

  const set = (k: keyof typeof form, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    setCommunes(form.wilaya ? getCommunesByWilaya(form.wilaya) : []);
    set("commune", "");
  }, [form.wilaya]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }
    if (!form.acceptTerms) {
      setMessage({ type: "error", text: "Vous devez accepter les conditions d'utilisation." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/register/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName, lastName: form.lastName, email: form.email,
          phone: form.phone, dateOfBirth: form.dateOfBirth, wilaya: form.wilaya,
          commune: form.commune, gender: form.gender, password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage({ type: "error", text: data.error || "Erreur lors de l'inscription." }); return; }
      setUser(data.user);
      setMessage({ type: "success", text: "Compte créé avec succès ! Redirection..." });
      setTimeout(() => router.push("/patient-dashboard"), 1200);
    } catch {
      setMessage({ type: "error", text: "Erreur de connexion au serveur." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-sky-500 rounded-2xl shadow-lg mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Bienvenue !</h1>
          <p className="text-gray-500 mt-1">Ravi de vous voir. Créez votre compte patient.</p>
          <p className="text-sm text-gray-400 mt-1">
            Déjà inscrit ?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg mb-5 text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {message.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Prénom <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required value={form.firstName} onChange={e => set("firstName", e.target.value)}
                    placeholder="Amina" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nom de famille</label>
                <input value={form.lastName} onChange={e => set("lastName", e.target.value)}
                  placeholder="Benali" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">E-mail <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required type="email" value={form.email} onChange={e => set("email", e.target.value)}
                  placeholder="amina@exemple.com" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Numéro de téléphone <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                  placeholder="0555 123 456" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
            </div>

            {/* DOB + Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Date de naissance <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Genre</label>
                <div className="flex gap-3 mt-1">
                  {["Homme", "Femme"].map(g => (
                    <label key={g} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-all ${form.gender === g ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
                      <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={() => set("gender", g)} className="sr-only" />
                      {g}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Wilaya + Commune */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Wilaya <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select required value={form.wilaya} onChange={e => set("wilaya", e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition">
                    <option value="">Sélectionner</option>
                    {WILAYAS.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Commune</label>
                <div className="relative">
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select value={form.commune} onChange={e => set("commune", e.target.value)} disabled={!communes.length}
                    className="w-full px-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white disabled:opacity-50 transition">
                    <option value="">Sélectionner</option>
                    {communes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mot de passe <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input required type={showPassword ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)}
                    placeholder="••••••••" minLength={6} className="w-full pl-3 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Confirmez le mot de passe <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input required type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}
                    placeholder="••••••••" className="w-full pl-3 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                  <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.acceptTerms} onChange={e => set("acceptTerms", e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-blue-600 rounded" />
              <span className="text-xs text-gray-600 leading-relaxed">
                J'accepte nos{" "}
                <Link href="/terms" className="text-blue-600 font-semibold hover:underline">règles et conditions d'utilisation</Link>
              </span>
            </label>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Création du compte...</> : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">Vous êtes un médecin ?{" "}
              <Link href="/signup/doctor" className="text-blue-600 font-semibold hover:underline">Inscription médecin →</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
