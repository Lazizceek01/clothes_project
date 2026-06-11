// 3 oylik ma'lumotlar bazasi - Kiyim-kechak ulgurji kompaniyasi
const now = new Date();

function daysAgo(n) {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max) { return parseFloat((Math.random() * (max - min) + min).toFixed(2)); }

// Foydalanuvchilar
export const USERS = [
  { id: 1, username: "admin", password: "admin123", name: "Jasur Toshmatov", role: "Admin", avatar: "JT", email: "admin@cloudnet.uz" },
  { id: 2, username: "demo", password: "demo123", name: "Malika Yusupova", role: "Engineer", avatar: "MY", email: "malika@cloudnet.uz" },
  { id: 3, username: "viewer", password: "view123", name: "Bobur Rahimov", role: "Viewer", avatar: "BR", email: "bobur@cloudnet.uz" },
];

// AWS Resurslar
export const AWS_RESOURCES = [
  { id: "i-0a1b2c3d4", name: "ERP-Server-01", type: "EC2", instance: "t3.large", region: "ap-southeast-1", az: "ap-southeast-1a", status: "running", cpu: 68, memory: 74, ip: "10.0.1.10", publicIp: "54.251.12.34" },
  { id: "i-1a2b3c4d5", name: "CRM-Server-01", type: "EC2", instance: "t3.medium", region: "ap-southeast-1", az: "ap-southeast-1b", status: "running", cpu: 45, memory: 58, ip: "10.0.1.11", publicIp: "54.251.12.35" },
  { id: "i-2b3c4d5e6", name: "WMS-Server-01", type: "EC2", instance: "t3.large", region: "ap-southeast-1", az: "ap-southeast-1a", status: "running", cpu: 52, memory: 61, ip: "10.0.2.10", publicIp: null },
  { id: "i-3c4d5e6f7", name: "Web-Server-01", type: "EC2", instance: "t3.small", region: "ap-southeast-1", az: "ap-southeast-1b", status: "running", cpu: 28, memory: 35, ip: "10.0.3.10", publicIp: "54.251.12.36" },
  { id: "i-4d5e6f7g8", name: "Bastion-Host", type: "EC2", instance: "t3.micro", region: "ap-southeast-1", az: "ap-southeast-1a", status: "running", cpu: 5, memory: 12, ip: "10.0.0.5", publicIp: "54.251.12.10" },
  { id: "rds-001", name: "Main-PostgreSQL", type: "RDS", instance: "db.t3.medium", region: "ap-southeast-1", az: "ap-southeast-1a", status: "available", cpu: 35, memory: 52, ip: "10.0.1.50", publicIp: null },
  { id: "lb-001", name: "App-LoadBalancer", type: "ALB", region: "ap-southeast-1", status: "active", ip: "10.0.0.20", publicIp: "54.251.15.100" },
  { id: "nat-001", name: "NAT-Gateway", type: "NAT", region: "ap-southeast-1", az: "ap-southeast-1a", status: "available", ip: "10.0.0.30", publicIp: "54.251.15.200" },
];

// VPC va Subnet ma'lumotlari
export const VPC_DATA = {
  vpcId: "vpc-0123456789abcdef0",
  cidr: "10.0.0.0/16",
  region: "ap-southeast-1",
  subnets: [
    { id: "subnet-pub-1a", name: "Public-1A", cidr: "10.0.0.0/24", az: "ap-southeast-1a", type: "public", resources: 3 },
    { id: "subnet-pub-1b", name: "Public-1B", cidr: "10.0.3.0/24", az: "ap-southeast-1b", type: "public", resources: 2 },
    { id: "subnet-priv-1a", name: "Private-1A", cidr: "10.0.1.0/24", az: "ap-southeast-1a", type: "private", resources: 4 },
    { id: "subnet-priv-1b", name: "Private-1B", cidr: "10.0.2.0/24", az: "ap-southeast-1b", type: "private", resources: 3 },
  ],
  securityGroups: [
    { id: "sg-001", name: "web-sg", rules: 5, attached: 2 },
    { id: "sg-002", name: "app-sg", rules: 8, attached: 3 },
    { id: "sg-003", name: "db-sg", rules: 3, attached: 1 },
    { id: "sg-004", name: "bastion-sg", rules: 2, attached: 1 },
  ]
};

