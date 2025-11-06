// src/components/TopBar.jsx
import { Search, Bell, MessageCircle, User } from 'lucide-react';

const TopBar = () => {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell size={20} className="text-gray-600 cursor-pointer" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
        </div>
        <MessageCircle size={20} className="text-gray-600 cursor-pointer" />
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
          <User size={16} className="text-gray-700" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;