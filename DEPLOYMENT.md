# Інструкції для деплою сайту

## Підготовка до деплою

### 1. Встановлення залежностей
```bash
pnpm install
```

### 2. Збірка проекту
```bash
# Збірка фронтенду
pnpm run build:client

# Збірка бекенду (для локального тестування)
pnpm run build:server
```

### 3. Тестування локально
```bash
# Запуск повного проекту (фронтенд + бекенд)
pnpm run dev:full

# Або тільки фронтенд
pnpm run dev

# Або тільки бекенд
pnpm run dev:server
```

## Деплой на Netlify

### Варіант 1: Через веб-інтерфейс
1. Перейдіть на [netlify.com](https://netlify.com)
2. Натисніть "New site from Git"
3. Підключіть ваш GitHub репозиторій
4. Налаштування збірки:
   - **Build command:** `npm run build:client`
   - **Publish directory:** `dist/spa`
5. Натисніть "Deploy site"

### Варіант 2: Через Netlify CLI
```bash
# Встановлення CLI
npm install -g netlify-cli

# Увійти в акаунт
netlify login

# Збудувати проект
pnpm run build:client

# Деплой
netlify deploy --prod --dir=dist/spa
```

### Варіант 3: Drag & Drop
1. Збудуйте проект: `pnpm run build:client`
2. Перетягніть папку `dist/spa` на [netlify.com](https://netlify.com)

## Налаштування змінних середовища

В налаштуваннях сайту на Netlify додайте:

### Обов'язкові змінні:
- `TELEGRAM_BOT_TOKEN` - токен вашого Telegram бота
- `TELEGRAM_CHAT_ID` - ID чату для отримання повідомлень

### Додаткові змінні:
- `PING_MESSAGE` - повідомлення для /api/ping endpoint

## Перевірка роботи

### API Endpoints:
- `GET /api/ping` - перевірка роботи сервера
- `GET /api/reviews` - отримання відгуків
- `POST /api/reviews` - додавання відгуку
- `POST /api/contact` - відправка контактної форми
- `POST /api/booking` - запис на тату
- `POST /api/telegram/send-message` - відправка повідомлення в Telegram

### Тестування:
1. Відкрийте сайт
2. Перевірте форму запису на тату
3. Перевірте форму контактів
4. Перевірте додавання відгуків
5. Перевірте, що повідомлення приходять в Telegram

## Структура проекту

```
├── client/                 # React фронтенд
├── server/                 # Express бекенд
├── netlify/               # Netlify Functions
│   └── functions/
│       └── api.ts         # API handler для Netlify
├── public/                # Статичні файли
├── dist/                  # Збудовані файли
│   ├── spa/              # Фронтенд для деплою
│   └── server/           # Бекенд для локального запуску
└── netlify.toml          # Конфігурація Netlify
```

## Вирішення проблем

### Помилка "Missing parameter name":
- Використовуйте Express 4.18.2 замість 5.x
- Перевірте синтаксис роутів

### API не працює:
- Перевірте змінні середовища
- Перевірте Netlify Functions
- Перевірте логи в Netlify Dashboard

### Фронтенд не завантажується:
- Перевірте збірку: `pnpm run build:client`
- Перевірте папку `dist/spa`
- Перевірте налаштування в `netlify.toml`
