import express from "express";
import { createServicePackage } from "../controllers/package.controller.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.Middleware.js";

const router = express.Router();

// ADMIN only
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createServicePackage
);

export default router;
