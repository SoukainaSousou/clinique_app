import { Outlet } from "react-router-dom";
import SidebarS from "../../components/SidebarS";
import TopBar from "../../components/TopBar";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarS />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="p-6 flex-1">
          <Outlet /> {/* Les pages enfants s'affichent ici */}
        </main>
      </div>
    </div>
  );
}
