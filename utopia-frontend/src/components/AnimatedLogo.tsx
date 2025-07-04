"use client";

import React from "react";

export const AnimatedLogo = () => {
  return (
    <div className="relative w-12 h-12 cursor-pointer select-none group">
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
        style={{ filter: "drop-shadow(0 0 8px rgba(0,116,217,0.6))" }}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0074D9" />
            <stop offset="50%" stopColor="#7FDBFF" />
            <stop offset="100%" stopColor="#001f3f" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Outer rotating ring */}
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="url(#logoGradient)"
          strokeWidth="4"
          fill="none"
          filter="url(#glow)"
          style={{
            transformOrigin: "32px 32px",
            animation: "rotate 6s linear infinite",
          }}
        />
        {/* Inner static ring */}
        <circle
          cx="32"
          cy="32"
          r="20"
          stroke="#001f3f"
          strokeWidth="2"
          fill="black"
        />
        {/* Central U text */}
        <text
          x="32"
          y="38"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="url(#logoGradient)"
          style={{
            animation: "pulse 2s ease-in-out infinite",
            transformOrigin: "32px 32px",
          }}
        >
          U
        </text>
      </svg>
      <style jsx>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};
