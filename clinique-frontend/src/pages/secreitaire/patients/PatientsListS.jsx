import { Link } from "react-router-dom";
import { useState } from "react";

export default function PatientsListS() {
  const [patients, setPatients] = useState([
    { id: 1, nom: "Dupont", prenom: "Jean", tel: "0600000000" },
    { id: 2, nom: "Martin", prenom: "Claire", tel: "0600000001" },
  ]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Gestion des patients</h2>
        <Link
          to="/secretaire/dashboard/patients/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter un patient
        </Link>
      </div>

      <ul>
        {patients.map((p) => (
          <li key={p.id} className="bg-white p-3 rounded mb-2 shadow flex justify-between">
            <div>{p.nom} {p.prenom} - {p.tel}</div>
            <Link
              to={`/secretaire/dashboard/patients/edit/${p.id}`}
              className="text-blue-600 hover:underline"
            >
              Modifier
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
