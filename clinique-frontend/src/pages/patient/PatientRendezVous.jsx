import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarP from "../../components/SidebarP";
import TopBar from "../../components/TopBar";
import { useAuth } from '../../context/AuthContext';

const PatientRendezVous = () => {
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'patient') {
      fetchPatientData(user.email);
    }
  }, [user]);

  const fetchPatientData = async (email) => {
    try {
      console.log("🔍 Fetching patient data for email:", email);
      const response = await fetch(`http://localhost:8080/api/patients/email/${email}`);
      if (response.ok) {
        const patientData = await response.json();
        console.log("✅ Patient data:", patientData);
        setPatient(patientData);
        fetchRendezVous(patientData.id);
      } else {
        console.error("❌ Patient not found");
        setLoading(false);
      }
    } catch (error) {
      console.error("💥 Error loading patient:", error);
      setLoading(false);
    }
  };

  const fetchRendezVous = async (patientId) => {
    try {
      console.log("🔄 Fetching rendez-vous for patient ID:", patientId);
      const response = await fetch(`http://localhost:8080/rendezvous/patient/${patientId}`);
      console.log("📡 Response status:", response.status);
      
      if (response.ok) {
        const rdvData = await response.json();
        console.log("✅ Rendez-vous data received:", rdvData);
        setRendezVous(rdvData);
      } else {
        console.error("❌ Error response:", response.status);
      }
    } catch (error) {
      console.error("💥 Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date < today) {
      return "bg-gray-100 text-gray-800";
    } else if (date.toDateString() === today.toDateString()) {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  const getStatusText = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date < today) {
      return "Passé";
    } else if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else {
      return "À venir";
    }
  };

  // Redirection si pas patient
  useEffect(() => {
    if (user && user.role !== 'patient') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'patient') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar fixe */}
      <div className="fixed left-0 top-0 h-full z-30 w-64">
        <SidebarP />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col ml-64">
        {/* TopBar fixe */}
        <div className="fixed top-0 right-0 left-64 z-20">
          <TopBar />
        </div>

        {/* Contenu scrollable */}
        <div className="pt-16 p-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">📅 Mes Rendez-vous</h1>
              <button
                onClick={() => navigate("/prendre-rendezvous")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Prendre un Rendez-vous
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Consultez l'historique de tous vos rendez-vous programmés.
            </p>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Chargement des rendez-vous...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {rendezVous.length > 0 ? (
                  <table className="w-full border border-gray-200 rounded-lg text-sm">
                    <thead className="bg-blue-500 text-white">
                      <tr>
                        <th className="py-3 px-4 text-left">Médecin</th>
                        <th className="py-3 px-4 text-left">Spécialité</th>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-left">Heure</th>
                        <th className="py-3 px-4 text-left">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rendezVous.map((rdv) => (
                        <tr key={rdv.id} className="border-t hover:bg-gray-50 transition">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-semibold text-gray-800">
                                Dr. {rdv.medecin?.user?.prenom} {rdv.medecin?.user?.nom}
                              </p>
                              {rdv.medecin?.specialite && (
                                <p className="text-sm text-gray-600">
                                  {rdv.medecin.specialite.title}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {rdv.medecin?.specialite?.title || "Généraliste"}
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {formatDate(rdv.date)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                              {rdv.slot}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rdv.date)}`}>
                              {getStatusText(rdv.date)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Aucun rendez-vous trouvé
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Vous n'avez pas encore de rendez-vous programmé.
                    </p>
                    <button
                      onClick={() => navigate("/prendre-rendezvous")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                      Prendre mon premier rendez-vous
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRendezVous;