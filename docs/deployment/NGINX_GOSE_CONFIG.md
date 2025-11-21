# Конфигурация Nginx для GOSE.KZ

**Дата создания:** 18 ноября 2025
**Домен:** gose.kz
**Сервер:** 194.32.142.237

---

## 📋 Файл конфигурации

**Расположение:** `/etc/nginx/sites-available/gose`
**Symlink:** `/etc/nginx/sites-enabled/gose`

---

## 🔧 Конфигурация Nginx

### Шаг 1: Создать файл конфигурации

```bash
sudo nano /etc/nginx/sites-available/gose
```

### Шаг 2: Добавить конфигурацию

```nginx
# HTTP сервер - редирект на HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name gose.kz www.gose.kz;

    # Для Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/gose/current;
    }

    # Редирект всего остального на HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS сервер
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name gose.kz www.gose.kz;

    # SSL сертификаты (будут созданы через Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/gose.kz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gose.kz/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/gose.kz/chain.pem;

    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Root directory (symlink)
    root /var/www/gose/current;
    index index.html;

    # Character set
    charset utf-8;

    # Логи
    access_log /var/log/nginx/gose-access.log;
    error_log /var/log/nginx/gose-error.log;

    # Основное правило для Astro
    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Статические файлы с кешированием
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Отключить логи для favicon
    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    # Отключить логи для robots.txt
    location = /robots.txt {
        log_not_found off;
        access_log off;
    }

    # Запретить доступ к скрытым файлам
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
    gzip_disable "msie6";
}
```

---

## 📝 Инструкции по установке

### 1. Создать конфигурацию

```bash
# Создать файл
sudo nano /etc/nginx/sites-available/gose

# Скопировать конфигурацию выше и сохранить (Ctrl+O, Enter, Ctrl+X)
```

### 2. Активировать сайт

```bash
# Создать symlink
sudo ln -s /etc/nginx/sites-available/gose /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t
```

### 3. Перезапустить Nginx

```bash
sudo systemctl reload nginx
```

---

## ⚠️ Важные замечания

### До установки SSL сертификата

Если SSL сертификат еще не установлен, используйте упрощенную конфигурацию:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name gose.kz www.gose.kz;

    root /var/www/gose/current;
    index index.html;

    charset utf-8;

    access_log /var/log/nginx/gose-access.log;
    error_log /var/log/nginx/gose-error.log;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript;
}
```

После получения SSL сертификата, замените на полную конфигурацию выше.

---

## 🔍 Проверка конфигурации

```bash
# Проверить синтаксис
sudo nginx -t

# Проверить активные сайты
ls -la /etc/nginx/sites-enabled/

# Проверить логи
sudo tail -f /var/log/nginx/gose-error.log
sudo tail -f /var/log/nginx/gose-access.log

# Проверить статус Nginx
sudo systemctl status nginx
```

---

## 🔗 Разделение с alash-zan.kz

Оба сайта находятся на одном сервере, но полностью изолированы:

| Параметр | alash-zan.kz | gose.kz |
|----------|--------------|---------|
| **Root директория** | `/var/www/alash-zan/current` | `/var/www/gose/current` |
| **Nginx config** | `/etc/nginx/sites-available/alash-zan` | `/etc/nginx/sites-available/gose` |
| **Access log** | `/var/log/nginx/alash-zan-access.log` | `/var/log/nginx/gose-access.log` |
| **Error log** | `/var/log/nginx/alash-zan-error.log` | `/var/log/nginx/gose-error.log` |
| **SSL cert** | `/etc/letsencrypt/live/alash-zan.kz/` | `/etc/letsencrypt/live/gose.kz/` |

Никакого пересечения файлов или конфигураций!

---

## 📚 Следующие шаги

1. ✅ Создать конфигурацию Nginx
2. ⏳ Настроить DNS (A запись gose.kz → 194.32.142.237)
3. ⏳ Установить SSL сертификат через Let's Encrypt
4. ⏳ Обновить конфигурацию для HTTPS
5. ⏳ Протестировать сайт

---

**Последнее обновление:** 18 ноября 2025
**Автор:** Claude Code AI
