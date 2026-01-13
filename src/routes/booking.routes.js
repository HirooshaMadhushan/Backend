import express from "express";
import { createBooking } from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.Middleware.js";

const router = express.Router();

// Only logged-in CUSTOMER can book
router.post(
  "/",
  protect,
  authorizeRoles("CUSTOMER"),
  createBooking
);

export default router;
