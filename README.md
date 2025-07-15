# ФУСАФ - Федерація України зі Спортивної Аеробіки і Фітнесу

Офіційний веб-сайт та система управління членством ФУСАФ.

## 🚀 Швидкий старт

### Локальна розробка

1. Клонуйте репозиторій:
```bash
git clone https://github.com/aerobicsua/fusaf-2025-v2.git
cd fusaf-2025-v2
```

2. Встановіть залежності:
```bash
bun install
```

3. Створіть файл `.env.local`:
```bash
cp .env.example .env.local
```

4. Запустіть сервер розробки:
```bash
bun run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000) у браузері.

## 🌐 Деплоймент на Vercel

### Автоматичний деплоймент з GitHub

1. **Завантажте код на GitHub:**
   - Створіть новий commit з останніми змінами
   - Push у репозиторій `https://github.com/aerobicsua/fusaf-2025-v2`

2. **Налаштуйте Vercel:**
   - Увійдіть на [vercel.com](https://vercel.com)
   - Виберіть "New Project"
   - Імпортуйте репозиторій `aerobicsua/fusaf-2025-v2`

3. **Налаштуйте Environment Variables у Vercel:**
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-random-secret-key
   NODE_ENV=production
   SKIP_TYPE_CHECK=true
   DISABLE_ESLINT=true
   CI=false
   ```

4. **Deploy:**
   - Натисніть "Deploy"
   - Vercel автоматично використає `vercel.json` конфігурацію

### Команди для деплойменту

```bash
# Локальна збірка
bun run build

# Запуск production сервера локально
bun run start
```

## 📁 Структура проекту

```
sportivna-aerobika/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── api/               # API Routes
│   │   ├── auth/              # Аутентифікація
│   │   ├── membership/        # Система членства
│   │   └── ...
│   ├── components/            # React компоненти
│   ├── lib/                   # Утиліти та конфігурація
│   └── ...
├── public/                    # Статичні файли
├── vercel.json               # Конфігурація Vercel
├── next.config.js            # Конфігурація Next.js
└── package.json
```

## 🔑 Ключові функції

### ✅ Система членства
- **Реєстрація спортсменів** - повна форма з валідацією
- **Реєстрація тренерів/суддів** - професійні поля та кваліфікації
- **Реєстрація клубів** - організаційна інформація та планування
- **Безшовний UX** - без проміжних сторінок

### ✅ Аутентифікація
- **Email/Password** аутентифікація через NextAuth.js
- **Демо акаунти** для тестування
- **Ролі користувачів**: спортсмен, тренер/суддя, власник клубу, адмін

### ✅ API
- **RESTful API** для всіх операцій
- **Валідація даних** на серверному рівні
- **Перевірка унікальності** email для кожного типу реєстрації

## 🧪 Тестові акаунти

Для тестування системи:

| Роль | Email | Пароль |
|------|--------|---------|
| Адміністратор | andfedos@gmail.com | password123 |
| Тренер/Суддя | coach@fusaf.org.ua | password123 |
| Спортсмен | athlete@fusaf.org.ua | password123 |

## 🛠 Технології

- **Next.js 15** - React фреймворк з App Router
- **TypeScript** - типізована розробка
- **Tailwind CSS** - utility-first CSS
- **shadcn/ui** - компоненти UI
- **NextAuth.js** - аутентифікація
- **Bun** - швидкий runtime та package manager

## 📋 Останні оновлення

### v140 - Видалено проміжні сторінки
- ✅ Усунуто сторінку signup з процесу членства
- ✅ Кнопка "Реєстрація" → "Стати членом"
- ✅ Ідеальний UX: Кнопка → (Авторизація) → Форма

### v139 - Повна система членства
- ✅ Окремі форми для кожного типу реєстрації
- ✅ API роути з повною валідацією
- ✅ Прямі посилання без проміжних кроків

## 🔧 Налагодження

### Типові проблеми

1. **ESLint помилки на Vercel:**
   - Вирішено через `DISABLE_ESLINT=true` у vercel.json

2. **Build помилки:**
   - Використовується `SKIP_TYPE_CHECK=true`

3. **Environment variables:**
   - Переконайтеся що всі змінні додані у Vercel Dashboard

## 📞 Підтримка

Для питань та підтримки:
- **Email:** info@fusaf.org.ua
- **GitHub Issues:** [Створити issue](https://github.com/aerobicsua/fusaf-2025-v2/issues)

---

© 2025 ФУСАФ. Всі права захищені.
