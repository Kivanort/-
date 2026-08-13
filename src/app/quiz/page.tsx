"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/Button";
import { PageTransition } from "@/components/PageTransition";
import type {
  AgeRange,
  Profession,
  Hobby,
  TourDuration,
  CommunicationStyle,
  RouteTheme,
} from "@/types";

const TOTAL_STEPS = 7;

const Q_TITLE = "mb-4 text-xl font-extrabold tracking-tight md:text-2xl";
const Q_HINT = "-mt-2 mb-4 text-sm text-yandex-gray-500";
const Q_OPT =
  "flex w-full items-center rounded-xl border-2 border-yandex-gray-200 px-4 py-3 text-left text-sm font-medium transition-all hover:border-yandex-gray-300 hover:bg-yandex-gray-50";
const Q_OPT_ON = "border-yandex-red bg-yandex-red-light";

/** Страница опроса — 7 точных вопросов из ТЗ */
export default function QuizPage() {
  const { profile, updateProfile, toggleHobby, isProfileComplete } = useApp();
  const [step, setStep] = useState(0);
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const canNext = (): boolean => {
    switch (step) {
      case 0:
        return profile.name.trim().length > 0;
      case 1:
        return !!profile.age;
      case 2:
        return !!profile.profession;
      case 3:
        return profile.hobbies.length > 0;
      case 4:
        return !!profile.tourTime;
      case 5:
        return !!profile.style;
      case 6:
        return true; // тема опциональна
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h2 className="mb-4 text-xl font-extrabold tracking-tight md:text-2xl">Как к вам обращаться?</h2>
            <input
              className="w-full rounded-xl border-2 border-yandex-gray-200 bg-yandex-gray-50 px-4 py-3 text-lg font-medium outline-none transition-all focus:border-yandex-red focus:bg-white focus:ring-4 focus:ring-yandex-red/10"
              placeholder="Имя или псевдоним"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              autoFocus
            />
          </>
        );
      case 1:
        return (
          <>
            <h2 className={Q_TITLE}>Ваш возраст?</h2>
            <OptionGroup
              options={[
                { id: "under18", label: "до 18 лет" },
                { id: "18-25", label: "18–25" },
                { id: "26-35", label: "26–35" },
                { id: "36-50", label: "36–50" },
                { id: "50plus", label: "50+" },
              ]}
              selected={profile.age}
              onSelect={(id) => updateProfile({ age: id as AgeRange })}
            />
          </>
        );
      case 2:
        return (
          <>
            <h2 className={Q_TITLE}>Направление работы/учёбы</h2>
            <p className={Q_HINT}>ИИ кастомизирует профессиональную лексику</p>
            <OptionGroup
              options={[
                { id: "it", label: "IT / Программирование" },
                { id: "engineering", label: "Инженерия / Техника" },
                { id: "humanities", label: "Гуманитарные науки" },
                { id: "business", label: "Бизнес / Управление" },
                { id: "student", label: "Студент (не IT)" },
                { id: "other", label: "Другое" },
              ]}
              selected={profile.profession}
              onSelect={(id) => updateProfile({ profession: id as Profession })}
            />
          </>
        );
      case 3:
        return (
          <>
            <h2 className={Q_TITLE}>Ваши хобби</h2>
            <p className={Q_HINT}>Выберите одно или несколько</p>
            <div className="space-y-2">
              {(
                [
                  ["games", "Игры / Гейминг"],
                  ["history", "История / Ретро"],
                  ["tech", "Технологии / Гаджеты"],
                  ["art", "Искусство / Дизайн"],
                  ["science", "Наука / Космос"],
                  ["music", "Музыка"],
                  ["cinema", "Кино"],
                ] as [Hobby, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleHobby(id)}
                  className={`${Q_OPT} ${profile.hobbies.includes(id) ? Q_OPT_ON : ""}`}
                >
                  {label}
                  {profile.hobbies.includes(id) && <span className="ml-auto text-yandex-red">✓</span>}
                </button>
              ))}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className={Q_TITLE}>Сколько времени готовы потратить на экскурсию?</h2>
            <OptionGroup
              options={[
                { id: "15-20", label: "15–20 мин" },
                { id: "30-40", label: "30–40 мин" },
                { id: "60plus", label: "60+ мин" },
              ]}
              selected={profile.tourTime}
              onSelect={(id) => updateProfile({ tourTime: id as TourDuration })}
            />
          </>
        );
      case 5:
        return (
          <>
            <h2 className={Q_TITLE}>Какой стиль общения вам комфортнее?</h2>
            <OptionGroup
              options={[
                { id: "formal", label: "Формальный (официальный)" },
                { id: "informal", label: "Неформальный (живой, с юмором)" },
              ]}
              selected={profile.style}
              onSelect={(id) => updateProfile({ style: id as CommunicationStyle })}
            />
          </>
        );
      case 6:
        return (
          <>
            <h2 className={Q_TITLE}>Выберите тему маршрута</h2>
            <p className={Q_HINT}>Опционально — можно пропустить</p>
            <OptionGroup
              options={[
                { id: "computers", label: "История компьютеров" },
                { id: "keyboards-games", label: "Клавиатуры и игры" },
                { id: "soviet", label: "Советские технологии" },
                { id: "modern", label: "Современные гаджеты" },
                { id: "random", label: "Случайный маршрут (выберет ИИ)" },
                { id: "", label: "Пропустить" },
              ]}
              selected={profile.theme}
              onSelect={(id) => updateProfile({ theme: id as RouteTheme })}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-xl px-4 py-8 sm:py-10">
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Опрос</h1>
        <p className="mb-8 text-yandex-gray-500">7 вопросов для персонализации маршрута</p>

        <ProgressBar value={progress} className="mb-8" />

        <div className="rounded-2xl border border-yandex-gray-200 bg-white p-4 shadow-card sm:p-6 md:p-8">
          <p className="mb-4 text-sm font-medium text-yandex-gray-400">
            Вопрос {step + 1} из {TOTAL_STEPS}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                ← Назад
              </Button>
            )}
            {canNext() && step < TOTAL_STEPS - 1 && (
              <Button onClick={() => setStep(step + 1)}>Далее →</Button>
            )}
            {(canNext() && step === TOTAL_STEPS - 1) || isProfileComplete ? (
              <Link href="/routes">
                <Button size="lg">Показать мои маршруты →</Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function OptionGroup({
  options,
  selected,
  onSelect,
}: {
  options: { id: string; label: string }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((o) => (
        <button
          key={o.id || "skip"}
          type="button"
          onClick={() => onSelect(o.id)}
          className={`${Q_OPT} ${selected === o.id ? Q_OPT_ON : ""}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
