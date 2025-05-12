"use client";

import React from "react";

interface QuestionProps {
  id: string;
  text: string;
  value: number;
  onChange: (id: string, value: number) => void;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export default function Question({ id, text, value, onChange, isLoading, isSuccess }: QuestionProps) {
  return (
    <div className="mb-4">
      <p className="mb-2">{text}</p>
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((v) => (
          <label key={v} className="flex items-center">
            <input
              type="radio"
              name={id}
              value={v}
              checked={value === v}
              onChange={() => onChange(id, v)}
              disabled={isLoading}
              className={`mr-1 ${isLoading ? 'opacity-50' : ''} ${isSuccess ? 'accent-green-500' : ''}`}
            />
            {isLoading && value === v && (
              <div className="ml-1 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
            {isSuccess && value === v && (
              <span className="ml-1 text-green-500">✓</span>
            )}
            {v}
          </label>
        ))}
      </div>
    </div>
  );
}
