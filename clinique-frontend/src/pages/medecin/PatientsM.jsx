import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/SidebarM";
import TopBar from "../../components/TopBar";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPatients = async (query = "") => {
    setLoading(true);
    try {
      const url = query
        ? `http://localhost:8080/api/patients/search?q=${encodeURIComponent(query)}`
        : "http://localhost:8080/api/patients";
      const response = await fetch(url);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Erreur lors du chargement des patients :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    fetchPatients(q);
  };

  const handleAjouterConsultation = (patientId) => {
    navigate(`/medecin/consultations/nouvelle/${patientId}`);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* ➤ Sidebar fixe */}
      <div className="fixed left-0 top-0 h-full z-30 w-64 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* ➤ Contenu principal (décalé pour laisser de la place au sidebar) */}
      <div className="flex-1 flex flex-col ml-64">
        {/* ➤ TopBar fixe en haut */}
        <div className="fixed top-0 right-0 left-64 z-20 bg-white shadow-sm">
          <TopBar />
        </div>

        {/* ➤ Contenu scrollable (commence en dessous de TopBar) */}
        <div className="pt-16 p-6"> {/* pt-16 = hauteur de TopBar (~4rem) */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">👨‍⚕️ Mes Patients</h1>
            </div>

            <p className="text-gray-600 mb-4">
              Liste complète des patients suivis dans votre clinique.
            </p>

            {/* 🔍 Barre de recherche */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou CIN..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {loading ? (
              <p className="text-center py-4">Chargement...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg text-sm">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="py-2 px-3 text-left">Nom</th>
                      <th className="py-2 px-3 text-left">Prénom</th>
                      <th className="py-2 px-3 text-left">CIN</th>
                      <th className="py-2 px-3 text-left">Téléphone</th>
                      <th className="py-2 px-3 text-left">Adresse</th>
                      <th className="py-2 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.length > 0 ? (
                      patients.map((patient) => (
                        <tr key={patient.id} className="border-t hover:bg-gray-50">
                          <td className="py-2 px-3">{patient.nom}</td>
                          <td className="py-2 px-3">{patient.prenom}</td>
                          <td className="py-2 px-3">{patient.cin || "—"}</td>
                          <td className="py-2 px-3">{patient.tel || "—"}</td>
                          <td className="py-2 px-3">{patient.adresse || "—"}</td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => handleAjouterConsultation(patient.id)}
                              className="text-white hover:underline font-medium"
                            >
                              ajouter une consultation
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-4 text-center text-gray-500">
                          Aucun patient trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;