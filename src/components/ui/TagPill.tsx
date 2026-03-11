"use client";

import React from 'react';

interface TagPillProps {
  tone: "green" | "red" | "gray" | "orange" | "blue";
  label: string;
}

export default function TagPill({ tone, label }: TagPillProps) {
  const getClasses = () => {
    switch (tone) {
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      case "gray":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "orange":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getClasses()}`}>
      {label}
    </span>
  );
}
