# 🔐 Cloudflare Turnstile Setup для GOSE.KZ

## Шаг 1: Регистрация на Cloudflare

1. Перейдите на https://dash.cloudflare.com/sign-up
2. Создайте аккаунт (бесплатный)
3. Подтвердите email

## Шаг 2: Получение Turnstile ключей

1. Войдите в Cloudflare Dashboard
2. Перейдите в **Turnstile** в боковом меню
3. Нажмите **"Add Site"**
4. Заполните форму:
   - **Site name:** GOSE.KZ Contact Form
   - **Domain:** gose.kz
   - **Widget Mode:** Invisible (невидимая CAPTCHA)
5. Нажмите **"Create"**

## Шаг 3: Копирование ключей

После создания вы получите два ключа:

### Site Key (публичный):
```
Пример: 0x4AAAAAAABc...
```
**Где использовать:** Frontend (src/components/ContactSection.astro)

### Secret Key (приватный):
```
Пример: 0x4AAAAAAABc..._SECRET
```
**Где использовать:** Backend API (src/pages/api/gose-contact.ts)

## Шаг 4: Обновление кода

### 4.1 Frontend (ContactSection.astro)

Найдите строку:
```javascript
const TURNSTILE_SITE_KEY = 'YOUR_SITE_KEY_HERE';
```

Замените на:
```javascript
const TURNSTILE_SITE_KEY = '0x4AAAAAAABc...'; // Ваш Site Key
```

### 4.2 Backend API (gose-contact.ts)

Найдите строку:
```typescript
const TURNSTILE_SECRET_KEY = 'YOUR_SECRET_KEY_HERE';
```

Замените на:
```typescript
const TURNSTILE_SECRET_KEY = '0x4AAAAAAABc..._SECRET'; // Ваш Secret Key
```

### 4.3 Раскомментируйте код Turnstile

В обоих файлах найдите закомментированный код Turnstile и раскомментируйте его.

## Шаг 5: Deployment

После обновления ключей:
```bash
git add .
git commit -m "feat: enable Cloudflare Turnstile CAPTCHA"
git push
```

GitHub Actions автоматически задеплоит изменения.

## Тестирование

1. Откройте https://gose.kz
2. Заполните контактную форму
3. Нажмите "Отправить"
4. Turnstile проверит вас автоматически (невидимо)
5. Проверьте Telegram - должна прийти заявка

## Важно!

⚠️ **Secret Key НИКОГДА не должен попадать в frontend код!**
⚠️ **Держите Secret Key в секрете, не коммитьте в публичные репозитории**

## Альтернатива: Environment Variables

Для большей безопасности можно хранить ключи в переменных окружения:

1. На сервере создайте файл `.env`:
```bash
TURNSTILE_SECRET_KEY=your_secret_key_here
```

2. Обновите код для чтения из environment:
```typescript
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || 'YOUR_SECRET_KEY_HERE';
```

## Поддержка

Если возникли проблемы:
- Документация: https://developers.cloudflare.com/turnstile/
- Проверка ключей: https://dash.cloudflare.com/turnstile
