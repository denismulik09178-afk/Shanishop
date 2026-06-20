# MAISON NOIR — Інструкція з міграції

## Структура пакету

```
migration-package/
├── frontend-src/          # Вихідний код React-фронтенду
├── frontend-index.html    # Головний HTML-файл
├── frontend-package.json  # Залежності фронтенду
├── frontend-vite.config.ts
├── frontend-tsconfig.json
├── api-src/               # Вихідний код Express API сервера
├── api-package.json       # Залежності API сервера
├── api-tsconfig.json
├── api-build.mjs
├── lib/                   # Спільні бібліотеки (DB schema, API types)
│   ├── db/                # Drizzle ORM схема (PostgreSQL)
│   ├── api-zod/           # Валідація запитів/відповідей
│   ├── api-spec/          # OpenAPI специфікація
│   └── api-client-react/  # React-хуки для API
├── public/                # Статичні файли (зображення парфумів)
│   └── perfumes/          # Фото парфумів
└── db-dump.sql            # Дамп PostgreSQL бази даних
```

## Вимоги до хоста

- Node.js 18+
- PostgreSQL 14+
- pnpm 8+

## Кроки міграції

### 1. Відновити базу даних

```bash
# Створити базу даних
createdb maison_noir

# Відновити з дампу
psql maison_noir < db-dump.sql
```

### 2. Встановити залежності

```bash
# Встановити pnpm якщо немає
npm install -g pnpm

# Фронтенд
cp -r frontend-src src
cp frontend-package.json package.json
cp frontend-index.html index.html
cp frontend-vite.config.ts vite.config.ts
cp frontend-tsconfig.json tsconfig.json
pnpm install

# API сервер
mkdir api && cd api
cp ../api-src . -r
cp ../api-package.json package.json
pnpm install
```

### 3. Налаштувати змінні оточення

Для API сервера створити файл `.env`:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/maison_noir
PORT=3001
ADMIN_PASSWORD=ваш_пароль_адміна
```

### 4. Запустити проєкт

```bash
# Запустити API сервер
cd api && pnpm run dev

# Запустити фронтенд (в окремому терміналі)
pnpm run dev
```

## Технічний стек

- **Фронтенд**: React 18 + Vite + TypeScript + Tailwind CSS
- **UI компоненти**: shadcn/ui + Radix UI
- **Анімації**: Framer Motion
- **API**: Express.js + TypeScript
- **База даних**: PostgreSQL + Drizzle ORM
- **Валідація**: Zod
