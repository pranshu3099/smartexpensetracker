import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET || "";
import express from "express";
import { customRequest } from "../types/types";

const verifyToken: any = (
  req: customRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authHeader: any = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "token not present" });
    }
    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "invalid token" });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "internal server error" });
  }
};

export default verifyToken;
