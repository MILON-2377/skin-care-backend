import { Router } from "express";
import verifyToken from "../middleware/auth.middleware.js";

import {
    getProducts,
    giveReviewToProduct,
    searchProducts,
} from "../controllers/products.controller.js";


const router = Router();


// routes
router.route("/products").get(verifyToken, getProducts );
router.route("/search").get(verifyToken, searchProducts);
router.route("/review").post(verifyToken, giveReviewToProduct);


export default router;