"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/Button";
import { RewardCard } from "@/components/RewardCard";
import { calcQuizScore } from "@/lib/utils";
import postTourQuiz from "@/data/post-tour-quiz.json";

export default function ResultsPage() {
  const { profile, rewards, resetAll } = useApp();
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const questions = postTourQuiz.questions;
  const allAnswered = questions.every((q) => answers[q.id]);
  const score = done ? calcQuizScore(answers, questions) : 0;

  if (done) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10 rounded-2xl bg-yandex-gray-50 p-8 text-center"
          >
            <div className="text-5xl mb-4">{score >= 75 ? "🎉" : "👍"}</div>
            <h1 className="text-3xl font-extrabold">{t("results.thanks")}{profile.name || "гость"}!</h1>
            <p className="mt-2 text-lg text-yandex-gray-500">
              {t("results.quizResult")}: <strong className="text-yandex-red">{score}%</strong>
            </p>
          </motion.div>

          <h2 className="mb-6 text-center text-xl font-extrabold">{t("results.yourRewards")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {rewards.map((r, i) => (
              <RewardCard key={r.id} reward={r} index={i} />
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button size="lg">{t("results.home")}</Button>
            </Link>
            <Link href="/routes">
              <Button variant="outline" size="lg">{t("results.newRoute")}</Button>
            </Link>
            <Button variant="ghost" onClick={resetAll}>
              {t("results.restart")}
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-xl px-4 py-8 sm:py-10">
        <h1 className="text-3xl font-extrabold tracking-tight">{t("results.quizTitle")}</h1>
        <p className="mt-2 mb-8 text-yandex-gray-500">
          {profile.style === "formal"
            ? t("results.quizHintFormal")
            : t("results.quizHintInformal")}
        </p>

        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="rounded-2xl border border-yandex-gray-200 bg-white p-6 shadow-card">
              <p className="mb-4 font-bold">
                {i + 1}. {q.question}
              </p>
              {q.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
                  className={`mb-2 flex w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all last:mb-0 ${
                    answers[q.id] === o.id
                      ? "border-yandex-red bg-yandex-red-light"
                      : "border-yandex-gray-200 hover:border-yandex-gray-300"
                  }`}
                >
                  {o.text}
                </button>
              ))}
            </div>
          ))}
        </div>

        <Button
          className="mt-8"
          size="lg"
          disabled={!allAnswered}
          onClick={() => setDone(true)}
        >
          {t("results.getRewards")}
        </Button>
      </div>
    </PageTransition>
  );
}
