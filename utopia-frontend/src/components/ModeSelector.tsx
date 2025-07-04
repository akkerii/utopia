"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Target,
  Rocket,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mode } from "@/types";
import { AnimatedLogo } from "@/components/AnimatedLogo";

interface ModeSelectorProps {
  onModeSelect: (mode: Mode) => void;
}

const FEATURES = {
  entrepreneur: [
    {
      icon: CheckCircle,
      title: "Idea Incubation",
      description: "Transform rough concepts into viable business ideas",
    },
    {
      icon: Target,
      title: "Market Intelligence",
      description: "Identify and understand your perfect customers",
    },
    {
      icon: TrendingUp,
      title: "Growth Blueprint",
      description: "Build scalable business models and strategies",
    },
  ],
  consultant: [
    {
      icon: CheckCircle,
      title: "Deep Diagnosis",
      description: "Uncover root causes of business challenges",
    },
    {
      icon: Target,
      title: "Strategic Solutions",
      description: "Get actionable plans to overcome obstacles",
    },
    {
      icon: TrendingUp,
      title: "Performance Boost",
      description: "Optimize operations and accelerate growth",
    },
  ],
};

const Card = ({
  mode,
  title,
  description,
  icon: Icon,
  features,
  isHovered,
  onHover,
  onSelect,
}: {
  mode: Mode;
  title: string;
  description: string;
  icon: any;
  features: typeof FEATURES.entrepreneur;
  isHovered: boolean;
  onHover: (isHovered: boolean) => void;
  onSelect: () => void;
}) => (
  <div
    className={`relative group ${isHovered ? "z-20" : "z-10"}`}
    onMouseEnter={() => onHover(true)}
    onMouseLeave={() => onHover(false)}
  >
    <div className="relative h-full bg-white rounded-xl shadow-sm p-6 transition-shadow duration-200 hover:shadow-md">
      <div className="relative flex flex-col h-full">
        <div className="flex-none">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-[#0074D9] rounded-lg flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#001f3f] mb-4">{title}</h2>

          <p className="text-[#001f3f] leading-relaxed">{description}</p>
        </div>

        <div className="flex-1 my-8">
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded hover:bg-gray-100"
              >
                <feature.icon className="w-5 h-5 text-[#0074D9] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-none">
          <button
            onClick={onSelect}
            className="w-full bg-[#0074D9] hover:bg-[#005bb5] text-white py-3 rounded transition-shadow duration-200 shadow"
          >
            <span className="relative z-10 flex items-center justify-center text-lg font-medium">
              {mode === Mode.ENTREPRENEUR
                ? "Launch My Startup"
                : "Solve My Challenge"}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Badge */}
          <div className="absolute -top-2 -right-2">
            <div className="relative">
              <div className="px-2 py-1 bg-[#0074D9] text-white text-xs font-semibold rounded">
                {mode === Mode.ENTREPRENEUR ? "POPULAR" : "PRO"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect }) => {
  const [hoveredMode, setHoveredMode] = useState<Mode | null>(null);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
      <div className="max-w-6xl w-full relative z-10">
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <AnimatedLogo />
        </div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card
            mode={Mode.ENTREPRENEUR}
            title="Entrepreneur Mode"
            description="Transform your spark of inspiration into a thriving business. Our AI guides you through every step of your entrepreneurial journey."
            icon={Rocket}
            features={FEATURES.entrepreneur}
            isHovered={hoveredMode === Mode.ENTREPRENEUR}
            onHover={(isHovered) =>
              setHoveredMode(isHovered ? Mode.ENTREPRENEUR : null)
            }
            onSelect={() => onModeSelect(Mode.ENTREPRENEUR)}
          />

          <Card
            mode={Mode.CONSULTANT}
            title="Consultant Mode"
            description="Overcome challenges and unlock growth. Our AI consultant provides expert strategies tailored to your business needs."
            icon={Brain}
            features={FEATURES.consultant}
            isHovered={hoveredMode === Mode.CONSULTANT}
            onHover={(isHovered) =>
              setHoveredMode(isHovered ? Mode.CONSULTANT : null)
            }
            onSelect={() => onModeSelect(Mode.CONSULTANT)}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-600 text-base mb-2">
            Switch modes anytime during your journey
          </p>
          <span className="text-gray-500 text-sm">Powered by AI • Built for ambitious businesses</span>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
