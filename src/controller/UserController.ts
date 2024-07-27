import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDb } from "../db/connection";
import utils from "../utils/utils";
require("dotenv").config();
const secretKey = process.env.JWT_SECRET;
const convertToHash = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    console.log(err);
  }
};

const ComparePassword = async (
  storedPassword: string,
  userEnteredPassword: string
) => {
  try {
    const result = await bcrypt.compare(userEnteredPassword, storedPassword);
    return result;
  } catch (err) {
    console.log(err);
  }
};

const RegisterUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { name, email, password, income_per_month } = req?.body;
    let hashedPassword = await convertToHash(password);
    const user = { name, email, password: hashedPassword, income_per_month };
    const db = getDb();
    const userCollection = db.collection("users");

    const getUser = await utils.getUser(email, {});
    if (getUser) {
      return res.status(409).json({ message: "User allready exists" });
    } else {
      const result = await userCollection.insertOne(user);
      const user_data = {
        name: name,
        email: email,
        id: result?.insertedId,
      };
      return res
        .status(201)
        .json({ message: "User registered successfully", user_data });
    }
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Failed to register user" });
  }
};

const LoginUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email, password } = req?.body;
    const existingUser = await utils.getUser(email, {});
    let storedPassword = existingUser?.password;
    if (existingUser) {
      let checkForPassword = await ComparePassword(storedPassword, password);
      if (!checkForPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      } else {
        const token = jwt.sign(
          {
            userID: existingUser?._id,
            name: existingUser?.name,
            email: existingUser?.email,
          },
          secretKey || "",
          {
            expiresIn: "12h",
          }
        );
        let user = {
          name: existingUser?.name,
          email: existingUser?.email,
          id: existingUser?._id,
        };
        return res.status(200).json({
          message: "successfully loggedin",
          Authorization: token,
          userdata: user,
        });
      }
    } else {
      return res
        .status(404)
        .json({ error: "conflict", message: "User does not exists" });
    }
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "internal server error" });
  }
};

export default { RegisterUser, LoginUser };
