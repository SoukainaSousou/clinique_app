import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPatientS() {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", tel: "", adresse: "" });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = e => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => navigate("/secretaire/dashboard/patients"), 1000);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Ajouter un patient</h2>
      {success && <p className="text-green-600 mb-4">Patient ajouté avec succès !</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
        {["nom","prenom","email","tel","adresse"].map(field => (
          <input
            key={field}
            type={field==="email"?"email":"text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
        ))}
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ajouter</button>
      </form>
    </div>
  );
}
