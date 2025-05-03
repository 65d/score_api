"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [prevDisplayValue, setPrevDisplayValue] = useState(value);
  const [animationDirection, setAnimationDirection] = useState<
    "up" | "down" | null
  >(null);

  const prevValueRef = useRef(value);

  useEffect(() => {
    const previous = prevValueRef.current;
    if (value === previous) return;

    setPrevDisplayValue(previous);
    setAnimationDirection(value > previous ? "down" : "up");

    const showNew = setTimeout(() => {
      setDisplayValue(value);

      const reset = setTimeout(() => setAnimationDirection(null), 500);
      return () => clearTimeout(reset);
    }, 50);

    prevValueRef.current = value;
    return () => clearTimeout(showNew);
  }, [value]);

  return (
    <div className="relative overflow-hidden">
      <div className={`transition-transform duration-500 ${className}`}>
        <div
          className={
            animationDirection === "down"
              ? "animate-slide-down-in"
              : animationDirection === "up"
              ? "animate-slide-up-in"
              : undefined
          }
        >
          {displayValue}
        </div>

        {animationDirection && (
          <div
            className={`absolute inset-0 ${
              animationDirection === "down"
                ? "animate-slide-down-out"
                : "animate-slide-up-out"
            }`}
          >
            {prevDisplayValue}
          </div>
        )}
      </div>
    </div>
  );
};
