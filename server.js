
// server.js
import http from "http";
import app from "./src/app.js";
import { prisma } from "./src/config/db.js";
import { Server } from "socket.io";
import { verifySocketToken } from "./src/middleware/socketAuth.middleware.js";
import { ChatService } from "./src/services/chat.service.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test Prisma connection
    await prisma.$connect();
    console.log("✅ Prisma connected successfully!");

    // Create HTTP server
    const server = http.createServer(app);

    // Create Socket.IO server
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000", // your frontend
        credentials: true,
      },
    });

    // SOCKET JWT AUTH
    io.use(verifySocketToken);

    // Chat service instance
    const chatService = ChatService.getInstance();

    // --- SOCKET EVENTS ---
    io.on("connection", (socket) => {
      const user = socket.user; // From socket middleware
      console.log(`⚡ User connected: ${user.id} (${user.role})`);

      // Join user's personal room
      socket.join(`user_${user.id}`);

      // When user joins a conversation
      socket.on("join_conversation", ({ conversationId }) => {
        socket.join(`conversation_${conversationId}`);
      });

      // When sending a message
      socket.on("send_message", async ({ conversationId, toUserId, content }) => {
        const msg = await chatService.saveMessage({
          conversationId,
          from: user.id,
          to: toUserId,
          content,
        });

        // Emit message to conversation room
        io.to(`conversation_${conversationId}`).emit("new_message", msg);
      });

      socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${user.id}`);
      });
    });

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
