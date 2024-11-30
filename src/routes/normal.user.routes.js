import { Router } from "express";
import verifyToken from "../middleware/auth.middleware.js";
import {
    userAccountDelete,
    addProductToWishList,
    removeProductFromWishlist,
    viewWishlist,
    addProductToCart,
} from "../controllers/normal.user.dashboard.controller.js";


const router = Router();


// routes
router.route("/delete-user").post(verifyToken, userAccountDelete);
router.route("/wishlist/add").post(verifyToken, addProductToWishList);
router.route("/wishlist/remove").delete(verifyToken, removeProductFromWishlist);
router.route("/wishlist").get(verifyToken, viewWishlist);
router.route("/cart/add").post(verifyToken, addProductToCart);


export default router;