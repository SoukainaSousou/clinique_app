// src/pages/medecin/MedecinDashboard.jsx
import { useState, useEffect } from 'react';
import StatCard from "../../components/StatCard";
import { User, CalendarDays, FileText } from "lucide-react";
import Sidebar from "../../components/SidebarM";
import TopBar from "../../components/TopBar";
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import axios from "axios";

// 👇 Helper : formate une date ISO en "Lun 30"
const formatDayLabel = (isoDate) => {
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const date = new Date(isoDate);
  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  return `${dayName} ${dayNum}`;
};

// 👇 Helper : formate une date ISO en "Lundi 30 Décembre 2025"
const formatFullDate = (isoDate) => {
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const date = new Date(isoDate);
  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName} ${dayNum} ${monthName} ${year}`;
};

// 👇 Créneaux horaires par jour
const getSlotsByDay = (dayOfWeek) => {
  if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Lundi=1 → Vendredi=5
    return [
      "09:00", "09:30", "10:00", "10:30",
      "11:00", "11:30", "14:00", "14:30",
      "15:00", "15:30", "16:00", "16:30", "17:00"
    ];
  }
  if (dayOfWeek === 6) { // Samedi
    return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
  }
  return [];
};

const MedecinDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    rendezVousToday: 0,
    dossiersMedicaux: 0,
    consultationsActives: 0
  });
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // ⚠️ Charger les stats, mais ne pas bloquer si erreur
        try {
          const statsData = await dashboardService.getStats(user.id);
          setStats(statsData);
        } catch (statsError) {
          console.warn("⚠️ Stats non chargées, on continue :", statsError.message);
        }

        // ✅ Charger les rendez-vous (prioritaire)
        const url = `http://localhost:8080/api/medecins/medecin/rendezvous/${user.id}`;
        console.log("🔗 Appel API RDV :", url);

        const response = await axios.get(url);
        const rendezvous = response.data || [];

        console.log("📋 RDVs reçus :", rendezvous);

        // 3. Générer les dates de la semaine (Lundi à Samedi)
        const today = new Date();
        const currentDay = today.getDay(); // 0 = dim, 1 = lun, ..., 6 = sam
        const offsetToMonday = currentDay === 0 ? -6 : 1 - currentDay;
        const monday = new Date(today);
        monday.setDate(today.getDate() + offsetToMonday);

        const weekdays = [];
        for (let i = 0; i < 6; i++) { // Lundi (0) → Samedi (5)
          const day = new Date(monday);
          day.setDate(monday.getDate() + i);
          weekdays.push(day);
        }

        // 4. Formater en YYYY-MM-DD
        const dateKeys = weekdays.map(d => d.toISOString().split('T')[0]);

        // 5. Construire l'emploi du temps
        const schedule = {};
        dateKeys.forEach(date => {
          const dateObj = new Date(date);
          const dayOfWeek = dateObj.getDay(); // 1=Lun, ..., 6=Sam
          const slots = getSlotsByDay(dayOfWeek);

          // ✅ Comparaison directe (les dates sont déjà au format YYYY-MM-DD)
          const occupiedSlots = rendezvous
            .filter(rdv => rdv.date === date)
            .map(rdv => ({
              slot: rdv.slot,
              patient: rdv.patient?.nom ? `${rdv.patient.nom} ${rdv.patient.prenom}` : "Patient inconnu",
              date: rdv.date
            }));

          schedule[date] = {
            dayLabel: formatDayLabel(date),
            slots,
            occupied: occupiedSlots
          };
        });

        setWeeklySchedule(schedule);
      } catch (error) {
        console.error("❌ Erreur chargement dashboard :", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <div className="fixed left-0 top-0 h-full z-30 w-64 bg-white shadow-md">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col ml-64">
          <div className="fixed top-0 right-0 left-64 z-20 bg-white shadow-sm">
            <TopBar />
          </div>
          <div className="pt-16 p-6">
            <div className="text-center py-10">Chargement du tableau de bord...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="fixed left-0 top-0 h-full z-30 w-64 bg-white shadow-md">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col ml-64">
        <div className="fixed top-0 right-0 left-64 z-20 bg-white shadow-sm">
          <TopBar />
        </div>

        <main className="p-6 space-y-6 pt-16">
          {/* Statistiques - 3 blocs seulement, plus petits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bloc Mes Patients */}
            <div className="bg-blue-500 text-white rounded-xl p-4 shadow-sm hover:bg-blue-600 transition-colors duration-200 cursor-pointer">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm">Mes Patients</h3>
                <User size={20} />
              </div>
              <div className="text-2xl font-bold">{stats.totalPatients > 0 ? stats.totalPatients : 1}</div>
              <div className="text-xs opacity-80"></div>
            </div>

            {/* Bloc Rendez-vous Aujourd'hui */}
            <div className="bg-green-500 text-white rounded-xl p-4 shadow-sm hover:bg-green-600 transition-colors duration-200 cursor-pointer">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm">Rendez-vous Aujourd’hui</h3>
                <CalendarDays size={20} />
              </div>
              <div className="text-2xl font-bold">{stats.rendezVousToday}</div>
              <div className="text-xs opacity-80"></div>
            </div>

            {/* Bloc Dossiers Médicaux */}
            <div className="bg-purple-500 text-white rounded-xl p-4 shadow-sm hover:bg-purple-600 transition-colors duration-200 cursor-pointer">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm">Dossiers Médicaux</h3>
                <FileText size={20} />
              </div>
              <div className="text-2xl font-bold">{stats.dossiersMedicaux > 0 ? stats.dossiersMedicaux : 1}</div>
              <div className="text-xs opacity-80">Mises à jour récentes</div>
            </div>
          </div>

          {/* Emploi du temps - Tableau inversé avec tooltip violet */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              📅 Mon Emploi du Temps (Semaine en cours)
            </h3>
            {Object.keys(weeklySchedule).length === 0 ? (
              <p className="text-gray-500 italic text-center py-6">
                Aucun rendez-vous programmé cette semaine.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 bg-gray-100 border border-gray-300 text-left font-medium text-gray-700">
                        Jour
                      </th>
                      {getSlotsByDay(1).map((slot, idx) => (
                        <th
                          key={idx}
                          className="px-2 py-1 bg-gray-100 border border-gray-300 text-center font-medium text-gray-700"
                        >
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(weeklySchedule).map(([date, data]) => (
                      <tr key={date} className="hover:bg-blue-50 transition-colors duration-200">
                        <td className="px-2 py-1 border border-gray-300 text-center font-medium text-gray-700">
                          {data.dayLabel}
                        </td>
                        {getSlotsByDay(1).map((slot, slotIdx) => {
                          const isOccupied = data.occupied.find(rdv => rdv.slot === slot);
                          return (
                            <td
                              key={`${date}-${slot}`}
                              className={`px-2 py-1 border border-gray-300 text-center ${
                                isOccupied
                                  ? "bg-green-50 hover:bg-green-100"
                                  : "bg-white hover:bg-gray-50"
                              } transition-colors duration-200 relative group`}
                            >
                              {isOccupied ? (
                                <div className="flex items-center justify-center cursor-pointer">
                                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>

                                  {/* Tooltip violet au survol */}
                                  <div className="absolute bottom-full left-1/2 mb-2 px-3 py-2 bg-purple-800 text-white text-xs rounded shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform -translate-x-1/2 whitespace-nowrap">
                                    <div><strong>{isOccupied.patient}</strong></div>
                                    <div>{slot}</div>
                                    <div>{formatFullDate(isOccupied.date)}</div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs opacity-60">○</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedecinDashboard;