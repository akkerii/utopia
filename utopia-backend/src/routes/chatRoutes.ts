import { Router, RequestHandler } from "express";
import { chatService } from "../services/chatService";
import { ChatRequest, QuestionResponse } from "../types";

const router = Router();

// Process a chat message
const handleChat: RequestHandler = async (req, res): Promise<void> => {
  try {
    const chatRequest: ChatRequest = req.body;

    if (!chatRequest.message && !chatRequest.questionResponse) {
      res
        .status(400)
        .json({ error: "Message or question response is required" });
      return;
    }

    const response = await chatService.processMessage(chatRequest);
    res.json(response);
  } catch (error) {
    console.error("Chat endpoint error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Handle question response specifically
const handleQuestionResponse: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { sessionId, questionId, answer } = req.body;

    if (!sessionId || !questionId || !answer) {
      res
        .status(400)
        .json({ error: "Session ID, question ID, and answer are required" });
      return;
    }

    const questionResponse: QuestionResponse = {
      questionId,
      answer,
      timestamp: new Date(),
    };

    const chatRequest: ChatRequest = {
      sessionId,
      message: "", // Empty message for question responses
      questionResponse,
    };

    const response = await chatService.processMessage(chatRequest);
    res.json(response);
  } catch (error) {
    console.error("Question response endpoint error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get session data
const getSession: RequestHandler = async (req, res): Promise<void> => {
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
};

// Clear/reset session
const clearSession: RequestHandler = async (req, res): Promise<void> => {
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
};

// Health check
const healthCheck: RequestHandler = (_req, res): void => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
};

// Route handlers
router.post("/chat", handleChat);
router.post("/question-response", handleQuestionResponse);
router.get("/session/:sessionId", getSession);
router.post("/session/:sessionId/clear", clearSession);
router.get("/health", healthCheck);

export default router;
