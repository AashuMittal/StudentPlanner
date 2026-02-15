"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetPhoto } from "../../utils/api";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [photoId, setPhotoId] = useState(null);
  const [photoSrc, setPhotoSrc] = useState(null);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load user + photo from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPhoto = localStorage.getItem("photo");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("User parse error", err);
      }
    }

    if (storedPhoto) {
      setPhotoId(storedPhoto);
    }
  }, []);

  // Fetch photo when photoId changes
  useEffect(() => {
    if (!photoId) {
      setPhotoSrc(null);
      return;
    }

    const fetchPhoto = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(GetPhoto(photoId), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Photo fetch failed");

        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        setPhotoSrc(imageUrl);
      } catch (err) {
        console.error("Navbar photo error:", err);
        setPhotoSrc(null);
      }
    };

    fetchPhoto();
  }, [photoId]);

  // Listen for localStorage changes (profile update sync)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedPhoto = localStorage.getItem("photo");
      setPhotoId(updatedPhoto);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
    setShowMenu(false);
  };

  return (
    <header className="flex justify-end items-center gap-4">
      {user && (
        <>
          <NotificationBell />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowMenu((p) => !p)}
              className="w-10 h-10 flex items-center justify-center bg-blue-700 text-white rounded-full font-medium hover:bg-blue-600 transition overflow-hidden"
            >
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name?.charAt(0)?.toUpperCase()
              )}
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-xl w-64 p-4 z-50 border">
                <div className="flex items-center gap-3 border-b pb-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {photoSrc ? (
                      <img
                        src={photoSrc}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-black font-medium">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleProfile}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
