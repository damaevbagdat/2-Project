# 🏗️ GOSE.KZ - Website

![CI](https://github.com/damaevbagdat/2-Project/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/damaevbagdat/2-Project/actions/workflows/deploy-gose.yml/badge.svg)

Корпоративный сайт компании GOSE по ремонту спецтехники в Казахстане

**Домен**: gose.kz
**Статус**: Production Ready
**Сервер**: 194.32.142.237 (PS.KZ VPS)
**Технологии**: Astro 5.14.4 + TypeScript

## 📚 Документация

Вся документация проекта организована в папке `docs/`:

- **[docs/](docs/)** - Главная страница документации с навигацией
- **[Requirements.md](docs/01-project/Requirements.md)** - Техническое задание на разработку сайта
- **[ROADMAP.md](docs/02-development/ROADMAP.md)** - Дорожная карта проекта с разбивкой на задачи
- **[STRUCTURE.md](docs/01-project/STRUCTURE.md)** - Детальная структура проекта
- **[CI_CD_SETUP.md](docs/03-deployment/CI_CD_SETUP.md)** - Настройка CI/CD
- **[MAINTENANCE.md](docs/03-deployment/MAINTENANCE.md)** - Инструкции по обслуживанию

## Performance Optimization

This project includes performance optimizations:

- Optimized build configuration in `astro.config.mjs`
- Automatic sitemap generation
- SEO-optimized structure
- Ready-to-use image optimization strategies (see [PERFORMANCE_OPTIMIZATION.md](docs/04-optimization/PERFORMANCE_OPTIMIZATION.md) for guidelines)
- Optimized asset delivery

## CI/CD Setup

This project includes a CI/CD setup through GitHub Actions:

- Automatic deployment to GitHub Pages when changes are pushed to the `main` branch
- Separate deployment workflow for Netlify
- Code formatting, type checking, and building are verified during CI
- See [CI_CD_SETUP.md](docs/03-deployment/CI_CD_SETUP.md) for detailed configuration

## Contact backend (local/demo)

Проект включает минимальный API-эндпоинт для контактной формы `src/pages/api/contact.ts`.

- Для управления логированием используйте переменную окружения `LOG_LEVEL` (см. `.env.example`).
- Для демонстрационной локальной персистентности данные сохраняются в `data/submissions.json` при наличии прав записи.
- Для продовой интеграции можно подключить SMTP (nodemailer), Telegram-бота или внешнее API — добавьте соответствующие секреты в окружение и доработайте `src/pages/api/contact.ts`.

Локальная проверка:

```powershell
npm install
npm run typecheck
npm run lint
npm run build
```

Если всё прошло — создайте ветку и закоммитьте изменения локально (git не доступен в CI-окружении этого агента).
