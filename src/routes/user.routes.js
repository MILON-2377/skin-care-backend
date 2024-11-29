import { Router } from "express";
import {
    registerUser,
    updateUser,
} from "../controllers/user.contorller.js";
import { upload } from "../middleware/multer.middleware.js";
import verifyToken from "../controllers/auth.middleware.js";

const router = Router();

// user register router
router.route("/register").post(registerUser);
router.route("/update").patch(
    verifyToken,
    updateUser);


export default router;