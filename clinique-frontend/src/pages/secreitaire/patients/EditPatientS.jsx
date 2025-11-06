import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPatientS() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom:"", prenom:"", email:"", tel:"", adresse:"" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Simuler fetch API
    setForm({ nom:"Dupont", prenom:"Jean", email:"jean@test.com", tel:"0600000000", adresse:"Paris" });
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => navigate("/secretaire/dashboard/patients"), 1000);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Modifier Patient</h2>
      {success && <p className="text-green-600 mb-4">Patient modifié avec succès !</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
        {["nom","prenom","email","tel","adresse"].map(field => (
          <input
            key={field}
            type={field==="email"?"email":"text"}
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
        ))}
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Modifier</button>
      </form>
    </div>
  );
}
