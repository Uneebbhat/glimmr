import { Router } from "express";
import {
	generateNewOTP,
	login,
	signup,
	verifyOTP,
} from "../../controllers/user/userController.controller";

const router = Router();

router.post("/v1/signup", signup);
router.post("/v1/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/generate-otp", generateNewOTP);

export default router;