// Ofislar va omborlar (xarita uchun)
export const LOCATIONS = [
  { id: 1, name: "Bosh Ofis — Toshkent", lat: 41.2995, lng: 69.2401, type: "office", status: "online", vpn: "site-to-site", employees: 45, bandwidth: "100 Mbps", ip: "192.168.1.0/24" },
  { id: 2, name: "Ombor — Samarqand", lat: 39.6270, lng: 66.9750, type: "warehouse", status: "online", vpn: "site-to-site", employees: 12, bandwidth: "50 Mbps", ip: "192.168.2.0/24" },
  { id: 3, name: "Ombor — Namangan", lat: 40.9983, lng: 71.6726, type: "warehouse", status: "online", vpn: "site-to-site", employees: 8, bandwidth: "30 Mbps", ip: "192.168.3.0/24" },
  { id: 4, name: "Ombor — Andijon", lat: 40.7829, lng: 72.3441, type: "warehouse", status: "warning", vpn: "site-to-site", employees: 6, bandwidth: "20 Mbps", ip: "192.168.4.0/24" },
  { id: 5, name: "Filial — Buxoro", lat: 39.7747, lng: 64.4286, type: "office", status: "online", vpn: "client-to-site", employees: 5, bandwidth: "20 Mbps", ip: "192.168.5.0/24" },
  { id: 6, name: "AWS Region — Singapore", lat: 1.3521, lng: 103.8198, type: "cloud", status: "online", vpn: null, employees: 0, bandwidth: "10 Gbps", ip: "10.0.0.0/16" },
];

// 90 kunlik traffic ma'lumotlari
export const DAILY_TRAFFIC = Array.from({ length: 90 }, (_, i) => {
  const dayOfWeek = new Date(daysAgo(89 - i)).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const base = isWeekend ? 0.4 : 1;
  return {
    date: daysAgo(89 - i),
    inbound: rand(800 * base, 2400 * base),
    outbound: rand(400 * base, 1200 * base),
    requests: rand(12000 * base, 48000 * base),
    errors: rand(0, 120 * base),
    latency: randFloat(12, 45),
  };
});

// 90 kunlik xarajat ma'lumotlari
export const DAILY_COST = Array.from({ length: 90 }, (_, i) => ({
  date: daysAgo(89 - i),
  ec2: randFloat(18, 28),
  rds: randFloat(8, 14),
  network: randFloat(3, 9),
  storage: randFloat(2, 5),
  other: randFloat(1, 4),
}));

// CPU/Memory monitoring (oxirgi 24 soat, har soatlik)
export const HOURLY_METRICS = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(23 - i).padStart(2, "0")}:00`,
  erp_cpu: rand(40, 85),
  erp_mem: rand(55, 80),
  crm_cpu: rand(25, 65),
  crm_mem: rand(45, 70),
  wms_cpu: rand(30, 72),
  wms_mem: rand(50, 75),
})).reverse();

// VPN ulanish loglari (oxirgi 30 kun)
export const VPN_LOGS = Array.from({ length: 30 }, (_, i) => ({
  date: daysAgo(29 - i),
  tashkent: rand(40, 50),
  samarqand: rand(8, 15),
  namangan: rand(5, 12),
  andijon: rand(3, 10),
  bukhara: rand(2, 8),
}));

// Xavfsizlik hodisalari
export const SECURITY_EVENTS = [
  { id: 1, time: "2025-06-06 09:14", type: "warning", msg: "Andijon omborida VPN uzilishi qayd etildi", location: "Andijon" },
  { id: 2, time: "2025-06-06 08:52", type: "info", msg: "Yangi EC2 instance ishga tushirildi: WMS-backup-01", location: "AWS SG" },
  { id: 3, time: "2025-06-05 23:11", type: "danger", msg: "RDS ulanishga 3 marta muvaffaqiyatsiz urinish", location: "10.0.1.50" },
  { id: 4, time: "2025-06-05 18:30", type: "info", msg: "Auto-scaling: ERP uchun 1 ta qo'shimcha instance qo'shildi", location: "AWS SG" },
  { id: 5, time: "2025-06-05 14:20", type: "success", msg: "SSL sertifikat muvaffaqiyatli yangilandi", location: "54.251.15.100" },
  { id: 6, time: "2025-06-04 11:05", type: "warning", msg: "Load Balancer — ERP serveri javob vaqti oshdi (2.1s)", location: "ALB" },
  { id: 7, time: "2025-06-04 09:00", type: "success", msg: "Har haftalik backup muvaffaqiyatli yakunlandi", location: "S3" },
  { id: 8, time: "2025-06-03 16:44", type: "danger", msg: "NAT Gateway orqali shubhali trafik aniqlandi", location: "NAT-001" },
];

// Oylik statistika (summary uchun)
export const SUMMARY_STATS = {
  totalUptime: "99.94%",
  avgLatency: "18.4ms",
  activeVpnTunnels: 4,
  totalInstances: 5,
  monthlyTrafficIn: "187 GB",
  monthlyTrafficOut: "94 GB",
  openTickets: 3,
  resolvedThisMonth: 28,
  currentMonthlyCost: "$1,247",
  projectedCost: "$1,389",
};
