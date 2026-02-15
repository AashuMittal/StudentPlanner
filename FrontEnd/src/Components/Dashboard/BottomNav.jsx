import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg lg:hidden">
      <div className="grid grid-cols-5 text-xs text-center">
        
        <Item to="/dashboard" label="Home" icon="📊" />
        <Item to="/dashboard/budget" label="Budget" icon="💰" />
        <Item to="/dashboard/studytask" label="Tasks" icon="📚" />
        <Item to="/dashboard/note" label="Notes" icon="📝" />
        <Item to="/dashboard/gamification" label="Awards" icon="🏆" />

      </div>
    </div>
  );
}

function Item({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center py-3 transition
        ${isActive ? "text-indigo-600 font-semibold" : "text-gray-500"}`
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
