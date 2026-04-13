"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Download, Trash2, Loader2, AlertCircle, FolderOpen, File } from "lucide-react";

interface MedicalFile {
  _id: string;
  name: string;
  url: string;
  fileType?: string;
  uploadedAt: string;
}

interface Props { patientId: string }

export default function DossierMedical({ patientId }: Props) {
  const [files, setFiles] = useState<MedicalFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/patients/${patientId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.medicalFiles) setFiles(data.medicalFiles); })
      .finally(() => setLoading(false));
  }, [patientId]);

  const handleUpload = async () => {
    if (!pendingFile || !fileName.trim()) { setError("Veuillez choisir un fichier et lui donner un nom."); return; }
    setUploading(true);
    setError(null);
    try {
      // 1. Upload file to Cloudinary via existing route
      const fd = new FormData();
      fd.append("file", pendingFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) throw new Error("Erreur d'upload.");

      // 2. Save record to patient dossier
      const saveRes = await fetch(`/api/patients/${patientId}/medical-files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fileName.trim(), url: uploadData.url, fileType: pendingFile.type }),
      });
      const saved = await saveRes.json();
      if (!saveRes.ok) throw new Error(saved.error || "Erreur lors de l'enregistrement.");

      setFiles(prev => [...prev, saved]);
      setFileName("");
      setPendingFile(null);
    } catch (err: any) {
      setError(err.message || "Erreur.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    setDeletingId(fileId);
    try {
      const res = await fetch(`/api/patients/${patientId}/medical-files?fileId=${fileId}`, { method: "DELETE" });
      if (res.ok) setFiles(prev => prev.filter(f => f._id !== fileId));
    } finally { setDeletingId(null); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-DZ", { day: "numeric", month: "short", year: "numeric" });

  const isImage = (ft?: string) => ft?.startsWith("image/");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Dossier Médical</h2>
        <p className="text-sm text-gray-500">Stockez et gérez vos documents médicaux</p>
      </div>

      {/* Upload panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2"><Upload className="w-4 h-4 text-blue-500" /> Ajouter un document</h3>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Nom / Label du fichier</label>
          <input value={fileName} onChange={e => setFileName(e.target.value)} placeholder="ex: Résultats analyse sanguine - Mars 2025"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Fichier (PDF ou image)</label>
          <label className={`flex items-center gap-3 px-4 py-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${pendingFile ? "border-sky-400 bg-blue-50" : "border-gray-300 hover:border-sky-400 hover:bg-blue-50"}`}>
            <Upload className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="text-sm">
              {pendingFile ? (
                <><span className="font-medium text-blue-700">{pendingFile.name}</span><span className="text-gray-400"> ({(pendingFile.size / 1024).toFixed(0)} Ko)</span></>
              ) : (
                <span className="text-gray-500">Cliquez ou glissez un fichier ici</span>
              )}
            </div>
            <input type="file" accept=".pdf,image/*" className="sr-only"
              onChange={e => { const f = e.target.files?.[0]; if (f) { setPendingFile(f); if (!fileName) setFileName(f.name.replace(/\.[^.]+$/, "")); } }} />
          </label>
        </div>

        <button onClick={handleUpload} disabled={uploading || !pendingFile}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white rounded-lg font-semibold text-sm shadow-md transition-all disabled:opacity-50">
          {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Upload en cours...</> : <><Upload className="w-4 h-4" /> Ajouter au dossier</>}
        </button>
      </div>

      {/* File list */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-4">
          <FolderOpen className="w-4 h-4 text-blue-500" /> Mes documents ({files.length})
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        ) : files.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun document ajouté pour le moment</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map(f => (
              <div key={f._id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition border border-gray-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isImage(f.fileType) ? "bg-blue-100" : "bg-red-100"}`}>
                  {isImage(f.fileType) ? <File className="w-5 h-5 text-blue-600" /> : <FileText className="w-5 h-5 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{f.name}</p>
                  <p className="text-xs text-gray-400">{formatDate(f.uploadedAt)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a href={f.url} target="_blank" rel="noopener noreferrer"
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition" title="Télécharger">
                    <Download className="w-4 h-4" />
                  </a>
                  <button onClick={() => handleDelete(f._id)} disabled={deletingId === f._id}
                    className="p-2 text-red-400 hover:bg-red-100 rounded-lg transition" title="Supprimer">
                    {deletingId === f._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
