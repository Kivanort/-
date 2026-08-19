"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
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

const NameInput = memo(function NameInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      className="w-full rounded-xl border-2 border-yandex-gray-200 bg-yandex-gray-50 px-4 py-3 text-lg font-medium outline-none transition-all focus:border-yandex-red focus:bg-white focus:ring-4 focus:ring-yandex-red/10"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
});

function Step1Options({
  t,
  profile,
  updateProfile,
}: {
  t: (key: string) => string;
  profile: { age: string; profession: string; hobbies: string[]; tourTime: string; style: string; theme: string };
  updateProfile: (patch: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-2">
      {(
        [
          ["games", t("quiz.q4_1")],
          ["history", t("quiz.q4_2")],
          ["tech", t("quiz.q4_3")],
          ["art", t("quiz.q4_4")],
          ["science", t("quiz.q4_5")],
          ["music", t("quiz.q4_6")],
          ["cinema", t("quiz.q4_7")],
        ] as [Hobby, string][]
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => {
            const has = profile.hobbies.includes(id);
            updateProfile({
              hobbies: has
                ? profile.hobbies.filter((h: string) => h !== id)
                : [...profile.hobbies, id],
            });
          }}
          className={`${Q_OPT} ${profile.hobbies.includes(id) ? Q_OPT_ON : ""}`}
        >
          {label}
          {profile.hobbies.includes(id) && <span className="ml-auto text-yandex-red">✓</span>}
        </button>
      ))}
    </div>
  );
}

export default function QuizPage() {
  const { profile, updateProfile, toggleHobby, isProfileComplete } = useApp();
  const { t } = useLanguage();
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
        return true;
      default:
        return false;
    }
  };

  const handleNameChange = useCallback(
    (value: string) => {
      updateProfile({ name: value });
    },
    [updateProfile]
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className={Q_TITLE}>{t("quiz.q2Title")}</h2>
            <OptionGroup
              options={[
                { id: "under18", label: t("quiz.q2_1") },
                { id: "18-25", label: t("quiz.q2_2") },
                { id: "26-35", label: t("quiz.q2_3") },
                { id: "36-50", label: t("quiz.q2_4") },
                { id: "50plus", label: t("quiz.q2_5") },
              ]}
              selected={profile.age}
              onSelect={(id) => updateProfile({ age: id as AgeRange })}
            />
          </>
        );
      case 2:
        return (
          <>
            <h2 className={Q_TITLE}>{t("quiz.q3Title")}</h2>
            <p className={Q_HINT}>{t("quiz.q3Hint")}</p>
            <OptionGroup
              options={[
                { id: "it", label: t("quiz.q3_1") },
                { id: "engineering", label: t("quiz.q3_2") },
                { id: "humanities", label: t("quiz.q3_3") },
                { id: "business", label: t("quiz.q3_4") },
                { id: "student", label: t("quiz.q3_5") },
                { id: "other", label: t("quiz.q3_6") },
              ]}
              selected={profile.profession}
              onSelect={(id) => updateProfile({ profession: id as Profession })}
            />
          </>
        );
      case 3:
        return (
          <>
            <h2 className={Q_TITLE}>{t("quiz.q4Title")}</h2>
            <p className={Q_HINT}>{t("quiz.q4Hint")}</p>
            <Step1Options
              t={t}
              profile={profile}
              updateProfile={updateProfile}
            />
          </>
        );
      case 4:
        return (
          <>
            <h2 className={Q_TITLE}>{t("quiz.q5Title")}</h2>
            <OptionGroup
              options={[
                { id: "15-20", label: t("quiz.q5_1") },
                { id: "30-40", label: t("quiz.q5_2") },
                { id: "60plus", label: t("quiz.q5_3") },
              ]}
              selected={profile.tourTime}
              onSelect={(id) => updateProfile({ tourTime: id as TourDuration })}
            />
          </>
        );
      case 5:
        return (
          <>
            <h2 className={Q_TITLE}>{t("quiz.q6Title")}</h2>
            <OptionGroup
              options={[
                { id: "formal", label: t("quiz.q6_1") },
                { id: "informal", label: t("quiz.q6_2") },
              ]}
              selected={profile.style}
              onSelect={(id) => updateProfile({ style: id as CommunicationStyle })}
            />
          </>
        );
      case 6:
        return (
          <>
            <h2 className={Q_TITLE}>{t("quiz.q7Title")}</h2>
            <p className={Q_HINT}>{t("quiz.q7Hint")}</p>
            <OptionGroup
              options={[
                { id: "computers", label: t("quiz.q7_1") },
                { id: "keyboards-games", label: t("quiz.q7_2") },
                { id: "soviet", label: t("quiz.q7_3") },
                { id: "modern", label: t("quiz.q7_4") },
                { id: "random", label: t("quiz.q7_5") },
                { id: "", label: t("quiz.q7_6") },
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
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{t("quiz.title")}</h1>
        <p className="mb-8 text-yandex-gray-500">{t("quiz.subtitle")}</p>

        <ProgressBar value={progress} className="mb-8" />

        <div className="rounded-2xl border border-yandex-gray-200 bg-white p-4 shadow-card sm:p-6 md:p-8">
          <p className="mb-4 text-sm font-medium text-yandex-gray-400">
            {t("quiz.stepCounter", { current: step + 1, total: TOTAL_STEPS })}
          </p>

          <div
            className={step === 0 ? "" : "hidden"}
          >
            <h2 className={Q_TITLE}>{t("quiz.q1Title")}</h2>
            <NameInput
              value={profile.name}
              onChange={handleNameChange}
              placeholder={t("quiz.q1Placeholder")}
            />
          </div>

          <AnimatePresence mode="wait">
            {step !== 0 && (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                {t("quiz.back")}
              </Button>
            )}
            {canNext() && step < TOTAL_STEPS - 1 && (
              <Button onClick={() => setStep(step + 1)}>{t("quiz.next")}</Button>
            )}
            {(canNext() && step === TOTAL_STEPS - 1) || isProfileComplete ? (
              <Link href="/routes">
                <Button size="lg">{t("quiz.showRoutes")}</Button>
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
