import { Router } from "express";
import { signup } from "../../controllers/user/userController.controller";

const router = Router();

router.post("/v1/signup", signup);

export default router;
