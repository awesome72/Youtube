"use client";

import { useState } from "react";
import { DEFAULT_KEYWORDS } from "@/lib/constants";

interface KeywordPickerProps {
  selected: string[];
  onChange: (keywords: string[]) => void;
}

export default function KeywordPicker({ selected, onChange }: KeywordPickerProps) {
  const [customInput, setCustomInput] = useState("");
  const extraKeywords = selected.filter((k) => !DEFAULT_KEYWORDS.includes(k));
  const allChips = [...DEFAULT_KEYWORDS, ...extraKeywords];

  function toggle(keyword: string) {
    if (selected.includes(keyword)) {
      onChange(selected.filter((k) => k !== keyword));
    } else {
      onChange([...selected, keyword]);
    }
  }

  function addCustomKeyword() {
    const value = customInput.trim();
    if (!value) return;
    if (!selected.includes(value)) {
      onChange([...selected, value]);
    }
    setCustomInput("");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {allChips.map((keyword) => {
          const isSelected = selected.includes(keyword);
          return (
            <button
              key={keyword}
              type="button"
              onClick={() => toggle(keyword)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              {keyword}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomKeyword();
            }
          }}
          placeholder="직접 검색어 입력 (예: 반도체)"
          className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
        <button
          type="button"
          onClick={addCustomKeyword}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
        >
          추가
        </button>
      </div>
    </div>
  );
}
