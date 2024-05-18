import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET;
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
    const getUser = await userCollection.findOne({ email });
    let storedPassword = getUser?.password;
    if (getUser) {
      let checkForPassword = await ComparePassword(storedPassword, password);
      if (!checkForPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      } else {
        const token = jwt.sign(
          {
            userID: getUser?._id,
          },
          jwtSecret || ""
        );
        return res
          .status(200)
          .json({ message: "successfully loggedin", bearer_token: token });
      }
    } else {
      return res
        .status(404)
        .json({ error: "conflict", message: "User does not exists" });
    }
    next();
  } catch (err) {}
};

export default { RegisterUser, LoginUser };
