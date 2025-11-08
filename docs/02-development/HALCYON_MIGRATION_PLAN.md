# План миграции: Halcyon Redesign

**Дата создания**: 09.01.2025
**Статус**: В разработке
**Ветка**: `feature/halcyon-redesign`

---

## Цель

Полная миграция дизайна и контента с halcyon-legal-site.html в текущий Astro проект с сохранением всей инфраструктуры (деплой, SSL, домен).

**Брендинг**:
- Домен: `alash-zan.kz`
- Бренд: `Halcyon`
- Стиль: Темный премиум-дизайн

---

## Этап 1: Цветовая схема и стили

### Текущая палитра (Alash-Zan):
```css
--primary-color: #0a2342;      /* глубокий синий */
--accent-color: #d4af37;       /* золотой */
--accent-alt-color: #4fd1c5;   /* бирюзовый */
--background-color: #ffffff;   /* белый */
--text-primary: #2d3748;       /* темный текст */
```

### Новая палитра (Halcyon):
```css
--primary: #1a1a2e;            /* темный фон */
--secondary: #16213e;          /* вторичный темный */
--accent: #c9a961;             /* золотой */
--accent-light: #e8d4a0;       /* светлое золото */
--text: #ffffff;               /* белый текст */
--text-muted: #a0a0a0;         /* приглушенный текст */
--bg-card: rgba(255, 255, 255, 0.05);  /* карточки */
```

### Изменения:
1. Обновить `src/styles/global.css` с новыми CSS переменными
2. Добавить темный фон (`background: #1a1a2e`)
3. Инвертировать цвета текста (белый на темном)
4. Обновить градиенты (золотой градиент для заголовков)

---

## Этап 2: Обновление компонентов

### 2.1 Header / Navigation

**Текущий**: Светлая навигация с прозрачным фоном

**Новый (Halcyon)**:
```astro
<!-- src/components/Header.astro -->
- Фиксированная навигация с backdrop-filter: blur(10px)
- Темный фон rgba(26, 26, 46, 0.95)
- Эффект при скролле (navbar.scrolled)
- Переключатель языков в стиле Halcyon (border-radius pills)
- Логотип "HALCYON" с градиентом
```

### 2.2 Hero Section

**Текущий**: Простой hero с текстом и кнопкой

**Новый (Halcyon)**:
```astro
<!-- src/components/Hero.astro -->
- Полноэкранный hero (min-height: 100vh)
- Анимированный радиальный градиент фона (вращение)
- Крупный заголовок "HALCYON" (4.5rem) с градиентом
- Subtitle: "Юридическая помощь премиум-класса в Казахстане"
- CTA кнопка с градиентом и тенью
- fadeInUp анимация
```

### 2.3 Service Cards (Accordion)

**Текущий**: Статичные карточки услуг

**Новый (Halcyon)**:
```astro
<!-- src/components/ServiceCardAccordion.astro -->
- Accordion-карточки (раскрываются по клику)
- Полупрозрачный фон с backdrop-filter
- Иконка стрелки (▼) которая вращается при открытии
- Плавная анимация max-height для контента
- Hover эффект с изменением border-color и фона
```

**3 основных блока услуг**:
1. **Расторжение брака** (6 услуг)
2. **Претензионно-исковая работа** (4 услуги)
3. **Юрист для бизнеса** (7 услуг)

### 2.4 Advantages Section

**Новый компонент**:
```astro
<!-- src/components/AdvantagesGrid.astro -->
- Сетка 3 колонки (responsive → 1 колонка на мобильных)
- Круглые иконки с градиентом (emoji)
- Центрированный текст
- 6 преимуществ:
  - Годы практики (10+ лет)
  - Конфиденциальность
  - Персональный подход
  - Отличный сервис
  - Эффективность
  - Выгода
```

### 2.5 Contact Section

**Текущий**: Простая контактная форма

**Новый (Halcyon)**:
```astro
<!-- src/components/ContactSection.astro -->
- Grid 2 колонки (info + форма)
- Левая колонка: кнопки-ссылки на мессенджеры
  - WhatsApp: +77079970411
  - Telegram: @halci
  - Instagram: @alash_lawyer
  - Телефон: +7 (707) 997-04-11
- Правая колонка: форма с полупрозрачным фоном
- Поля: Имя, Телефон, Сообщение
- Отправка на API /api/contact
```

