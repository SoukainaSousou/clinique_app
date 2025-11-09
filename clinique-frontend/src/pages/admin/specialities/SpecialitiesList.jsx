// src/pages/admin/Specialities/SpecialitiesList.jsx

import React, { useEffect, useState } from "react";
import { getSpecialities, deleteSpeciality } from "../../../services/specialityService";
import { Link } from "react-router-dom";

// ⚠️ Import du layout
import Sidebar from "../../../components/SidebarA";
import TopBar from "../../../components/TopBar";
import { Edit, Trash2 } from "lucide-react";

function SpecialitiesList() {
    const [specialities, setSpecialities] = useState([]);

    useEffect(() => {
        getSpecialities().then(data => setSpecialities(data));
    }, []);

    const handleDelete = (id) => {
        deleteSpeciality(id).then(() => {
            setSpecialities(specialities.filter(s => s.id !== id));
        });
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {/* TopBar */}
                <TopBar />

                {/* Contenu principal */}
                <main className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold mb-4">Liste des Spécialités</h1>

                    <Link to="/admin/specialites/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                        + Ajouter une spécialité
                    </Link>

                    <div className="overflow-x-auto mt-5">
                        <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr className="text-left">
                                    <th className="px-3 py-2 border">Titre</th>
                                    <th className="px-3 py-2 border">Description</th>
                                    <th className="px-3 py-2 border">Détails</th>
                                    <th className="px-3 py-2 border">Icône</th>
                                    <th className="px-3 py-2 border">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {specialities.map(s => (
                                    <tr key={s.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 border">{s.title}</td>
                                        <td className="px-3 py-2 border">{s.description}</td>
                                        <td className="px-3 py-2 border">{s.details}</td>
                                        <td className="px-3 py-2 border">{s.iconName}</td>
                                        <td className="px-4 py-2 border flex gap-2">
                                            {/* Bouton Modifier */}
                                            <Link
                                                to={`/admin/specialites/edit/${s.id}`}
                                                className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"

                                            >
                                                Modifier
                                            </Link>

                                            {/* Bouton Supprimer */}
                                            <button
                                                onClick={() => handleDelete(s.id)}
                                                className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-white"

                                            >
                                                Supprimer
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default SpecialitiesList;
