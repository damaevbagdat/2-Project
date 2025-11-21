# Настройка SSL для GOSE.KZ

**Дата создания:** 18 ноября 2025
**Домен:** gose.kz
**Сервер:** 194.32.142.237
**Метод:** Let's Encrypt (Certbot)

---

## 📋 Предварительные требования

Перед установкой SSL сертификата убедитесь:

- ✅ DNS настроен (A запись gose.kz → 194.32.142.237)
- ✅ Nginx установлен и работает
- ✅ Сайт доступен по HTTP (http://gose.kz)
- ✅ Порты 80 и 443 открыты в firewall

---

## 🔧 Установка Certbot

### Шаг 1: Установить Certbot и Nginx плагин

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### Шаг 2: Проверить установку

```bash
certbot --version
```

Должно вывести версию, например: `certbot 2.7.4`

---

## 🔐 Получение SSL сертификата

### Вариант 1: Автоматическая настройка (Рекомендуется)

Certbot автоматически настроит Nginx:

```bash
sudo certbot --nginx -d gose.kz -d www.gose.kz
```

**Вопросы которые задаст Certbot:**

1. **Email для уведомлений:**
   ```
   Enter email address (used for urgent renewal and security notices):
   ```
   Введите рабочий email (например, admin@gose.kz)

2. **Согласие с условиями:**
   ```
   Please read the Terms of Service at https://letsencrypt.org/documents/LE-SA-v1.3-September-21-2022.pdf
   (A)gree/(C)ancel: A
   ```
   Введите `A`

3. **Подписка на новости:**
   ```
   Would you be willing to share your email address with the Electronic Frontier Foundation?
   (Y)es/(N)o: N
   ```
   Введите `N`

4. **Редирект на HTTPS:**
   ```
   Please choose whether or not to redirect HTTP traffic to HTTPS
   1: No redirect
   2: Redirect - Make all requests redirect to secure HTTPS access
   Select the appropriate number [1-2]: 2
   ```
   Введите `2`

### Вариант 2: Только получить сертификат (без настройки Nginx)

```bash
sudo certbot certonly --nginx -d gose.kz -d www.gose.kz
```

После этого нужно будет вручную обновить конфигурацию Nginx (см. NGINX_GOSE_CONFIG.md).

---

## ✅ Проверка установки

### 1. Проверить файлы сертификата

```bash
sudo ls -la /etc/letsencrypt/live/gose.kz/
```

Должны быть файлы:
- `cert.pem` - Сертификат домена
- `chain.pem` - Цепочка сертификатов
- `fullchain.pem` - Полная цепочка (cert + chain)
- `privkey.pem` - Приватный ключ

### 2. Проверить конфигурацию Nginx

```bash
sudo nginx -t
```

Должно вывести:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 3. Перезапустить Nginx

```bash
sudo systemctl reload nginx
```

### 4. Проверить работу HTTPS

Откройте в браузере:
- https://gose.kz
- https://www.gose.kz

Должен открыться сайт с зеленым замочком в адресной строке.

---

## 🔄 Автоматическое обновление сертификата

Let's Encrypt сертификаты действуют 90 дней. Certbot автоматически настраивает обновление.

### Проверить автообновление

```bash
# Проверить таймер
sudo systemctl status certbot.timer

# Протестировать обновление (dry run)
sudo certbot renew --dry-run
```

### Ручное обновление

Если нужно обновить вручную:

```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## 🔍 Проверка SSL конфигурации

### SSL Labs Test

Проверьте качество SSL конфигурации:

1. Откройте: https://www.ssllabs.com/ssltest/
2. Введите: `gose.kz`
3. Нажмите "Submit"

**Цель:** Получить оценку A или A+

### Проверка через командную строку

```bash
# Проверить сертификат
echo | openssl s_client -servername gose.kz -connect gose.kz:443 2>/dev/null | openssl x509 -noout -dates

# Проверить цепочку сертификатов
echo | openssl s_client -servername gose.kz -connect gose.kz:443 -showcerts
```

---

## 🐛 Устранение проблем

### Проблема: DNS не настроен

**Ошибка:**
```
Domain: gose.kz
Type: dns
Detail: DNS problem: NXDOMAIN looking up A for gose.kz
```

**Решение:**
1. Настройте A запись в DNS провайдере
2. Подождите распространения DNS (до 24 часов)
3. Проверьте: `nslookup gose.kz`

### Проблема: Порт 80 закрыт

**Ошибка:**
```
Fetching http://gose.kz/.well-known/acme-challenge/XXX: Connection refused
```

**Решение:**
```bash
# Проверить firewall
sudo ufw status

# Открыть порты (если закрыты)
sudo ufw allow 'Nginx Full'
sudo ufw reload
```

### Проблема: Nginx не настроен

**Ошибка:**
```
Unable to find a virtual host listening on port 80
```

**Решение:**
1. Создайте конфигурацию Nginx (см. NGINX_GOSE_CONFIG.md)
2. Сначала используйте HTTP конфигурацию
3. Затем получите сертификат
4. Обновите конфигурацию для HTTPS

### Проблема: Сертификат для другого домена

**Решение:**
```bash
# Удалить старый сертификат
sudo certbot delete --cert-name gose.kz

# Получить новый
sudo certbot --nginx -d gose.kz -d www.gose.kz
```

---

## 📝 Важные команды

```bash
# Список всех сертификатов
sudo certbot certificates

# Удалить сертификат
sudo certbot delete --cert-name gose.kz

# Обновить все сертификаты
sudo certbot renew

# Обновить конкретный сертификат
sudo certbot renew --cert-name gose.kz

# Отозвать сертификат
sudo certbot revoke --cert-name gose.kz

# Логи Certbot
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

---

## 🔐 Security Headers (уже в Nginx конфигурации)

В конфигурации Nginx уже настроены security headers:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

Эти заголовки обеспечивают:
- **HSTS** - Принудительное использование HTTPS
- **X-Frame-Options** - Защита от clickjacking
- **X-Content-Type-Options** - Защита от MIME-sniffing
- **X-XSS-Protection** - Защита от XSS атак

---

## 📚 Полный процесс настройки SSL

### Пошаговая инструкция

1. **Настроить DNS**
   ```bash
   # Добавить A запись: gose.kz → 194.32.142.237
   # Добавить A запись: www.gose.kz → 194.32.142.237
   ```

2. **Создать HTTP конфигурацию Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/gose
   # Скопировать упрощенную конфигурацию из NGINX_GOSE_CONFIG.md
   sudo ln -s /etc/nginx/sites-available/gose /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Проверить доступность**
   ```bash
   curl -I http://gose.kz
   # Должен вернуть 200 OK
   ```

4. **Получить SSL сертификат**
   ```bash
   sudo certbot --nginx -d gose.kz -d www.gose.kz
   ```

5. **Обновить Nginx конфигурацию**
   ```bash
   sudo nano /etc/nginx/sites-available/gose
   # Скопировать полную HTTPS конфигурацию из NGINX_GOSE_CONFIG.md
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. **Проверить HTTPS**
   ```bash
   curl -I https://gose.kz
   # Проверить в браузере: https://gose.kz
   ```

7. **Проверить автообновление**
   ```bash
   sudo certbot renew --dry-run
   ```

---

## ✅ Чек-лист

- [ ] DNS настроен (A записи)
- [ ] Nginx установлен
- [ ] HTTP конфигурация создана
- [ ] Сайт доступен по HTTP
- [ ] Certbot установлен
- [ ] SSL сертификат получен
- [ ] HTTPS конфигурация обновлена
- [ ] Сайт доступен по HTTPS
- [ ] Редирект HTTP → HTTPS работает
- [ ] SSL Labs оценка A/A+
- [ ] Автообновление настроено

---

**Последнее обновление:** 18 ноября 2025
**Автор:** Claude Code AI
