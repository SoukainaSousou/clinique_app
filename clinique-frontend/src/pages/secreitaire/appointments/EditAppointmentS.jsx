import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditAppointmentS() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ patient:"", medecin:"", date:"", heure:"", motif:"", statut:"" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Simuler récupération du rendez-vous depuis l'ID
    setForm({ patient:"Jean Dupont", medecin:"Dr. Martin", date:"2025-11-02", heure:"10:00", motif:"Consultation", statut:"Confirmé" });
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => navigate("/secretaire/dashboard/appointments"), 1000);
  };

  const handleCancel = () => {
    alert("Rendez-vous annulé !");
    navigate("/secretaire/dashboard/appointments");
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Modifier / Annuler Rendez-vous</h2>
      {success && <p className="text-green-600 mb-4">Rendez-vous modifié avec succès !</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-4">
        <input type="text" name="patient" value={form.patient} onChange={handleChange} className="w-full mb-3 p-2 border rounded"/>
        <input type="text" name="medecin" value={form.medecin} onChange={handleChange} className="w-full mb-3 p-2 border rounded"/>
        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full mb-3 p-2 border rounded"/>
        <input type="time" name="heure" value={form.heure} onChange={handleChange} className="w-full mb-3 p-2 border rounded"/>
        <input type="text" name="motif" value={form.motif} onChange={handleChange} className="w-full mb-3 p-2 border rounded"/>
        <select name="statut" value={form.statut} onChange={handleChange} className="w-full mb-3 p-2 border rounded">
          <option value="Confirmé">Confirmé</option>
          <option value="En attente">En attente</option>
          <option value="Annulé">Annulé</option>
        </select>
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Modifier</button>
          <button type="button" onClick={handleCancel} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Annuler RDV</button>
        </div>
      </form>
    </div>
  );
}
