#!/bin/bash
# Скрипт для настройки SSL сертификата и обновления Nginx конфигурации
# Запускать ТОЛЬКО после обновления DNS записей!

set -e

DOMAIN="alash-zan.kz"
WWW_DOMAIN="www.alash-zan.kz"
SERVER_IP="194.32.142.237"

echo "🔍 Проверка DNS записей..."
echo "================================"

# Проверка A записи
A_RECORD=$(dig +short $DOMAIN A | tail -n1)
echo "A запись $DOMAIN: $A_RECORD"

if [ "$A_RECORD" != "$SERVER_IP" ]; then
    echo "❌ ОШИБКА: DNS запись не указывает на наш сервер!"
    echo "   Ожидается: $SERVER_IP"
    echo "   Получено: $A_RECORD"
    echo ""
    echo "⏳ Подождите обновления DNS записей (обычно 1-24 часа)"
    exit 1
fi

WWW_A_RECORD=$(dig +short $WWW_DOMAIN A | tail -n1)
echo "A запись $WWW_DOMAIN: $WWW_A_RECORD"

echo "✅ DNS записи настроены правильно!"
echo ""

# Backup текущей конфигурации
echo "💾 Создание резервной копии Nginx конфигурации..."
sudo cp /etc/nginx/sites-available/alash-zan /etc/nginx/sites-available/alash-zan.backup.$(date +%Y%m%d_%H%M%S)

# Обновление Nginx конфигурации с доменом
echo "🔧 Обновление Nginx конфигурации..."
sudo tee /etc/nginx/sites-available/alash-zan > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name alash-zan.kz www.alash-zan.kz;

    root /var/www/alash-zan/current;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Проверка конфигурации Nginx
echo "✅ Проверка конфигурации Nginx..."
sudo nginx -t

# Перезагрузка Nginx
echo "🔄 Перезагрузка Nginx..."
sudo systemctl reload nginx

echo "✅ Nginx конфигурация обновлена!"
echo ""

# Получение SSL сертификата
echo "🔒 Получение SSL сертификата от Let's Encrypt..."
echo "================================"
sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect

# Проверка автоматического обновления
echo "✅ Проверка таймера автообновления Certbot..."
sudo systemctl status certbot.timer --no-pager

echo ""
echo "🎉 ========================================="
echo "🎉 SSL сертификат успешно установлен!"
echo "🎉 ========================================="
echo ""
echo "✅ Сайт доступен по HTTPS:"
echo "   https://$DOMAIN"
echo "   https://$WWW_DOMAIN"
echo ""
echo "✅ HTTP автоматически перенаправляется на HTTPS"
echo "✅ Сертификат будет автоматически обновляться каждые 60 дней"
echo ""
echo "📋 Полезные команды:"
echo "   sudo certbot certificates              # Посмотреть сертификаты"
echo "   sudo certbot renew --dry-run           # Тест обновления"
echo "   sudo nginx -t && sudo systemctl reload nginx  # Проверка и перезагрузка Nginx"
echo ""
