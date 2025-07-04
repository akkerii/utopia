import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes";
import { sessionService } from "./services/sessionService";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", chatRoutes);

// Root endpoint
app.get("/", (_req, res) => {
  res.json({
    message: "Utopia AI Backend API",
    version: "1.0.0",
    endpoints: {
      chat: "POST /api/chat",
      session: "GET /api/session/:sessionId",
      clearSession: "POST /api/session/:sessionId/clear",
      health: "GET /api/health",
    },
  });
});

// Error handling middleware
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Utopia AI Backend running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      "⚠️  Warning: OPENAI_API_KEY not found in environment variables"
    );
    console.warn(
      "   Please set it in your .env file for the AI to work properly"
    );
  }

  // Clean up old sessions periodically (every hour)
  setInterval(
    () => {
      console.log("🧹 Cleaning up old sessions...");
      sessionService.cleanupOldSessions(24); // Remove sessions older than 24 hours
    },
    60 * 60 * 1000
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

export default app;
