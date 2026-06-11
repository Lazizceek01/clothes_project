import { useState } from "react";
import { LOCATIONS } from "../db";

// Uzbekistan SVG xaritasi - soddalashttirilgan
const UZ_PATH = "M 60 120 L 80 100 L 120 95 L 160 85 L 200 80 L 240 75 L 280 72 L 320 70 L 360 68 L 400 65 L 440 60 L 480 58 L 510 55 L 520 70 L 515 90 L 500 110 L 490 130 L 480 150 L 470 165 L 450 175 L 430 180 L 410 185 L 380 190 L 350 195 L 320 200 L 300 210 L 280 220 L 260 225 L 240 230 L 220 225 L 200 215 L 180 210 L 160 215 L 140 220 L 120 215 L 100 205 L 80 190 L 65 175 L 55 155 L 52 135 Z";

// Koordinatalarni SVG ga moslashtirish
// Uzbekistan: lat 37-42, lng 56-73
function latLngToSvg(lat, lng) {
  const minLat = 37, maxLat = 43;
  const minLng = 55, maxLng = 74;
  const svgW = 580, svgH = 300;
  const x = ((lng - minLng) / (maxLng - minLng)) * svgW;
  const y = svgH - ((lat - minLat) / (maxLat - minLat)) * svgH;
  return { x, y };
}

const TYPE_ICONS = {
  office: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 21h18V5L12 2 3 5v16zm7-2v-5h4v5h-4zm-4-2V9h2v8H6zm10 0V9h2v8h-2z"/>
    </svg>
  ),
  warehouse: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 20V8l10-6 10 6v12H2zm8-2h4v-6h-4v6zM4 18h4v-4H4v4zm12 0h4v-4h-4v4z"/>
    </svg>
  ),
  cloud: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  ),
};

const STATUS_COLOR = { online: "#22c55e", warning: "#f59e0b", offline: "#ef4444" };

export default function MapView() {
  const [selected, setSelected] = useState(null);
  const [hoverId, setHoverId] = useState(null);

  const sel = LOCATIONS.find(l => l.id === selected);

  return (
    <div className="map-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Geografik Xarita</h2>
          <p className="page-desc">O'zbekiston — ofislar, omborlar va bulut infratuzilmasi</p>
        </div>
        <div className="map-legend">
          <span className="legend-item"><span className="legend-dot" style={{ background: "#22c55e" }} />Aktiv</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: "#f59e0b" }} />Ogohlantirish</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: "#ef4444" }} />Uzilgan</span>
        </div>
      </div>

      <div className="map-container">
        <svg viewBox="0 0 600 320" className="map-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
            </filter>
          </defs>

          {/* Fon */}
          <rect width="600" height="320" fill="var(--map-bg)" rx="12" />

          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={`h${i}`} x1="0" y1={i * 55} x2="600" y2={i * 55} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.5" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <line key={`v${i}`} x1={i * 75} y1="0" x2={i * 75} y2="320" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.5" />
          ))}

          {/* O'zbekiston chegarasi */}
          <path d={UZ_PATH} fill="var(--map-land)" stroke="var(--map-border)" strokeWidth="1.5" filter="url(#shadow)" />

          {/* VPN ulanish chiziqlari - faqat UZB ichidagilari uchun */}
          {LOCATIONS.filter(l => l.type !== "cloud").map(loc => {
            const cloud = LOCATIONS.find(l => l.type === "cloud");
            if (!cloud || loc.id === cloud.id) return null;
            const from = latLngToSvg(loc.lat, loc.lng);
            const to = { x: 580, y: 30 }; // Cloud pozitsiyasi (ekrandan tashqarida ko'rsatish)
            return (
              <line
                key={`vpn-${loc.id}`}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke={STATUS_COLOR[loc.status]}
                strokeWidth={loc.id === hoverId ? 2 : 1}
                strokeDasharray="5 4"
                opacity={loc.id === hoverId ? 0.8 : 0.3}
              />
            );
          })}

          {/* Lokatsiya markalari */}
          {LOCATIONS.filter(l => l.type !== "cloud").map(loc => {
            const { x, y } = latLngToSvg(loc.lat, loc.lng);
            const isHov = hoverId === loc.id;
            const isSel = selected === loc.id;
            const color = STATUS_COLOR[loc.status];
            return (
              <g
                key={loc.id}
                transform={`translate(${x},${y})`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(selected === loc.id ? null : loc.id)}
                onMouseEnter={() => setHoverId(loc.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                {/* Pulsatsiya (aktiv bo'lsa) */}
                {loc.status === "online" && (
                  <circle r="16" fill={color} opacity="0.12">
                    <animate attributeName="r" values="10;18;10" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0;0.2" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Asosiy marker */}
                <circle r={isSel || isHov ? 12 : 9} fill={color} stroke="var(--map-marker-stroke)" strokeWidth="2" />
                {/* Tur belgisi */}
                <circle r={isSel || isHov ? 11 : 8} fill={color} />
                {/* Label */}
                <text y="22" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text-primary)" style={{ pointerEvents: "none" }}>
                  {loc.name.split(" — ")[1] || loc.name.split("—")[1]?.trim() || loc.name}
                </text>
              </g>
            );
          })}

          {/* Singapore cloud */}
          {(() => {
            const cloud = LOCATIONS.find(l => l.type === "cloud");
            return (
              <g transform="translate(575, 25)">
                <circle r="18" fill="#3b82f6" opacity="0.15" />
                <circle r="12" fill="#3b82f6" stroke="white" strokeWidth="2" style={{ cursor: "pointer" }} onClick={() => setSelected(cloud.id)} />
                <text y="28" x="0" textAnchor="middle" fontSize="8" fontWeight="600" fill="var(--text-primary)">AWS SG</text>
              </g>
            );
          })()}
        </svg>
      </div>

      <div className="location-cards">
        {LOCATIONS.map(loc => (
          <div
            key={loc.id}
            className={`loc-card ${selected === loc.id ? "loc-card--active" : ""}`}
            onClick={() => setSelected(selected === loc.id ? null : loc.id)}
          >
            <div className="loc-card-top">
              <div className="loc-type-icon" style={{ color: STATUS_COLOR[loc.status] }}>
                {TYPE_ICONS[loc.type]}
              </div>
              <div className="loc-info">
                <div className="loc-name">{loc.name}</div>
                <div className="loc-vpn">{loc.vpn || "Direct"}</div>
              </div>
              <span className={`status-chip status-chip--${loc.status === "online" ? "green" : loc.status === "warning" ? "yellow" : "red"}`}>
                {loc.status}
              </span>
            </div>
            {selected === loc.id && (
              <div className="loc-detail">
                <div className="loc-detail-row"><span>Xodimlar:</span> {loc.employees}</div>
                <div className="loc-detail-row"><span>Bandwidth:</span> {loc.bandwidth}</div>
                <div className="loc-detail-row"><span>Subnet:</span> <code>{loc.ip}</code></div>
                <div className="loc-detail-row"><span>Koordinat:</span> {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
