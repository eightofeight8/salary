
# TECHNICAL SPECIFICATION: FinanceFlow

> **Цель документа:** Руководство по пошаговой реализации веб-приложения для учета личных финансов. Документ оптимизирован для исполнения через терминальный агент Opencode CLI.

---

## 1. Стек и Архитектура

- **Frontend:** React 18/19, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts, TanStack Query v5.
- **Backend:** Node.js (Vercel Serverless Functions), TypeScript, Zod.
- **База данных и ORM:** Turso (libSQL) через `@libsql/client` + `drizzle-orm` (с миграциями через `drizzle-kit`).
- **Среда развертывания:** Vercel (SPA-роутинг + `/api/*` эндпоинты), GitHub.

---

## 2. Структура проекта

```text
.
├── api/                           # Vercel Serverless API
│   ├── db/
│   │   ├── client.ts              # Инициализация клиента Turso + Drizzle
│   │   ├── schema.ts              # Drizzle ORM схемы
│   │   └── seed.ts                # Скрипт наполнения базовыми категориями
│   ├── middleware/
│   │   └── validate.ts            # Обертка для Zod-валидации
│   ├── routes/
│   │   ├── transactions.ts        # Handlers: GET, POST, PUT, DELETE
│   │   ├── categories.ts          # Handlers: GET, POST
│   │   └── analytics.ts           # Handlers: GET (сводка, баланс, группировки)
│   └── index.ts                   # Единая точка входа API (или serverless-роутер)
├── drizzle/                       # Сгенерированные миграции Drizzle
├── src/                           # Vite + React Frontend
│   ├── assets/
│   ├── components/
│   │   ├── ui/                    # Базовые UI-компоненты (Button, Input, Modal, Select)
│   │   ├── Dashboard/             # Карточки баланса, графики (Recharts)
│   │   ├── Transactions/          # Форма добавления, таблица/список транзакций, фильтры
│   │   └── Layout.tsx
│   ├── lib/
│   │   ├── api.ts                 # Axios / fetch клиент для вызова `/api`
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts               # Общие TypeScript интерфейсы
│   ├── App.tsx
│   └── main.tsx
├── drizzle.config.ts
├── vercel.json
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── .env.example
```

---

## 3. Конфигурация и окружение

### 3.1. Переменные окружения (`.env.example`)
```env
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-turso-jwt-token
PORT=3000
```

### 3.2. `vercel.json`
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.ts" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 4. Схема Базы Данных (Drizzle ORM)

Файл: `api/db/schema.ts`

```typescript
import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(), // nanoid или uuid v4
  name: text('name').notNull(),
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  color: text('color').default('#64748b'),
  icon: text('icon').default('tag'),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  amount: real('amount').notNull(),
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'restrict' }),
  date: text('date').notNull(), // ISO YYYY-MM-DD
  comment: text('comment'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
```

### 4.1. Базовые сиды категорий (`api/db/seed.ts`)
При первом запуске должны быть доступны следующие записи:
* **Расходы (`expense`):**
  - "Продукты" (`#ef4444`)
  - "Коммунальные услуги" (`#f97316`)
  - "Аренда" (`#eab308`)
  - "Транспорт" (`#3b82f6`)
  - "Развлечения" (`#a855f7`)
  - "Здоровье" (`#ec4899`)
  - "Прочее" (`#6b7280`)
* **Доходы (`income`):**
  - "Зарплата" (`#10b981`)
  - "Подработка" (`#14b8a6`)
  - "Премия" (`#06b6d4`)
  - "Процент от вклада" (`#84cc16`)
  - "Подарки" (`#f59e0b`)

---

## 5. Контракты API и Схемы Валидации (Zod)

### 5.1. Категории (`/api/categories`)
* **`GET /api/categories?type=income|expense`**
  - Response: `200 OK` -> `Category[]`
* **`POST /api/categories`**
  - Schema:
    ```typescript
    z.object({
      name: z.string().min(1).max(50),
      type: z.enum(['income', 'expense']),
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      icon: z.string().optional()
    })
    ```

### 5.2. Транзакции (`/api/transactions`)
* **`GET /api/transactions`**
  - Query Params:
    - `page` (default: 1)
    - `limit` (default: 20)
    - `type` (`income` | `expense` | all)
    - `categoryId` (опционально)
    - `startDate`, `endDate` (ISO date: `YYYY-MM-DD`)
  - Response:
    ```typescript
    {
      items: Array<Transaction & { categoryName: string; categoryColor: string }>;
      totalCount: number;
      totalPages: number;
      currentPage: number;
    }
    ```
* **`POST /api/transactions`**
  - Schema:
    ```typescript
    z.object({
      amount: z.number().positive('Сумма должна быть больше нуля'),
      type: z.enum(['income', 'expense']),
      categoryId: z.string().min(1),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Формат даты: YYYY-MM-DD'),
      comment: z.string().max(255).optional()
    })
    ```
* **`PUT /api/transactions/:id`**
  - Обновление существующей транзакции с аналогичной валидацией.
* **`DELETE /api/transactions/:id`**
  - Response: `200 OK` -> `{ success: true, id: string }`

