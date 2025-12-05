// server.js
import http from "http";
import app from "./src/app.js";
import { prisma } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test Prisma connection
    await prisma.$connect();
    console.log("✅ Prisma connected successfully!");

    // Start HTTP server
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect Prisma:", error.message);
    process.exit(1);
  }
}

startServer();
