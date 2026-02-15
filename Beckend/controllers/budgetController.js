const Expense = require('../models/Expense');
const Budget=require('../models/Budget')
const Notification = require("../models/Notification");

exports.getExpenses = async (req, res) => {
  try{
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
  }catch(err){
    res.status(400).json({ error: err.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { category, amount } = req.body;

    const expense = new Expense({
      userId: req.user.id,
      category,
      amount,
    });

    await expense.save();

    /* 🔔 NOTIFICATION: Expense Added */
    await Notification.create({
      userId: req.user.id,
      title: "Expense Added 💸",
      message: `₹${amount} spent on ${category}`,
    });

    /* 🔔 CHECK BUDGET */
    const budget = await Budget.findOne({ userId: req.user.id });
    if (budget) {
      const totalExpense = await Expense.aggregate([
        { $match: { userId: expense.userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const spent = totalExpense[0]?.total || 0;

      if (spent > budget.totalAmount) {
        await Notification.create({
          userId: req.user.id,
          title: "Budget Exceeded ⚠️",
          message: `You exceeded your budget of ₹${budget.totalAmount}`,
        });
      }
    }

    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user.id });
    res.json({ success: true, data: budget });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.setBudget = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    let budget = await Budget.findOne({ userId: req.user.id });

    if (budget) {
      budget.totalAmount = totalAmount;

      /* 🔔 Notification: Budget Updated */
      await Notification.create({
        userId: req.user.id,
        title: "Budget Updated 📊",
        message: `Your budget is now ₹${totalAmount}`,
      });
    } else {
      budget = new Budget({
        userId: req.user.id,
        totalAmount,
      });

      /* 🔔 Notification: Budget Created */
      await Notification.create({
        userId: req.user.id,
        title: "Budget Set 🎯",
        message: `Your budget is set to ₹${totalAmount}`,
      });
    }

    await budget.save();
    res.json({ success: true, data: budget });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.resetMonth = async (req, res) => {
  try {
    await Expense.deleteMany({ userId: req.user.id });
    await Budget.deleteOne({ userId: req.user.id });

    await Notification.create({
      userId: req.user.id,
      title: "Month Reset 🔄",
      message: "Your monthly budget has been reset.",
    });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
