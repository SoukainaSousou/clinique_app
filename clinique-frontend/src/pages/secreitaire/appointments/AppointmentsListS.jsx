import { Link } from "react-router-dom";
import { useState } from "react";

export default function AppointmentsListS() {
  const [appointments, setAppointments] = useState([
    { id:1, patient:"Jean Dupont", medecin:"Dr. Martin", date:"2025-11-02", heure:"10:00", motif:"Consultation", statut:"Confirmé" },
    { id:2, patient:"Claire Martin", medecin:"Dr. Dupuis", date:"2025-11-03", heure:"14:00", motif:"Suivi", statut:"En attente" },
  ]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Rendez-vous</h2>
        <Link
          to="/secretaire/dashboard/appointments/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nouveau RDV
        </Link>
      </div>

      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Patient</th>
            <th className="p-3">Médecin</th>
            <th className="p-3">Date</th>
            <th className="p-3">Heure</th>
            <th className="p-3">Motif</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{a.patient}</td>
              <td className="p-3">{a.medecin}</td>
              <td className="p-3">{a.date}</td>
              <td className="p-3">{a.heure}</td>
              <td className="p-3">{a.motif}</td>
              <td className="p-3">{a.statut}</td>
              <td className="p-3">
                <Link
                  to={`/secretaire/dashboard/appointments/edit/${a.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Modifier / Annuler
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
