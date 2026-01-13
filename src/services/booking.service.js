import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBooking = async (userId, data) => {
  const { vehicleId, packageId, mealOptionId, bookingDate } = data;

  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      userId: userId,
    },
  });

  if (!vehicle) {
    throw new Error("Invalid vehicle or not owned by user");
  }

  return prisma.booking.create({
    data: {
      userId,
      vehicleId,
      packageId,
      mealOptionId: mealOptionId || null,
      bookingDate: new Date(bookingDate),
    },
    include: {
      vehicle: true,
      servicePackage: true,
      mealOption: true,
    },
  });
};

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
