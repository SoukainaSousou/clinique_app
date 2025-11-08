import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

export default function PatientsListS() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/patients")
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(() => setError("Erreur de chargement des patients"));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestion des patients</h2>
        <Link
          to="/secretaire/dashboard/patients/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter un patient
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prénom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">{p.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.prenom}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.tel}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.adresse}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Link to={`/secretaire/dashboard/patients/edit/${p.id}`} className="text-blue-600 hover:text-blue-800">
                    <PencilSquareIcon className="w-5 h-5 inline" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
