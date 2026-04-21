"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stethoscope, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, setUser, loading: authLoading } = useAuth();
  const [role, setRole] = useState<"doctor" | "patient">("patient");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
       router.push(user.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard");
    }
  }, [user, authLoading, router]);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password, role }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg({ type: "error", text: data.error || t("auth.invalid_creds", "Identifiants incorrects.") }); return; }

      setUser(data.user);

      // Legacy keys for backward compat
      if (role === "doctor") {
        localStorage.setItem("doctorId", data.user.id);
        localStorage.setItem("doctorName", data.user.name);
        localStorage.setItem("doctorEmail", data.user.email);
      }

      setMsg({ type: "success", text: t("auth.login_success", "Connexion réussie ! Redirection...") });
      setTimeout(() => router.push(role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"), 900);
    } catch {
      setMsg({ type: "error", text: t("auth.server_error", "Erreur de connexion au serveur.") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md relative">
        <div className="absolute -top-16 right-0">
          <LanguageSwitcher />
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-sky-400 rounded-2xl shadow-lg mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">{t("auth.login", "Connexion")}</h1>
          <p className="text-gray-500 mt-1 text-sm">{t("auth.access_space", "Accédez à votre espace santé")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Role selector */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            {(["patient", "doctor"] as const).map(r => (
              <button key={r} type="button" onClick={() => { setRole(r); setMsg(null); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === r ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {r === "patient" ? `👤 ${t("auth.patient", "Patient")}` : `🩺 ${t("auth.doctor", "Médecin")}`}
              </button>
            ))}
          </div>

          {msg && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium mb-4 ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {msg.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("auth.email", "Adresse E-mail")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder={role === "doctor" ? "docteur@exemple.com" : "patient@exemple.com"}
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("auth.password", "Mot de passe")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required type={showPwd ? "text" : "password"} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("auth.logging_in", "Connexion...")}</> : t("auth.login_btn", "Se connecter")}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 space-y-2 text-center text-sm">
            <p className="text-gray-500">
              {t("auth.no_account", "Pas encore de compte ?")}{" "}
              <Link href={role === "doctor" ? "/signup/doctor" : "/signup/patient"} className="text-blue-600 font-semibold hover:underline">
                {t("auth.register_as", "S'inscrire comme")} {role === "doctor" ? t("auth.doctor", "médecin") : t("auth.patient", "patient")}
              </Link>
            </p>
            <p className="text-xs text-gray-400">
              {role === "patient" ? `${t("auth.doctor", "Médecin")} ?` : `${t("auth.patient", "Patient")} ?`}{" "}
              <button type="button" onClick={() => setRole(role === "doctor" ? "patient" : "doctor")} className="text-gray-500 hover:text-blue-600 font-medium">
                {t("auth.switch", "Basculer")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}