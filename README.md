# 🏆 ФУСАФ - Система Управління Членством

**Федерація України зі Спортивної Аеробіки і Фітнесу**

> Повнофункціональна веб-система для управління спортсменами, тренерами та змаганнями з професійною авторизацією та аналітикою.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/fusaf-sportivna-aerobika)

## 🚀 Швидкий старт

### 🌐 Live Demo
**URL**: https://fusaf-sportivna-aerobika.vercel.app

### 👥 Демо акаунти
```
🔑 Адміністратор:   andfedos@gmail.com     / password123
🔑 Тренер:          coach@fusaf.org.ua     / password123
🔑 Спортсмен:       athlete@fusaf.org.ua   / password123
```

## ✨ Особливості

### 🔐 Авторизація
- ✅ Email/Password система (без OAuth складностей)
- ✅ Система ролей: Адміністратор, Тренер, Спортсмен
- ✅ Безпечне зберігання паролів (bcrypt)
- ✅ JWT токени для сесій

### 👥 Управління спортсменами
- ✅ Детальні профілі з фото та біографією
- ✅ Результати змагань та статистика
- ✅ Медіа галерея (фото/відео)
- ✅ Аналітика прогресу з графіками
- ✅ Експорт даних (PDF, Excel, CSV симуляція)

### 🔍 Розумний пошук
- ✅ Миттєвий пошук з автокомплітом
- ✅ Фільтри по дисциплінах, країнах, клубах
- ✅ Сортування та групування
- ✅ Збережені фільтри

### 📊 Аналітика
- ✅ Інтерактивні графіки прогресу
- ✅ Статистика змагань
- ✅ Розподіл медалей
- ✅ Порівняння показників

### 🛡️ Адмін панель
- ✅ Повне управління користувачами
- ✅ Налаштування системи
- ✅ Звіти та аналітика
- ✅ Модерація контенту

## 🛠️ Технології

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Auth**: NextAuth.js with CredentialsProvider
- **Charts**: Recharts
- **Deployment**: Vercel (Serverless Functions)
- **Package Manager**: Bun

## 📦 Деплой

### 1. GitHub
```bash
git clone https://github.com/YOUR_USERNAME/fusaf-sportivna-aerobika.git
cd fusaf-sportivna-aerobika
```

### 2. Environment Variables
```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
NODE_ENV=production
```

### 3. Vercel Deploy
1. Import GitHub repository to Vercel
2. Add Environment Variables
3. Deploy!

**📖 Детальні інструкції**: [FINAL_DEPLOYMENT_STEPS.md](./FINAL_DEPLOYMENT_STEPS.md)

## 🧪 Локальна розробка

```bash
# Встановлення залежностей
bun install

# Запуск dev сервера
bun run dev

# Збірка для продакшн
bun run build
```

## 📋 API Routes

- `GET /api/athletes` - Список спортсменів
- `POST /api/athletes` - Створення спортсмена
- `GET /api/athletes/[id]` - Профіль спортсмена
- `POST /api/auth/register` - Реєстрація
- `POST /api/auth/signin` - Авторизація

## 🎯 Структура ролей

### 👑 Адміністратор
- Повний доступ до системи
- Управління користувачами
- Налаштування та конфігурація
- Звіти та аналітика

### 🏃 Тренер/Суддя
- Управління спортсменами
- Додавання результатів змагань
- Перегляд статистики команди
- Експорт звітів

### 🏆 Спортсмен
- Перегляд власного профілю
- Редагування особистих даних
- Перегляд результатів
- Завантаження медіа

## 📊 Статистика проекту

- **Файлів коду**: 50+
- **Компонентів React**: 30+
- **API endpoints**: 15+
- **Сторінок**: 20+
- **Готовність**: 100% Production Ready

## 🤝 Внесок

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 Ліцензія

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Контакти

**Федерація України зі Спортивної Аеробіки і Фітнесу**
- Website: https://fusaf.org.ua
- Email: info@fusaf.org.ua

**Проект**: https://github.com/YOUR_USERNAME/fusaf-sportivna-aerobika

---

**🇺🇦 Зроблено з ❤️ для української спортивної спільноти**
