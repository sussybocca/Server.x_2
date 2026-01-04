"use client";

import { useState } from "react";

interface TabManagerProps {
  tabs: string[];
  active: number;
  onNew: () => void;
  onSelect: (index: number) => void;
  onClose: (index: number) => void;
}

export default function TabManager({ tabs, active, onNew, onSelect, onClose }: TabManagerProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div className="flex items-center bg-zinc-950 px-1 py-1 gap-1 overflow-x-auto">
      {tabs.map((tab, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 px-3 py-1 rounded-t-lg cursor-pointer transition-colors duration-150
            ${i === active ? "bg-zinc-700" : hoverIndex === i ? "bg-zinc-800" : "bg-zinc-800/80"}`}
          onClick={() => onSelect(i)}
          onMouseEnter={() => setHoverIndex(i)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <span className="text-sm truncate max-w-[120px]">{tab.replace("server://", "")}</span>
          <span
            className="text-red-400 hover:text-red-300 transition"
            onClick={e => {
              e.stopPropagation();
              onClose(i);
            }}
          >
            ×
          </span>
        </div>
      ))}

      {/* New tab button */}
      <button
        onClick={onNew}
        className="ml-2 px-3 py-1 rounded-t-lg bg-zinc-800 hover:bg-zinc-700 transition"
        title="New Tab"
      >
        +
      </button>
    </div>
  );
}
