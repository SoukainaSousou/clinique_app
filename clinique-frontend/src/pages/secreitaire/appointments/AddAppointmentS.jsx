import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddAppointmentS() {
  const [form, setForm] = useState({ patient:"", medecin:"", date:"", heure:"", motif:"", statut:"En attente" });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = e => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => navigate("/secretaire/dashboard/appointments"), 1000);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Nouveau Rendez-vous</h2>
      {success && <p className="text-green-600 mb-4">Rendez-vous ajouté avec succès !</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
        <input type="text" name="patient" placeholder="Nom du patient" onChange={handleChange} className="w-full mb-3 p-2 border rounded"/>
        <input type="text" name="medecin" placeholder="Médecin" onChange={handleChange} className="w-full mb-3 p-2 border rounded"/>
        <input type="date" name="date" onChange={handleChange} className="w-full mb-3 p-2 border rounded"/>
        <input type="time" name="heure" onChange={handleChange} className="w-full mb-3 p-2 border rounded"/>
        <input type="text" name="motif" placeholder="Motif" onChange={handleChange} className="w-full mb-3 p-2 border rounded"/>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Planifier</button>
      </form>
    </div>
  );
}
