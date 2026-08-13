"use client";

import type { CommunicationStyle } from "@/types";

/** Переключатель формального / неформального стиля */
export function StyleToggle({
  style,
  onChange,
  className = "",
}: {
  style: CommunicationStyle;
  onChange: (s: CommunicationStyle) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full rounded-full border border-yandex-gray-200 bg-yandex-gray-50 p-1 sm:inline-flex sm:w-auto ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange("formal")}
        className={`min-h-[44px] flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-all sm:flex-none sm:px-4 ${
          style === "formal"
            ? "bg-white text-yandex-dark shadow-sm"
            : "text-yandex-gray-500 hover:text-yandex-dark"
        }`}
      >
        📋 Формальный
      </button>
      <button
        type="button"
        onClick={() => onChange("informal")}
        className={`min-h-[44px] flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-all sm:flex-none sm:px-4 ${
          style === "informal"
            ? "bg-white text-yandex-red shadow-sm"
            : "text-yandex-gray-500 hover:text-yandex-dark"
        }`}
      >
        😄 Неформальный
      </button>
    </div>
  );
}
