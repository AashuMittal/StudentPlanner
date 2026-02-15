import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { ClearAllNotifications, GetNotifications, MarkNotificationRead } from "../../utils/api";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [soundAllowed, setSoundAllowed] = useState(false);

  // 🔁 LOAD NOTIFICATIONS
  const load = async () => {
    const data = await GetNotifications();
    setNotifications(data || []);
  };

  // 🔊 SOUND (browser rule safe)
  const playSound = () => {
    if (!soundAllowed) return;
    const audio = new Audio("/bellNotification.mp3"); // public folder
    audio.play().catch(() => {});
  };

  // 🔔 Play sound when new unread notification comes
  useEffect(() => {
    if (notifications.length > 0) {
      const hasUnread = notifications.some((n) => !n.isRead);
      if (hasUnread) playSound();
    }
  }, [notifications]);

  // ⏱️ POLLING (no socket)
  useEffect(() => {
    load();
    const i = setInterval(load, 15000);
    return () => clearInterval(i);
  }, []);

  const unread = notifications.filter((n) => !n.isRead).length;

  const handleRead = async (id) => {
    await MarkNotificationRead(id);
    load();
  };

  const handleClearAll = async () => {
  await ClearAllNotifications();
  setNotifications([]);
};


  return (
    <div className="relative">
      {/* 🔔 BELL BUTTON */}
      <button
        onClick={() => {
          setOpen(!open);
          setSoundAllowed(true); // 👈 first user interaction
        }}
        className={`relative w-10 h-10 flex items-center justify-center rounded-full 
        bg-white hover:bg-gray-100 transition
        ${unread > 0 ? "animate-pulse" : ""}`}
      >
        <Bell className="text-gray-700" size={20} />

        {/* 🔴 BADGE */}
        {unread > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px]
            bg-red-600 text-white text-[11px] font-semibold
            rounded-full flex items-center justify-center px-1"
          >
            {unread}
          </span>
        )}
      </button>

      {/* 🌑 MOBILE BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 sm:hidden"
        />
      )}

      {/* 🔽 DROPDOWN (RESPONSIVE) */}
      {open && (
        <div
          className="
            fixed inset-x-2 top-16 z-50
            sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 sm:w-80
            bg-white rounded-2xl shadow-2xl border overflow-hidden
          "
        >
          {/* HEADER */}
          <div className="px-4 py-3 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Notifications
            </h3>
            <span className="text-xs text-gray-500">
              {unread} unread
            </span>
             {notifications.length > 0 && (
      <button
        onClick={handleClearAll}
        className="text-xs text-red-500 hover:text-red-700"
      >
        Clear All
      </button>
    )}
          </div>

          {/* BODY */}
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-6">
                No notifications yet
              </p>
            )}

            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleRead(n._id)}
                className={`px-4 py-3 border-b cursor-pointer transition
                ${
                  n.isRead
                    ? "bg-white hover:bg-gray-50"
                    : "bg-indigo-50 hover:bg-indigo-100"
                }`}
              >
                <p className="text-sm font-medium text-gray-800">
                  {n.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {n.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
