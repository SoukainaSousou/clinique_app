import axios from "axios";

const API_URL = "http://localhost:8080/api/patients";

// Dans patientService.js
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

export const createPatient = async (patient) => {
  return axios.post(API_URL, patient).then((res) => res.data);
};
