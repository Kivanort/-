# НавИИгатор × Яндекс Музей

Next.js 14 (App Router) + Tailwind CSS + Framer Motion.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Структура

```
src/
├── app/              # Страницы (роутинг)
│   ├── page.tsx      # Главная
│   ├── quiz/         # Опрос (7 вопросов)
│   ├── routes/       # Маршруты-заглушки
│   ├── tour/         # Экскурсия
│   └── results/      # Квиз + награды
├── components/       # UI (Header, RouteCard, AiToast…)
├── context/          # AppContext — профиль, экскурсия
├── data/             # JSON: routes, exhibits, quiz, rewards, locales
├── lib/utils.ts      # Адаптация текста, таймер
└── types/            # TypeScript-типы
```

## Header (как museum.yandex.ru)

- Логотип **Яндекс** → главная
- Магазин, О музее, События, Экспонаты, Адреса, Запись на экскурсию (заглушки)
- 🌍 Локализация: Россия, Казахстан, Сербия
- **Стать другом** (активная)
- **Поддержать разработчиков** (disabled, cursor: not-allowed)
- Бургер-меню на mobile

## Функционал

- Имитация ИИ: toast при старте маршрута (1 сек)
- Текст экспонатов меняется по профессии и хобби
- Таймер зависит от времени экскурсии из опроса
- Награды после квиза

> В корне также есть `index.html` — статическая версия для прототипа без Node.js.
