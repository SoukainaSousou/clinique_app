// src/pages/Dashboard.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/StatCard';
import { Stethoscope, UserPlus, CalendarCheck, Clock } from 'lucide-react';
import Sidebar from '../../components/SidebarA';
import TopBar from '../../components/TopBar';

const data = [
  { name: 'Lun', patients: 12 },
  { name: 'Mar', patients: 18 },
  { name: 'Mer', patients: 15 },
  { name: 'Jeu', patients: 22 },
  { name: 'Ven', patients: 10 },
  { name: 'Sam', patients: 8 },
  { name: 'Dim', patients: 5 },
];

const Dashboard = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Médecins Actifs"
              value="24"
              subtitle="+3 ce mois"
              icon={<Stethoscope size={24} />}
              color="blue"
            />
            <StatCard
              title="Secrétaires"
              value="8"
              subtitle="Tous connectés"
              icon={<UserPlus size={24} />}
              color="green"
            />
            <StatCard
              title="Rdv Aujourd'hui"
              value="47"
              subtitle="23% vs hier"
              icon={<CalendarCheck size={24} />}
              color="purple"
            />
            <StatCard
              title="Attente Moyenne"
              value="15 min"
              subtitle="Optimisé"
              icon={<Clock size={24} />}
              color="teal"
            />
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Rendez-vous par jour</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Bar dataKey="patients" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Spécialités</h3>
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    42%
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Cardiologie</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">État des RDV</h3>
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    78%
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Confirmés</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;