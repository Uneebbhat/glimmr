import { Router } from "express";
import { createShop } from "../../controllers/shop/shopController.controller";

const router = Router();

router.post("/v1/create-shop", createShop);

export default router;
