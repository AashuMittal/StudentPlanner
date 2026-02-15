import { useState } from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen bg-[#e9ecf3] flex overflow-hidden">
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed lg:static z-50 h-full transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-[#f5f7fb] overflow-y-auto">
        {/* MOBILE HEADER */}
        <div className="lg:hidden p-4 bg-white shadow flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>
          <h1 className="font-bold">Dashboard</h1>
        </div>

        <div className="p-4 lg:p-6">
          <Outlet />
        </div>

        <BottomNav/>
      </div>
    </div>
  );
}
