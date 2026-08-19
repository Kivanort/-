"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { RouteIcon } from "./Icons";
import { Button } from "./Button";
import type { Route } from "@/types";

export function RouteCard({ route }: { route: Route }) {
  const router = useRouter();
  const { setShowAiToast, setPendingRouteId, startTour } = useApp();
  const { t } = useLanguage();

  const handleStart = () => {
    setPendingRouteId(route.id);
    setShowAiToast(true);
    setTimeout(() => {
      setShowAiToast(false);
      startTour(route.id);
      setPendingRouteId(null);
      router.push(`/tour?route=${route.id}`);
    }, 1000);
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-yandex-gray-200 bg-white shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-center justify-center bg-yandex-gray-50 p-8 text-yandex-red">
        <RouteIcon name={route.icon} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-2 inline-block w-fit rounded-full bg-yandex-gray-100 px-3 py-1 text-xs font-semibold text-yandex-gray-500">
          {route.duration}
        </span>
        <h3 className="mb-2 text-xl font-extrabold tracking-tight">{route.title}</h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-yandex-gray-500">{route.description}</p>
        <Button className="w-full" onClick={handleStart}>
          {t("card.startRoute")}
        </Button>
      </div>
    </motion.article>
  );
}
