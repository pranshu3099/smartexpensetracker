import express from "express";
import { getDb } from "../db/connection";
import utils from "../utils/utils";
const AddExpenseData = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { amount, email, category, payment_mode, message } = req?.body;
  try {
    const db = getDb();
    const existingUser = await utils.getUser(email);

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
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export default { AddExpenseData, getExpenseData };
