import { Router } from "express";
import { createShop, shopLogin } from "../../controllers/shop/shopController.controller";

const router = Router();

router.post("/v1/create-shop", createShop);
router.post("/v1/shop-login", shopLogin);

export default router;
