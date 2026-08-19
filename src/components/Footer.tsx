"use client";

import { NavBrand } from "./NavBrand";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-yandex-gray-200 bg-yandex-gray-50 py-10">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <p className="text-lg">
          <NavBrand />
          <span className="text-yandex-gray-500"> × Яндекс Музей</span>
        </p>
        <p className="mt-2 text-sm text-yandex-gray-500">
          {t("footer.about")}
        </p>
      </div>
    </footer>
  );
}
