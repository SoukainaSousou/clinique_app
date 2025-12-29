// src/pages/medecin/MedecinProfil.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import LayoutMedecin from '../../components/layout/LayoutMedecin';

// 👇 Fonction utilitaire pour générer l’URL complète de l’image
const getImageUrl = (path) => {
  if (!path || path === '👨‍⚕️') return '👨‍⚕️';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `http://localhost:8080${path}`;
  return `http://localhost:8080/${path}`;
};

const MedecinProfil = () => {
  const [profil, setProfil] = useState({
    nom: '',
    prenom: '',
    email: '',
    image: '',
    experiences: '',
    languages: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // 🔄 Charger le profil au montage
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      alert("Non connecté");
      navigate('/login');
      return;
    }

    const fetchProfil = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/medecins/user/${user.id}`);
        const data = res.data;

        // ✅ Accéder à data.user pour les infos perso
        setProfil({
          nom: data.user?.nom || 'Non renseigné',
          prenom: data.user?.prenom || 'Non renseigné',
          email: data.user?.email || 'Non renseigné',
          image: data.image || '👨‍⚕️',
          experiences: data.experiences || '',
          languages: data.languages || ''
        });
        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement profil", err);
        alert("Médecin non trouvé");
        navigate('/medecin/dashboard');
      }
    };

    fetchProfil();
  }, [user, authLoading, navigate]);

  // 🖼️ Gérer l’upload local (aperçu)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfil(prev => ({ ...prev, image: reader.result })); // DataURL temporaire
    };
    reader.readAsDataURL(file);
  };

  // 💾 Soumettre les modifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Vous devez être connecté pour enregistrer.");
      return;
    }

    setUploading(true);

    try {
      // Récupérer medecinId
      const medecinRes = await axios.get(`http://localhost:8080/api/medecins/user/${user.id}`);
      const medecinId = medecinRes.data.id;

      const formData = new FormData();
      formData.append('experiences', profil.experiences);
      formData.append('languages', profil.languages);

      // Si l'image est une DataURL (upload local), la convertir en Blob
      if (profil.image && profil.image.startsWith('data:image')) {
        const byteString = atob(profil.image.split(',')[1]);
        const mimeString = profil.image.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        formData.append('image', blob, 'profile.jpg');
      }

      // ✅ ENVOYER SANS HEADER MANUEL → Axios gère multipart/form-data
      await axios.put(`http://localhost:8080/api/medecins/${medecinId}/profil`, formData);

      // ✅ Recharger le profil
      const updatedRes = await axios.get(`http://localhost:8080/api/medecins/user/${user.id}`);
      setProfil({
        nom: updatedRes.data.user?.nom || 'Non renseigné',
        prenom: updatedRes.data.user?.prenom || 'Non renseigné',
        email: updatedRes.data.user?.email || 'Non renseigné',
        image: updatedRes.data.image || '👨‍⚕️',
        experiences: updatedRes.data.experiences || '',
        languages: updatedRes.data.languages || ''
      });

      alert("✅ Profil mis à jour avec succès !");
    } catch (err) {
      console.error("Erreur mise à jour", err);
      const errorMsg = err.response?.data || err.message || "Erreur inconnue";
      alert(`❌ Erreur : ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <LayoutMedecin>
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Chargement du profil...</p>
        </div>
      </LayoutMedecin>
    );
  }

  return (
    <LayoutMedecin>
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-3xl mx-auto">

        {/* En-tête avec avatar en cercle */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-gray-100 overflow-hidden flex items-center justify-center border-2 border-blue-200 shadow-sm">
            {profil.image && profil.image !== '👨‍⚕️' ? (
              <img
                src={getImageUrl(profil.image)}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="text-4xl">👨‍⚕️</span>';
                }}
              />
            ) : (
              <span className="text-4xl">👨‍⚕️</span>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">👨‍⚕️ Mon Profil</h1>
            <p className="text-gray-600">Gérez vos informations personnelles</p>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Informations personnelles</h2>
          <p><strong>Nom :</strong> {profil.nom}</p>
          <p><strong>Prénom :</strong> {profil.prenom}</p>
          <p><strong>Email :</strong> {profil.email}</p>
        </div>

        {/* Formulaire modifiable */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload d'image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📷 Photo de profil
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label
                htmlFor="upload-image"
                className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition shadow-sm"
              >
                Choisir une image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="upload-image"
              />
              {profil.image && profil.image.startsWith('data:image') && (
                <span className="text-sm text-green-600 font-medium">✓ Nouvelle image sélectionnée</span>
              )}
            </div>

            {/* Aperçu si DataURL */}
            {profil.image && profil.image.startsWith('data:image') && (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                  <img
                    src={profil.image}
                    alt="Nouvelle photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <small className="text-gray-500">Aperçu de la nouvelle photo</small>
              </div>
            )}
          </div>

          {/* Champs modifiables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expériences professionnelles
              </label>
              <textarea
                name="experiences"
                value={profil.experiences}
                onChange={(e) => setProfil(prev => ({ ...prev, experiences: e.target.value }))}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Ex: 10 ans en cardiologie, CHU Rabat..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Langues parlées
              </label>
              <input
                type="text"
                name="languages"
                value={profil.languages}
                onChange={(e) => setProfil(prev => ({ ...prev, languages: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Ex: Français, Anglais, Arabe"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-2.5 rounded-md font-medium transition ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </span>
            ) : (
              '💾 Enregistrer les modifications'
            )}
          </button>
        </form>
      </div>
    </LayoutMedecin>
  );
};

export default MedecinProfil;