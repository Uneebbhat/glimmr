import { Router } from "express";
import {
	generateNewOTP,
	verifyOTP,
} from "../controllers/verifyOTPController.controller";

const router = Router();

router.post("/v1/verify-otp", verifyOTP);
router.post("/v1/generate-otp", generateNewOTP);

export default router;
