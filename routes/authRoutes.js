import express from "express";

const router = express.Router();
import {
  getUserProfile,
  loginUser,
  recoverPassword,
  registerUser,
  resetPassword,
  updateUserProfile,
  verifyCode,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/recover-password").post(recoverPassword);
router.route("/verify-code").post(verifyCode);
router.route("/reset-password").post(resetPassword);

export default router;
