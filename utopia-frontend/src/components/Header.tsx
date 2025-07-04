"use client";

import React from "react";
import { RotateCcw, Settings, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mode, AgentType } from "@/types";
import { getAgentColor } from "@/lib/modules";

interface HeaderProps {
  mode?: Mode;
  currentAgent?: AgentType;
  sessionId?: string;
  onReset?: () => void;
  onHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  mode,
  currentAgent,
  sessionId,
  onReset,
  onHome,
}) => {
  const getAgentName = (agent?: AgentType): string => {
    if (!agent) return "";
    return `${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent`;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and breadcrumb */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Utopia AI</h1>
          </div>

          {mode && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>/</span>
              <span className="font-medium capitalize">{mode} Mode</span>
              {currentAgent && (
                <>
                  <span>/</span>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${getAgentColor(
                        currentAgent
                      )}`}
                    />
                    <span>{getAgentName(currentAgent)}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {sessionId && (
            <div className="text-xs text-gray-500 hidden md:block">
              Session: {sessionId.slice(0, 8)}...
            </div>
          )}

          {onHome && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onHome}
              className="text-gray-600 hover:text-gray-900"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          )}

          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-gray-600 hover:text-gray-900"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
