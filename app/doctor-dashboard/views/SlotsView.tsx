"use client";
import { FC, useEffect, useState } from "react";
import { PlusSquare, Clock, Trash2, Loader2, CheckCircle } from "lucide-react";

interface ISlot { _id: string; date: string; times: string[] }
const SlotsView: FC<{ currentDoctorId: string }> = ({ currentDoctorId }) => {
  const [slots, setSlots] = useState<ISlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(""); const [startTime, setStartTime] = useState(""); const [endTime, setEndTime] = useState("");

  useEffect(() => {
    fetch(`/api/doctors/${currentDoctorId}/slots`).then(r => r.ok ? r.json() : []).then(setSlots).finally(() => setLoading(false));
  }, [currentDoctorId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) return;
    const res = await fetch(`/api/doctors/${currentDoctorId}/slots`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date, startTime, endTime }) });
    if (res.ok) { const s = await res.json(); setSlots(p => [...p, s]); setDate(""); setStartTime(""); setEndTime(""); }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/doctors/${currentDoctorId}/slots/${id}`, { method: "DELETE" });
    if (res.ok) setSlots(p => p.filter(s => s._id !== id));
  };

  if (loading) return <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-bold text-gray-800">Mes Disponibilités</h2>
      <form onSubmit={handleAdd} className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Date", type: "date", value: date, set: setDate },
            { label: "Début", type: "time", value: startTime, set: setStartTime },
            { label: "Fin", type: "time", value: endTime, set: setEndTime },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
              <input required type={f.type} value={f.value} onChange={e => f.set(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          ))}
        </div>
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-lg font-semibold text-sm shadow transition-all">
          <PlusSquare className="w-4 h-4" /> Ajouter
        </button>
      </form>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-600">Plages configurées ({slots.length})</p>
        {slots.length === 0 ? (
          <p className="text-sm text-gray-400 italic py-4 text-center">Aucune plage configurée.</p>
        ) : slots.map(s => (
          <div key={s._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p className="font-semibold text-sm text-gray-800">{s.date}</p>
              <p className="text-xs text-gray-500">{s.times[0]} → {s.times[s.times.length - 1]} · {s.times.length} créneaux</p>
            </div>
            <button onClick={() => handleDelete(s._id)} className="p-2 text-red-400 hover:bg-red-100 rounded-lg transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SlotsView;
