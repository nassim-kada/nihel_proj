"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "fr" : "ar";
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="font-bold border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
    >
      {i18n.language === "ar" ? "FR" : "عربي"}
    </Button>
  );
}
