# PR: feat(i18n, ci, contact): path-based i18n, CI checks, contact backend improvements

## Summary

This PR implements path-based internationalization (ru/kz/en), content scaffolding for localized pages, per-path hreflang generation, CI checks (format/typecheck/lint/build), and a minimal contact backend with structured logging and optional SMTP/Telegram notifications.

## Major changes

- i18n: helpers in `src/i18n`, localized JSON dictionaries and localized routes under `src/pages/[lang]`.
- Content: placeholders for `about`, `contact`, and `services` in ru/kz/en inside `src/content`.
- Hreflang: `src/layouts/BaseLayout.astro` uses `generateHreflangs` to emit alternate links.
- Logger: `src/lib/logger.ts` — env-driven LOG_LEVEL.
- Contact API: `src/pages/api/contact.ts` — validation, local persistence (`data/submissions.json`), optional SMTP (nodemailer) and Telegram notifications, robust retry/backoff for SMTP, HTML email template.
- CI: `.github/workflows/ci.yml` — format, typecheck, lint, build, artifact upload and optional deploy steps.
- Dev tooling: Prettier, ESLint (astro parser + plugin), husky + lint-staged.

## Testing & Local verification

Run locally:

```powershell
npm install
npm run format:check
npm run typecheck
npm run lint
npm run build
```

For testing SMTP/Telegram notifications set the following env vars (see `.env.example`):

- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO (optional)
- TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

Note: Notification sending is best-effort — failures are logged and do not break the API response.

## Review checklist
- [ ] TypeScript typecheck passes in CI
- [ ] Linting rules applied (no critical failures)
- [ ] Build succeeds and static pages are generated
- [ ] Contact form validation and error cases tested manually
- [ ] SMTP/Telegram integrations reviewed for secrets handling (do not log secrets)

## Post-merge steps
- Add repo secrets for SMTP or TELEGRAM in GitHub Settings if you want CI to send notifications.
- Configure GH-Pages / Netlify deploy secrets (if using deploy step in CI).
- Monitor logs for notification errors and adjust retry/backoff or use external queue if needed.

## Notes for maintainers
- This PR intentionally keeps notification sending best-effort and synchronous to avoid blocking; for high-traffic sites consider moving to a background worker or external queue (e.g., AWS SQS, RabbitMQ, or serverless function with retry).
