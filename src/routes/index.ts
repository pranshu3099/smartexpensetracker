import express from "express";
import UserController from "../controller/UserController";
import ExpenseController from "../controller/ExpenseController";
import validate from "../middleware/validate";
import schema from "../schema/schema";
import verifyToken from "../middleware/Authmiddleware";
import { customRequest } from "../types/types";
import OauthController from "../controller/OauthController";
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
  "/v1/user/addexpensedata",
  validate({ body: schema.ExpenseSchema }),
  ExpenseController.AddExpenseData
);

router.get(
  "/v1/user/monthly-expenses/:userId/:year/:month",
  ExpenseController.ExpensesAnalysisData
);

router.get("/v1/user/getexpensedata/:email", ExpenseController.getExpenseData);
router.get("/api/auth/github", OauthController.githubAuthHandler);

export default router;
