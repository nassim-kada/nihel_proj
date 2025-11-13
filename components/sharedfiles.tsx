import { useState, useEffect, ReactNode } from 'react';
import { FileSliders, Upload, Send, Download, Search, X, Loader2, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface Specialty {
  _id: string;
  name: string;
}

interface Doctor {
  _id: string;
  name: string;
  specialty?: Specialty | string;
}

interface SharedFile {
  _id: string;
  fileName: string;
  fileUrl: string;
  description?: string;
  createdAt: string;
  sender: Doctor | string;
  receiver: Doctor | string;
}

interface SharedFilesViewProps {
  currentDoctorId: string;
}

interface UploadData {
  receiverId: string;
  description: string;
  file: File | null;
}

type Message = {
  type: 'success' | 'error';
  text: string;
} | null;

const Card = ({ children, className = "" }: CardProps) => (
  <div className={`p-6 bg-white rounded-xl shadow-lg border border-blue-100 ${className}`}>
    {children}
  </div>
);

const SharedFilesView = ({ currentDoctorId }: SharedFilesViewProps) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [receivedFiles, setReceivedFiles] = useState<SharedFile[]>([]);
  const [sentFiles, setSentFiles] = useState<SharedFile[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [uploadData, setUploadData] = useState<UploadData>({
    receiverId: '',
    description: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors');
        if (response.ok) {
          const data: Doctor[] = await response.json();
          setDoctors(data.filter(doc => doc._id !== currentDoctorId));
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, [currentDoctorId]);

  const fetchSharedFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sharedfiles');
      if (response.ok) {
        const allFiles: SharedFile[] = await response.json();
        
        const received = allFiles.filter(file => {
          const receiverId = typeof file.receiver === 'object' ? file.receiver._id : file.receiver;
          return receiverId === currentDoctorId;
        });
        const sent = allFiles.filter(file => {
          const senderId = typeof file.sender === 'object' ? file.sender._id : file.sender;
          return senderId === currentDoctorId;
        });
        
        setReceivedFiles(received);
        setSentFiles(sent);
      }
    } catch (error) {
      console.error('Error fetching shared files:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des fichiers' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentDoctorId) {
      fetchSharedFiles();
    }
  }, [currentDoctorId]);

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!uploadData.receiverId || !uploadData.file) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un médecin et un fichier' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Échec du téléchargement du fichier');
      }

      const uploadResult: { result?: { secure_url?: string; url?: string } } = await uploadResponse.json();
      const fileUrl = uploadResult.result?.secure_url || uploadResult.result?.url;
      
      if (!fileUrl) {
        throw new Error('URL du fichier non disponible');
      }

      const sharedFileData = {
        sender: currentDoctorId,
        receiver: uploadData.receiverId,
        fileName: uploadData.file.name,
        fileUrl: fileUrl,
        description: uploadData.description
      };

      const createResponse = await fetch('/api/sharedfiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sharedFileData),
      });
      
      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Échec de la création du partage (${createResponse.status})`);
      }

      const newFile: SharedFile = await createResponse.json();
      
      setSentFiles(prev => [newFile, ...prev]);
      setUploadData({ receiverId: '', description: '', file: null });
      setShowUploadModal(false);
      setMessage({ type: 'success', text: 'Fichier partagé avec succès!' });
      
      fetchSharedFiles();
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur lors du partage du fichier' });
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDoctorName = (doctor: Doctor | string): string => {
    return typeof doctor === 'object' ? doctor.name : 'Inconnu';
  }

  const getDoctorSpecialty = (doctor: Doctor | string): string => {
    if (typeof doctor === 'object' && doctor.specialty) {
      return typeof doctor.specialty === 'object' ? doctor.specialty.name : doctor.specialty;
    }
    return '';
  }

  const currentFiles = activeTab === 'received' ? receivedFiles : sentFiles;
  const filteredFiles = currentFiles.filter(file => {
    const searchLower = searchQuery.toLowerCase();
    const fileName = file.fileName?.toLowerCase() || '';
    const description = file.description?.toLowerCase() || '';
    
    if (activeTab === 'received') {
      const senderName = getDoctorName(file.sender).toLowerCase();
      return fileName.includes(searchLower) || senderName.includes(searchLower) || description.includes(searchLower);
    } else {
      const receiverName = getDoctorName(file.receiver).toLowerCase();
      return fileName.includes(searchLower) || receiverName.includes(searchLower) || description.includes(searchLower);
    }
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border-blue-200">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-lg text-gray-600">Chargement des fichiers...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FileSliders className="w-6 h-6 mr-3 text-blue-600"/>
          Partage de Fichiers
        </h3>
        
        <p className="text-gray-600 mb-6">
          Partagez et recevez des fichiers médicaux avec vos confrères en toute sécurité.
        </p>

        {message && (
          <div className={`mb-4 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2"/> : <AlertTriangle className="w-5 h-5 mr-2"/>}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">Fichiers Reçus</p>
            <p className="text-3xl font-bold text-green-600">{receivedFiles.length}</p>
          </Card>
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm text-gray-600 font-medium">Fichiers Envoyés</p>
            <p className="text-3xl font-bold text-blue-600">{sentFiles.length}</p>
          </Card>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-sky-700 transition-all shadow-md flex items-center justify-center gap-2 mb-6"
        >
          <Upload className="w-5 h-5" />
          Partager un Fichier
        </button>

        <div className="flex gap-2 border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'received'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Fichiers Reçus ({receivedFiles.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'sent'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Fichiers Envoyés ({sentFiles.length})
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom de fichier, médecin ou description..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-4">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <div key={file._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-800">{file.fileName}</h4>
                    </div>
                    
                    {activeTab === 'received' ? (
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">De:</span> Dr. {getDoctorName(file.sender)}
                        {getDoctorSpecialty(file.sender) && ` - ${getDoctorSpecialty(file.sender)}`}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">À:</span> Dr. {getDoctorName(file.receiver)}
                        {getDoctorSpecialty(file.receiver) && ` - ${getDoctorSpecialty(file.receiver)}`}
                      </p>
                    )}
                    
                    {file.description && (
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Description:</span> {file.description}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-400">
                      {formatDate(file.createdAt)}
                    </p>
                  </div>
                  
                  <a
                    href={file.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-md flex items-center gap-2 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center py-8">
              {searchQuery 
                ? "Aucun fichier ne correspond à votre recherche."
                : activeTab === 'received' 
                  ? "Aucun fichier reçu pour le moment."
                  : "Aucun fichier envoyé pour le moment."
              }
            </p>
          )}
        </div>
      </Card>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Partager un Fichier</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadData({ receiverId: '', description: '', file: null });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner un médecin
                </label>
                <select
                  value={uploadData.receiverId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUploadData({ ...uploadData, receiverId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">-- Choisir un médecin --</option>
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} {getDoctorSpecialty(doctor) && `- ${getDoctorSpecialty(doctor)}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fichier
                </label>
                <input
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadData({ ...uploadData, file: e.target.files ? e.target.files[0] : null })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formats acceptés: PDF, DOC, DOCX, JPG, PNG
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnelle)
                </label>
                <textarea
                  value={uploadData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUploadData({ ...uploadData, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ajoutez une description du fichier..."
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-sky-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer le Fichier
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedFilesView;