# CloudNet Dashboard

BTEC Unit 6 — Bulutda Tarmoq Assignment uchun React dashboard.

## Loyiha tarkibi

```
src/
├── App.jsx           → Asosiy routing + Auth/Theme context
├── db.js             → 3 oylik database (90 kunlik ma'lumotlar)
├── index.css         → To'liq CSS (dark/light, responsive)
├── main.jsx          → Entry point
├── pages/
│   ├── Login.jsx     → Login sahifasi + authentication
│   ├── Dashboard.jsx → Asosiy dashboard + grafiklar
│   ├── Network.jsx   → VPC, subnets, EC2 resurslari
│   ├── Analytics.jsx → Tahlil + 5 xil grafik
│   └── MapView.jsx   → O'zbekiston xaritasi + lokatsiyalar
└── components/
    ├── Sidebar.jsx   → Navigatsiya
    └── Topbar.jsx    → Yuqori panel + bildirishnomalar
```

## Local ishga tushirish

```bash
npm install
npm run dev
# http://localhost:5173 da ochiladi
```

## AWS EC2 ga deploy qilish

### 1. EC2 instance yarating
- **AMI**: Ubuntu Server 22.04 LTS
- **Instance type**: t3.small (yoki t3.micro test uchun)
- **Security Group**: Port 80 (HTTP) va 22 (SSH) ochiq bo'lsin

### 2. Fayllarni EC2 ga yuklash
```bash
# Lokal kompyuterdan
scp -r -i your-key.pem . ubuntu@YOUR_EC2_IP:/home/ubuntu/cloudnet
```

### 3. EC2 ga kirib deploy qilish
```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
cd /home/ubuntu/cloudnet
chmod +x deploy.sh
bash deploy.sh
```

Shundan so'ng `http://YOUR_EC2_IP` da ochiladi.

## Login ma'lumotlari

| Username | Parol    | Rol        |
|----------|----------|------------|
| admin    | admin123 | Admin      |
| demo     | demo123  | Engineer   |
| viewer   | view123  | Viewer     |

## Xususiyatlar

- 🌙 Dark / Light mode
- 📱 Mobile responsive (320px gacha)
- 📊 5 xil recharts grafigi (Area, Bar, Line, Pie, stacked)
- 🗺️ SVG xarita — O'zbekiston + VPN ulanishlar
- 🔐 JWT-ga o'xshash localStorage authentication
- 📋 90 kunlik realistic seeded ma'lumotlar
- 🔔 Real-time bildirishnomalar
- ⚡ Live statistika (3 soniyada yangilanadi)
