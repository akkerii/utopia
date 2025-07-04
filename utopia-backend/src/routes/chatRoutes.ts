import express, { Router, Request, Response } from "express";
import { chatService } from "../services/chatService";
import { ChatRequest } from "../types";

const router = Router();

// Process a chat message
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const chatRequest: ChatRequest = req.body;

    if (!chatRequest.message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const response = await chatService.processMessage(chatRequest);
    res.json(response);
  } catch (error) {
    console.error("Chat endpoint error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get session data
router.get("/session/:sessionId", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const sessionData = chatService.getSessionData(sessionId);

    if (!sessionData) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.json(sessionData);
  } catch (error) {
    console.error("Session endpoint error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Clear/reset session
router.post(
  "/session/:sessionId/clear",
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const success = chatService.clearSession(sessionId);

      if (!success) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      res.json({ message: "Session cleared successfully" });
    } catch (error) {
      console.error("Clear session endpoint error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Health check
router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
