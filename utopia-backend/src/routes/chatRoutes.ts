import express, { Router } from "express";
import { chatService } from "../services/chatService";
import { ChatRequest } from "../types";

const router = Router();

// Process a chat message
router.post("/chat", async (req: express.Request, res: express.Response) => {
  try {
    const chatRequest: ChatRequest = req.body;

    if (!chatRequest.message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await chatService.processMessage(chatRequest);
    return res.json(response);
  } catch (error) {
    console.error("Chat endpoint error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get session data
router.get("/session/:sessionId", async (req: express.Request, res: express.Response) => {
  try {
    const { sessionId } = req.params;
    const sessionData = chatService.getSessionData(sessionId);

    if (!sessionData) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.json(sessionData);
  } catch (error) {
    console.error("Session endpoint error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Clear/reset session
router.post(
  "/session/:sessionId/clear",
  async (req: express.Request, res: express.Response) => {
    try {
      const { sessionId } = req.params;
      const success = chatService.clearSession(sessionId);

      if (!success) {
        return res.status(404).json({ error: "Session not found" });
      }

      return res.json({ message: "Session cleared successfully" });
    } catch (error) {
      console.error("Clear session endpoint error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Health check
router.get("/health", (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
