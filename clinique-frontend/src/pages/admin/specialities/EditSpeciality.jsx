// src/pages/admin/specialities/EditSpeciality.jsx

import React, { useState, useEffect } from "react";
import { getSpecialityById, updateSpeciality } from "../../../services/specialityService";
import { useParams, useNavigate } from "react-router-dom";

// Layout
import Sidebar from "../../../components/SidebarA";
import TopBar from "../../../components/TopBar";

function EditSpeciality() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        description: "",
        details: "",
        iconName: ""
    });

    useEffect(() => {
        getSpecialityById(id).then(data => setForm(data));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSpeciality(id, form).then(() => navigate("/admin/specialites"));
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">

            <Sidebar />

            <div className="flex-1 flex flex-col">

                <TopBar />

                <main className="p-6 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm max-w-3xl">
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">
                            Modifier la spécialité
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <input
                                value={form.title}
                                placeholder="Titre"
                                className="border p-3 w-full rounded-lg"
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />

                            <input
                                value={form.description}
                                placeholder="Description"
                                className="border p-3 w-full rounded-lg"
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                required
                            />

                            <textarea
                                value={form.details}
                                placeholder="Détails"
                                className="border p-3 w-full rounded-lg"
                                onChange={(e) => setForm({ ...form, details: e.target.value })}
                                rows="4"
                            />

                            <input
                                value={form.iconName}
                                placeholder="Nom de l'icône (ex: Heart, Stethoscope...)"
                                className="border p-3 w-full rounded-lg"
                                onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                            />

                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow"
                            >
                                Modifier
                            </button>

                        </form>
                    </div>
                </main>

            </div>
        </div>
    );
}

export default EditSpeciality;
