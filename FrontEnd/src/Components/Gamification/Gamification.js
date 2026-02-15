"use client";
import { Lock, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { GetAchievements, GetProgress } from "../../utils/api";

export default function Gamification() {
  const [achievements, setAchievements] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    GetAchievements().then(setAchievements);
    GetProgress().then(setProgress);
  }, []);

  if (!progress) return null;

  const total = 5;
  const unlocked = achievements.length;
  const percent = Math.min((unlocked / total) * 100, 100);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">🎮 Gamification</h1>

      {/* LEVEL */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl mb-6">
        <h2 className="text-2xl font-bold">Level {progress.level}</h2>
        <p>XP: {progress.xp}</p>

        <div className="mt-3 bg-white/20 h-3 rounded-full">
          <div
            className="bg-yellow-400 h-full rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[ "✍️ First Note", "📝 5 Notes", "📚 10 Notes", "⬆️ Level 2", "🔥 3 Day Streak" ].map((name, i) => {
          const unlockedOne = achievements.find(a => a.name === name);
          return (
            <div
              key={i}
              className={`p-5 rounded-xl text-center ${
                unlockedOne
                  ? "bg-slate-900 border border-indigo-500"
                  : "bg-black/30 opacity-40"
              }`}
            >
              {unlockedOne ? (
                <Trophy className="mx-auto text-yellow-400" />
              ) : (
                <Lock className="mx-auto" />
              )}
              <p className="mt-2 text-sm">{name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
