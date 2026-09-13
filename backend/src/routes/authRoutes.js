import express from "express";
import { signup, login } from "../controllers/authController.js";
import {
  signupValidator,
  loginValidator
} from "../validators/authValidator.js";
import validationMiddleware from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/signup",
  signupValidator,
  validationMiddleware,
  signup
);

router.post(
  "/login",
  loginValidator,
  validationMiddleware,
  login
);

export default router;