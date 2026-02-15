"use client";
import { useEffect, useState } from "react";
import {
  GetExpenses,
  GetNotes,
  GetTasks
} from "../../utils/api";

import {
  EntertainmentImg,
  GroceryImg,
  NotesImg,
  ReadImg,
  TransportImg,
} from "../../utils/imgLink";

import Navbar from "./Navbar";

import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);

  const [totals, setTotals] = useState({
    Groceries: 0,
    Transport: 0,
    Entertainment: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const e = await GetExpenses();
      const expenseList = Array.isArray(e) ? e : [];
      setExpenses(expenseList);

      const summary = { Groceries: 0, Transport: 0, Entertainment: 0 };
      expenseList.forEach((item) => {
        if (summary[item.category] !== undefined) {
          summary[item.category] += item.amount;
        }
      });
      setTotals(summary);

      const t = await GetTasks();
      setTasks(Array.isArray(t) ? t : []);

      const n = await GetNotes();
      setNotes(Array.isArray(n) ? n : []);
    };

    loadData();
  }, []);

  /* ===== CATEGORY GRAPH ===== */
  const categoryChartData = [
    { category: "Groceries", amount: totals.Groceries },
    { category: "Transport", amount: totals.Transport },
    { category: "Entertainment", amount: totals.Entertainment },
  ];

  /* ===== SIMPLE DATE WISE EXPENSE DATA ===== */
  const expenseMap = {};

  expenses.forEach((item) => {
    const date = new Date(item.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    expenseMap[date] = (expenseMap[date] || 0) + item.amount;
  });

  const expenseByDateData = Object.entries(expenseMap).map(
    ([date, amount]) => ({ date, amount })
  );

  const totalDailyExpense = expenseByDateData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-[#f4f6fb]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <Navbar />
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Stat title="Groceries" amount={totals.Groceries} Icon={GroceryImg} />
        <Stat title="Transport" amount={totals.Transport} Icon={TransportImg} />
        <Stat
          title="Entertainment"
          amount={totals.Entertainment}
          Icon={EntertainmentImg}
        />
      </div>

      {/* ===== TASKS + NOTES ===== */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Study Tasks</h2>

          {tasks.length === 0 ? (
            <Empty text="No tasks added yet 📚" />
          ) : (
            tasks.map((task) => (
              <Task
                key={task._id}
                subject={task.subject}
                taskText={task.task}
                completed={task.completed}
                date={task.date}
                time={task.time}
                Icon={ReadImg}
              />
            ))
          )}
        </div>

        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Notes</h2>

          {notes.length === 0 ? (
            <Empty text="No notes yet ✍️" />
          ) : (
            notes.slice(0, 4).map((note) => (
              <Note key={note._id} Icon={NotesImg} text={note.subject} />
            ))
          )}
        </div>
      </div>

      {/* ===== GRAPH 1 ===== */}
      <div className="bg-white rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-6">Expense by Category</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#6366f1" barSize={40} />
              <Line type="monotone" dataKey="amount" stroke="#22c55e" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== GRAPH 2 (CLEAN & SIMPLE LAYOUT) ===== */}
    <div className="bg-white rounded-2xl p-6 shadow-sm">
  <h2 className="text-xl font-bold mb-4">Daily Expense</h2>

  {/* SUMMARY */}
  <div className="flex gap-4 mb-5">
    <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium">
      💰 Total: ₹{totalDailyExpense}
    </div>
    <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-medium">
      📅 Days: {expenseByDateData.length}
    </div>
  </div>

  {/* COLORFUL GRAPH */}
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={expenseByDateData}>
        <defs>
          <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />

        <Area
          type="monotone"
          dataKey="amount"
          stroke="#6366f1"
          strokeWidth={3}
          fill="url(#expenseColor)"
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Stat({ title, amount, Icon }) {
  return (
    <div className="bg-white rounded-2xl p-6 flex items-center gap-4">
      <div className="h-14 w-14 bg-[#f4f6fb] rounded-xl flex items-center justify-center">
        <Icon />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold">₹{amount}</p>
      </div>
    </div>
  );
}

function Task({ subject, taskText, completed, date, time, Icon }) {
  return (
    <div className="bg-[#f4f6fb] rounded-xl p-4 mb-3">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="h-9 w-9 bg-white rounded-lg flex items-center justify-center">
            <Icon />
          </div>
          <div>
            <p className="text-sm font-semibold">{subject}</p>
            <p className="text-xs text-gray-500">{taskText}</p>
            <p className="text-xs text-gray-400">
              {new Date(date).toLocaleDateString()} • {time}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 h-fit rounded-full text-xs ${
            completed
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {completed ? "Completed" : "Pending"}
        </span>
      </div>
    </div>
  );
}

function Note({ text, Icon }) {
  return (
    <div className="bg-[#f4f6fb] rounded-xl p-3 mb-3 flex items-center gap-3">
      <div className="h-9 w-9 bg-white rounded-lg flex items-center justify-center">
        <Icon />
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="text-center text-gray-400 text-sm py-10">{text}</div>
  );
}
