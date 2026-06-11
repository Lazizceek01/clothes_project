import { useState } from "react";
import { AWS_RESOURCES, VPC_DATA } from "../db";

const TYPE_COLORS = { EC2: "#3b82f6", RDS: "#a855f7", ALB: "#22c55e", NAT: "#f59e0b", IGW: "#06b6d4" };

function ResourceRow({ r }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="net-row" onClick={() => setOpen(o => !o)}>
        <span className="net-name">
          <span className="net-type-badge" style={{ background: TYPE_COLORS[r.type] + "22", color: TYPE_COLORS[r.type] }}>{r.type}</span>
          {r.name}
        </span>
        <span className="net-id">{r.id}</span>
        <span className="net-ip">{r.ip}</span>
        <span className="net-region">{r.az || r.region}</span>
        {r.cpu != null ? (
          <span className="net-cpu-col">
            <div className="cpu-bar"><div className="cpu-fill" style={{ width: `${r.cpu}%`, background: r.cpu > 80 ? "#ef4444" : r.cpu > 60 ? "#f59e0b" : "#22c55e" }} /></div>
            <span>{r.cpu}%</span>
          </span>
        ) : <span />}
        <span className={`status-chip status-chip--${r.status === "running" || r.status === "available" || r.status === "active" ? "green" : "red"}`}>
          {r.status}
        </span>
        <span className="net-expand">{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div className="net-detail">
          <div className="detail-grid">
            <div><span>Instance:</span> {r.instance || "—"}</div>
            <div><span>Private IP:</span> {r.ip}</div>
            <div><span>Public IP:</span> {r.publicIp || "Yo'q"}</div>
            <div><span>Region:</span> {r.region}</div>
            {r.memory != null && <div><span>Memory:</span> {r.memory}%</div>}
          </div>
        </div>
      )}
    </>
  );
}

export default function Network() {
  const [filter, setFilter] = useState("all");
  const types = ["all", "EC2", "RDS", "ALB", "NAT"];
  const filtered = filter === "all" ? AWS_RESOURCES : AWS_RESOURCES.filter(r => r.type === filter);

  return (
    <div className="network-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Tarmoq Resurslari</h2>
          <p className="page-desc">VPC: {VPC_DATA.vpcId} · CIDR: {VPC_DATA.cidr}</p>
        </div>
        <div className="filter-tabs">
          {types.map(t => (
            <button key={t} className={`filter-tab ${filter === t ? "filter-tab--active" : ""}`} onClick={() => setFilter(t)}>
              {t === "all" ? "Barchasi" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="vpc-overview">
        <div className="vpc-card">
          <h3>VPC</h3>
          <div className="vpc-stat"><span>ID</span><code>{VPC_DATA.vpcId.slice(0, 18)}…</code></div>
          <div className="vpc-stat"><span>CIDR</span><code>{VPC_DATA.cidr}</code></div>
          <div className="vpc-stat"><span>Region</span><code>{VPC_DATA.region}</code></div>
        </div>
        {VPC_DATA.subnets.map(s => (
          <div key={s.id} className={`subnet-card subnet-card--${s.type}`}>
            <div className="subnet-label">{s.type === "public" ? "🌐 Public" : "🔒 Private"}</div>
            <div className="subnet-name">{s.name}</div>
            <div className="subnet-cidr">{s.cidr}</div>
            <div className="subnet-az">{s.az}</div>
            <div className="subnet-res">{s.resources} resurs</div>
          </div>
        ))}
      </div>

      <div className="sg-row">
        {VPC_DATA.securityGroups.map(sg => (
          <div key={sg.id} className="sg-card">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="sg-name">{sg.name}</span>
            <span className="sg-rules">{sg.rules} qoida</span>
            <span className="sg-attached">{sg.attached} attached</span>
          </div>
        ))}
      </div>

      <div className="net-table">
        <div className="net-head">
          <span>Nom / Tur</span><span>ID</span><span>IP</span><span>AZ / Region</span><span>CPU</span><span>Holat</span><span />
        </div>
        {filtered.map(r => <ResourceRow key={r.id} r={r} />)}
      </div>
    </div>
  );
}
