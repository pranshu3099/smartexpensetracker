import express from "express";
import { customRequest } from "../types/types";
const RegisterCompanyData = async (
  req: customRequest,
  res: express.Response,
  next: express.NextFunction,
  db: any
) => {
  const { company, skills, experience, qualification, position, subscribed } =
    req?.body;
  try {
    let data = {
      company,
      skills,
      experience,
      qualification,
      position,
      subscribed,
    };
    const result = await db.collection("company").insertOne(data);
    return res.status(200).json({ message: "successfully inserted" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "internal server error" });
  }
};

export default { RegisterCompanyData };
