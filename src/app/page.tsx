"use client";

import Link from "next/link";
import { NavBrand } from "@/components/NavBrand";
import { Button } from "@/components/Button";
import { PageTransition } from "@/components/PageTransition";
import { useLanguage } from "@/context/LanguageContext";

const EDITORIAL_KEYS = [
  { num: "01", titleKey: "home.editorial1Title", textKey: "home.editorial1Text" },
  { num: "02", titleKey: "home.editorial2Title", textKey: "home.editorial2Text" },
  { num: "03", titleKey: "home.editorial3Title", textKey: "home.editorial3Text" },
];

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <section className="relative overflow-hidden px-4 py-16 text-center sm:py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(252,63,29,0.06),transparent_60%)]" />
        <p className="relative mb-4 text-xs font-bold uppercase tracking-[0.2em] text-yandex-red">
          {t("home.badge")}
        </p>
        <h1 className="relative mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl">
          <NavBrand className="text-4xl sm:text-5xl md:text-7xl" />
        </h1>
        <p className="relative mx-auto mb-10 max-w-2xl text-base leading-relaxed text-yandex-gray-500 sm:mb-12 sm:text-lg md:text-xl">
          {t("home.heroSubtitle")}
        </p>
        <div className="relative flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/quiz">
            <Button size="lg">{t("home.takeQuiz")}</Button>
          </Link>
          <Link href="/routes">
            <Button variant="outline" size="lg">{t("home.chooseRoutes")}</Button>
          </Link>
        </div>
      </section>

      <section className="border-t border-yandex-gray-200 py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-3 md:gap-12">
          {EDITORIAL_KEYS.map((item) => (
            <div key={item.num}>
              <p className="mb-3 text-xs font-bold tracking-[0.15em] text-yandex-red">{item.num}</p>
              <h3 className="mb-2 text-lg font-extrabold tracking-tight">{t(item.titleKey)}</h3>
              <p className="text-sm leading-relaxed text-yandex-gray-500">{t(item.textKey)}</p>
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
