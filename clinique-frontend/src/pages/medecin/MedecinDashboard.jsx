import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import StatCard from "../../components/StatCard";
import { User, CalendarDays, FileText, Activity } from "lucide-react";
import Sidebar from "../../components/SidebarM";
import TopBar from "../../components/TopBar";

const data = [
  { name: "Lun", patients: 12 },
  { name: "Mar", patients: 18 },
  { name: "Mer", patients: 15 },
  { name: "Jeu", patients: 22 },
  { name: "Ven", patients: 10 },
  { name: "Sam", patients: 8 },
  { name: "Dim", patients: 5 },
];

const MedecinDashboard = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* --- Sidebar --- */}
      <Sidebar />

      {/* --- Contenu principal --- */}
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="p-6 space-y-6">
          {/* --- Statistiques principales --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Mes Patients"
              value="128"
              subtitle="+6 cette semaine"
              icon={<User size={24} />}
              color="blue"
            />
            <StatCard
              title="Rendez-vous Aujourd’hui"
              value="12"
              subtitle="3 urgences"
              icon={<CalendarDays size={24} />}
              color="green"
            />
            <StatCard
              title="Dossiers Médicaux"
              value="245"
              subtitle="Mises à jour récentes"
              icon={<FileText size={24} />}
              color="purple"
            />
            <StatCard
              title="Consultations Actives"
              value="5"
              subtitle="En cours"
              icon={<Activity size={24} />}
              color="teal"
            />
          </div>

          {/* --- Graphiques --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* --- Graphique patients --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Patients vus par jour</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                  <YAxis tick={{ fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="patients" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* --- Statistique spéciale 1 --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Taux de Satisfaction</h3>
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    89%
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Patients satisfaits</p>
                </div>
              </div>
            </div>

            {/* --- Statistique spéciale 2 --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Consultations terminées</h3>
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    76%
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Aujourd’hui</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedecinDashboard;
