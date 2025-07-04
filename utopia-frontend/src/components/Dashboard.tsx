"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  Users,
  Diamond,
  Building,
  Megaphone,
  Cog,
  DollarSign,
  CheckCircle,
  Clock,
  Circle,
  ChevronRight,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ModuleType, SessionData, AgentType } from "@/types";
import {
  moduleConfig,
  getModulesByOrder,
  isModuleAccessible,
  getNextModule,
  getPreviousModule,
  getModuleIndex,
  getModuleTitle,
  getAgentColor,
} from "@/lib/modules";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  sessionData?: SessionData;
  onModuleClick?: (moduleType: ModuleType) => void;
  onNextModule?: () => void;
  currentModule?: ModuleType;
  currentAgent?: AgentType;
}

const iconMap = {
  lightbulb: Lightbulb,
  users: Users,
  diamond: Diamond,
  building: Building,
  megaphone: Megaphone,
  cog: Cog,
  "dollar-sign": DollarSign,
};

const ModuleTransitionOverlay = ({
  show,
  moduleTitle,
}: {
  show: boolean;
  moduleTitle: string;
}) =>
  show ? (
    <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center rounded-xl z-10 animate-fade-out">
      <div className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
        <span className="text-sm text-gray-700">
          Switching to {moduleTitle}...
        </span>
      </div>
    </div>
  ) : null;

const Dashboard: React.FC<DashboardProps> = ({
  sessionData,
  onModuleClick,
  onNextModule,
  currentModule,
  currentAgent,
}) => {
  const modules = getModulesByOrder();

  const getModuleStatus = (moduleType: ModuleType) => {
    if (!sessionData) return "empty";
    const moduleData = sessionData.modules.find(
      (m) => m.moduleType === moduleType
    );
    return moduleData?.completionStatus || "empty";
  };

  const getModuleSummary = (moduleType: ModuleType) => {
    if (!sessionData) return undefined;
    const moduleData = sessionData.modules.find(
      (m) => m.moduleType === moduleType
    );
    return moduleData?.summary;
  };

  const getModuleData = (moduleType: ModuleType) => {
    if (!sessionData) return undefined;
    const moduleData = sessionData.modules.find(
      (m) => m.moduleType === moduleType
    );
    return moduleData?.data;
  };

  const getCompletedModules = (): ModuleType[] => {
    if (!sessionData) return [];
    return sessionData.modules
      .filter((m) => m.completionStatus === "completed")
      .map((m) => m.moduleType);
  };

  const handleModuleClick = (moduleType: ModuleType) => {
    const accessible = isModuleAccessible(moduleType, completedModules);
    if (accessible && onModuleClick) {
      onModuleClick(moduleType);
    }
  };

  const completedModules = getCompletedModules();
  const currentModuleIndex = currentModule ? getModuleIndex(currentModule) : -1;
  const nextModule = currentModule ? getNextModule(currentModule) : null;

  const getProgressPercentage = (completedModules: ModuleType[]): number => {
    if (!sessionData || completedModules.length === 0) return 0;
    const totalModules = modules.length;
    const completed = completedModules.length;
    return (completed / totalModules) * 100;
  };

  return (
    <div className="w-72 bg-white border-r h-full overflow-y-auto">
      {/* Header */}
      <div className="p-3 border-b">
        <h2 className="text-base font-semibold text-gray-900">Business Plan</h2>
        {sessionData && (
          <div className="mt-1.5 flex items-center space-x-2">
            <span className="text-[11px] text-gray-500">Mode:</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {sessionData.mode.charAt(0).toUpperCase() +
                sessionData.mode.slice(1)}
            </span>
          </div>
        )}
      </div>

      {/* Current Module Indicator */}
      {currentModule && (
        <div className="px-3 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[11px] text-gray-600">
              <div className="w-1 h-1 bg-blue-500 rounded-full" />
              <span>Current Module:</span>
            </div>
            {currentAgent && (
              <div className="flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 text-purple-500" />
                <span className="text-[11px] font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {currentAgent.charAt(0).toUpperCase() + currentAgent.slice(1)}{" "}
                  Agent
                </span>
              </div>
            )}
          </div>
          <div className="mt-0.5 text-sm font-medium text-gray-900">
            {moduleConfig[currentModule].title}
          </div>
        </div>
      )}

      {/* Modules */}
      <div className="py-2">
        {modules.map((moduleType, index) => {
          const config = moduleConfig[moduleType];
          const status = getModuleStatus(moduleType);
          const summary = getModuleSummary(moduleType);
          const moduleData = getModuleData(moduleType);
          const Icon = iconMap[config.icon as keyof typeof iconMap] || Circle;
          const isCurrent = currentModule === moduleType;
          const isAccessible = isModuleAccessible(moduleType, completedModules);
          const isCompleted = status === "completed";
          const hasData =
            summary || (moduleData && Object.keys(moduleData).length > 0);

          return (
            <div key={moduleType} className="relative">
              {/* Connection Line */}
              {index < modules.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[22px] top-[38px] w-0.5 h-4",
                    isCompleted ? "bg-green-400" : "bg-gray-200"
                  )}
                />
              )}

              <div
                onClick={() => isAccessible && handleModuleClick(moduleType)}
                className={cn(
                  "relative mx-2 rounded-lg transition-colors",
                  isCurrent
                    ? "bg-blue-50"
                    : isCompleted
                    ? "hover:bg-green-50"
                    : isAccessible
                    ? "hover:bg-gray-50"
                    : "opacity-60",
                  isAccessible ? "cursor-pointer" : "cursor-not-allowed"
                )}
              >
                <div className="p-3">
                  <div className="flex items-start space-x-3">
                    {/* Module Number/Status */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium flex-shrink-0",
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-blue-500 text-white"
                          : isAccessible
                          ? "bg-gray-200 text-gray-700"
                          : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3
                          className={cn(
                            "text-sm font-medium truncate",
                            isCurrent
                              ? "text-blue-700"
                              : isAccessible
                              ? "text-gray-900"
                              : "text-gray-500"
                          )}
                        >
                          {config.title}
                        </h3>
                        {!isAccessible && (
                          <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        )}
                      </div>

                      {hasData && (
                        <div className="mt-2 text-xs bg-white rounded-md border p-2">
                          {summary ? (
                            <p className="text-gray-600 line-clamp-3">
                              {summary}
                            </p>
                          ) : (
                            moduleData && (
                              <div className="space-y-1 text-gray-600">
                                {Object.entries(moduleData)
                                  .slice(0, 2)
                                  .map(([key, value]) => (
                                    <div
                                      key={key}
                                      className="flex items-center space-x-1"
                                    >
                                      <span className="font-medium capitalize">
                                        {key.replace(/_/g, " ")}:
                                      </span>
                                      <span className="truncate">
                                        {String(value)}
                                      </span>
                                    </div>
                                  ))}
                                {Object.keys(moduleData).length > 2 && (
                                  <div className="text-gray-400 text-xs">
                                    +{Object.keys(moduleData).length - 2}{" "}
                                    more...
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      {sessionData && (
        <div className="px-4 py-3 border-t bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Progress</span>
            <span className="text-xs font-bold text-blue-600">
              {Math.round(getProgressPercentage(completedModules))}%
            </span>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${getProgressPercentage(completedModules)}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {completedModules.length} of {modules.length} complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
