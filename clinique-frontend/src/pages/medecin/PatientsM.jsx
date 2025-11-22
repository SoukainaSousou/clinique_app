import React from "react";
import Sidebar from "../../components/SidebarM";
import TopBar from "../../components/TopBar";

const Patients = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* --- Sidebar --- */}
      <Sidebar />

      {/* --- Contenu principal --- */}
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">👨‍⚕️ Mes Patients</h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
              + Ajouter un Patient
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            Liste complète des patients suivis dans votre clinique.
          </p>

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
              <tr className="border-t hover:bg-gray-50">
                <td className="py-2 px-3">El Amrani</td>
                <td className="py-2 px-3">Ahmed</td>
                <td className="py-2 px-3">AA123456</td>
                <td className="py-2 px-3">+212 612345678</td>
                <td className="py-2 px-3">Casablanca</td>
                <td className="py-2 px-3 text-center">
                  <button className="text-white-600 hover:underline mr-2">Voir</button>
                  <button className="text-white-600 hover:underline mr-2">Modifier</button>
                  <button className="text-white-600 hover:underline">Supprimer</button>
                </td>
              </tr>
              <tr className="border-t hover:bg-gray-50">
                <td className="py-2 px-3">Zahraoui</td>
                <td className="py-2 px-3">Fatima</td>
                <td className="py-2 px-3">BB789654</td>
                <td className="py-2 px-3">+212 699887766</td>
                <td className="py-2 px-3">Rabat</td>
                <td className="py-2 px-3 text-center">
                  <button className="text-white-600 hover:underline mr-2">Voir</button>
                  <button className="text-white-600 hover:underline mr-2">Modifier</button>
                  <button className="text-white-600 hover:underline">Supprimer</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Patients;
