import { Link, useLocation } from "react-router-dom";
import { FaUserMd, FaCalendarAlt, FaUsers, FaSignOutAlt } from "react-icons/fa"; // icônes pro

export default function SidebarS() {
  const { pathname } = useLocation();

  const links = [
    { to: "/secretaire/dashboard", label: "DashboardS", icon: <FaUserMd size={18} /> },
    { to: "/secretaire/dashboard/patients", label: "Patients", icon: <FaUsers size={18} /> },
    { to: "/secretaire/dashboard/appointments", label: "Rendez-vous", icon: <FaCalendarAlt size={18} /> },
    // Tu peux ajouter Planning, Notifications etc.
  ];

  return (
    <div className="w-64 min-h-screen bg-white shadow-lg p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center mb-8">
        <FaUserMd size={28} className="text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-blue-600">Espace Secrétaire</h2>
      </div>

      {/* Links */}
      <nav className="flex-1 space-y-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`flex items-center p-3 rounded hover:bg-blue-50 text-blue-700 font-medium ${
              pathname === l.to ? "bg-blue-100 font-semibold" : ""
            }`}
          >
            <span className="mr-3">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Déconnexion */}
      <Link
        to="/"
        className="flex items-center p-3 mt-8 text-white bg-red-500 rounded hover:bg-red-600 justify-center"
      >
        <FaSignOutAlt className="mr-2" />
        Déconnexion
      </Link>
    </div>
  );
}
