# Настройка CI/CD для проекта Halcyon

## Описание

Проект использует GitHub Actions для автоматического развертывания сайта при изменениях в ветке `main`.

## Конфигурация

### CI/CD (`.github/workflows/ci.yml`)

Этот файл настроен на выполнение следующих действий:
- При пуше в ветку `main` или при pull request в `main`
- Установка Node.js и зависимостей
- Проверка форматирования (Prettier), типов (TypeScript) и сборка проекта
- Загрузка артефакта сборки
- Развертывание на GitHub Pages в ветку `gh-pages`

### Netlify Deploy (`.github/workflows/netlify-deploy.yml`)

Дополнительно настроена автоматическая публикация на Netlify:
- При пуше в ветку `main`
- Сборка и развертывание на Netlify
- Для работы требуется настроить `NETLIFY_AUTH_TOKEN` и `NETLIFY_SITE_ID` в GitHub Secrets

## Настройка GitHub Pages

Для корректной работы GitHub Pages необходимо:
1. В репозитории перейти в Settings → Pages
2. Установить Source в "Deploy from a branch"
3. Выбрать ветку `gh-pages` и корень `/` как папку для публикации

## Требуемые Secrets (для Netlify)

Для развертывания на Netlify необходимо добавить следующие секреты:
- `NETLIFY_AUTH_TOKEN`: Токен авторизации Netlify
- `NETLIFY_SITE_ID`: ID сайта в Netlify

Эти секреты можно добавить в Settings → Secrets and variables → Actions репозитория.