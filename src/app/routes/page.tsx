"use client";

import { useState, useMemo } from "react";
import { PageTransition } from "@/components/PageTransition";
import { RouteCard } from "@/components/RouteCard";
import { StyleToggle } from "@/components/StyleToggle";
import { useApp } from "@/context/AppContext";
import routesData from "@/data/routes.json";

const FILTER_MAP: Record<string, string | null> = {
  Все: null,
  История: "history",
  Игры: "games",
  Технологии: "technology",
};

/** Страница маршрутов с фильтрами и карточками-заглушками */
export default function RoutesPage() {
  const { profile, updateProfile, routes, isProfileComplete } = useApp();
  const [filter, setFilter] = useState("Все");

  const filtered = useMemo(() => {
    const cat = FILTER_MAP[filter];
    if (!cat) return routes;
    return routes.filter((r) => r.category === cat);
  }, [filter, routes]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">Маршруты</h1>
            <p className="mt-2 text-yandex-gray-500">
              {isProfileComplete
                ? `${profile.name}, вот маршруты музея — ИИ учёл ваши ответы`
                : "Выберите маршрут или пройдите опрос для персонализации"}
            </p>
          </div>
          <div className="w-full shrink-0 md:w-auto">
            <StyleToggle
              style={profile.style}
              onChange={(style) => updateProfile({ style })}
            />
          </div>
        </div>

        {/* Фильтры */}
        <div className="-mx-1 mb-8 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {routesData.filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-yandex-red text-white shadow-md shadow-yandex-red/20"
                  : "bg-yandex-gray-100 text-yandex-gray-600 hover:bg-yandex-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
