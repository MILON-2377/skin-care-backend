import { Router } from "express";
import verifyToken from "../middleware/auth.middleware.js";
import {
    userAccountDelete,
    addProductToWishList,
    removeProductFromWishlist,
    viewWishlist,
    addProductToCart,
    removeProductToCart,
    viewCartItems,
} from "../controllers/normal.user.dashboard.controller.js";


const router = Router();


// routes
router.route("/delete-user").post(verifyToken, userAccountDelete);
router.route("/wishlist/add").post(verifyToken, addProductToWishList);
router.route("/wishlist/remove").delete(verifyToken, removeProductFromWishlist);
router.route("/wishlist").get(verifyToken, viewWishlist);
router.route("/cart/add").post(verifyToken, addProductToCart);
router.route("/cart/remove").delete(verifyToken, removeProductToCart);
router.route("/cart/view").get(verifyToken, viewCartItems);


export default router;