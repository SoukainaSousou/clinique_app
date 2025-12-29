// src/pages/medecin/RendezvousM.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SidebarM";
import TopBar from "../../components/TopBar";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const RendezvousM = () => {
  const { user } = useAuth();
  const [rendezvous, setRendezvous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRendezvous = async () => {
      if (!user || !user.id) {
        setError("Aucun médecin connecté.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/medecins/medecin/rendezvous/${user.id}`
        );

        // ✅ Trier par date décroissante (plus récent en haut)
        const sorted = [...response.data].sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        setRendezvous(sorted);
      } catch (err) {
        console.error("Erreur lors du chargement des rendez-vous :", err);
        setError("Impossible de charger vos rendez-vous.");
      } finally {
        setLoading(false);
      }
    };

    fetchRendezvous();
  }, [user]);

  // ✅ Recherche : seulement nom, prénom, CNE
  const filteredRdv = rendezvous.filter((rdv) => {
    const nom = (rdv.patient?.nom || "").toLowerCase();
    const prenom = (rdv.patient?.prenom || "").toLowerCase();
    const cne = (rdv.patient?.cin || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      nom.includes(search) ||
      prenom.includes(search) ||
      cne.includes(search)
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <div className="p-6 text-center">Chargement de vos rendez-vous...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <div className="p-6 text-red-600">⚠️ {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="bg-white p-6 rounded-xl shadow-sm mx-6 mt-4">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">📅 Mes Rendez-vous</h1>

          {/* 🔍 Barre de recherche (nom, prénom, CNE) */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou CNE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {filteredRdv.length === 0 ? (
            <p className="text-gray-500 italic text-center py-6">
              Aucun rendez-vous trouvé.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="py-2 px-3 text-left">Patient</th>
                    <th className="py-2 px-3 text-left">CNE</th>
                    <th className="py-2 px-3 text-left">Téléphone</th>
                    <th className="py-2 px-3 text-left">Date</th>
                    <th className="py-2 px-3 text-left">Heure</th>
                    <th className="py-2 px-3 text-left">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRdv.map((rdv) => (
                    <tr key={rdv.id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium">
                        {rdv.patient?.nom || ""} {rdv.patient?.prenom || ""}
                      </td>
                      <td className="py-2 px-3">{rdv.patient?.cin || "—"}</td>
                      <td className="py-2 px-3">{rdv.patient?.tel || "—"}</td>
                      <td className="py-2 px-3">{formatDate(rdv.date)}</td>
                      <td className="py-2 px-3">{rdv.slot}</td>
                      <td className="py-2 px-3">
                        <span className="text-green-600 font-semibold">Confirmé</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RendezvousM;