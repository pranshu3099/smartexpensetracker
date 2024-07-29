import express from "express";
import { getDb } from "../db/connection";
import utils from "../utils/utils";
import { ObjectId } from "mongodb";

interface Expense {
  amount: number;
  category: string;
  timeStamp: Date;
}

const AddExpenseData = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { amount, email, category, payment_mode, message } = req?.body;
  try {
    const db = getDb();
    const existingUser = await utils.getUser(email, {});

    if (existingUser) {
      const newDocument = {
        category: category,
        amount: amount,
        email: email,
        user_id: existingUser?._id,
        payment_mode: payment_mode,
        message: message,
        timeStamp: new Date(),
      };

      const expenseCollection = db.collection("expense");

      const result = await expenseCollection.insertOne(newDocument);
      return res
        .status(200)
        .json({ message: "item successfully added", result });
    } else {
      return res
        .status(404)
        .json({ error: "conflict", message: "User does not exists" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error", err });
  }
};

const getExpenseData = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email } = req?.params;
    const getData = await utils.yourExpenseData(email);

    return res.status(200).json({ message: "success", getData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error", err });
  }
};

const ExpensesAnalysisData = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    let { userId, year, month } = req?.params;
    const db = getDb();
    const startDate = new Date(Number(year), 0, 1);
    const currentDate = new Date(Number(year), Number(month), 1);

    const userCollection = db.collection("expense");
    const expenses = await userCollection
      .find({
        user_id: new ObjectId(userId),
        timeStamp: { $gte: startDate, $lt: currentDate },
      })
      .toArray();
    const { user_id } = expenses?.[0];
    const user = await utils.getUser("", user_id);
    const { income_per_month } = user;
    const totalExpenses = expenses.reduce(
      (acc: number, expense: Expense) => acc + Number(expense.amount),
      0
    );

    const expenses_data = expenses.map((expense: Expense) => {
      return {
        [expense.category]: expense?.amount,
        amount: expense?.amount,
        month: utils.getMonth(expense.timeStamp),
      };
    });

    const IncomePerMOnth = income_per_month;
    const remainingBudget = IncomePerMOnth - totalExpenses;
    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
    const dailyBudget = Math.floor(remainingBudget / daysInMonth);
    const data = [
      {
        totalExpenses,
        remainingBudget,
        dailyBudget,
        expenses_data,
      },
    ];
    return res.status(200).json({ message: "success", data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export default { AddExpenseData, getExpenseData, ExpensesAnalysisData };
