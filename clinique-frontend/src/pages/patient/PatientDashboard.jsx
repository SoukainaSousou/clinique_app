import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "../../components/StatCard";
import { User, CalendarDays, FileText, Clock } from "lucide-react";
import SidebarP from "../../components/SidebarP";
import TopBar from "../../components/TopBar";
import { useAuth } from '../../context/AuthContext';

const data = [
  { name: "Jan", consultations: 3 },
  { name: "Fév", consultations: 5 },
  { name: "Mar", consultations: 2 },
  { name: "Avr", consultations: 4 },
  { name: "Mai", consultations: 6 },
  { name: "Jun", consultations: 3 },
];

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [rendezVous, setRendezVous] = useState([]);
  const [stats, setStats] = useState({
    totalConsultations: 0,
    rendezVousProchains: 0,
    dossiersMedicaux: 0,
    consultationsMois: 0
  });

  useEffect(() => {
    if (user && user.role === 'patient') {
      console.log("👤 User:", user);
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
      }
    } catch (error) {
      console.error("💥 Error loading patient:", error);
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
        
        // Calcul des statistiques
        const aujourdHui = new Date();
        const prochains = rdvData.filter(rdv => {
          const dateRdv = new Date(rdv.date);
          return dateRdv >= aujourdHui;
        }).length;

        const debutMois = new Date(aujourdHui.getFullYear(), aujourdHui.getMonth(), 1);
        const consultationsMois = rdvData.filter(rdv => {
          const dateRdv = new Date(rdv.date);
          return dateRdv >= debutMois && dateRdv <= aujourdHui;
        }).length;

        setStats({
          totalConsultations: rdvData.length,
          rendezVousProchains: prochains,
          dossiersMedicaux: rdvData.length,
          consultationsMois: consultationsMois
        });
      } else {
        console.error("❌ Error response:", response.status);
      }
    } catch (error) {
      console.error("💥 Fetch error:", error);
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
      {/* Sidebar Patient */}
      <div className="fixed left-0 top-0 h-full z-30 w-64">
        <SidebarP />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col ml-64">
        <div className="fixed top-0 right-0 left-64 z-20">
          <TopBar />
        </div>

        <main className="pt-16 p-6 space-y-6">
          {/* En-tête personnalisé */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <h1 className="text-2xl font-bold mb-2">
              Bienvenue, {patient ? `${patient.prenom} ${patient.nom}` : 'Patient'}
            </h1>
            <p className="text-blue-100">
              Votre espace santé personnel - Gérez vos rendez-vous et consultations
            </p>
          </div>

          {/* Statistiques principales - MÊMES COULEURS QUE MÉDECIN */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Consultations Totales"
              value={stats.totalConsultations.toString()}
              subtitle="Depuis le début"
              icon={<FileText size={24} />}
              color="blue"
            />
            <StatCard
              title="Rendez-vous à Venir"
              value={stats.rendezVousProchains.toString()}
              subtitle="Prochainement"
              icon={<CalendarDays size={24} />}
              color="green"
            />
            <StatCard
              title="Dossiers Médicaux"
              value={stats.dossiersMedicaux.toString()}
              subtitle="Documents accessibles"
              icon={<User size={24} />}
              color="purple"
            />
            <StatCard
              title="Consultations Ce Mois"
              value={stats.consultationsMois.toString()}
              subtitle="Activité récente"
              icon={<Clock size={24} />}
              color="teal"
            />
          </div>

          {/* Graphiques et contenu */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graphique des consultations */}
            <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Historique des Consultations
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                  <YAxis tick={{ fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="consultations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Prochains rendez-vous */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Prochains Rendez-vous
              </h3>
              <div className="space-y-4">
                {rendezVous.filter(rdv => new Date(rdv.date) >= new Date())
                  .slice(0, 3)
                  .map((rdv) => (
                    <div key={rdv.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-blue-800">
                            Dr. {rdv.medecin.user.prenom} {rdv.medecin.user.nom}
                          </p>
                          <p className="text-sm text-blue-600">
                            {new Date(rdv.date).toLocaleDateString('fr-FR')} à {rdv.slot}
                          </p>
                          <p className="text-xs text-blue-500 mt-1">
                            {rdv.medecin.specialite.title}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Confirmé
                        </span>
                      </div>
                    </div>
                  ))
                }
                {rendezVous.filter(rdv => new Date(rdv.date) >= new Date()).length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Aucun rendez-vous à venir
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Mes Informations Personnelles
            </h3>
            {patient ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Nom :</strong> {patient.nom}</p>
                  <p><strong>Prénom :</strong> {patient.prenom}</p>
                  <p><strong>Email :</strong> {patient.email}</p>
                </div>
                <div>
                  <p><strong>Téléphone :</strong> {patient.tel || "Non renseigné"}</p>
                  <p><strong>Adresse :</strong> {patient.adresse || "Non renseignée"}</p>
                  <p><strong>CIN :</strong> {patient.cin || "Non renseigné"}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Chargement des informations...</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;