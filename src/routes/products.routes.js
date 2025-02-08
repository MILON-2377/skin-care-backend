import { Router } from "express";
import verifyToken from "../middleware/auth.middleware.js";

import {
    displayReviews,
    getProducts,
    giveReviewToProduct,
    searchProducts,
    getTotalProductsCount,
    getWishlistProducts,
} from "../controllers/products.controller.js";


const router = Router();


// secure routes
router.route("/display").get(getProducts );
router.route("/search").get(verifyToken, searchProducts);
router.route("/review").post(verifyToken, giveReviewToProduct);
router.route("/display-review").get(verifyToken,displayReviews);
router.route("/totalCount").get(getTotalProductsCount);
router.route("/getwishlist").get(getWishlistProducts);


export default router;