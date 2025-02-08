import { Router } from "express";
import verifyToken from "../middleware/auth.middleware.js";
import {
    addItemToCart,
    getCartItems
} from "../controllers/cart.controller.js";


const router = Router();


router.route("/add").post(verifyToken, addItemToCart);
router.route("/get").get(verifyToken, getCartItems);

export default router;