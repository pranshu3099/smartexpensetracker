import express from "express";
import UserController from "../controller/UserController";
import validate from "../middleware/validate";
import schema from "../schema/schema";
import verifyToken from "../middleware/Authmiddleware";
import CompanyController from "../controller/CompanyController";
import { customRequest } from "../types/types";
import { db } from "../db/connection";
const router = express.Router();

router.post(
  "/v1/user/signup",
  validate({ body: schema?.registerSchema }),
  (req, res, next) => {
    UserController.RegisterUser(req, res, next, db);
  }
);

router.post(
  "/v1/user/login",
  validate({ body: schema?.LoginSchema }),
  (req, res, next) => {
    UserController.LoginUser(req, res, next, db);
  }
);

router.post("/v1/company/register", verifyToken, (req, res, next) => {
  CompanyController.RegisterCompanyData(req as customRequest, res, next, db);
});

export default router;
