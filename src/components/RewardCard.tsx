"use client";

import { motion } from "framer-motion";
import type { Reward } from "@/types";

export function RewardCard({ reward, index }: { reward: Reward; index: number }) {
  const labels = { sticker: "Стикер музея", badge: "Значок", avatar: "Аватар" };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl border border-yandex-gray-200 bg-white p-6 text-center shadow-card"
    >
      <div className="text-5xl mb-3">{reward.emoji}</div>
      <p className="text-xs font-bold uppercase tracking-wider text-yandex-red">{labels[reward.type]}</p>
      <h3 className="mt-1 text-lg font-extrabold">{reward.title}</h3>
      <p className="mt-2 text-sm text-yandex-gray-500">{reward.description}</p>
    </motion.div>
  );
}
