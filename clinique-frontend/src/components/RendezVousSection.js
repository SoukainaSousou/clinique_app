import React, { useState } from 'react';

export default function RendezVousSection() {
  const [rendezVous, setRendezVous] = useState([]);
  const [form, setForm] = useState({
    nomPatient: '',
    specialite: '',
    dateRendezVous: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nomPatient || !form.specialite || !form.dateRendezVous) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Créer un nouveau rendez-vous localement
    const nouveauRV = {
      id: Date.now(),
      nomPatient: form.nomPatient,
      specialite: form.specialite,
      dateRendezVous: form.dateRendezVous
    };

    setRendezVous([...rendezVous, nouveauRV]);

    // Réinitialiser le formulaire
    setForm({ nomPatient: '', specialite: '', dateRendezVous: '' });
  };

  return (
    <div className="rendezvous-section">
      <h2>🗓️ Prendre un Rendez-vous</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom du patient"
          value={form.nomPatient}
          onChange={(e) => setForm({ ...form, nomPatient: e.target.value })}
        />
        <input
          type="text"
          placeholder="Spécialité"
          value={form.specialite}
          onChange={(e) => setForm({ ...form, specialite: e.target.value })}
        />
        <input
          type="datetime-local"
          value={form.dateRendezVous}
          onChange={(e) => setForm({ ...form, dateRendezVous: e.target.value })}
        />
        <button type="submit">Ajouter</button>
      </form>

      <h3>📋 Liste des rendez-vous</h3>
      {rendezVous.length === 0 ? (
        <p>Aucun rendez-vous pour le moment.</p>
      ) : (
        <ul>
          {rendezVous.map((rv) => (
            <li key={rv.id}>
              <strong>{rv.nomPatient}</strong> - {rv.specialite} <br />
              <small>📅 {rv.dateRendezVous}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}