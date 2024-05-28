import express from "express";
import { getDb } from "../db/connection";
const AddExpenseData = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { amount, email, category, payment_mode } = req?.body;
  try {
    const newDocument = {
      category: category,
      amount: amount,
      email: email,
      payment_mode: payment_mode,
      timeStamp: new Date(),
    };
    const db = getDb();

    const userCollection = db.collection("expense");
    const result = await userCollection.insertOne(newDocument);
    return res.status(200).json({ message: "item successfully added", result });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export default { AddExpenseData };
