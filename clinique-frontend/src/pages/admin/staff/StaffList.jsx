import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../../services/userService";
import { Link } from "react-router-dom";
// Layout
import Sidebar from "../../../components/SidebarA";
import TopBar from "../../../components/TopBar";

const StaffList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getAllUsers();
            if (Array.isArray(res.data)) {
                setUsers(res.data);
            } else {
                console.error("Les données reçues ne sont pas un tableau :", res.data);
                setUsers([]);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des utilisateurs :", err);
            alert("Erreur lors du chargement des utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
            try {
                console.log("Tentative de suppression user ID:", id);
                const response = await deleteUser(id);
                console.log("Réponse suppression:", response);
                
                // Vérifier si la suppression a réussi
                if (response.status === 200) {
                    alert("Utilisateur supprimé avec succès");
                    fetchUsers(); // Recharge la liste
                } else {
                    alert("Erreur lors de la suppression");
                }
            } catch (err) {
                console.error("Erreur détaillée suppression:", err);
                
                // Afficher un message d'erreur clair
                let errorMessage = "Erreur lors de la suppression";
                
                if (err.response) {
                    // Erreur du serveur avec réponse
                    errorMessage = err.response.data || 
                                 err.response.data?.message || 
                                 `Erreur ${err.response.status}: ${err.response.statusText}`;
                } else if (err.request) {
                    // Erreur de réseau
                    errorMessage = "Erreur de connexion au serveur";
                } else {
                    // Autre erreur
                    errorMessage = err.message || "Erreur inconnue";
                }
                
                alert(errorMessage);
            }
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="p-6">
                    <h1 className="text-3xl font-bold mb-6">Personnel de la clinique</h1>

                    <Link
                        to="/admin/staff/add"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 inline-block"
                    >
                        Ajouter un utilisateur
                    </Link>

                    {loading && <p className="text-blue-600">Chargement...</p>}

                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 shadow-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border">Nom</th>
                                    <th className="px-4 py-2 border">Prénom</th>
                                    <th className="px-4 py-2 border">Email</th>
                                    <th className="px-4 py-2 border">Rôle</th>
                                    <th className="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(users) && users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border">{user.nom}</td>
                                        <td className="px-4 py-2 border">{user.prenom}</td>
                                        <td className="px-4 py-2 border">{user.email}</td>
                                        <td className="px-4 py-2 border capitalize">{user.role}</td>
                                        <td className="px-4 py-2 border flex gap-2">
                                            <Link
                                                to={`/admin/staff/update/${user.id}`}
                                                className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-white"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!Array.isArray(users) || users.length === 0) && (
                                    <tr>
                                        <td colSpan="5" className="text-center p-4">
                                            Aucun utilisateur trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StaffList;