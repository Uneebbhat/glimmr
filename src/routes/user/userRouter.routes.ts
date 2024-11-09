import { Router } from "express";
import {
	login,
	signup,
	verifyOTP,
} from "../../controllers/user/userController.controller";

const router = Router();

router.post("/v1/signup", signup);
router.post("/v1/login", login);
router.post("/verify-otp", verifyOTP);

export default router;
