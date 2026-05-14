"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface OrderSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const THUMB_SIZE = 16;
const HALF_THUMB = THUMB_SIZE / 2;

export default function OrderSlider({ value, onChange, min = 1, max = 10 }: OrderSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const range = max - min;
  const percentage = ((value - min) / range) * 100;

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const raw = min + pct * range;
      return Math.round(raw);
    },
    [min, max, range, value]
  );

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newValue = getValueFromPosition(e.clientX);
    onChange(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = getValueFromPosition(e.clientX);
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, getValueFromPosition, onChange]);

  // Touch support
  useEffect(() => {
    if (!dragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      const newValue = getValueFromPosition(e.touches[0].clientX);
      onChange(newValue);
    };

    const handleTouchEnd = () => {
      setDragging(false);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, getValueFromPosition, onChange]);

  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="select-none">
      {/* Track spans full width — thumb center aligns to value point */}
      <div
        ref={trackRef}
        className="relative h-2 bg-slate-200 rounded-lg cursor-pointer"
        onClick={handleTrackClick}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full shadow cursor-grab active:cursor-grabbing bg-slate-800"
          style={{
            left: `calc(${percentage}% - ${HALF_THUMB}px)`,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={() => setDragging(true)}
        />
      </div>

      {/* Ticks share the same full-width coordinate system */}
      <div className="relative mt-1" style={{ height: 36 }}>
        {ticks.map((v) => {
          const pct = ((v - min) / range) * 100;
          return (
            <div
              key={v}
              className="absolute top-0 flex flex-col items-center"
              style={{
                left: `${pct}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className={`w-px bg-slate-300 ${v === min || v === max ? "h-3" : "h-1.5"}`} />
              <span className="text-[10px] text-slate-400 mt-0.5">{v}</span>
              {v === min && <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">最重要</span>}
              {v === max && <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">最次要</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
