import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifySocketToken = (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.token;

    if (!token) return next(new Error("NO TOKEN"));

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    socket.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return next(new Error("UNAUTHORIZED SOCKET"));
  }
};
