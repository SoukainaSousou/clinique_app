import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPatientS() {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", tel: "", adresse: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout du patient");

      setSuccess(true);
      setTimeout(() => navigate("/secretaire/dashboard/patients"), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Ajouter un patient</h2>
      {success && <p className="text-green-600 mb-4">Patient ajouté avec succès !</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

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
