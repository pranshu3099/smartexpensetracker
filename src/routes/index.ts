import express from "express";
import UserController from "../controller/UserController";
import TaskController from "../controller/TaskController";
import validate from "../middleware/validate";
import schema from "../schema/schema";
import verifyToken from "../middleware/Authmiddleware";
import { customRequest } from "../types/types";
const router = express.Router();

router.post(
  "/v1/user/signup",
  validate({ body: schema?.registerSchema }),

  UserController.RegisterUser
);

router.post(
  "/v1/user/login",
  validate({ body: schema?.LoginSchema }),
  UserController.LoginUser
);

router.post(
  "/v1/user/addexpenseitem",
  validate({ body: schema.ExpenseSchema }),
  TaskController.AddExpenseData
);

export default router;
