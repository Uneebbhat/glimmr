import { Router } from "express";
import { createShop, shopLogin } from "../../controllers/shop/shopController.controller";
import { createService } from "../../controllers/shop/shopServiceController.controller";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "/uploads" });

router.post("/v1/create-shop", createShop);
router.post("/v1/shop-login", shopLogin);
router.post("/v1/create-service", upload.array("serviceImage", 15), createService);

export default router;
