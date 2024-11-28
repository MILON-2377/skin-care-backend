import { Router } from "express";
import {
    registerUser
} from "../controllers/user.contorller.js";

const router = Router();

// user register router
router.route("/register").post(registerUser);


export default router;