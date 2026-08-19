"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";

export function AiToast() {
  const { showAiToast } = useApp();
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {showAiToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-[200] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-yandex-gray-200 bg-white px-4 py-3 shadow-card-hover sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:px-6 sm:py-4"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yandex-red-light text-lg animate-pulse">
            🤖
          </span>
          <p className="text-xs font-semibold text-yandex-dark sm:text-sm">
            {t("aiToast.thinking")}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
