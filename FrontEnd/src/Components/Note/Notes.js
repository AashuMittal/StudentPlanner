"use client";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AddNote, DeleteNote, GetNotes, UpdateNote } from "../../utils/api";

export default function Notes() {
  // DATA
  const [notes, setNotes] = useState([]);

  // FORM STATE
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  // UI STATE
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // LOAD NOTES
  const loadNotes = async () => {
    const data = await GetNotes();
    setNotes(data || []);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setSubject("");
    setContent("");
    setFile(null);
    setEditId(null);
    setShowForm(false);
  };

  // SAVE / UPDATE
  const handleSubmit = async () => {
    if (!subject || !content) {
      alert("Subject & content required");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("content", content);
    if (file) formData.append("file", file);

    console.log(file);

    if (editId) {
      await UpdateNote(editId, formData);
    } else {
      await AddNote(formData);
    }

    resetForm();
    loadNotes();
  };

  // EDIT
  const handleEdit = (note) => {
    setSubject(note.subject);
    setContent(note.content);
    setFile(null);
    setEditId(note._id);
    setShowForm(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    await DeleteNote(id);
    loadNotes();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">📝 My Notes</h1>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          <Plus size={18} /> Add Note
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-slate-900 p-4 sm:p-6 rounded-xl mb-6 border border-white/10">
          <div className="space-y-4">
            <input
              value={subject}
              placeholder="Subject"
              className="w-full bg-black/30 p-3 rounded-lg outline-none"
              onChange={(e) => setSubject(e.target.value)}
            />

            <textarea
              value={content}
              placeholder="Write your note..."
              rows={4}
              className="w-full bg-black/30 p-3 rounded-lg outline-none"
              onChange={(e) => setContent(e.target.value)}
            />

            <input
              type="file"
              className="text-sm text-white/70"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end mt-4 gap-3">
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-600 rounded-lg w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 rounded-lg w-full sm:w-auto"
            >
              {editId ? "Update Note" : "Save Note"}
            </button>
          </div>
        </div>
      )}

      {/* NOTES LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {notes.map((n) => (
          <div
            key={n._id}
            className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-white/10"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="px-3 py-1 text-xs bg-indigo-600 rounded-full">
                {n.subject}
              </span>

              <div className="flex gap-3">
                <button onClick={() => handleEdit(n)}>
                  <Pencil size={16} className="text-yellow-400" />
                </button>
                <button onClick={() => handleDelete(n._id)}>
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>

            <p className="text-white/80 text-sm mb-2 line-clamp-4">
              {n.content}
            </p>

            {n.fileUrl && (
              <div className="mt-2">
                <p className="text-xs text-white/50">
                  📎 {n.fileName}
                </p>
                <a
                  href={`${n.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 text-sm underline"
                >
                  View Attachment
                </a>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
