import axios from "axios";
import { ChatRequest, ChatResponse, SessionData } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://3.82.158.36/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 second timeout for AI responses
});

// Add request/response interceptors for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      throw new Error(
        "The AI is taking longer than usual to respond. Please try again."
      );
    }

    if (error.code === "NETWORK_ERROR") {
      throw new Error(
        "Unable to connect to the server. Please check if the backend is running."
      );
    }

    if (error.response?.status === 500) {
      throw new Error("Server error occurred. Please try again.");
    }

    if (error.response?.status === 429) {
      throw new Error(
        "Service is currently rate limited. Please wait a moment and try again."
      );
    }

    throw error;
  }
);

export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    try {
      const response = await api.post("/chat", request);
      return response.data;
    } catch (error: any) {
      if (
        error.message?.includes("Unable to connect") ||
        error.message?.includes("taking longer than usual") ||
        error.message?.includes("rate limited")
      ) {
        throw error;
      }
      throw new Error("Failed to send message. Please try again.");
    }
  },

  getSession: async (sessionId: string): Promise<SessionData> => {
    try {
      const response = await api.get(`/session/${sessionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to load session data.");
    }
  },

  clearSession: async (sessionId: string): Promise<void> => {
    try {
      await api.post(`/session/${sessionId}/clear`);
    } catch (error: any) {
      throw new Error("Failed to clear session.");
    }
  },

  healthCheck: async (): Promise<{ status: string }> => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error: any) {
      throw new Error("Backend health check failed.");
    }
  },
};

export default api;
