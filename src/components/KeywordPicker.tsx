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
              className={`rounded-pill border px-4 py-1.5 text-[14px] font-normal tracking-[-0.224px] transition-all active:scale-95 ${
                isSelected
                  ? "border-primary bg-primary text-white"
                  : "border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-[var(--color-text-primary)] hover:border-[var(--color-primary-focus)]"
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
          className="w-full max-w-xs rounded-pill border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-2 text-[14px] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary-focus)] focus:ring-2 focus:ring-[var(--color-primary-focus)]/20"
        />
        <button
          type="button"
          onClick={addCustomKeyword}
          className="rounded-pill bg-[var(--color-text-primary)] px-4 py-2 text-[14px] font-normal text-[var(--color-card-bg)] transition-transform active:scale-95 hover:opacity-90"
        >
          추가
        </button>
      </div>
    </div>
  );
}
