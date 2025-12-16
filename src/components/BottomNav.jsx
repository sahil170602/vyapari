import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
} from "lucide-react";
import FabMenu from "./FabMenu";

export default function BottomNav() {
  const showSettingsBadge = true; // later control via state / profile completion

  const linkClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 text-xs ${
      isActive ? "text-purple-600" : "text-gray-500"
    }`;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-t border-gray-200 flex justify-around items-center z-40">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/parties" className={linkClass}>
          <Users size={20} />
          Parties
        </NavLink>

        {/* FAB placeholder space */}
        <div className="w-12" />

        <NavLink to="/purchases" className={linkClass}>
          <ShoppingBag size={20} />
          Purchases
        </NavLink>

        {/* SETTINGS WITH BADGE */}
        <NavLink to="/settings" className={linkClass}>
          <div className="relative">
            <Settings size={20} />
            {showSettingsBadge && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </div>
          Settings
        </NavLink>
      </nav>

      {/* Floating Action Button */}
      <FabMenu />
    </>
  );
}
