// page.tsx - Complete Doctor Dashboard with Profile Management

"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { 
  Calendar, Clock, CheckCircle, PlusSquare, Trash2, Loader2, AlertTriangle, 
  LogOut, DollarSign, Filter, X, Stethoscope, Activity, Image as ImageIcon, 
  AlertCircle, Scissors, User, Save, MapPin, Users, Award, FileText, ExternalLink 
} from "lucide-react"

const Image = ImageIcon;

// Reusable Button Style
const NavButton = ({ label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 text-left ${
      isActive 
        ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg font-semibold' 
        : 'text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-600'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    {label}
  </button>
);

// Reusable Card Style
const Card = ({ children, className = "" }) => (
  <div className={`p-6 bg-white rounded-xl shadow-lg border border-blue-100 ${className}`}>
    {children}
  </div>
);

// Configuration des types de rendez-vous
const APPOINTMENT_TYPES = [
  { value: 'Consultation', label: 'Consultation', icon: Stethoscope, color: 'blue', textBgClass: 'text-blue-700 bg-blue-100', activeClass: 'bg-blue-500 text-white' },
  { value: 'Consultation de Controle ', label: 'Consultation de Contrôle', icon: Activity, color: 'green', textBgClass: 'text-green-700 bg-green-100', activeClass: 'bg-green-500 text-white' },
  { value: 'Examen', label: 'Examen', icon: CheckCircle, color: 'purple', textBgClass: 'text-purple-700 bg-purple-100', activeClass: 'bg-purple-500 text-white' },
  { value: 'Radiologie/Imagerie', label: 'Radiologie/Imagerie', icon: Image, color: 'indigo', textBgClass: 'text-indigo-700 bg-indigo-100', activeClass: 'bg-indigo-500 text-white' },
  { value: 'Urgence', label: 'Urgence', icon: AlertCircle, color: 'red', textBgClass: 'text-red-700 bg-red-100', activeClass: 'bg-red-500 text-white' },
  { value: 'Intervention', label: 'Intervention', icon: Scissors, color: 'orange', textBgClass: 'text-orange-700 bg-orange-100', activeClass: 'bg-orange-500 text-white' },
];

// Configuration des statuts
const APPOINTMENT_STATUSES = [
  { value: 'all', label: 'Tous', color: 'gray', textBgClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200', activeClass: 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md' },
  { value: 'pending', label: 'En Attente', color: 'yellow', textBgClass: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100', activeClass: 'bg-yellow-500 text-white shadow-md' },
  { value: 'confirmed', label: 'Confirmés', color: 'green', textBgClass: 'bg-green-50 text-green-700 hover:bg-green-100', activeClass: 'bg-green-500 text-white shadow-md' },
  { value: 'completed', label: 'Terminés', color: 'blue', textBgClass: 'bg-blue-50 text-blue-700 hover:bg-blue-100', activeClass: 'bg-blue-500 text-white shadow-md' },
  { value: 'cancelled', label: 'Annulés', color: 'red', textBgClass: 'bg-red-50 text-red-700 hover:bg-red-100', activeClass: 'bg-red-500 text-white shadow-md' },
];

const getTypeConfig = (type) => {
  return APPOINTMENT_TYPES.find(t => t.value.trim() === type?.trim()) || {
    value: type,
    label: type || 'Consultation',
    icon: Stethoscope,
    color: 'blue',
    textBgClass: 'text-blue-700 bg-blue-100',
    activeClass: 'bg-blue-500 text-white'
  };
};

// --- VIEW 1: Gestion des Rendez-vous ---
const GestionRendezVous = ({ currentDoctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allBookings = await response.json();
      
      const doctorAppointments = allBookings.filter(booking => {
        const bookingDoctorId = booking.doctorId?._id || booking.doctorId;
        return bookingDoctorId?.toString() === currentDoctorId;
      });
      
      setAppointments(doctorAppointments);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };
    
  useEffect(() => {
    if (currentDoctorId) {
      fetchAppointments();
    }
  }, [currentDoctorId]);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setAppointments(prev => prev.map(a => a._id === id ? updatedBooking : a));
      } else {
        throw new Error('Failed to update appointment status');
      }
    } catch (err) {
      console.error("Error updating appointment status:", err);
      alert("Erreur lors de la mise à jour du statut du rendez-vous");
    }
  };

  const handleTypeChange = async (id, appointmentType) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointementType: appointmentType }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setAppointments(prev => prev.map(a => a._id === id ? updatedBooking : a));
      } else {
        const errorText = await response.text();
        console.error("Server error detail:", errorText);
        alert(`Erreur lors de la mise à jour du type de rendez-vous: ${errorText}`);
        throw new Error('Failed to update appointment type');
      }
    } catch (err) {
      console.error("Error updating appointment type:", err);
    }
  };

  const filteredAppointments = useMemo(() => {
  return appointments
    .filter(appt => {
      const matchesType = selectedTypeFilter === 'all' || appt.appointementType?.trim() === selectedTypeFilter.trim();
      const matchesStatus = selectedStatusFilter === 'all' || appt.status === selectedStatusFilter;
      return matchesType && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by creation date (most recent booking first)
      const dateA = new Date(a.createdAt || a._id);
      const dateB = new Date(b.createdAt || b._id);
      return dateB - dateA;
    });
}, [appointments, selectedTypeFilter, selectedStatusFilter]);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
    };
  }, [appointments]);

  const appointmentsOnSelectedDate = appointments.filter(a => a.appointmentDate === selectedDate);
  const occupiedSlots = appointmentsOnSelectedDate.map(a => a.appointmentTime);

  if (loading) {
    return (
      <div className="space-y-8">
        <Card className="border-blue-200">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-lg text-gray-600">Chargement des rendez-vous...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <Card className="border-red-200">
          <div className="flex items-center justify-center p-8 text-red-600">
            <AlertTriangle className="w-8 h-8 mr-3" />
            <span className="text-lg">Erreur: {error}</span>
          </div>
        </Card>
      </div>
    );
  }

  const activeFiltersCount = (selectedTypeFilter !== 'all' ? 1 : 0) + (selectedStatusFilter !== 'all' ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Cards de Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-400" />
          </div>
        </Card>
        
        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">En Attente</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-400" />
          </div>
        </Card>
        
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Confirmés</p>
              <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </Card>
        
        <Card className="border-blue-200 bg-gradient-to-br from-sky-50 to-sky-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Terminés</p>
              <p className="text-3xl font-bold text-sky-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-sky-400" />
          </div>
        </Card>
      </div>

      {/* Cartes de Filtres */}
      <Card className="border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-600"/>
            Filtres
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>
        </div>

        <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type de Rendez-vous</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTypeFilter('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTypeFilter === 'all'
                    ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              {APPOINTMENT_TYPES.map(type => {
                const Icon = type.icon;
                const isActive = selectedTypeFilter.trim() === type.value.trim();
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedTypeFilter(type.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      isActive ? type.activeClass : type.textBgClass
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="truncate text-xs">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Statut</label>
            <div className="flex flex-wrap gap-2">
              {APPOINTMENT_STATUSES.map(status => {
                const isActive = selectedStatusFilter === status.value;
                return (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatusFilter(status.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? status.activeClass : status.textBgClass
                    }`}
                  >
                    {status.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                setSelectedTypeFilter('all');
                setSelectedStatusFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Effacer tous les filtres
            </button>
          )}
        </div>
      </Card>

      {/* Liste des Rendez-vous */}
      <Card className="border-blue-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-3 text-blue-600"/>
          Mes Rendez-vous ({filteredAppointments.length})
        </h3>
        
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => {
              const typeConfig = getTypeConfig(appt.appointementType);
              const TypeIcon = typeConfig.icon;
              
              return (
                <div key={appt._id} className={`flex flex-col p-4 rounded-lg transition-all border-l-4 ${
                  appt.status === 'confirmed' ? 'bg-green-50 border-green-500' : 
                  appt.status === 'cancelled' ? 'bg-red-50 border-red-500' : 
                  appt.status === 'completed' ? 'bg-blue-50 border-blue-500' :
                  'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                        <div>
                          <p className="font-semibold text-lg text-gray-800">{appt.patientName}</p>
                          <p className="text-sm text-gray-600">
                            {appt.appointmentDate} à {appt.appointmentTime}
                          </p>
                        </div>
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${typeConfig.textBgClass}`}
                        >
                          <TypeIcon className="w-3 h-3" />
                          {typeConfig.label}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500">Téléphone: {appt.patientPhone}</p>
                      {appt.patientDescription && (
                        <p className="text-sm text-gray-500 mt-1">
                          Description: <span className="italic">{appt.patientDescription}</span>
                        </p>
                      )}
                      <p className="text-sm font-semibold text-gray-700 mt-1">Frais: {appt.fee}</p>
                      
                      {appt.fileLink && (
                    <a
                      href={appt.fileLink}
                      download
                      className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Télécharger le fichier
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                      
                      <div className="mt-3">
                        <label className="text-xs text-gray-600 font-medium mb-1 block">Changer le type:</label>
                        <select
                          value={appt.appointementType || 'Consultation'}
                          onChange={(e) => handleTypeChange(appt._id, e.target.value)}
                          className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          {APPOINTMENT_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                      
                    <div className="flex sm:flex-col gap-2">
                      {appt.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(appt._id, 'confirmed')} 
                            className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors shadow-md whitespace-nowrap"
                          >
                            Confirmer
                          </button>
                          <button 
                            onClick={() => handleStatusChange(appt._id, 'cancelled')} 
                            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors shadow-md whitespace-nowrap"
                          >
                            Annuler
                          </button>
                        </>
                      )}
                      {appt.status === 'confirmed' && (
                        <>
                          <span className="text-green-700 font-medium flex items-center gap-1 px-3 py-2 bg-green-100 rounded-lg text-sm justify-center">
                            <CheckCircle className="w-4 h-4"/> Confirmé
                          </span>
                          <button 
                            onClick={() => handleStatusChange(appt._id, 'completed')} 
                            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-md whitespace-nowrap"
                          >
                            Terminer
                          </button>
                        </>
                      )}
                      {appt.status === 'cancelled' && (
                        <span className="text-red-700 font-medium px-3 py-2 bg-red-100 rounded-lg text-sm text-center">Annulé</span>
                      )}
                      {appt.status === 'completed' && (
                        <span className="text-blue-700 font-medium px-3 py-2 bg-blue-100 rounded-lg text-sm text-center">Terminé</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 italic text-center py-8">
              {activeFiltersCount > 0 
                ? "Aucun rendez-vous ne correspond aux filtres sélectionnés."
                : "Aucun rendez-vous trouvé pour le moment."
              }
            </p>
          )}
        </div>
      </Card>

      {/* Visualisation du Planning */}
      <Card className="border-sky-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Clock className="w-6 h-6 mr-3 text-sky-600"/>
          Vérifier la Disponibilité
        </h3>
        <label htmlFor="date-selector" className="block text-gray-700 font-medium mb-2">Sélectionnez une date:</label>
        <input
          id="date-selector"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all"
        />

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xl font-semibold mb-3">Statut du {selectedDate}:</p>
          {occupiedSlots.length > 0 ? (
            <div>
              <p className="text-red-600 font-medium mb-2">Créneaux occupés:</p>
              <ul className="list-disc pl-5 space-y-1">
                {occupiedSlots.map((time, index) => (
                  <li key={index} className="text-red-600 font-medium">Occupé à {time}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-green-600 font-medium flex items-center">
              <CheckCircle className="w-5 h-5 mr-2"/>
              Aucun rendez-vous planifié. Journée libre.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

// --- VIEW 2: Ajouter des Slots Disponibles ---
const AjouterSlotsDisponibles = ({ currentDoctorId }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/doctors/${currentDoctorId}/slots`);
        if (!response.ok) throw new Error('Failed to fetch doctor slots');
        
        const slotsData = await response.json();
        setSlots(slotsData);
      } catch (err) {
        console.error("Error fetching slots:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentDoctorId) {
      fetchSlots();
    }
  }, [currentDoctorId]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (date && startTime && endTime) {
      try {
        const response = await fetch(`/api/doctors/${currentDoctorId}/slots`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, startTime, endTime }),
        });

        if (response.ok) {
          const addedSlot = await response.json();
          setSlots(prev => [...prev, addedSlot]);
          setDate('');
          setStartTime('');
          setEndTime('');
          alert("Plage horaire ajoutée avec succès!");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add slot');
        }
      } catch (err) {
        console.error("Error adding slot:", err);
        alert(`Erreur lors de l'ajout: ${err.message}`);
      }
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      const response = await fetch(`/api/doctors/${currentDoctorId}/slots/${slotId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSlots(prev => prev.filter(s => s._id !== slotId));
        alert("Plage horaire supprimée!");
      } else {
        throw new Error('Failed to delete slot');
      }
    } catch (err) {
      console.error("Error deleting slot:", err);
      alert(`Erreur lors de la suppression: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <Card className="border-blue-200">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className="text-lg text-gray-600">Chargement...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-blue-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <PlusSquare className="w-6 h-6 mr-3 text-blue-600"/>
          Ajouter une Plage de Disponibilité
        </h3>
        <form onSubmit={handleAddSlot} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
              <input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin</label>
              <input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-sky-700 transition-all shadow-md flex items-center justify-center"
          >
            Ajouter <PlusSquare className="w-5 h-5 ml-2"/>
          </button>
        </form>
      </Card>

      <Card className="border-sky-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Clock className="w-6 h-6 mr-3 text-sky-600"/>
          Mes Plages Horaires ({slots.length})
        </h3>
        <div className="space-y-4">
          {slots.length > 0 ? (
            slots.map(slot => (
              <div key={slot._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {slot.date} - De {slot.times[0]} à {slot.times[slot.times.length - 1]}
                  </p>
                  <p className="text-sm text-gray-600">
                    {slot.times.length} créneaux
                  </p>
                </div>
                <button 
                  onClick={() => handleDeleteSlot(slot._id)} 
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5"/>
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center py-8">
              Aucune plage horaire configurée.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

// --- VIEW 3: Gestion du Profil Médecin ---
const ManageProfile = ({ currentDoctor, updateDoctorInfo, specialties }) => {
  const [profileData, setProfileData] = useState({
    maxPatients: currentDoctor.maxPatients?.toString() || currentDoctor.patients?.toString() || '',
    fee: currentDoctor.fee?.toString() || '',
    experience: currentDoctor.experience?.toString() || '',
    location: currentDoctor.location || currentDoctor.clinic || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setProfileData({
      maxPatients: currentDoctor.maxPatients?.toString() || currentDoctor.patients?.toString() || '',
      fee: currentDoctor.fee?.toString() || '',
      experience: currentDoctor.experience?.toString() || '',
      location: currentDoctor.location || currentDoctor.clinic || ''
    });
  }, [currentDoctor]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const updateData = {};
      if (profileData.maxPatients) updateData.maxPatients = parseInt(profileData.maxPatients);
      if (profileData.fee) updateData.fee = profileData.fee.trim();
      if (profileData.experience) updateData.experience = parseInt(profileData.experience);
      if (profileData.location) updateData.location = profileData.location.trim();

      const response = await fetch(`/api/doctors/${currentDoctor._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedDoctor = await response.json();
        updateDoctorInfo(updatedDoctor);
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec de la mise à jour.');
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la sauvegarde.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour obtenir le nom de la spécialité
  const getSpecialtyName = () => {
    if (!currentDoctor.specialty) return 'Non spécifiée';
    
    // Si specialty est un objet (populé)
    if (typeof currentDoctor.specialty === 'object' && currentDoctor.specialty !== null) {
      return currentDoctor.specialty.name || 'Non spécifiée';
    }
    
    // Si specialty est un string (ID), chercher dans la liste des spécialités
    if (typeof currentDoctor.specialty === 'string' && specialties) {
      const foundSpecialty = specialties.find(s => s._id === currentDoctor.specialty);
      return foundSpecialty ? foundSpecialty.name : 'Non spécifiée';
    }
    
    return 'Non spécifiée';
  };

  return (
    <div className="space-y-8">
      {/* Profile Summary Card - MAINTENANT EN HAUT */}
      <Card className="border-blue-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600"/>
          Résumé du Profil
        </h3>
        
        {/* Informations personnelles */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <User className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-800">Informations Personnelles</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Nom Complet</p>
              <p className="text-lg font-bold text-gray-800">Dr. {currentDoctor.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Spécialité</p>
              <p className="text-lg font-bold text-gray-800">
                {getSpecialtyName()}
              </p>
            </div>
          </div>
        </div>

        {/* Informations professionnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Patients Max/Jour</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {currentDoctor.maxPatients || currentDoctor.patients || 'Non défini'}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Honoraires</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {currentDoctor.fee || 'Non défini'}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Expérience</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {currentDoctor.experience ? `${currentDoctor.experience} ans` : 'Non défini'}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Localisation</span>
            </div>
            <p className="text-lg font-bold text-gray-800">
              {currentDoctor.location || currentDoctor.clinic || 'Non défini'}
            </p>
          </div>
        </div>
      </Card>

      {/* Formulaire d'édition - MAINTENANT EN BAS */}
      <Card className="border-blue-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <User className="w-6 h-6 mr-3 text-blue-600"/>
          Modifier Mon Profil Médical
        </h3>
        
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Max Patients */}
          <div>
            <label htmlFor="max-patients" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              Nombre de Patients par Jour
            </label>
            <input
              id="max-patients"
              type="number"
              value={profileData.maxPatients}
              onChange={(e) => setProfileData({...profileData, maxPatients: e.target.value})}
              placeholder="Ex: 50"
              className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p className="mt-2 text-sm text-gray-500">
              Définissez le nombre maximum de patients que vous pouvez recevoir par jour.
            </p>
          </div>

          {/* Fee */}
          <div>
            <label htmlFor="fee-input" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Honoraires de Consultation
            </label>
            <input
              id="fee-input"
              type="text"
              value={profileData.fee}
              onChange={(e) => setProfileData({...profileData, fee: e.target.value})}
              placeholder="Ex: 3000 DZD"
              className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p className="mt-2 text-sm text-gray-500">
              Indiquez le montant de vos honoraires avec la devise (ex: 3000 DZD).
            </p>
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="experience-input" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Award className="w-5 h-5 text-blue-600" />
              Années d'Expérience
            </label>
            <input
              id="experience-input"
              type="number"
              value={profileData.experience}
              onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
              placeholder="Ex: 10"
              className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p className="mt-2 text-sm text-gray-500">
              Nombre d'années d'expérience dans votre spécialité.
            </p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location-input" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Localisation du Cabinet
            </label>
            <input
              id="location-input"
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
              placeholder="Ex: Alger, Centre-ville"
              className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p className="mt-2 text-sm text-gray-500">
              Adresse ou localisation de votre cabinet médical.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-sky-700 transition-all shadow-md flex items-center justify-center disabled:opacity-50"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2"/> Sauvegarde...</>
            ) : (
              <><Save className="w-5 h-5 mr-2"/> Enregistrer les Modifications</>
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2"/> : <AlertTriangle className="w-5 h-5 mr-2"/>}
            <p className="font-medium">{message.text}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

// --- MAIN DOCTOR DASHBOARD COMPONENT ---
export default function DoctorDashboard() {
  const router = useRouter();
  const [mainView, setMainView] = useState("appointments");
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateDoctorInfo = (updatedData) => {
    setCurrentDoctor(prev => ({ ...prev, ...updatedData }));
  };

  // Fonction pour obtenir le nom de la spécialité
  const getSpecialtyName = () => {
    if (!currentDoctor || !currentDoctor.specialty) return 'Non spécifiée';
    
    // Si specialty est un objet (populé)
    if (typeof currentDoctor.specialty === 'object' && currentDoctor.specialty !== null) {
      return currentDoctor.specialty.name || 'Non spécifiée';
    }
    
    // Si specialty est un string (ID), chercher dans la liste des spécialités
    if (typeof currentDoctor.specialty === 'string' && specialties.length > 0) {
      const foundSpecialty = specialties.find(s => s._id === currentDoctor.specialty);
      return foundSpecialty ? foundSpecialty.name : 'Non spécifiée';
    }
    
    return 'Non spécifiée';
  };

  useEffect(() => {
    const doctorId = localStorage.getItem('doctorId');
    const doctorName = localStorage.getItem('doctorName');
    const doctorEmail = localStorage.getItem('doctorEmail');

    if (!doctorId || !doctorName) {
      router.push('/');
      return;
    }

    const fetchDoctorData = async () => {
      try {
        const response = await fetch(`/api/doctors/${doctorId}`);
        if (response.ok) {
          const doctorData = await response.json();
          setCurrentDoctor(doctorData);
        } else {
          setCurrentDoctor({
            _id: doctorId,
            name: doctorName,
            email: doctorEmail,
            specialty: 'Chargement...',
            fee: 'N/A',
            maxPatients: 0,
            experience: 0,
            location: ''
          });
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setCurrentDoctor({
          _id: doctorId,
          name: doctorName,
          email: doctorEmail,
          specialty: 'Information non disponible',
          fee: 'N/A',
          maxPatients: 0,
          experience: 0,
          location: ''
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchSpecialties = async () => {
      try {
        const response = await fetch('/api/specialities');
        if (response.ok) {
          const specialtiesData = await response.json();
          setSpecialties(specialtiesData);
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchDoctorData();
    fetchSpecialties();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('doctorId');
    localStorage.removeItem('doctorName');
    localStorage.removeItem('doctorEmail');
    localStorage.removeItem('doctorSpecialty');
    router.push('/');
  };

  const renderMainView = () => {
    if (!currentDoctor) return null;

    switch (mainView) {
      case "appointments":
        return <GestionRendezVous currentDoctorId={currentDoctor._id} />;
      case "add_slots":
        return <AjouterSlotsDisponibles currentDoctorId={currentDoctor._id} />;
      case "manage_profile":
        return <ManageProfile currentDoctor={currentDoctor} updateDoctorInfo={updateDoctorInfo} specialties={specialties} />;
      default:
        return (
          <div className="p-10 text-center text-gray-500 bg-white rounded-xl shadow-lg border border-gray-200">
            <p className="text-xl">Veuillez sélectionner une option dans le menu.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Chargement...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-8">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent leading-tight">
              Tableau de Bord Médical
            </h1>
            {currentDoctor && (
              <div className="space-y-1">
                <p className="text-lg text-gray-600">
                  Dr. {currentDoctor.name} - {getSpecialtyName()}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentDoctor.fee && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                      💰 Frais: {currentDoctor.fee}
                    </span>
                  )}
                  {(currentDoctor.maxPatients > 0 || currentDoctor.patients > 0) && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                      👥 Max: {currentDoctor.maxPatients || currentDoctor.patients} patients/jour
                    </span>
                  )}
                  {currentDoctor.experience > 0 && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm">
                      🏆 {currentDoctor.experience} ans d'expérience
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 pt-6">
          
          <div className="w-full lg:w-1/4 p-4 lg:p-6 bg-white rounded-xl shadow-xl space-y-3 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Menu Docteur</h2>
            
            <NavButton 
              label="Gérer Mon Profil" 
              icon={User} 
              isActive={mainView === 'manage_profile'} 
              onClick={() => setMainView('manage_profile')} 
            />
            
            <NavButton 
              label="Gestion de Rendez-vous" 
              icon={Calendar} 
              isActive={mainView === 'appointments'} 
              onClick={() => setMainView('appointments')} 
            />
            
            <NavButton 
              label="Mes Disponibilités" 
              icon={PlusSquare} 
              isActive={mainView === 'add_slots'} 
              onClick={() => setMainView('add_slots')} 
            />
            
          </div>

          <div className="w-full lg:w-3/4">
            {renderMainView()}
          </div>
        </div>
      </div>
    </main>
  )
}