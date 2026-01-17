import express from "express";
import { createServicePackage } from "../controllers/package.controller.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.Middleware.js";
import { getAllservicePackages } from "../controllers/package.controller.js";

const router = express.Router();

// ADMIN only
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createServicePackage
);

router.get("/", getAllservicePackages);

export default router;
