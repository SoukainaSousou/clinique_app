import axios from "axios";

const API_URL = "http://localhost:8080/api/patients";

export const getPatientByEmail = async (email) => {
  try {
    const response = await fetch(`http://localhost:8080/api/patients/email/${encodeURIComponent(email)}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Patient non trouvé
      }
      throw new Error('Erreur serveur');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur getPatientByEmail:', error);
    return null;
  }
};

export const createPatient = async (patientData) => {
  // Transformer les noms de champs pour correspondre à votre entité Java
  const transformedData = {
    nom: patientData.nom,
    prenom: patientData.prenom,
    email: patientData.email,
    tel: patientData.telephone,           // "tel" au lieu de "telephone"
    cin: patientData.cin,                 // "cin" 
    motDePasse: patientData.mot_de_passe, // "motDePasse" au lieu de "mot_de_passe"
    adresse: null                         // Champ requis par votre entité
  };

  console.log("🧹 Données transformées pour le backend:", transformedData);
  
  try {
    const response = await axios.post(API_URL, transformedData);
    console.log("✅ Patient créé avec succès:", response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur createPatient:', error);
    
    if (error.response) {
      console.error("📡 Status:", error.response.status);
      console.error("📡 Données d'erreur:", error.response.data);
    }
    
    throw error;
  }
};