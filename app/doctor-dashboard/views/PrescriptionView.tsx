"use client";
import { FC, useState } from "react";
import { ClipboardEdit, Pill, TestTube2, FileCheck, HeartPulse, FileText } from "lucide-react";

const TYPES = [
  { id: "traitement", label: "Traitement", icon: Pill, items: ["Paracétamol 1g", "Amoxicilline 500mg", "Vitamine C", "Ibuprofène 400mg"] },
  { id: "analyses", label: "Analyses", icon: TestTube2, items: ["NFS", "Glycémie à jeun", "Bilan lipidique", "CRP"] },
  { id: "tests", label: "Tests", icon: FileCheck, items: ["Test Allergique", "Test PCR", "Test de grossesse"] },
  { id: "examens", label: "Examens", icon: HeartPulse, items: ["Radiographie Thoracique", "ECG", "Échographie abdominale", "IRM"] },
];

const PrescriptionView: FC = () => {
  const [active, setActive] = useState("traitement");
  const type = TYPES.find(t => t.id === active)!;
  const TypeIcon = type.icon;
  return (
    <div className="space-y-5 max-w-xl">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><ClipboardEdit className="w-5 h-5 text-blue-600" /> Ordonnances</h2>
      <div className="flex flex-wrap gap-2">
        {TYPES.map(t => { const Icon = t.icon; const active2 = active === t.id;
          return <button key={t.id} onClick={() => setActive(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${active2 ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}><Icon className="w-4 h-4" />{t.label}</button>;
        })}
      </div>
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><TypeIcon className="w-4 h-4 text-blue-600" /> {type.label}</h4>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {type.items.map(item => (
            <label key={item} className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer transition">
              <input type="checkbox" className="w-4 h-4 accent-blue-600" />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
        <textarea rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Instructions supplémentaires..." />
        <button className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-lg font-semibold text-sm shadow transition-all">
          <FileText className="w-4 h-4" /> Imprimer l'ordonnance
        </button>
      </div>
    </div>
  );
};
export default PrescriptionView;
