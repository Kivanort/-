import Link from "next/link";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/Button";
import { NavBrand } from "@/components/NavBrand";

export default function HomePage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="text-center">
          <div className="mb-4 inline-block rounded-full bg-yandex-gray-100 px-4 py-1.5 text-xs font-semibold text-yandex-gray-500">
            Яндекс Музей
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Нав<span className="text-yandex-red">ИИ</span>гатор
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-yandex-gray-500 sm:text-lg">
            Персональный ИИ-гид по музею технологий. Пройдите короткий опрос — мы
            подберём маршрут, темп экскурсии и манеру рассказа.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/quiz">
              <Button size="lg" className="min-w-[180px]">
                Пройти опрос
              </Button>
            </Link>
            <Link href="/routes">
              <Button variant="outline" size="lg" className="min-w-[180px]">
                Выбрать маршрут
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-yandex-gray-200 bg-white p-6 shadow-card">
            <div className="text-3xl">🗺️</div>
            <h3 className="mt-2 text-lg font-bold">Маршрут под вас</h3>
            <p className="mt-1 text-sm text-yandex-gray-500">
              ИИ подберёт последовательность экспонатов по вашим интересам и времени.
            </p>
          </div>
          <div className="rounded-2xl border border-yandex-gray-200 bg-white p-6 shadow-card">
            <div className="text-3xl">🎙️</div>
            <h3 className="mt-2 text-lg font-bold">Стиль рассказа</h3>
            <p className="mt-1 text-sm text-yandex-gray-500">
              Выбирайте: официально или с юмором — текст адаптируется под вас.
            </p>
          </div>
          <div className="rounded-2xl border border-yandex-gray-200 bg-white p-6 shadow-card">
            <div className="text-3xl">🏆</div>
            <h3 className="mt-2 text-lg font-bold">Награды</h3>
            <p className="mt-1 text-sm text-yandex-gray-500">
              После экскурсии — стикеры, аватарка и значок «Знаток компьютеров».
            </p>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-yandex-gray-400">
          <NavBrand /> × Яндекс Музей · Прототип
        </div>
      </div>
    </PageTransition>
  );
}
