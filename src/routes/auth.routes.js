import express from "express";
import { register,login,refreshToken,logout,getProfile } from "../controllers/auth.controller.js";
import { registerValidator } from "../validators/auth.validator.js";
import { loginValidator } from "../validators/auth.validator.js";
import { validate } from "../middleware/validate.js";
import {protect} from '../middleware/auth.js';
const router = express.Router();

router.post("/register",registerValidator,validate,  register);
router.post("/login",loginValidator,validate, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/profile",protect,getProfile)



export default router;
