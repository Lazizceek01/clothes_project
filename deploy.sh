#!/bin/bash
# ============================================================
# CloudNet Dashboard — AWS EC2 Deploy Script
# Ubuntu 22.04 LTS uchun (t3.small yoki yuqori)
# Bir marta ishga tushiring: bash deploy.sh
# ============================================================

set -e
echo "🚀 CloudNet deploy boshlandi..."

# ---- 1. System update ----
echo "📦 Tizim yangilanmoqda..."
sudo apt-get update -y
sudo apt-get upgrade -y

# ---- 2. Node.js 20 LTS o'rnatish ----
echo "📦 Node.js 20 o'rnatilmoqda..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "✅ Node versiyasi: $(node --version)"
echo "✅ NPM versiyasi: $(npm --version)"

# ---- 3. Nginx o'rnatish ----
echo "📦 Nginx o'rnatilmoqda..."
sudo apt-get install -y nginx

# ---- 4. PM2 o'rnatish (process manager) ----
echo "📦 PM2 o'rnatilmoqda..."
sudo npm install -g pm2

# ---- 5. Loyiha papkasiga o'tish ----
APP_DIR="/var/www/cloudnet"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Fayllarni ko'chirish
echo "📂 Fayllar ko'chirilmoqda..."
cp -r . $APP_DIR/
cd $APP_DIR

# ---- 6. Dependencies o'rnatish ----
echo "📦 Dependencies o'rnatilmoqda..."
npm install

# ---- 7. Build qilish ----
echo "🔨 Production build qilinmoqda..."
npm run build

# ---- 8. Nginx konfiguratsiya ----
echo "⚙️  Nginx sozlanmoqda..."
sudo tee /etc/nginx/sites-available/cloudnet > /dev/null <<'NGINX'
server {
    listen 80;
    server_name _;

    root /var/www/cloudnet/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    gzip_min_length 1000;

    # React Router uchun
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static fayllar uchun cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
NGINX

# Nginx saytni faollashtirish
sudo ln -sf /etc/nginx/sites-available/cloudnet /etc/nginx/sites-enabled/cloudnet
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx tekshirish va qayta ishga tushirish
sudo nginx -t && sudo systemctl restart nginx
sudo systemctl enable nginx

echo ""
echo "✅ ============================================"
echo "✅ CloudNet Dashboard muvaffaqiyatli deploy qilindi!"
echo "✅ ============================================"
echo ""
echo "🌐 Brauzerda oching: http://$(curl -s ifconfig.me)"
echo ""
echo "👤 Login ma'lumotlari:"
echo "   admin  / admin123  → Admin"
echo "   demo   / demo123   → Engineer"
echo "   viewer / view123   → Viewer"
echo ""
echo "📋 Foydali buyruqlar:"
echo "   sudo nginx -t          → Nginx tekshirish"
echo "   sudo systemctl status nginx → Nginx holati"
echo "   cd /var/www/cloudnet && npm run build → Qayta build"
