import React from "react";
import Sidebar from "../../components/SidebarM";
import TopBar from "../../components/TopBar";


const Rendezvous = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* --- Sidebar --- */}
            <Sidebar />

            {/* --- Contenu principal --- */}
            <div className="flex-1 flex flex-col">
                <TopBar />
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">📅 Mes Rendez-vous</h1>
                    <p className="text-gray-600 mb-4">
                        Voici la liste de vos rendez-vous programmés.
                    </p>

                    <table className="w-full border border-gray-200 rounded-lg text-sm">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="py-2 px-3 text-left">Patient</th>
                                <th className="py-2 px-3 text-left">Date</th>
                                <th className="py-2 px-3 text-left">Heure</th>
                                <th className="py-2 px-3 text-left">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t hover:bg-gray-50">
                                <td className="py-2 px-3">Ahmed El Amrani</td>
                                <td className="py-2 px-3">01/11/2025</td>
                                <td className="py-2 px-3">10:00</td>
                                <td className="py-2 px-3 text-green-600 font-semibold">Confirmé</td>
                            </tr>
                            <tr className="border-t hover:bg-gray-50">
                                <td className="py-2 px-3">Fatima Zahra</td>
                                <td className="py-2 px-3">02/11/2025</td>
                                <td className="py-2 px-3">14:30</td>
                                <td className="py-2 px-3 text-yellow-600 font-semibold">En attente</td>
                            </tr>
                            <tr className="border-t hover:bg-gray-50">
                                <td className="py-2 px-3">Hassan Rami</td>
                                <td className="py-2 px-3">03/11/2025</td>
                                <td className="py-2 px-3">16:00</td>
                                <td className="py-2 px-3 text-red-600 font-semibold">Annulé</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Rendezvous;
