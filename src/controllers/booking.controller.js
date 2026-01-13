import { prisma } from "../config/db.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      plateNumber,
      brand,
      model,
      year,
      packageId,
      mealOptionId,
      bookingDate
    } = req.body;

    // 1️⃣ Create vehicle at booking time
    const vehicle = await prisma.vehicle.create({
      data: {
        userId,
        plateNumber,
        brand,
        model,
        year
      }
    });

    // 2️⃣ Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        vehicleId: vehicle.id,
        packageId,
        mealOptionId,
        bookingDate
      }
    });

    // 3️⃣ Activity log
    await prisma.activityLog.create({
      data: {
        userId,
        action: "CREATE_BOOKING",
        detail: `Booking ID ${booking.id}`
      }
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
};
