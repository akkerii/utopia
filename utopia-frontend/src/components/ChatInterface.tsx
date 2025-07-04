"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Target,
  CheckCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientDate } from "@/components/ClientDate";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import {
  ConversationMessage,
  AgentType,
  ModuleType,
  SessionData,
} from "@/types";
import {
  getAgentColor,
  getModuleTitle,
  getNextModule,
  getPreviousModule,
} from "@/lib/modules";
import ReactMarkdown from "react-markdown";

interface ChatInterfaceProps {
  messages: ConversationMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  currentAgent?: AgentType;
  currentModule?: ModuleType;
  sessionData?: SessionData;
}

const TypingIndicator = ({ agent }: { agent?: AgentType }) => (
  <div className="flex justify-start">
    <div className="bg-white rounded-2xl p-4 flex items-center space-x-3 shadow-sm border border-gray-100">
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="text-gray-600 text-sm">Utopia AI is typing...</span>
    </div>
  </div>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  currentAgent,
  currentModule,
  sessionData,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [showContextInfo, setShowContextInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const getAgentName = (agent?: AgentType): string => {
    if (!agent) return "Utopia AI";
    return `${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent`;
  };

  const getModuleData = (moduleType: ModuleType) => {
    if (!sessionData) return null;
    return sessionData.modules.find((m) => m.moduleType === moduleType);
  };

  const renderMessage = (message: ConversationMessage) => {
    // Check if this is a system transition message
    const isTransitionMessage =
      message.role === "system" ||
      (message.role === "assistant" &&
        message.content.includes("🔄 Transitioning to"));

    if (isTransitionMessage) {
      return (
        <div key={message.id} className="flex justify-center my-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg animate-pulse">
            {message.content}
          </div>
        </div>
      );
    }

    // Check if this message is from a different module than the current one
    const isFromDifferentModule =
      message.module && currentModule && message.module !== currentModule;

    const isUserMessage = message.role === "user";

    return (
      <div
        key={message.id}
        className={`flex ${
          isUserMessage ? "justify-end" : "justify-start"
        } mb-4 animate-fade-in`}
      >
        <div
          className={`max-w-[80%] rounded-2xl p-4 shadow-sm transition-all ${
            isUserMessage
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
              : isFromDifferentModule
              ? "bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-amber-400 text-gray-900"
              : "bg-white border border-gray-100 text-gray-900"
          }`}
        >
          {!isUserMessage && message.agent && (
            <div className="flex items-center mb-2 text-xs">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${getAgentColor(
                  message.agent
                )} animate-pulse`}
              />
              <span
                className={`font-medium ${
                  isUserMessage ? "text-blue-100" : "text-gray-600"
                }`}
              >
                {getAgentName(message.agent)}
              </span>
              {message.module && (
                <span
                  className={`ml-2 ${
                    isUserMessage ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  • {getModuleTitle(message.module)}
                </span>
              )}
              {isFromDifferentModule && (
                <span className="ml-2 text-amber-600 font-medium">
                  • Referenced
                </span>
              )}
            </div>
          )}
          <div
            className={`prose ${
              isUserMessage ? "prose-invert" : "prose-gray"
            } max-w-none leading-relaxed`}
          >
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-2xl font-bold mt-6 mb-4 pb-2 border-b"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className={`text-lg font-semibold mt-4 mb-2 ${
                      isUserMessage
                        ? "text-white"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    }`}
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-3 last:mb-0" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-3" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-3" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="mb-1 last:mb-0" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className={`font-medium ${
                      isUserMessage
                        ? "text-white underline"
                        : "text-indigo-600 hover:text-purple-600 transition-colors"
                    }`}
                    {...props}
                  />
                ),
                strong: ({ node, ...props }) => (
                  <strong
                    className={`font-bold ${
                      isUserMessage
                        ? "text-white"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    }`}
                    {...props}
                  />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          <div
            className={`text-xs mt-3 ${
              isUserMessage ? "text-blue-100" : "text-gray-400"
            }`}
          >
            <ClientDate date={message.timestamp} />
          </div>
        </div>
      </div>
    );
  };

  // Get context from previous modules
  const renderContextPanel = () => {
    if (!showContextInfo || !sessionData || !currentModule) return null;

    const prevModule = getPreviousModule(currentModule);
    const nextModule = getNextModule(currentModule);

    return (
      <div className="bg-gradient-to-b from-gray-50 to-white border-t border-b p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 text-lg">
            Module Context
          </h3>
          <button
            onClick={() => setShowContextInfo(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-sm">✕</span>
          </button>
        </div>

        <div className="space-y-4">
          {prevModule && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Previous: {getModuleTitle(prevModule)}</span>
              </div>
              {renderModuleData(prevModule)}
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200 shadow-sm">
            <div className="flex items-center text-sm font-medium text-blue-700 mb-2">
              <Target className="w-4 h-4 mr-2" />
              <span>Current: {getModuleTitle(currentModule)}</span>
            </div>
            {renderModuleData(currentModule)}
          </div>

          {nextModule && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <ArrowRight className="w-4 h-4 mr-2" />
                <span>Next: {getModuleTitle(nextModule)}</span>
              </div>
              <div className="text-sm text-gray-500">
                Complete current module to unlock
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderModuleData = (moduleType: ModuleType) => {
    const moduleData = getModuleData(moduleType);

    if (!moduleData || Object.keys(moduleData.data || {}).length === 0) {
      return <div className="text-sm text-gray-500 italic">No data yet</div>;
    }

    if (moduleData.summary) {
      return <div className="text-sm text-gray-700">{moduleData.summary}</div>;
    }

    return (
      <div className="text-sm text-gray-700 space-y-1">
        {Object.entries(moduleData.data).map(([key, value]) => (
          <div key={key}>
            <span className="font-medium capitalize">
              {key.replace(/_/g, " ")}:
            </span>{" "}
            {String(value)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Module Progress Header */}
      {currentModule && (
        <div className="bg-white border-b px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {getModuleTitle(currentModule)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentAgent && `with ${getAgentName(currentAgent)}`}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowContextInfo(!showContextInfo)}
              className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>{showContextInfo ? "Hide" : "Show"} context</span>
            </button>
          </div>
        </div>
      )}

      {/* Context Panel */}
      {renderContextPanel()}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {messages.length === 0 ? (
          <>
            <div className="flex justify-start mb-4 animate-fade-in">
              <div className="max-w-[80%] rounded-2xl p-4 shadow-sm bg-white border border-gray-100 text-gray-900">
                <div className="flex items-center mb-2 text-xs">
                  <div className="w-2 h-2 rounded-full mr-2 bg-blue-500 animate-pulse" />
                  <span className="font-medium text-gray-600">Utopia AI</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  👋 Hello! I'm Utopia AI, your dedicated business advisor. I'm
                  here to help you develop and refine your business ideas,
                  create comprehensive plans, and overcome challenges. Feel free
                  to share your thoughts or ask any questions about your
                  business journey. What would you like to explore today?
                </div>
                <div className="text-xs mt-3 text-gray-400">
                  <ClientDate date={new Date()} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                  <AnimatedLogo />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Welcome to Utopia AI
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  I'm here to help you build your business plan step by step.
                  Let's start by exploring your business idea!
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {messages.map(renderMessage)}
            {isLoading && <TypingIndicator agent={currentAgent} />}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t bg-white px-6 py-4 shadow-lg">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              currentModule
                ? `Ask about ${getModuleTitle(
                    currentModule
                  ).toLowerCase()} or say "let's move to [next module]"`
                : "Type your message..."
            }
            disabled={isLoading}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
          />
          <Button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl group relative overflow-hidden will-change-transform"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