### 2.6 Footer

**Простой footer**:
```astro
<!-- src/components/Footer.astro -->
- Темный фон
- Центрированный текст
- "© 2025 Halcyon. Все права защищены. Республика Казахстан"
```

---

## Этап 3: Content Collections

### 3.1 Структура контента

```
src/content/
├── services/
│   ├── divorce/
│   │   ├── 01-without-participation-ru.md
│   │   ├── 01-without-participation-kz.md
│   │   ├── 01-without-participation-en.md
│   │   ├── 02-without-consent-ru.md
│   │   ├── ... (6 услуг × 3 языка = 18 файлов)
│   ├── pretension/
│   │   ├── 01-pretension-stage-ru.md
│   │   ├── ... (4 услуги × 3 языка = 12 файлов)
│   └── business/
│       ├── 01-contract-analysis-ru.md
│       ├── ... (7 услуг × 3 языка = 21 файл)
├── advantages/
│   ├── 01-experience-ru.md
│   ├── ... (6 преимуществ × 3 языка = 18 файлов)
└── pages/
    ├── home-ru.md
    ├── home-kz.md
    └── home-en.md
```

### 3.2 Schema для услуг

```typescript
// src/content/config.ts
const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['divorce', 'pretension', 'business']),
    order: z.number(),
    locale: z.enum(['ru', 'kz', 'en']),
    draft: z.boolean().default(false),
  }),
});
```

---

## Этап 4: Переводы (i18n)

### Обновить переводы для Halcyon контента

**src/i18n/ru.json**:
```json
{
  "nav": {
    "divorce": "Расторжение брака",
    "pretension": "Претензионно-исковая работа",
    "business": "Юрист для бизнеса",
    "contact": "Контакты"
  },
  "hero": {
    "title": "HALCYON",
    "subtitle": "Юридическая помощь премиум-класса в Казахстане",
    "cta": "Получить консультацию"
  },
  "sections": {
    "divorceTitle": "Услуги по Расторжению Брака",
    "divorceSubtitle": "под ключ",
    "pretensionTitle": "Претензионно-исковая работа",
    "businessTitle": "Карманный юрист для бизнеса",
    "advantagesTitle": "Наши преимущества",
    "contactTitle": "Связаться со мной"
  }
}
```

**src/i18n/kz.json** и **src/i18n/en.json** - аналогично

---

## Этап 5: JavaScript функциональность

### 5.1 Accordion для карточек услуг

```typescript
// src/scripts/accordion.ts
export function initAccordion() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      // Закрыть все карточки в секции
      card.closest('section')
        ?.querySelectorAll('.service-card')
        .forEach(c => c.classList.remove('active'));
      // Открыть текущую, если она была закрыта
      if (!isActive) card.classList.add('active');
    });
  });
}
```

### 5.2 Scroll эффекты

```typescript
// src/scripts/scroll-effects.ts
export function initScrollEffects() {
  // Navbar при скролле
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // IntersectionObserver для анимаций
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.service-card, .advantage-card')
    .forEach(el => observer.observe(el));
}
```

### 5.3 Smooth scroll навигация

```typescript
// src/scripts/smooth-scroll.ts
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(
        anchor.getAttribute('href') || ''
      );
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
```

---

## Этап 6: Структура страниц

### Главная страница

**src/pages/[lang]/index.astro**:
```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Header from '@/components/Header.astro';
import Hero from '@/components/Hero.astro';
import DivorceSection from '@/components/sections/DivorceSection.astro';
import PretensionSection from '@/components/sections/PretensionSection.astro';
import BusinessSection from '@/components/sections/BusinessSection.astro';
import AdvantagesSection from '@/components/sections/AdvantagesSection.astro';
import ContactSection from '@/components/ContactSection.astro';
import Footer from '@/components/Footer.astro';

const { lang } = Astro.params;
---

<BaseLayout lang={lang}>
  <Header lang={lang} />
  <Hero lang={lang} />
  <DivorceSection lang={lang} />
  <PretensionSection lang={lang} />
  <BusinessSection lang={lang} />
  <AdvantagesSection lang={lang} />
  <ContactSection lang={lang} />
  <Footer lang={lang} />
</BaseLayout>
```

