import express from "express";
import UserController from "../controller/UserController";
import validate from "../middleware/validate";
import schema from "../schema/schema";
import ConnectToDatabase from "../db/mongo";
require("dotenv").config();
const uri = process.env.MONGO_CONNECTION_STRING;
const router = express.Router();
let db: any;
async function connectDatabase() {
  db = await ConnectToDatabase(uri || "");
}

connectDatabase();

router.post(
  "/v1/user/signup",
  validate({ body: schema?.registerSchema }),
  (req, res, next) => {
    UserController.RegisterUser(req, res, next, db);
  }
);

router.post("/v1/user/login", (req, res, next) => {
  UserController.LoginUser(req, res, next, db);
});
export default router;
