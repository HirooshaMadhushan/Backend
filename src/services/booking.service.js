import fs from "fs";
import path from "path";
import { prisma } from "../config/db.js";
import { sendEmail } from "../email/email.service.js";

/**
 * CREATE BOOKING + SEND EMAIL
 */
export const createBookingService = async (userId, data) => {
  const { vehicleId, packageId, mealOptionId, bookingDate } = data;

  // 1️⃣ Validate vehicle ownership
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      userId,
    },
  });

  if (!vehicle) {
    throw new Error("Invalid vehicle or not owned by user");
  }

  // 2️⃣ Create booking with nested relation connect
  const booking = await prisma.booking.create({
    data: {
      user: { connect: { id: userId } },
      vehicle: { connect: { id: vehicle.id } },
      servicePackage: { connect: { id: packageId } },
      mealOption: mealOptionId ? { connect: { id: mealOptionId } } : undefined,
      bookingDate: new Date(bookingDate),
    },
    include: {
      user: true,
      vehicle: true,
      servicePackage: true,
      mealOption: true,
    },
  });

  // 3️⃣ Send confirmation email
  await sendBookingConfirmationEmail(booking);

  return booking;
};

/**
 * GET BOOKINGS BY USER
 */
export const getBookingsByUser = async (userId) => {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      vehicle: true,
      servicePackage: true,
      mealOption: true,
    },
  });
};

/* ---------------- EMAIL HELPER ---------------- */
const sendBookingConfirmationEmail = async (booking) => {
  const templatePath = path.join(
    process.cwd(),
    "templates",
    "bookingConfirmation.html"
  );

  let html = fs.readFileSync(templatePath, "utf-8");

  html = html
    .replace("{{name}}", booking.user.name)
    .replace("{{brand}}", booking.vehicle.brand)
    .replace("{{model}}", booking.vehicle.model)
    .replace("{{year}}", booking.vehicle.year.toString())
    .replace("{{plateNumber}}", booking.vehicle.plateNumber)
    .replace("{{packageName}}", booking.servicePackage.name)
    .replace(
      "{{bookingDate}}",
      new Date(booking.bookingDate).toLocaleString()
    );

  await sendEmail(
    booking.user.email,
    "Booking Confirmation - AutoBook",
    html
  );
};

export const getBookingsByUserService = async (userId) => {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { bookingDate: "desc" },
    include: {
      vehicle: true,
      servicePackage: true,
      mealOption: true,
    },
  });
};