import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../../services/userService";
import { Link } from "react-router-dom";
// Layout
import Sidebar from "../../../components/SidebarA";
import TopBar from "../../../components/TopBar";

const StaffList = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const res = await getAllUsers();
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
            await deleteUser(id);
            fetchUsers();
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col">
                {/* TopBar */}
                <TopBar />

                {/* Main content */}
                <main className="p-6">
                    <h1 className="text-3xl font-bold mb-6">Personnel de la clinique</h1>

                    <Link
                        to="/admin/staff/add"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 inline-block"
                    >
                        Ajouter un utilisateur
                    </Link>

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
                                {users.map((user) => (
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
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StaffList;
