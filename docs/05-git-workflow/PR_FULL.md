# PR: feat(i18n,ci,contact): path-based i18n, CI checks, contact backend with notifications

## Summary

This PR implements path-based internationalization (ru/kz/en), localized content scaffolding, per-path hreflang generation, CI checks for formatting/typecheck/lint/build, and a minimal contact backend that supports structured logging and optional SMTP and Telegram notifications.

## Why

- Add multi-language support (SEO and UX) with clear per-language routes.
- Improve DX and reliability by enforcing formatting, type checking, and linting in CI.
- Provide a production-ready contact flow with optional integrations for notifications and persistence.

## Changes (high level)

- i18n helpers: `src/i18n/index.ts` and dictionaries `src/i18n/{ru,kz,en}.json`.
- Localized content and pages: `src/pages/[lang]/...`, localized markdown in `src/content`.
- Hreflang links emitted in `src/layouts/BaseLayout.astro`.
- Logger: `src/lib/logger.ts` (LOG_LEVEL via env).
- Contact API: `src/pages/api/contact.ts` — validation, file persistence (`data/submissions.json`), optional SMTP (nodemailer) and Telegram notifications, retry/backoff for SMTP, HTML email template at `src/lib/emailTemplate.ts`.
- CI: `.github/workflows/ci.yml` with format/typecheck/lint/build and deploy steps.
- Tooling: Prettier, ESLint (astro parser/plugin), husky + lint-staged.
- Docs & helpers: `.env.example`, `README.md` updates, `PR_TEMPLATE.md`, `PR_BODY.md`, `COMMIT_INSTRUCTIONS.md`, `REVIEW_CHECKLIST.md`.

## How to test locally

1. Install deps and run checks:

```powershell
npm install
npm run format:check
npm run typecheck
npm run lint
npm run build
```

2. Test the contact form locally:
   - Run the site (`npm run dev`) and submit invalid data — verify errors.
   - Submit valid data — verify response success and that `data/submissions.json` contains the entry (when running locally).

3. (Optional) Test notifications:
   - SMTP: set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and optional `CONTACT_TO` in env.
   - Telegram: set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.

Note: Notification sending is best-effort and logged; failures do not change API success response.

## Reviewer checklist
- [ ] TypeScript typecheck passes in CI
- [ ] Linting rules applied (no critical failures)
- [ ] Build succeeds and static pages are generated
- [ ] Contact form validation and manual tests performed
- [ ] Secrets handling reviewed (no secrets committed, secrets in GitHub settings)

## Post-merge steps
- Add SMTP/Telegram secrets to GitHub repository (Settings → Secrets) if notifications in CI are required.
- Ensure CI deploy step has correct secrets for gh-pages or Netlify.
- Consider moving notification sending to background worker/queue for production-scale traffic.

## Notes
- The project currently persists submissions into `data/submissions.json` for demo/local runs. For production, connect to a database or persistent API.
- The i18n `t()` helper falls back to returning the key when a translation is missing — consider adding translation completeness checks if needed.

---

Paste this body into the PR description when opening the PR. Use `COMMIT_INSTRUCTIONS.md` for local commit/push commands.
