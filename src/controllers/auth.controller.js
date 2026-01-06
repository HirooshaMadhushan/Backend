import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password,phone,role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword,phone,role },
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role ,phone: user.phone},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Login controller

const createAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Store refresh token in session table
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(now.getDate() + 7); // 7 days expiry

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] || null,
      },
    });

    // Send tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 mins
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      // Delete refresh token from DB
      await prisma.session.deleteMany({ where: { refreshToken: token } });
    }

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Check if token exists in DB
    const session = await prisma.session.findFirst({
      where: { refreshToken: token, userId: decoded.userId },
    });

    if (!session) return res.status(401).json({ message: "Invalid refresh token" });

    // Optional: check if token expired in DB
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } });
      return res.status(401).json({ message: "Refresh token expired" });
    }

    // Create new tokens (rotate)
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
    const newRefreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );

    // Update session in DB with new refresh token
    await prisma.session.update({
      where: { id: session.id },
      data: { refreshToken: newRefreshToken, expiresAt: new Date(Date.now() + 7*24*60*60*1000) },
    });

    // Send new tokens in cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 mins
      sameSite: "strict",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    res.status(200).json({ message: "Tokens refreshed successfully" });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile=async (req,res)=>{
  try {
    const{name,phone,password,email}=req.body;
    const userId=req.user.userId;

    const updateData={};
    if(name) updateData.name=name;
    if(phone) updateData.phone=phone;
    if(email) updateData.email=email;
    if(password){
      const hashedPassword=await bcrypt.hash(password,10);
      updateData.password=hashedPassword;
    }
    await prisma.user.update({
      where:{id:userId},
      data:updateData
    });
    res.status(200).json({message:"Profile updated successfully"});

    
  } catch (error) {
    res.status(500).json({message:"Server error"});
    
  }
}
