// src/pages/admin/Specialities/AddSpeciality.jsx

import React, { useState } from "react";
import { createSpeciality } from "../../../services/specialityService";
import { useNavigate } from "react-router-dom";

// Layout
import Sidebar from "../../../components/SidebarA";
import TopBar from "../../../components/TopBar";

function AddSpeciality() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: "", description: "", details: "", iconName: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        createSpeciality(form).then(() => navigate("/admin/specialites"));
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            
            <Sidebar />

            <div className="flex-1 flex flex-col">
                
                <TopBar />

                <main className="p-6 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm max-w-3xl">
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">
                            Ajouter une spécialité
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <input
                                placeholder="Titre"
                                className="border p-3 w-full rounded-lg"
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />

                            <input
                                placeholder="Description"
                                className="border p-3 w-full rounded-lg"
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                required
                            />

                            <textarea
                                placeholder="Détails"
                                className="border p-3 w-full rounded-lg"
                                onChange={(e) => setForm({ ...form, details: e.target.value })}
                                rows="4"
                            />

                            <input
                                placeholder="Nom de l'icône (ex: Heart, Stethoscope...)"
                                className="border p-3 w-full rounded-lg"
                                onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                            />

                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow"
                            >
                                + Ajouter
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AddSpeciality;
