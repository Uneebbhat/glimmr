import { Router } from "express";
import {
	login,
	signup,
} from "../../controllers/user/userController.controller";

const router = Router();

router.post("/v1/signup", signup);
router.post("/v1/login", login);

export default router;
