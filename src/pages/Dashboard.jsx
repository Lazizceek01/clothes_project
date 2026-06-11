import { useEffect, useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { AWS_RESOURCES, DAILY_COST, DAILY_TRAFFIC, SECURITY_EVENTS, SUMMARY_STATS } from "../db"

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ "--c": color }}>{icon}</div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="tooltip-row" style={{ color: p.color }}>
          <span>{p.name}:</span> <strong>{p.value?.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard({ setPage }) {
  const [tick, setTick] = useState(0);
  const [liveStats, setLiveStats] = useState({ rps: 847, active: 1243, cpu: 68 });

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setLiveStats({
        rps: 800 + Math.floor(Math.random() * 300),
        active: 1100 + Math.floor(Math.random() * 400),
        cpu: 55 + Math.floor(Math.random() * 30),
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const recentTraffic = DAILY_TRAFFIC.slice(-30).map(d => ({
    date: d.date.slice(5),
    "Kiruvchi": d.inbound,
    "Chiquvchi": d.outbound,
  }));

  const recentCost = DAILY_COST.slice(-30).map(d => ({
    date: d.date.slice(5),
    cost: +(d.ec2 + d.rds + d.network + d.storage + d.other).toFixed(1),
  }));

  const running = AWS_RESOURCES.filter(r => r.status === "running" || r.status === "available" || r.status === "active");

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          {/* Edit */}
          <h2 className="page-title">Dashboard</h2>
          <p className="page-desc">Kiyim-kechak ulgurji kompaniyasi — bulut monitoring</p>
        </div>
        <div className="live-badge">
          <span className="live-dot" />
          <span>Jonli</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Uptime" value={SUMMARY_STATS.totalUptime} sub="Oxirgi 90 kun" color="#22c55e"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        <StatCard label="Latency" value={SUMMARY_STATS.avgLatency} sub="O'rtacha" color="#3b82f6"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
        <StatCard label="Aktiv Instancelar" value={`${running.length}/${AWS_RESOURCES.length}`} sub="AWS resurslari" color="#a855f7"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>} />
        <StatCard label="VPN Tunnellari" value={SUMMARY_STATS.activeVpnTunnels} sub="4/4 aktiv" color="#f59e0b"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} />
        <StatCard label="So'rovlar/sek" value={liveStats.rps} sub="Hozir" color="#06b6d4"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>} />
        <StatCard label="Oylik xarajat" value={SUMMARY_STATS.currentMonthlyCost} sub={`Prognoz: ${SUMMARY_STATS.projectedCost}`} color="#ef4444"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
      </div>

      <div className="charts-row">
        <div className="chart-card chart-card--wide">
          <div className="chart-head">
            <h3>Trafik (oxirgi 30 kun)</h3>
            <span className="chart-unit">MB/kun</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={recentTraffic} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} interval={6} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Kiruvchi" stroke="#3b82f6" fill="url(#gIn)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Chiquvchi" stroke="#22c55e" fill="url(#gOut)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-head">
            <h3>Kunlik xarajat</h3>
            <span className="chart-unit">USD</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={recentCost.slice(-14)} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} interval={3} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" fill="#a855f7" radius={[4, 4, 0, 0]} name="Xarajat ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bottom-row">
        <div className="table-card">
          <div className="card-head">
            <h3>AWS Resurslar</h3>
            <button className="view-all-btn" onClick={() => setPage("network")}>Barchasi →</button>
          </div>
          <div className="resource-table">
            <div className="rt-head">
              <span>Nomi</span><span>Turi</span><span>CPU</span><span>Holat</span>
            </div>
            {AWS_RESOURCES.slice(0, 6).map(r => (
              <div key={r.id} className="rt-row">
                <span className="rt-name">{r.name}</span>
                <span className="rt-type">{r.type}</span>
                <span className="rt-cpu">
                  {r.cpu != null && (
                    <>
                      <div className="cpu-bar"><div className="cpu-fill" style={{ width: `${r.cpu}%`, background: r.cpu > 80 ? "#ef4444" : r.cpu > 60 ? "#f59e0b" : "#22c55e" }} /></div>
                      <span>{r.cpu}%</span>
                    </>
                  )}
                </span>
                <span className={`status-chip status-chip--${r.status === "running" || r.status === "available" || r.status === "active" ? "green" : "red"}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="events-card">
          <div className="card-head">
            <h3>Hodisalar</h3>
            <span className="events-count">{SECURITY_EVENTS.length} ta</span>
          </div>
          <div className="events-list">
            {SECURITY_EVENTS.map(ev => (
              <div key={ev.id} className="event-item">
                <span className={`event-dot event-dot--${ev.type}`} />
                <div className="event-body">
                  <div className="event-msg">{ev.msg}</div>
                  <div className="event-meta">{ev.location} · {ev.time.split(" ")[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
