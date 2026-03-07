import { use } from "react";
import Transaction from "../model/transaction.js";
import User from "../model/User.js";

//ADD Expenses--------

export const addexpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, category } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const expenseAmount = Number(amount);
    const dailylimit = user.dailybudget[category]; // Seedha limit uthao

    const extraamount = user.dailybudget[category] - expenseAmount;
    if (extraamount < 0) {
      user.budgetOver[category] =Math.abs(extraamount);
       
      user.markModified("budgetOver");
      await user.save();
    }
   

    const transaction = await Transaction.create({
      userId,
      title,
      amount: expenseAmount,
      category
    });

    await user.save();

    res.status(201).json({
      message: "Expense added",
      transaction,
      remaininglimit: dailylimit - (user.budgetOver[category] || 0),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get expneses
export const getexpensses = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    res.json({
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// getsingle expense
export const getSingleExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      userId: userId, // important security check
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// get user count

export const getusercount = async (req, res) => {
  const usercount = await User.countDocuments();
  res.json({ usercount });
};

//Delete expenses

export const deleteexpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    if (transaction.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Not authorized to delete this expense",
      });
    }

    const user = await User.findById(userId);
    if (user) {
      const category = transaction.category;

      // ✅ YAHAN CHANGE KIYA HAI: Taaki value 0 se niche na jaye
      user.budgetOver[category] = Math.max(
        0,
        (user.budgetOver[category] || 0) - transaction.amount,
      );

      user.markModified("budgetOver");
      await user.save();
    }

    await transaction.deleteOne();

    res.json({
      message: "Expense deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//Update expenses
export const updateexpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;
    const { title, amount, category } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this expense" });
    }

    const user = await User.findById(userId);
    if (user) {
      const oldAmount = transaction.amount;
      const oldCategory = transaction.category;
      const newAmount = amount ? Number(amount) : oldAmount;
      const newCategory = category || oldCategory;

      user.budgetOver[oldCategory] -= oldAmount;
      user.budgetOver[newCategory] += newAmount;

      user.markModified("budgetOver");
      await user.save();
    }

    if (title) transaction.title = title;
    if (amount) transaction.amount = Number(amount);
    if (category) transaction.category = category;

    await transaction.save();

    res.json({
      message: "Expense updated successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Dashboard data

export const dashbaord = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId });

    const totalexpenses = transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTransactions = transactions.filter((t) => t.date >= today);
    const todayexpenses = todayTransactions.reduce((total, t) => total + t.amount, 0);

    const categorywise = [
      { name: "food", amount: 0 },
      { name: "travelling", amount: 0 },
      { name: "others", amount: 0 },
    ];

    todayTransactions.forEach((transaction) => {
      const category = categorywise.find(
        (c) => c.name === transaction.category.toLowerCase(),
      );
      if (category) {
        category.amount += transaction.amount;
      } else {
        categorywise[2].amount += transaction.amount;
      }
    });

    const user = await User.findById(userId);

    // --- SIRF YE SAFETY CHECK LAGAYA HAI TAAKI 500 ERROR NA AAYE ---
    const budget = user.dailybudget || { food: 0, travelling: 0, others: 0 };

    const remainingbudget = {
      food: (budget.food || 0) - (categorywise.find(c => c.name === "food")?.amount || 0),
      travelling: (budget.travelling || 0) - (categorywise.find(c => c.name === "travelling")?.amount || 0),
      others: (budget.others || 0) - (categorywise.find(c => c.name === "others")?.amount || 0),
    };

    const dailyLimitTotal = (budget.food || 0) + (budget.travelling || 0) + (budget.others || 0);
    const savingsToday = dailyLimitTotal - todayexpenses;

    res.json({
      totalexpenses,
      todayexpenses,
      categorywise,
      remainingbudget,
      wallet: user.wallet || 0,
      monthlyincome: user.monthlyincome || 0, // Frontend ke liye zaroori hai
      savingsToday: savingsToday > 0 ? savingsToday : 0,
      lastAnimTime: user.lastAnimTime || "" // Animation trigger logic ke liye
    });
  } catch (err) {
    console.error(err); // Server terminal pe error dikhega
    res.status(500).json({
      message: err.message,
    });
  }
};

// check graph

export const checkgraph = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ userId });
    const user = await User.findById(userId);

    const graphdata = {};

    transactions.forEach((t) => {
      if (!graphdata[t.category]) {
        graphdata[t.category] = 0;
      }
      graphdata[t.category] += t.amount;
    });

    res.json({
      graphdata,
      dailylimit: user.dailybudget || 0,
      totaltransactions: transactions.length,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//update monthly income

export const updatemonthlyincome=async(req,res)=>{
  try{
    const monthlyincome=req.body.monthlyincome;
    const userid=req.user.id;

    const income=Number(monthlyincome);
    const dailybudget=income/30;

    const Updateuser=await User.findByIdAndUpdate(
      userid,
      {
        monthlyincome:income,
        dailybudget:{
          food:dailybudget*0.4,
          travelling:dailybudget*0.4,
          others:dailybudget*0.2
        }
      }
    )
    res.json({
      message:"Monthly income updated successfully",
      Updateuser
    })


  }
  catch(err){
    res.status(500).json({
      message:err.message
    })
  }
};
