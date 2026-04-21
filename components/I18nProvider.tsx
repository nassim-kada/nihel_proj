"use client";

import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Hydration is complete, now safely load the user's preferred language
    const savedLang = localStorage.getItem("i18nextLng") || "fr";
    if (savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }

    // Ensure dir is set according to language on load
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    
    const handleLangChange = (lng: string) => {
      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
      localStorage.setItem("i18nextLng", lng);
    };

    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
