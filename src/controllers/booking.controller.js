import { createBookingService } from "../services/booking.service.js";
import { prisma } from "../config/db.js";
import { getBookingsByUserService } from "../services/booking.service.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;

    const booking = await createBookingService(userId, req.body);

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Booking failed",
    });
  }
};


export const getBookingsByUserController = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const bookings = await getBookingsByUserService(userId);
    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId; // from auth middleware

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
    });

    if (!booking || booking.userId !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await prisma.booking.delete({
      where: { id: parseInt(bookingId) },
    });

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking" });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { bookingDate, mealOptionId } = req.body;
    const userId = req.user.userId;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
    });

    if (!booking || booking.userId !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = await prisma.booking.update({
      where: { id: parseInt(bookingId) },
      data: {
        bookingDate: bookingDate ? new Date(bookingDate) : booking.bookingDate,
        mealOptionId: mealOptionId || null,
      },
      include: {
        vehicle: true,
        servicePackage: true,
        mealOption: true,
      },
    });

    res.json({ message: "Booking updated", booking: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update booking" });
  }
};

