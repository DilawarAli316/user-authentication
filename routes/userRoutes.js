import express from "express";

const router = express.Router();
import {
  loginUser,
  recoverPassword,
  registerUser,
  resetPassword,
  updateUserProfile,
  verifyCode,
} from "../controller/authController.js";
import { getUserProfile } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser);
router.route("/profile").get(getUserProfile);
export default router;
