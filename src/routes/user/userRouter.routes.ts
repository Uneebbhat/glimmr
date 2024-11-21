import { Router } from "express";
import {
	forgotPassword,
	login,
	resetPassword,
	signup,
} from "../../controllers/user/userController.controller";

const router = Router();

router.post("/v1/signup", signup);
router.post("/v1/login", login);
router.post("/v1/forgot-password", forgotPassword);
router.put("/v1/reset-password", resetPassword);

export default router;
