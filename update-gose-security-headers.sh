#!/bin/bash
# Script to add security headers to gose.kz nginx config
# This is INDEPENDENT from alash-zan.kz configuration

set -e

echo "🔒 Adding security headers to gose.kz nginx configuration..."

# Backup current config
sudo cp /etc/nginx/sites-available/gose /etc/nginx/sites-available/gose.backup.$(date +%Y%m%d_%H%M%S)

# Add security headers to the HTTPS server block
sudo sed -i '/listen 443 ssl;/a \    # Security headers\n    add_header X-Frame-Options "SAMEORIGIN" always;\n    add_header X-Content-Type-Options "nosniff" always;\n    add_header X-XSS-Protection "1; mode=block" always;\n    add_header Referrer-Policy "strict-origin-when-cross-origin" always;' /etc/nginx/sites-available/gose

# Test nginx configuration
echo "Testing nginx configuration..."
sudo nginx -t

# If test passes, reload nginx
if [ $? -eq 0 ]; then
    echo "✅ Configuration valid. Reloading nginx..."
    sudo systemctl reload nginx
    echo "✅ Security headers added successfully!"
    echo ""
    echo "Verifying headers..."
    curl -I https://gose.kz | grep -E "X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Referrer-Policy"
else
    echo "❌ Configuration test failed. Restoring backup..."
    sudo cp /etc/nginx/sites-available/gose.backup.$(date +%Y%m%d)_* /etc/nginx/sites-available/gose
    exit 1
fi
