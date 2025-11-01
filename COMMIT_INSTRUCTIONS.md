# How to commit & open PR (run locally)

These steps must be performed locally because git is not available in the execution environment used by this agent.

1. Create a branch and stage changes

```powershell
git checkout -b feat/i18n-contact-ci
git add -A
git commit -m "feat(i18n,ci,contact): add multi-language, logger, and CI checks"
```

2. Push branch and open PR

```powershell
git push -u origin feat/i18n-contact-ci
# Then open a PR on GitHub (the repo page will usually offer a quick link)
```

3. If you want to run checks in CI locally before pushing, run:

```powershell
npm install
npm run format:check
npm run typecheck
npm run lint
npm run build
```

4. If CI fails on GitHub Actions for missing secrets (deploy, SMTP), either set secrets in repository settings or temporarily disable those steps in `.github/workflows/ci.yml`.
