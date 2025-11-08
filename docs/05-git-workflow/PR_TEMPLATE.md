# PR: feat(i18n,ci,contact): multi-language, CI checks, contact backend improvements

## Summary

This PR implements path-based i18n (ru/kz/en), adds localized content placeholders, generates per-path hreflang links, configures CI checks (format/typecheck/lint/build) and adds a minimal contact backend with structured logging.

## Changes
- i18n helpers and JSON dictionaries: `src/i18n/*`
- Localized pages and content under `src/pages/[lang]` and `src/content`
- `src/lib/logger.ts` — minimal structured logger using `LOG_LEVEL`
- `src/pages/api/contact.ts` — use logger; best-effort file persistence to `data/submissions.json`
- CI workflow: `.github/workflows/ci.yml`
- `.env.example` and README notes for contact backend
- Linting/TypeScript config tweaks to ensure typecheck and lint run in CI

## Notes
- SMTP/Telegram integrations are skeletons—add secrets to environment and extend `src/pages/api/contact.ts` for production.
- GitHub Actions deploy step (gh-pages) expects `ACTIONS_DEPLOY_KEY` or configured workflow secrets.

## Testing
Run the commands locally (see COMMIT_INSTRUCTIONS.md).
