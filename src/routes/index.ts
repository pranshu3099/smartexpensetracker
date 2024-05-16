import express from "express";
import UserController from "../controller/UserController";
import validate from "../middleware/validate";
import schema from "../schema/schema";
const router = express.Router();
router.post(
  "/v1/user/signup",
  validate({ body: schema?.registerSchema }),
  UserController.RegisterUser
);
export default router;
