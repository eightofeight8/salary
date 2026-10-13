# FinanceFlow

Веб-приложение для учета личных финансов (доходы/расходы) с аналитикой по категориям.

Стек: React + Vite + TypeScript + Tailwind CSS + TanStack Query + Recharts, серверные функции Vercel (Node.js + TypeScript + Zod), база данных Turso (libSQL) через Drizzle ORM.

## Структура

```text
api/          # Vercel Serverless API (роутинг, валидация, Drizzle)
drizzle/      # Сгенерированные миграции
src/          # React-приложение
vercel.json   # Конфигурация роутинга SPA + /api
```

## Локальная разработка

1. Установить зависимости:

   ```bash
   npm install
   ```

2. Создать файл `.env.local` (не обязателен для локальной работы — по умолчанию используется локальная SQLite-база `file:local.db`):

   ```env
   TURSO_DATABASE_URL=libsql://your-db-name.turso.io
   TURSO_AUTH_TOKEN=your-turso-jwt-token
   ```

3. Создать схему и наполнить базовые категории:

   ```bash
   npm run db:push   # применить схему к БД
   npm run db:seed   # заполнить стартовые категории
   ```

4. Запустить API (localhost:3000) и фронтенд (localhost:5173) в двух терминалах:

   ```bash
   npm run dev:api
   npm run dev
   ```

   Фронтенд проксирует `/api` на `http://localhost:3000` (см. `vite.config.ts`).

## Скрипты

| Команда                 | Описание                                           |
| :---------------------- | :------------------------------------------------- |
| `npm run dev`           | Vite dev-сервер                                    |
| `npm run dev:api`       | Локальный API-сервер на `PORT` (по умолчанию 3000) |
| `npm run build`         | Проверка типов + production-сборка фронтенда       |
| `npm run typecheck`     | Проверка TypeScript                                |
| `npm run db:push`       | Применить схему Drizzle к БД                       |
| `npm run db:generate`   | Сгенерировать миграцию в `drizzle/`                |
| `npm run db:seed`       | Заполнить стартовые категории                      |

## API

Все маршруты обслуживаются единой серверной функцией `api/index.ts`:

- `GET /api/categories?type=income|expense` — список категорий
- `POST /api/categories` — создать категорию
- `GET /api/transactions?page&limit&type&categoryId&startDate&endDate` — список с пагинацией и фильтрами
- `POST /api/transactions` — создать транзакцию
- `PUT /api/transactions/:id` — обновить транзакцию
- `DELETE /api/transactions/:id` — удалить транзакцию
- `GET /api/analytics/summary?from=YYYY-MM-DD&to=YYYY-MM-DD` — сводка: доходы, расходы, чистый остаток, суммы по категориям с процентами

Входные данные проходят Zod-валидацию; отрицательные и нулевые суммы отклоняются с кодом `400`.

## Деплой на Vercel

1. Импортируйте репозиторий в [Vercel](https://vercel.com). Framework preset: **Vite** (build: `npm run build`, output: `dist`).
2. В разделе *Environment Variables* добавьте:
   - `TURSO_DATABASE_URL` — URL вашей базы Turso вида `libsql://<db>.turso.io`
   - `TURSO_AUTH_TOKEN` — токен доступа Turso
3. Деплой. `vercel.json` уже настраивает маршрутизацию: `/api/*` → серверная функция, всё остальное → SPA.

> Базу можно создать через Turso CLI: `turso db create financeflow` и получить URL/токен через `turso db show` и `turso db tokens create`.

## Создание базы данных Turso

```bash
npm i -g wrangler   # или используйте turso CLI
turso db create financeflow
turso db show financeflow          # URL базы
turso db tokens create financeflow # токен
```

Затем укажите полученные значения в Vercel Environment Variables и выполните:

```bash
npm run db:push
npm run db:seed
```