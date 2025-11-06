// page.tsx (Confirmé)

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, CheckCircle, PlusSquare, Trash2, Loader2, AlertTriangle, LogOut, DollarSign } from "lucide-react"

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

// --- VIEW 1: Gestion des Rendez-vous (Unchanged) ---
const GestionRendezVous = ({ currentDoctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments for current doctor
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/bookings');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allBookings = await response.json();
        
        // Filter bookings for current doctor - convert both to string for comparison
        const doctorAppointments = allBookings.filter(booking => {
          // Handle both string and ObjectId doctorId
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

    if (currentDoctorId) {
      fetchAppointments();
    }
  }, [currentDoctorId]);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setAppointments(prev => prev.map(a => a._id === id ? updatedBooking : a));
      } else {
        throw new Error('Failed to update appointment status');
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Erreur lors de la mise à jour du rendez-vous");
    }
  };

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

  return (
    <div className="space-y-8">
      {/* Liste des Rendez-vous */}
      <Card className="border-blue-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-3 text-blue-600"/>
          Mes Rendez-vous ({appointments.length})
        </h3>
        
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appt) => (
              <div key={appt._id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg transition-all ${
                appt.status === 'confirmed' ? 'bg-green-50 border-l-4 border-green-500' : 
                appt.status === 'cancelled' ? 'bg-red-50 border-l-4 border-red-500' : 
                appt.status === 'completed' ? 'bg-blue-50 border-l-4 border-blue-500' :
                'bg-yellow-50 border-l-4 border-yellow-500' // pending
              }`}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg text-gray-800">{appt.patientName}</p>
                  <p className="text-sm text-gray-600">
                    {appt.appointmentDate} à {appt.appointmentTime} 
                  </p>
                  <p className="text-sm text-gray-500">Téléphone: {appt.patientPhone}</p>
                  {appt.patientDescription && (
                    <p className="text-sm text-gray-500 mt-1">
                      Description: <span className="italic">{appt.patientDescription}</span>
                    </p>
                  )}
                  {/* Fee display is already here */}
                  <p className="text-sm text-gray-500">Frais: **{appt.fee}**</p> 
                </div>
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  {appt.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(appt._id, 'confirmed')} 
                        className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-colors shadow-md"
                      >
                        Confirmer
                      </button>
                      <button 
                        onClick={() => handleStatusChange(appt._id, 'cancelled')} 
                        className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition-colors shadow-md"
                      >
                        Annuler
                      </button>
                    </>
                  )}
                  {appt.status === 'confirmed' && (
                    <span className="text-green-700 font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1"/> Confirmé
                    </span>
                  )}
                  {appt.status === 'cancelled' && (
                    <span className="text-red-700 font-medium">Annulé</span>
                  )}
                  {appt.status === 'completed' && (
                    <span className="text-blue-700 font-medium">Terminé</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center py-8">
              Aucun rendez-vous trouvé pour le moment.
            </p>
          )}
        </div>
      </Card>

      {/* Visualisation du Planning (Unchanged) */}
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

// --- VIEW 2: Ajouter des Slots Disponibles (Unchanged) ---
const AjouterSlotsDisponibles = ({ currentDoctorId }) => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch doctor's available slots
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                setLoading(true);
                // API path assumed to exist in the system
                const response = await fetch(`/api/doctors/${currentDoctorId}/slots`); 
                if (!response.ok) throw new Error('Failed to fetch doctor slots');
                
                const slotsData = await response.json();
                setSlots(slotsData);
            } catch (err) {
                setError(err.message);
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
                const newSlot = {
                    date: date,
                    startTime: startTime,
                    endTime: endTime,
                };

                // API path assumed to exist in the system
                const response = await fetch(`/api/doctors/${currentDoctorId}/slots`, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newSlot),
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
                alert(`Erreur lors de l'ajout de la plage horaire: ${err.message}`);
            }
        }
    };

    const handleDeleteSlot = async (slotId) => {
        try {
            // API path assumed to exist in the system
            const response = await fetch(`/api/doctors/${currentDoctorId}/slots/${slotId}`, { 
                method: 'DELETE',
            });

            if (response.ok) {
                setSlots(prev => prev.filter(s => s._id !== slotId));
                alert("Plage horaire supprimée avec succès!");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete slot');
            }
        } catch (err) {
            console.error("Error deleting slot:", err);
            alert(`Erreur lors de la suppression de la plage horaire: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <Card className="border-blue-200">
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                        <span className="text-lg text-gray-600">Chargement des plages horaires...</span>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Card className="border-blue-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <PlusSquare className="w-6 h-6 mr-3 text-blue-600"/>
                    Ajouter une Nouvelle Plage de Disponibilité
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
                        className="w-full sm:w-auto mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-sky-700 transition-all shadow-md flex items-center justify-center"
                    >
                        Ajouter le Slot <PlusSquare className="w-5 h-5 ml-2"/>
                    </button>
                </form>
            </Card>

            {/* Liste des Slots Existants */}
            <Card className="border-sky-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-sky-600"/>
                    Mes Plages Horaires Disponibles ({slots.length})
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
                                        {slot.times.length} créneaux disponibles
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Créneaux: {slot.times.join(', ')}
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
                            Aucune plage horaire configurée. Ajoutez vos premières disponibilités.
                        </p>
                    )}
                </div>
            </Card>
        </div>
    );
};

// --- NEW VIEW 3: Gérer les Frais ---
const ManagePricing = ({ currentDoctor, updateDoctorInfo }) => {
    const [fee, setFee] = useState(currentDoctor.fee || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setFee(currentDoctor.fee || '');
    }, [currentDoctor.fee]);

    const handleSaveFee = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        // Simple validation
        if (!fee.trim()) {
            setMessage({ type: 'error', text: 'Le champ des frais ne peut pas être vide.' });
            setIsSubmitting(false);
            return;
        }

        try {
            // API path assumed to exist and handle PATCH requests to update doctor fields
            const response = await fetch(`/api/doctors/${currentDoctor._id}`, { 
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fee: fee.trim() }), // Send only the fee field
            });

            if (response.ok) {
                const updatedDoctor = await response.json();
                // Update the main doctor state in the parent component
                updateDoctorInfo(updatedDoctor); 
                setMessage({ type: 'success', text: 'Frais mis à jour avec succès!' });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la mise à jour des frais.');
            }
        } catch (err) {
            console.error("Error updating fee:", err);
            setMessage({ type: 'error', text: err.message || 'Erreur lors de la sauvegarde des frais.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card className="border-green-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <DollarSign className="w-6 h-6 mr-3 text-green-600"/>
                    Gérer les Frais de Consultation
                </h3>
                
                <form onSubmit={handleSaveFee} className="space-y-6">
                    <div>
                        <label htmlFor="fee-input" className="block text-lg font-medium text-gray-700 mb-2">
                            Frais de Consultation Actuels
                        </label>
                        <input
                            id="fee-input"
                            type="text"
                            value={fee}
                            onChange={(e) => setFee(e.target.value)}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg text-xl focus:ring-green-500 focus:border-green-500 transition-all"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Veuillez entrer le montant et la devise (ex: 100 TND).
                        </p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-md flex items-center justify-center disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin mr-2"/> Sauvegarde en cours...</>
                        ) : (
                            <>Sauvegarder les Frais <DollarSign className="w-5 h-5 ml-2"/></>
                        )}
                    </button>
                </form>

                {message && (
                    <div className={`mt-6 p-4 rounded-lg flex items-center ${
                        message.type === 'success' 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
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
  // State to manage the main view displayed in the right column
  const [mainView, setMainView] = useState("appointments");
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to update doctor's info from child components (used by ManagePricing)
  const updateDoctorInfo = (updatedData) => {
    setCurrentDoctor(prev => ({ ...prev, ...updatedData }));
  };

  // Get current doctor info on component mount
  useEffect(() => {
    const doctorId = localStorage.getItem('doctorId');
    const doctorName = localStorage.getItem('doctorName');
    const doctorEmail = localStorage.getItem('doctorEmail');

    if (!doctorId || !doctorName) {
      router.push('/');
      return;
    }

    // Fetch complete doctor data
    const fetchDoctorData = async () => {
      try {
        const response = await fetch(`/api/doctors/${doctorId}`);
        if (response.ok) {
          const doctorData = await response.json();
          setCurrentDoctor(doctorData);
        } else {
          // Fallback to basic info from localStorage
          setCurrentDoctor({
            _id: doctorId,
            name: doctorName,
            email: doctorEmail,
            specialty: { name: 'Chargement...' },
            fee: 'N/A' 
          });
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        // Fallback to basic info from localStorage
        setCurrentDoctor({
          _id: doctorId,
          name: doctorName,
          email: doctorEmail,
          specialty: { name: 'Information non disponible' },
          fee: 'N/A' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('doctorId');
    localStorage.removeItem('doctorName');
    localStorage.removeItem('doctorEmail');
    localStorage.removeItem('doctorSpecialty');
    router.push('/');
  };

  // Helper function to render the current main component
  const renderMainView = () => {
    if (!currentDoctor) return null;

    switch (mainView) {
      case "appointments":
        return <GestionRendezVous currentDoctorId={currentDoctor._id} />;
      case "add_slots":
        return <AjouterSlotsDisponibles currentDoctorId={currentDoctor._id} />;
      case "manage_pricing":
        return <ManagePricing currentDoctor={currentDoctor} updateDoctorInfo={updateDoctorInfo} />; // New View
      default:
        return (
            <div className="p-10 text-center text-gray-500 bg-white rounded-xl shadow-lg border border-gray-200">
                <p className="text-xl">Veuillez sélectionner une option dans le menu de gauche.</p>
            </div>
        );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </main>
    );
  }

  return (
    // Applied soft background gradient
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-8">
          <div className="space-y-2">
            {/* Stylized Title using Blue/Sky Gradient */}
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent leading-tight">
                Tableau de Bord Médical
            </h1>
            {currentDoctor && (
              <p className="text-lg text-gray-600">
                Dr. {currentDoctor.name} - {currentDoctor.specialty?.name || 'Spécialité'}
                {/* Displaying current fee in the header */}
                <span className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                    Frais: {currentDoctor.fee || 'Non défini'}
                </span>
              </p>
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

        {/* Main Content Area (Sidebar + View) */}
        <div className="flex flex-col lg:flex-row gap-6 pt-6">
            
            {/* Left Column: Sidebar Navigation */}
            <div className="w-full lg:w-1/4 p-4 lg:p-6 bg-white rounded-xl shadow-xl space-y-3 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Menu Docteur</h2>
                
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
                
                {/* New Nav Button for Pricing */}
                <NavButton 
                    label="Gérer les Frais" 
                    icon={DollarSign} 
                    isActive={mainView === 'manage_pricing'} 
                    onClick={() => setMainView('manage_pricing')} 
                />
            </div>

            {/* Right Column: Dynamic Content View */}
            <div className="w-full lg:w-3/4">
                {renderMainView()}
            </div>
        </div>
      </div>
    </main>
  )
}