import { Router } from "express";
import {
    addProductsToWishlist,
    getWishlist,
} from "../controllers/wishlist.controler.js";
import verifyToken from "../middleware/auth.middleware.js";


const router = Router();


router.route("/add").post(verifyToken, addProductsToWishlist);
router.route("/get").get(verifyToken, getWishlist);

export default router;