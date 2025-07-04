"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ModeSelector from "@/components/ModeSelector";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import ChatInterface from "@/components/ChatInterface";
import {
  Mode,
  ChatState,
  SessionData,
  ConversationMessage,
  ModuleType,
} from "@/types";
import { chatApi } from "@/lib/api";
import {
  getNextModule,
  getModuleTransitionMessage,
  isModuleAccessible,
} from "@/lib/modules";

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | undefined>();
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });

  // Local function to get module title
  const getModuleTitle = (moduleType: ModuleType): string => {
    const titles: Record<ModuleType, string> = {
      [ModuleType.IDEA_CONCEPT]: "Your Idea",
      [ModuleType.TARGET_MARKET]: "Target Market",
      [ModuleType.VALUE_PROPOSITION]: "Value Proposition",
      [ModuleType.BUSINESS_MODEL]: "Business Model",
      [ModuleType.MARKETING_STRATEGY]: "Marketing Strategy",
      [ModuleType.OPERATIONS_PLAN]: "Operations Plan",
      [ModuleType.FINANCIAL_PLAN]: "Financial Plan",
    };
    return titles[moduleType] || moduleType.replace(/_/g, " ");
  };

  // Load session data when sessionId changes
  useEffect(() => {
    if (chatState.sessionId) {
      loadSessionData(chatState.sessionId);
    }
  }, [chatState.sessionId]);

  const loadSessionData = async (sessionId: string) => {
    try {
      const data = await chatApi.getSession(sessionId);
      setSessionData(data);

      // Update chat state with conversation history
      setChatState((prev) => ({
        ...prev,
        messages: data.conversationHistory,
        mode: data.mode,
        currentAgent: data.currentAgent,
        currentModule: data.currentModule,
      }));
    } catch (error) {
      console.error("Failed to load session data:", error);
      toast.error("Failed to load session data");
    }
  };

  const handleModeSelect = async (mode: Mode) => {
    setSelectedMode(mode);

    // Initialize chat state with empty messages
    setChatState((prev) => ({
      ...prev,
      mode,
      messages: [],
      isLoading: false,
    }));
  };

  const sendMessage = async (message: string, mode?: Mode) => {
    // Create user message immediately
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    // Update chat state with user message immediately
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const request = {
        message,
        sessionId: chatState.sessionId,
        mode: mode || chatState.mode,
      };

      const response = await chatApi.sendMessage(request);

      // Update module state if changed
      if (
        response.currentModule &&
        response.currentModule !== chatState.currentModule
      ) {
        setChatState((prev) => ({
          ...prev,
          currentModule: response.currentModule,
        }));
      }

      // Add transition message if needed
      if (response.isModuleTransition && response.currentModule) {
        const transitionMessage: ConversationMessage = {
          id: `transition-${Date.now()}`,
          role: "system",
          content: `🔄 Transitioning to ${getModuleTitle(
            response.currentModule
          )} module...`,
          timestamp: new Date(),
        };

        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, transitionMessage],
        }));
      }

      // Create assistant message
      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        agent: response.agent,
        module: response.currentModule,
        timestamp: new Date(),
      };

      // Update chat state with assistant message
      setChatState((prev) => ({
        ...prev,
        sessionId: response.sessionId,
        mode: mode || prev.mode,
        currentAgent: response.agent,
        currentModule: response.currentModule,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));

      // Reload session data to get updated modules
      if (response.sessionId) {
        await loadSessionData(response.sessionId);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");

      // Keep the user message but show error state
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const handleReset = async () => {
    if (chatState.sessionId) {
      try {
        await chatApi.clearSession(chatState.sessionId);
        toast.success("Session reset successfully");
      } catch (error) {
        console.error("Failed to clear session:", error);
      }
    }

    // Reset local state
    setSelectedMode(null);
    setSessionData(undefined);
    setChatState({
      messages: [],
      isLoading: false,
    });
  };

  const handleHome = () => {
    setSelectedMode(null);
    setSessionData(undefined);
    setChatState({
      messages: [],
      isLoading: false,
    });
  };

  const getCompletedModules = (): ModuleType[] => {
    if (!sessionData) return [];
    return sessionData.modules
      .filter((m) => m.completionStatus === "completed")
      .map((m) => m.moduleType);
  };

  const handleModuleClick = (moduleType: ModuleType) => {
    const completedModules = getCompletedModules();

    // Check if module is accessible
    if (!isModuleAccessible(moduleType, completedModules)) {
      toast.error("Complete previous modules first to unlock this one");
      return;
    }

    // Just update the current module without sending a message
    setChatState((prev) => ({
      ...prev,
      currentModule: moduleType,
    }));
  };

  const handleNextModule = () => {
    if (!chatState.currentModule) return;

    const nextModule = getNextModule(chatState.currentModule);
    if (!nextModule) {
      toast.success("Congratulations! You've completed all modules!");
      return;
    }

    // Use the same module switching logic
    handleModuleClick(nextModule);
  };

  // Show mode selector if no mode is selected
  if (!selectedMode) {
    return <ModeSelector onModeSelect={handleModeSelect} />;
  }

  // Main application interface
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        mode={chatState.mode}
        currentAgent={chatState.currentAgent}
        sessionId={chatState.sessionId}
        onReset={handleReset}
        onHome={handleHome}
      />

      <div className="flex-1 flex overflow-hidden">
        <Dashboard
          sessionData={sessionData}
          onModuleClick={handleModuleClick}
          onNextModule={handleNextModule}
          currentModule={chatState.currentModule}
          currentAgent={chatState.currentAgent}
        />

        <div className="flex-1 bg-white">
          <ChatInterface
            messages={chatState.messages}
            isLoading={chatState.isLoading}
            onSendMessage={sendMessage}
            currentAgent={chatState.currentAgent}
            currentModule={chatState.currentModule}
            sessionData={sessionData}
          />
        </div>
      </div>
    </div>
  );
}
