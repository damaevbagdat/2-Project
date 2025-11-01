## Reviewer checklist

1. Build & CI
   - [ ] Run `npm run typecheck` locally — no errors
   - [ ] Run `npm run lint` locally — fix any code-style issues
   - [ ] Run `npm run build` — verify output folder and check example pages (/ru/about, /en/services)

2. Security & Secrets
   - [ ] Ensure no secrets are committed
   - [ ] For production, add SMTP and Telegram tokens to GitHub Secrets (Settings → Secrets)
   - [ ] Confirm deploy steps (gh-pages or Netlify) have appropriate secrets configured

3. Functional tests
   - [ ] Submit the contact form locally with invalid input — verify validation errors
   - [ ] Submit with valid input — verify response success and that `data/submissions.json` contains the entry (when running locally)
   - [ ] If SMTP/Telegram env vars are set, verify notifications are delivered

4. Code quality
   - [ ] Check `src/lib/logger.ts` usage for not leaking secrets
   - [ ] Ensure i18n helper `t()` fallback behavior is acceptable (returns key when missing)

5. Post-merge
   - [ ] Add repository secrets
   - [ ] Optionally switch SMTP sending to a background job/queue for production
