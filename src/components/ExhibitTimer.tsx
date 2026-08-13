"use client";

import { useEffect, useState, useCallback } from "react";
import { formatTime } from "@/lib/utils";

export function ExhibitTimer({
  durationSec,
  onComplete,
}: {
  durationSec: number;
  onComplete?: () => void;
}) {
  const [remaining, setRemaining] = useState(durationSec);

  useEffect(() => setRemaining(durationSec), [durationSec]);

  const tick = useCallback(() => {
    setRemaining((prev) => {
      if (prev <= 1) {
        onComplete?.();
        return 0;
      }
      return prev - 1;
    });
  }, [onComplete]);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [remaining, tick]);

  const progress = ((durationSec - remaining) / durationSec) * 100;

  return (
    <div className="rounded-2xl border border-yandex-gray-200 bg-yandex-gray-50 p-5">
      <div className="mb-2 flex justify-between">
        <span className="text-sm font-medium text-yandex-gray-500">Время на экспонат</span>
        <span className={`font-mono text-2xl font-bold ${remaining <= 15 && remaining > 0 ? "text-yandex-red" : ""}`}>
          {formatTime(remaining)}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-yandex-gray-200">
        <div
          className="h-full rounded-full bg-yandex-red transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
