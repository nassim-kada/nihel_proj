"use client";

import { FC, useState } from "react";
import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  navItems: NavItem[];
  activeView: string;
  onNav: (id: string) => void;
  doctorName: string;
  doctorSpecialty: string;
  onLogout: () => void;
}

const Sidebar: FC<SidebarProps> = ({ navItems, activeView, onNav, doctorName, doctorSpecialty, onLogout }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const LogoutIcon = navItems[0]?.icon; // placeholder

  return (
    <aside className={`relative flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300 h-full ${collapsed ? "w-16" : "w-60"}`}>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-20 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-all">
        {collapsed ? <ChevronRight className="w-3 h-3 text-gray-500" /> : <ChevronLeft className="w-3 h-3 text-gray-500" />}
      </button>

      {/* Brand */}
      <Link href="/" className={`flex items-center gap-2.5 px-4 py-5 border-b border-gray-100 overflow-hidden hover:bg-gray-50 transition-colors`}>
        <div className="w-9 h-9 shrink-0 bg-gradient-to-br from-blue-600 to-sky-400 rounded-xl flex items-center justify-center shadow-md">
          <span className="text-white font-black text-sm">M</span>
        </div>
        {!collapsed && (
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent whitespace-nowrap">Medcal</span>
        )}
      </Link>

      {/* Doctor info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
              {doctorName?.charAt(0)?.toUpperCase() ?? "D"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Dr. {doctorName}</p>
              <p className="text-xs text-blue-600 font-medium truncate">{t(`specialties.${doctorSpecialty}`, { defaultValue: doctorSpecialty }) as string}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto min-h-0">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)} title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}>
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{t(`nav.${item.id}`, item.label)}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout & Lang — always pinned at bottom */}
      <div className="shrink-0 p-2 border-t border-gray-100 bg-white flex flex-col gap-2">
        {!collapsed && (
          <div className="flex justify-center w-full pb-2 border-b border-gray-50">
            <LanguageSwitcher />
          </div>
        )}
        <button onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all`}>
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {!collapsed && <span>{t("nav.logout", "Déconnexion")}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
