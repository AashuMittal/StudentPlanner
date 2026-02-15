"use client";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AddTask, DeleteTask, GetTasks, UpdateTask } from "../../utils/api";

export default function StudyTask() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    subject: "",
    task: "",
    date: "",
    time: "",
  });

  const loadTasks = async () => {
    const res = await GetTasks();
    setTasks(res || []);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async () => {
    if (!form.subject || !form.task) return;

    if (editId) await UpdateTask(editId, form);
    else await AddTask(form);

    setForm({ subject: "", task: "", date: "", time: "" });
    setEditId(null);
    setShowForm(false);
    loadTasks();
  };

  const handleDelete = async (id) => {
    await DeleteTask(id);
    loadTasks();
  };

  const handleEdit = (task) => {
    setForm({
      subject: task.subject,
      task: task.task,
      date: task.date || "",
      time: task.time || "",
    });
    setEditId(task._id);
    setShowForm(true);
  };

  return (
    <div className="p-4 sm:p-8 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">📚 Study Planner</h1>

        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ subject: "", task: "", date: "", time: "" });
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-slate-900 p-4 sm:p-6 rounded-xl mb-6 border border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={form.subject}
              placeholder="Subject"
              className="bg-black/30 p-3 rounded-lg outline-none"
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
            />

            <input
              value={form.date}
              type="date"
              className="bg-black/30 p-3 rounded-lg outline-none"
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            <input
              value={form.time}
              type="time"
              className="bg-black/30 p-3 rounded-lg outline-none"
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
            />

            <textarea
              value={form.task}
              placeholder="Task description"
              rows={3}
              className="bg-black/30 p-3 rounded-lg outline-none sm:col-span-2"
              onChange={(e) =>
                setForm({ ...form, task: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end mt-4 gap-3">
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="px-4 py-2 bg-gray-600 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 rounded-lg"
            >
              {editId ? "Update Task" : "Save Task"}
            </button>
          </div>
        </div>
      )}

      {/* TASK LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {tasks.map((t) => (
          <div
            key={t._id}
            className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-white/10"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="px-3 py-1 text-xs bg-indigo-600 rounded-full">
                {t.subject}
              </span>

              <div className="flex gap-3">
                <button onClick={() => handleEdit(t)}>
                  <Pencil size={16} className="text-yellow-400" />
                </button>
                <button onClick={() => handleDelete(t._id)}>
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>

            <p className="text-white/90 text-sm sm:text-base mb-4">
              {t.task}
            </p>

            <div className="text-xs sm:text-sm text-white/60 flex justify-between">
              <span>📅 {t.date || "No date"}</span>
              <span>⏰ {t.time || "No time"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
