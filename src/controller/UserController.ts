import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
  next: express.NextFunction,
  db: any
) => {
  try {
    const { name, email, password } = req?.body;
    let hashedPassword = await convertToHash(password);
    const user = { name, email, password: hashedPassword };

    const userCollection = db.collection("users");

    const getUser = await userCollection.findOne({ email, password });
    if (getUser) {
      return res.status(409).json({ message: "User allready exists" });
    } else {
      const result = await userCollection.insertOne(user);
      console.log(`User inserted with _id: ${result.insertedId}`);
      return res
        .status(201)
        .json({ message: "User registered successfully", result });
    }
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Failed to register user" });
  }
};

const LoginUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  db: any
) => {
  try {
    const { email, password } = req?.body;
    const userCollection = db.collection("users");
    const existingUser = await userCollection.findOne({ email });
    let storedPassword = existingUser?.password;
    if (existingUser) {
      let checkForPassword = await ComparePassword(storedPassword, password);
      if (!checkForPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      } else {
        const token = jwt.sign(
          {
            userID: existingUser?._id,
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
