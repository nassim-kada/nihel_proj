"use client";
import { FC, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: number | string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

interface Props { stats: StatItem[] }

const StatsWidget: FC<Props> = ({ stats }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map(s => {
      const Icon = s.icon;
      return (
        <div key={s.label} className={`p-5 rounded-xl border ${s.bgClass} flex items-center justify-between`}>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${s.colorClass}`}>{s.value}</p>
          </div>
          <Icon className={`w-8 h-8 ${s.colorClass} opacity-60`} />
        </div>
      );
    })}
  </div>
);

export default StatsWidget;
export type { StatItem };
