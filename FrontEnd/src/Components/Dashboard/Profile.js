"use client";
import { Camera, Mail, Pencil, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeletePhoto, GetPhoto, PhotoUpload } from "../../utils/api";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [photoId, setPhotoId] = useState(null);
  const [photoSrc, setPhotoSrc] = useState(null);

  // Load user + photo separately
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPhoto = localStorage.getItem("photo");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedPhoto) setPhotoId(storedPhoto);
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
        console.error("Photo load error:", err);
        setPhotoSrc(null);
      }
    };

    fetchPhoto();
  }, [photoId]);

  const goToEdit = () => {
    navigate("/edit");
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const res = await PhotoUpload(file);

    if (res.success) {
      setPhotoId(res.id);
      localStorage.setItem("photo", res.id);
    } else {
      console.error(res.message);
    }
  };

  const handleDeletePhoto = async () => {
    if (!photoId) return;

    const res = await DeletePhoto(photoId);

    if (res.success) {
      setPhotoId(null);
      setPhotoSrc(null);
      localStorage.removeItem("photo");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      
      <div className="relative h-64 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative max-w-7xl mx-auto px-8 h-full flex items-end pb-6">
          <div className="flex items-center gap-6">

            <div className="relative">
              <img
                src={photoSrc || "https://i.pravatar.cc/150"}
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                alt="profile"
              />

              <button
                className="absolute bottom-1 right-1 bg-black/70 p-2 rounded-full hover:scale-105 transition"
                onClick={handleCameraClick}
              >
                <Camera size={16} />
              </button>

              {photoId && (
                <button
                  className="absolute top-1 right-1 bg-red-600 p-2 rounded-full hover:scale-105 transition"
                  onClick={handleDeletePhoto}
                >
                  <Trash2 size={14} />
                </button>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-white/80">{user.email}</p>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="backdrop-blur-xl rounded-2xl p-8 border border-white/10">

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <button
              onClick={goToEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              <Pencil size={16} />
              Edit
            </button>
          </div>

          <div className="grid gap-6">

            <div>
              <label className="text-sm text-white/60">Full Name</label>
              <div className="flex items-center gap-2 mt-2 bg-black/30 rounded-lg px-3 py-3">
                <User size={18} className="text-white/40" />
                {user.name}
              </div>
            </div>

            <div>
              <label className="text-sm text-white/60">Email</label>
              <div className="flex items-center gap-2 mt-2 bg-black/30 rounded-lg px-3 py-3">
                <Mail size={18} className="text-white/40" />
                <input
                  disabled
                  value={user.email || ""}
                  className="bg-transparent outline-none w-full"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
