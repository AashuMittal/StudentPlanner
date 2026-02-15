import { useEffect, useState } from "react";
import { AddExpense, GetBudget, GetExpenses, ResetBudget, SetBudget } from "../../utils/api";

export default function Budget() {
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Groceries");

  useEffect(() => {
    const loadData = async () => {
      const b = await GetBudget();
      if (b?.success) setBudget(b.data?.totalAmount || 0);

      const e = await GetExpenses();
      setExpenses(Array.isArray(e) ? e : []);
    };
    loadData();
  }, []);

  const saveBudget = async () => {
    if (!budgetInput) return;
    const res = await SetBudget(Number(budgetInput));
    if (res.success) {
      setBudget(res.data.totalAmount);
      setBudgetInput("");
    }
  };

  const addExpense = async () => {
    if (!amount || !category) return;
    const res = await AddExpense({ category, amount: Number(amount) });
    if (res._id) {
      setExpenses((prev) => [...prev, res]);
      setAmount("");
    }
  };

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget - totalSpent;

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const resetMonth = async () => {
  await ResetBudget(); // API call
  setExpenses([]);
  setBudget(0);
};


  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold mb-5">My Budget</h2>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Card title="Total Budget" value={`₹${budget}`} />
        <Card title="Spent" value={`₹${totalSpent}`} />
        <Card title="Remaining" value={`₹${remaining}`} />
      </div>

      {/* SET BUDGET */}
      <div className="bg-[#f4f6fb] rounded-xl p-4 mb-6">
        <p className="font-medium mb-3 text-sm sm:text-base">
          Set Monthly Budget
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            className="flex-1 px-4 py-2 rounded-lg border outline-none"
            placeholder="Enter amount"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
          />

          <button
            onClick={saveBudget}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Save
          </button>

          <button
  onClick={resetMonth}
  className="bg-red-600 text-white px-6 py-2 rounded-lg"
>
  Reset Month
</button>

        </div>
      </div>

      {/* ADD EXPENSE */}
      <div className="bg-[#f4f6fb] rounded-xl p-4 mb-6">
        <p className="font-medium mb-3 text-sm sm:text-base">Add Expense</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border"
          >
            <option>Groceries</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Education</option>
            <option>Other</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            className="px-4 py-2 rounded-lg border outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={addExpense}
            className="bg-green-600 text-white rounded-lg font-medium py-2"
          >
            Add
          </button>
        </div>
      </div>

      {/* CATEGORY SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.keys(categoryTotals).map((cat) => (
          <div
            key={cat}
            className="bg-[#f4f6fb] rounded-xl p-4 flex justify-between text-sm sm:text-base"
          >
            <span className="font-medium">{cat}</span>
            <span className="font-semibold">₹{categoryTotals[cat]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-[#f4f6fb] rounded-xl p-4 text-center">
      <p className="text-xs sm:text-sm text-gray-500">{title}</p>
      <p className="text-base sm:text-lg font-semibold">{value}</p>
    </div>
  );
}
