import express from "express";
import { createBooking, updateBooking, deleteBooking, getBookingsByUserController } from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.Middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("CUSTOMER"), createBooking);
router.get("/", protect, authorizeRoles("CUSTOMER"), getBookingsByUserController);
router.put("/:bookingId", protect, authorizeRoles("CUSTOMER"), updateBooking);
router.delete("/:bookingId", protect, authorizeRoles("CUSTOMER"), deleteBooking);

export default router;