---

## Этап 7: SEO обновления

### 7.1 Мета-теги

```astro
<!-- BaseLayout.astro -->
<title>Halcyon | Юридические услуги премиум-класса в Казахстане</title>
<meta name="description" content="Halcyon - юридическая фирма премиум-класса. Расторжение брака под ключ, претензионно-исковая работа, юрист для бизнеса. 10+ лет опыта." />

<!-- Open Graph -->
<meta property="og:title" content="Halcyon | Юридические услуги" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://alash-zan.kz/" />
<meta property="og:image" content="https://alash-zan.kz/og-image.jpg" />

<!-- Keywords -->
<meta name="keywords" content="юрист, Казахстан, развод, претензионная работа, юридическая консультация, Алматы" />
```

### 7.2 Structured Data (Schema.org)

```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "Halcyon",
  "description": "Юридические услуги премиум-класса",
  "url": "https://alash-zan.kz",
  "telephone": "+77079970411",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "KZ"
  },
  "priceRange": "$$"
}
```

---

## Этап 8: Обновление конфигурации

### astro.config.mjs

```javascript
export default defineConfig({
  site: 'https://alash-zan.kz',
  // ... остальная конфигурация
});
```

### package.json

```json
{
  "name": "halcyon-legal-site",
  "description": "Halcyon - Premium legal services in Kazakhstan",
  // ...
}
```

---

## Этап 9: Тестирование

### Чек-лист перед деплоем:

- [ ] Все компоненты рендерятся корректно
- [ ] Accordion карточки открываются/закрываются
- [ ] Smooth scroll навигация работает
- [ ] Контактная форма отправляет данные на API
- [ ] Языковой переключатель работает (ru/kz/en)
- [ ] Адаптивная верстка (мобильные, планшеты, десктоп)
- [ ] Анимации IntersectionObserver работают
- [ ] Navbar меняет стиль при скролле
- [ ] Все ссылки на мессенджеры работают
- [ ] SEO теги заполнены
- [ ] Lighthouse score > 90
- [ ] TypeScript компилируется без ошибок
- [ ] npm run build успешен

---

## Этап 10: Деплой

### 10.1 Создать Pull Request

```bash
git add .
git commit -m "feat: complete Halcyon redesign migration"
git push origin feature/halcyon-redesign
```

### 10.2 Создать релиз v2.0.0

После мержа в main:

```bash
git tag v2.0.0 -m "Release v2.0.0: Halcyon redesign"
git push origin v2.0.0
```

### 10.3 Автоматический деплой

GitHub Actions автоматически:
1. Соберет проект (npm run build)
2. Создаст релиз `/var/www/alash-zan/releases/v2.0.0/`
3. Переключит symlink `current` на новую версию
4. Старая версия v1.0.0 сохранится для отката

---

## Timeline

**Общая оценка**: 3-5 дней

### День 1: Стили и базовые компоненты
- Обновить цветовую палитру
- Создать Hero, Header, Footer
- Настроить темную тему

### День 2: Секции услуг
- Мигрировать контент в Content Collections
- Создать ServiceCardAccordion компонент
- Реализовать 3 секции услуг

### День 3: Функциональность
- Accordion JavaScript
- Scroll эффекты
- IntersectionObserver анимации
- Контактная секция

### День 4: Переводы и i18n
- Обновить все переводы (ru/kz/en)
- Проверить переключение языков
- SEO оптимизация

### День 5: Тестирование и деплой
- Локальное тестирование
- Исправление багов
- Pull Request и Review
- Деплой на production

---

## Откат (Rollback)

Если что-то пойдет не так:

```bash
# На сервере
ssh ubuntu@194.32.142.237
~/rollback-alash-zan.sh
# Выбрать v1.0.0
```

Вернется на старую версию мгновенно (symlink switch).

---

## Следующие задачи (после миграции)

- [ ] Добавить analytics (Google Analytics, Yandex Metrika)
- [ ] Настроить SMTP/Telegram уведомления для формы
- [ ] Создать OG image для соцсетей
- [ ] Настроить мониторинг (UptimeRobot)
- [ ] Добавить блог/новости (если понадобится)

---

**Статус**: Готов к началу работы
**Следующий шаг**: Утверждение плана → Начало реализации
