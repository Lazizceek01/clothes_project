import { useState } from "react";
import { useAuth } from "../App";
import { SECURITY_EVENTS } from "../db";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  network: "Tarmoq Resurslari",
  analytics: "Tahlil va Grafiklar",
  map: "Geografik Xarita",
};

export default function Topbar({ page, toggleSidebar }) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = SECURITY_EVENTS.filter(e => e.type === "danger" || e.type === "warning").length;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={toggleSidebar} aria-label="Menu">
          <span /><span /><span />
        </button>
        <div className="topbar-breadcrumb">
          <span className="breadcrumb-root">CloudNet</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-cur">{PAGE_TITLES[page] || page}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-stat">
          <span className="topstat-dot" />
          <span>99.94% uptime</span>
        </div>

        <div className="notif-wrap">
          <button className="notif-btn" onClick={() => setNotifOpen(o => !o)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unread > 0 && <span className="notif-badge">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span>Bildirishnomalar</span>
                <button onClick={() => setNotifOpen(false)}>✕</button>
              </div>
              <div className="notif-list">
                {SECURITY_EVENTS.slice(0, 5).map(ev => (
                  <div key={ev.id} className={`notif-item notif-item--${ev.type}`}>
                    <span className={`notif-dot notif-dot--${ev.type}`} />
                    <div>
                      <div className="notif-msg">{ev.msg}</div>
                      <div className="notif-time">{ev.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="topbar-user">
          <div className="topbar-avatar">{user?.avatar}</div>
          <span className="topbar-uname">{user?.name.split(" ")[0]}</span>
        </div>
      </div>
    </header>
  );
}
