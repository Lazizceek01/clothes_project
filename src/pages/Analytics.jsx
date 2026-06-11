import { useState } from "react";
import { DAILY_TRAFFIC, DAILY_COST, VPN_LOGS, HOURLY_METRICS } from "../db";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Legend, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#ef4444"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="tooltip-row" style={{ color: p.color }}>
          <span>{p.name}:</span> <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [range, setRange] = useState(30);

  const trafficData = DAILY_TRAFFIC.slice(-range).map(d => ({
    date: d.date.slice(5),
    Kiruvchi: d.inbound,
    Chiquvchi: d.outbound,
    Xatolar: d.errors,
  }));

  const costData = DAILY_COST.slice(-range).map(d => ({
    date: d.date.slice(5),
    EC2: +d.ec2.toFixed(1),
    RDS: +d.rds.toFixed(1),
    Tarmoq: +d.network.toFixed(1),
    Storage: +d.storage.toFixed(1),
    Boshqa: +d.other.toFixed(1),
  }));

  const vpnData = VPN_LOGS.slice(-14).map(d => ({
    date: d.date.slice(5),
    Toshkent: d.tashkent,
    Samarqand: d.samarqand,
    Namangan: d.namangan,
    Andijon: d.andijon,
  }));

  const metricData = HOURLY_METRICS.slice(-12).map(d => ({
    soat: d.hour,
    "ERP CPU": d.erp_cpu,
    "CRM CPU": d.crm_cpu,
    "WMS CPU": d.wms_cpu,
  }));

  const totalCost = DAILY_COST.slice(-30).reduce((acc, d) => ({
    EC2: acc.EC2 + d.ec2,
    RDS: acc.RDS + d.rds,
    Tarmoq: acc.Tarmoq + d.network,
    Storage: acc.Storage + d.storage,
    Boshqa: acc.Boshqa + d.other,
  }), { EC2: 0, RDS: 0, Tarmoq: 0, Storage: 0, Boshqa: 0 });

  const pieData = Object.entries(totalCost).map(([k, v]) => ({ name: k, value: +v.toFixed(1) }));

  const totalTrafficIn = DAILY_TRAFFIC.slice(-range).reduce((s, d) => s + d.inbound, 0);
  const totalTrafficOut = DAILY_TRAFFIC.slice(-range).reduce((s, d) => s + d.outbound, 0);
  const totalRequests = DAILY_TRAFFIC.slice(-range).reduce((s, d) => s + d.requests, 0);
  const totalErrors = DAILY_TRAFFIC.slice(-range).reduce((s, d) => s + d.errors, 0);
  const totalSpend = DAILY_COST.slice(-range).reduce((s, d) => s + d.ec2 + d.rds + d.network + d.storage + d.other, 0);

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Tahlil va Grafiklar</h2>
          <p className="page-desc">Trafik, xarajat, VPN va server ko'rsatkichlari</p>
        </div>
        <div className="range-tabs">
          {[7, 14, 30, 60, 90].map(r => (
            <button key={r} className={`filter-tab ${range === r ? "filter-tab--active" : ""}`} onClick={() => setRange(r)}>
              {r} kun
            </button>
          ))}
        </div>
      </div>

      <div className="analytics-summary">
        <div className="asumm-card"><div className="asumm-val">{(totalTrafficIn / 1024).toFixed(1)} GB</div><div className="asumm-lbl">Kiruvchi trafik</div></div>
        <div className="asumm-card"><div className="asumm-val">{(totalTrafficOut / 1024).toFixed(1)} GB</div><div className="asumm-lbl">Chiquvchi trafik</div></div>
        <div className="asumm-card"><div className="asumm-val">{(totalRequests / 1000).toFixed(0)}K</div><div className="asumm-lbl">Jami so'rovlar</div></div>
        <div className="asumm-card asumm-card--warn"><div className="asumm-val">{totalErrors.toLocaleString()}</div><div className="asumm-lbl">Xatolar</div></div>
        <div className="asumm-card asumm-card--cost"><div className="asumm-val">${totalSpend.toFixed(0)}</div><div className="asumm-lbl">Jami xarajat</div></div>
      </div>

      <div className="charts-row">
        <div className="chart-card chart-card--wide">
          <div className="chart-head"><h3>Trafik tendensiyasi</h3><span className="chart-unit">MB/kun</span></div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trafficData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gIn2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gOut2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} interval={Math.ceil(range / 8)} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="Kiruvchi" stroke="#3b82f6" fill="url(#gIn2)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Chiquvchi" stroke="#22c55e" fill="url(#gOut2)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-head"><h3>Xarajat taqsimoti</h3><span className="chart-unit">USD · 30 kun</span></div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: $${value.toFixed(0)}`} labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `$${v.toFixed(1)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-head"><h3>Kunlik xarajat (stack)</h3><span className="chart-unit">USD</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={costData.slice(-14)} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {["EC2", "RDS", "Tarmoq", "Storage"].map((k, i) => (
                <Bar key={k} dataKey={k} stackId="a" fill={COLORS[i]} radius={i === 3 ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-head"><h3>VPN ulanishlar (aktiv foydalanuvchi)</h3><span className="chart-unit">Soni</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={vpnData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} interval={3} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {["Toshkent", "Samarqand", "Namangan", "Andijon"].map((k, i) => (
                <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-head"><h3>Server CPU — oxirgi 12 soat</h3><span className="chart-unit">%</span></div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={metricData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="soat" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {["ERP CPU", "CRM CPU", "WMS CPU"].map((k, i) => (
              <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
