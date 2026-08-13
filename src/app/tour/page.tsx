"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { PageTransition } from "@/components/PageTransition";
import { ExhibitTimer } from "@/components/ExhibitTimer";
import { InteractiveBlock } from "@/components/InteractiveBlock";
import { StyleToggle } from "@/components/StyleToggle";
import { ExhibitPlaceholder } from "@/components/Icons";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { getExhibitText, getExhibitDurationSec } from "@/lib/utils";

function TourContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeId = searchParams.get("route") ?? "";

  const {
    profile,
    updateProfile,
    routes,
    tour,
    startTour,
    nextExhibit,
    setTimerDone,
    getRouteExhibits,
  } = useApp();

  const route = routes.find((r) => r.id === routeId);
  const exhibits = route ? getRouteExhibits(routeId) : [];
  const idx = tour?.routeId === routeId ? tour.exhibitIndex : 0;
  const exhibit = exhibits[idx];
  const durationSec = getExhibitDurationSec(profile.tourTime);

  useEffect(() => {
    if (routeId && (!tour || tour.routeId !== routeId)) {
      startTour(routeId);
    }
  }, [routeId, tour, startTour]);

  if (!route || !exhibit) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold">Маршрут не найден</h1>
        <Link href="/routes" className="mt-6 inline-block">
          <Button>Выбрать маршрут</Button>
        </Link>
      </div>
    );
  }

  const isLast = idx >= exhibits.length - 1;
  const text = getExhibitText(exhibit, profile);
  const progress = ((idx + 1) / exhibits.length) * 100;
  const textTone =
    profile.style === "formal"
      ? "border-l-4 border-yandex-gray-300 pl-4"
      : "border-l-4 border-yandex-red pl-4";

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-yandex-gray-400">{route.title}</p>
            <p className="text-sm font-semibold">
              Экспонат {idx + 1} / {exhibits.length}
            </p>
          </div>
          <StyleToggle
            style={profile.style}
            onChange={(style) => updateProfile({ style })}
          />
        </div>

        <ProgressBar value={progress} className="mb-8" />

        <motion.article
          key={exhibit.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-yandex-gray-200 bg-white shadow-card"
        >
          <ExhibitPlaceholder title="Фото экспоната (заглушка)" />
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{exhibit.title}</h1>
            <p className={`mt-6 whitespace-pre-line text-base leading-relaxed text-yandex-gray-600 ${textTone}`}>
              {text}
            </p>

            <div className="mt-8">
              <ExhibitTimer
                key={exhibit.id}
                durationSec={durationSec}
                onComplete={() => setTimerDone(true)}
              />
            </div>

            <div className="mt-6">
              <InteractiveBlock items={exhibit.interactives} />
            </div>
          </div>
        </motion.article>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button
            size="lg"
            disabled={!tour?.timerDone}
            onClick={() => {
              if (isLast) router.push("/results");
              else nextExhibit();
            }}
          >
            {isLast ? "Завершить экскурсию →" : "Следующий экспонат →"}
          </Button>
          {!tour?.timerDone && (
            <span className="text-sm text-yandex-gray-400">Дождитесь окончания таймера</span>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default function TourPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Загрузка...</div>}>
      <TourContent />
    </Suspense>
  );
}
