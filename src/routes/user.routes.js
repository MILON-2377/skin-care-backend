import { Router } from "express";
import {
    registerUser,
    updateUser,
    updateUserAvatar,
    loginUser,
    logOutUser,
} from "../controllers/user.contorller.js";
import { upload } from "../middleware/multer.middleware.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = Router();

// user register router
router.route("/register").post(registerUser);
router.route("/update").patch(
    verifyToken,
    updateUser);

router.route("/update-avatar").patch(
    verifyToken,
    upload.single("avatar"),
    updateUserAvatar
)

router.route("/login-user").post(loginUser);
router.route("/logout-user").post(verifyToken,logOutUser);




export default router;