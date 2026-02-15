import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      setUser(JSON.parse(storedData));
    }
  }, []);

  return (
    <div className="w-64 sm:w-72 bg-[#1f2b5b] text-white flex flex-col h-screen">
      
      {/* TITLE */}
      <div className="px-6 py-6 font-semibold text-xl  border-white/10">
        Dashboard
      </div>

      {/* MENU */}
      <div className="px-4 space-y-1 flex-1 py-4">
        <Item to="/dashboard" text="📊 Dashboard" />
        <Item to="/dashboard/budget" text="💰 Budget" />
        <Item to="/dashboard/studytask" text="📚 Study Tasks" />
        <Item to="/dashboard/note" text="📝 Notes" />
        <Item to="/dashboard/gamification" text="🏆 Gamification" />
      </div>

      {/* USER */}
      <div className="p-4 flex items-center gap-3 bg-[#182351]">
        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center overflow-hidden">
            <span className="font-semibold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          
        </div>
        <div>
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-300">Student</p>
        </div>
      </div>
    </div>
  );
}

function Item({ to, text }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-lg text-sm transition ${
          isActive ? "" : "hover:bg-[#2c3a75]"
        }`
      }
    >
      {text}
    </NavLink>
  );
}
