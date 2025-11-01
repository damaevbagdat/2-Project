# my-first-project

![CI](https://github.com/damaevbagdat/my-first-project/actions/workflows/ci.yml/badge.svg)

Learning to code with Cursor AI

## Project Files

- `tech_spec.md`: Техническое задание на разработку сайта.
- `ROADMAP.md`: Дорожная карта проекта с разбивкой на задачи.

## Performance Optimization

This project includes performance optimizations:

- Optimized build configuration in `astro.config.mjs`
- Automatic sitemap generation
- SEO-optimized structure
- Ready-to-use image optimization strategies (see [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) for guidelines)
- Optimized asset delivery

## CI/CD Setup

This project includes a CI/CD setup through GitHub Actions:

- Automatic deployment to GitHub Pages when changes are pushed to the `main` branch
- Separate deployment workflow for Netlify
- Code formatting, type checking, and building are verified during CI
- See [CI_CD_SETUP.md](./CI_CD_SETUP.md) for detailed configuration

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
