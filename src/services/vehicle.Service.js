import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createVehicle = async (userId, data) => {
  const { plateNumber, brand, model, year } = data;

  if (!plateNumber || !brand || !model) {
    throw new Error("plateNumber, brand, and model are required");
  }

  return prisma.vehicle.create({
    data: {
      plateNumber,
      brand,
      model,
      year,
      userId,
    },
  });
};

export const getVehiclesByUser = async (userId) => {
  return prisma.vehicle.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};
