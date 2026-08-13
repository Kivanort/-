"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { NavBrand } from "./NavBrand";
import { LanguageIcon } from "./Icons";
import localesData from "@/data/locales.json";

/** Упрощённое меню музея */
const NAV_LINKS = [
  { label: "О проекте", href: "/about.html" },
  { label: "Адрес", href: "/address.html" },
];

export function Header() {
  const [localeOpen, setLocaleOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const localeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (localeRef.current && !localeRef.current.contains(e.target as Node)) {
        setLocaleOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-yandex-gray-200 bg-white shadow-header">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 md:h-16 md:px-6">
        {/* Яндекс × НавИИгатор */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-yandex-dark transition-opacity hover:opacity-70"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-lg font-extrabold tracking-tight md:text-xl">Яндекс</span>
          <span className="text-sm font-medium text-yandex-gray-400">×</span>
          <NavBrand className="text-base md:text-lg" />
        </Link>

        <nav className="hidden flex-1 items-center gap-6 pl-4 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-yandex-dark transition-colors hover:text-yandex-red"
            >
              {link.label}
            </a>
          ))}
          <Link href="/quiz" className="text-sm font-medium text-yandex-gray-500 hover:text-yandex-red">
            Опрос
          </Link>
          <Link href="/routes" className="text-sm font-medium text-yandex-gray-500 hover:text-yandex-red">
            Маршруты
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <div className="relative" ref={localeRef}>
            <button
              type="button"
              aria-label="Выбор языка и региона"
              aria-expanded={localeOpen}
              onClick={() => setLocaleOpen(!localeOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-yandex-dark transition-colors hover:bg-yandex-gray-100"
            >
              <LanguageIcon className="text-[22px]" />
            </button>
            {localeOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-yandex-gray-200 bg-white py-2 shadow-card-hover">
                {localesData.locales.map((loc) => (
                  <div key={loc.countryEn} className="px-4 py-2.5 hover:bg-yandex-gray-50">
                    <p className="text-sm font-bold text-yandex-dark">
                      {loc.country}{" "}
                      <span className="font-normal text-yandex-gray-400">({loc.countryEn})</span>
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {loc.languages.map((lang) => (
                        <p key={lang} className="text-xs text-yandex-gray-500">
                          {lang}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hidden rounded-full bg-yandex-red px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-yandex-red-hover sm:inline-block"
          >
            Стать другом
          </a>

          <button
            type="button"
            disabled
            title="Скоро"
            className="hidden cursor-not-allowed rounded-full bg-yandex-gray-200 px-4 py-2 text-sm font-semibold text-yandex-gray-400 lg:inline-block"
          >
            Поддержать разработчиков
          </button>

          <button
            type="button"
            aria-label="Меню"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-lg hover:bg-yandex-gray-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className={`h-0.5 w-5 bg-yandex-dark transition-transform ${mobileOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-yandex-dark transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-yandex-dark transition-transform ${mobileOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-yandex-gray-200 bg-white md:hidden">
          <nav className="mx-auto max-w-[1400px] px-4 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block border-b border-yandex-gray-100 py-3 text-base font-medium text-yandex-dark"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link href="/quiz" className="block py-3 text-base font-semibold text-yandex-red" onClick={() => setMobileOpen(false)}>
              Опрос
            </Link>
            <Link href="/routes" className="block border-b border-yandex-gray-100 py-3 text-base font-semibold text-yandex-red" onClick={() => setMobileOpen(false)}>
              Маршруты
            </Link>
            <div className="mt-4 flex flex-col gap-2">
              <a href="#" onClick={(e) => e.preventDefault()} className="rounded-full bg-yandex-red py-3 text-center text-sm font-semibold text-white">
                Стать другом
              </a>
              <button type="button" disabled className="cursor-not-allowed rounded-full bg-yandex-gray-200 py-3 text-center text-sm font-semibold text-yandex-gray-400">
                Поддержать разработчиков
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
