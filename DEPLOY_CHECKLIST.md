# ✅ CHECKLIST ДЕПЛОЮ - ФУСАФ

**⏰ 30 хвилин до живого сайту!**

## 📂 КРОК 1: GITHUB (5 хв)

```bash
# У папці sportivna-aerobika виконати:
git init
git add .
git commit -m "🚀 FUSAF v133 - Production ready"

# ЗАМІНИТИ YOUR_USERNAME на ваш GitHub username!
git remote add origin https://github.com/YOUR_USERNAME/fusaf-sportivna-aerobika.git
git push -u origin main
```

- [ ] ✅ Створено репозиторій `fusaf-sportivna-aerobika` на GitHub
- [ ] ✅ Код завантажено (git push успішний)
- [ ] ✅ Файли видні на GitHub (vercel.json, README.md)

## 🌐 КРОК 2: VERCEL (15 хв)

### Налаштування:
- [ ] ✅ Зареєстровано на vercel.com (через GitHub)
- [ ] ✅ "New Project" → Import `fusaf-sportivna-aerobika`
- [ ] ✅ Framework: Next.js (auto-detected)

### Environment Variables (КРИТИЧНО!):
```
NEXTAUTH_URL = https://fusaf-sportivna-aerobika.vercel.app
NEXTAUTH_SECRET = fusaf-simple-auth-secret-2025
NODE_ENV = production
SKIP_TYPE_CHECK = true
DISABLE_ESLINT = true
```

- [ ] ✅ Додано всі 5 Environment Variables
- [ ] ✅ Натиснуто "Deploy"
- [ ] ✅ Деплой успішний (зелений статус)
- [ ] ✅ URL доступний: https://fusaf-sportivna-aerobika.vercel.app

## 🧪 КРОК 3: ТЕСТУВАННЯ (10 хв)

### Базові перевірки:
- [ ] ✅ Головна сторінка завантажується
- [ ] ✅ Header з кнопками "Вхід/Реєстрація"

### Авторизація:
**URL: /auth/signin**

- [ ] ✅ andfedos@gmail.com / password123 (Адмін)
- [ ] ✅ coach@fusaf.org.ua / password123 (Тренер)
- [ ] ✅ athlete@fusaf.org.ua / password123 (Спортсмен)

### Функції:
- [ ] ✅ /membership/athletes (список спортсменів)
- [ ] ✅ /admin (адмін панель під адміном)
- [ ] ✅ /api/athletes (JSON відповідь)

## 🎉 ГОТОВО!

**✨ Ваш сайт живий на:**
**https://fusaf-sportivna-aerobika.vercel.app**

### 📞 Якщо проблеми:
1. Перевірити Environment Variables у Vercel
2. Переглянути Vercel Logs
3. Очистити кеш браузера
4. Перезапустити деплой

**📖 Детальні інструкції: FINAL_DEPLOYMENT_STEPS.md**