### 5.3. Аналитика (`/api/analytics/summary`)
* **`GET /api/analytics/summary?from=YYYY-MM-DD&to=YYYY-MM-DD`**
  - Обработка целиком на бэкенде через SQL-агрегации.
  - Response:
    ```typescript
    {
      totalIncome: number;
      totalExpense: number;
      netBalance: number; // totalIncome - totalExpense
      expenseByCategory: Array<{
        categoryId: string;
        categoryName: string;
        color: string;
        total: number;
        percentage: number;
      }>;
      incomeByCategory: Array<{
        categoryId: string;
        categoryName: string;
        color: string;
        total: number;
        percentage: number;
      }>;
    }
    ```

---

## 6. Требования к UI (Frontend)

1. **Dashboard (Главный экран):**
   - Верхняя плашка: 3 карточки (`Доходы`, `Расходы`, `Чистый остаток`).
   - Селектор периода (Текущий месяц, Прошлый месяц, Кастомный интервал).
   - Круговая диаграмма (Donut Chart) расходов по категориям.
   - Кнопка быстрого действия: «+ Добавить запись».
2. **Форма добавления транзакции (Modal / Bottom Sheet):**
   - Переключатель табов: `Расход` / `Доход`.
   - Большое поле ввода суммы.
   - Сетка/выпадающий список категорий с цветными бейджами.
   - Пикер даты (по умолчанию сегодня).
   - Поле комментария.
3. **Лента истории транзакций:**
   - Группировка по дням или хронологический список.
   - Цветовая индикация: зеленый для доходов (`+ 10 000 ₽`), красный для расходов (`- 1 200 ₽`).
   - Кнопки быстрого удаления и редактирования строки.

---

## 7. Пошаговый план разработки (Implementation Tasks)

### Фаза 1: Инициализация и БД
- [ ] 1.1. Инициализировать проект `npm create vite@latest . -- --template react-ts`.
- [ ] 1.2. Установить зависимости:
  - Frontend: `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`, `recharts`, `@tanstack/react-query`, `clsx`, `tailwind-merge`.
  - Backend/DB: `drizzle-orm`, `@libsql/client`, `zod`, `nanoid`.
  - Dev: `drizzle-kit`, `tsx`, `@types/node`.
- [ ] 1.3. Настроить Tailwind CSS и базовые стили.
- [ ] 1.4. Сконфигурировать `drizzle.config.ts` и `api/db/client.ts`.
- [ ] 1.5. Написать схему `api/db/schema.ts` и применить миграцию (`drizzle-kit push`).
- [ ] 1.6. Реализовать сид-скрипт `api/db/seed.ts` и заполнить категории.

### Фаза 2: Backend API
- [ ] 2.1. Создать роутер/обработчик `api/index.ts` с поддержкой CORS и JSON-парсинга.
- [ ] 2.2. Реализовать эндпоинты категорий (`GET`, `POST`).
- [ ] 2.3. Реализовать CRUD для транзакций (`GET` с пагинацией/фильтрами, `POST`, `PUT`, `DELETE`).
- [ ] 2.4. Реализовать расчет аналитики в `GET /api/analytics/summary`.
- [ ] 2.5. Протестировать локально обработку некорректных входных данных (Zod safeParse).

### Фаза 3: Frontend Компоненты и API Интеграция
- [ ] 3.1. Настроить `TanStack QueryProvider` и базовый HTTP-клиент в `src/lib/api.ts`.
- [ ] 3.2. Создать UI-компоненты: `Modal`, `Button`, `Input`, `Select`.
- [ ] 3.3. Разработать компонент формы добавления/редактирования транзакции с валидацией.
- [ ] 3.4. Реализовать карточки сводки (`Income`, `Expense`, `Balance`).
- [ ] 3.5. Внедрить Recharts диаграмму расходов по категориям.
- [ ] 3.6. Реализовать таблицу/список последних операций с возможностью удаления.

### Фаза 4: Подготовка к Vercel и проверка
- [ ] 4.1. Проверить конфигурацию `vercel.json`.
- [ ] 4.2. Настроить скрипты сборки в `package.json` (`build`, `db:push`, `db:seed`).
- [ ] 4.3. Выполнить тестовый билд `npm run build` локально.
- [ ] 4.4. Добавить документацию по развертыванию в `README.md`.

---

## 8. Критерии приемки (Acceptance Criteria)

1. **Целостность данных:** Все операции создания транзакций проверяются схемой Zod. Отрицательные и нулевые суммы отклоняются с кодом `400`.
2. **Расчеты:** Баланс на бэкенде рассчитывается по формуле `Сумма доходов - Сумма расходов`. Фронтенд не производит агрегацию самостоятельно.
3. **Turso интеграция:** Данные персистентно сохраняются и запрашиваются из Turso через libSQL без блокировок соединения.
4. **Deploy Ready:** Репозиторий готов к импорту в Vercel; при указании `TURSO_DATABASE_URL` и `TURSO_AUTH_TOKEN` проект собирается без ошибок TypeScript и сборщика.
```