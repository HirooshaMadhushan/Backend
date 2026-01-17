import { prisma } from "../config/db.js";

export const createServicePackage = async (req, res) => {
  try {
    const { name, description, price, durationMin } = req.body;

    if (!name || !price || !durationMin) {
      return res.status(400).json({
        message: "Name, price and duration are required"
      });
    }

    const servicePackage = await prisma.servicePackage.create({
      data: {
        name,
        description,
        price,
        durationMin
      }
    });

    res.status(201).json({
      message: "Service package created successfully",
      servicePackage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllservicePackages=async(req,res)=>{
  try {
     const servicePackages=await prisma.servicePackage.findMany();
     res.status(200).json({
      message:" Service packages retrieved successfully",
      servicePackages
     })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
