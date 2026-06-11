import { useAuth, useTheme } from "../App";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { id: "network", label: "Tarmoq", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4M12 11l-7 6M12 11l7 6"/></svg> },
  { id: "analytics", label: "Tahlil", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { id: "map", label: "Xarita", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> },
];

export default function Sidebar({ page, setPage, open, setOpen }) {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();

  return (
    <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <path d="M8 20 L8 14 L14 8 L20 14 L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="11" y="15" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
              <circle cx="20" cy="9" r="3" fill="var(--accent)"/>
            </svg>
          </div>
          <div>
            <div className="sidebar-logo-name">RETAKENET</div>
            <div className="sidebar-logo-sub">v2.1.0</div>
          </div>
        </div>
        <button className="sidebar-close-btn" onClick={() => setOpen(false)}>✕</button>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-item ${page === item.id ? "nav-item--active" : ""}`}
            onClick={() => { setPage(item.id); setOpen(false); }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {page === item.id && <span className="nav-active-bar" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-status">
        <div className="status-dot-row">
          <span className="status-dot status-dot--green" />
          <span>Tizim ishlayapti</span>
        </div>
        <div className="status-dot-row">
          <span className="status-dot status-dot--green" />
          <span>4/4 VPN aktiv</span>
        </div>
        <div className="status-dot-row">
          <span className="status-dot status-dot--yellow" />
          <span>Andijon: sekin</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={() => setDark(d => !d)}>
          {dark
            ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Kunduzgi</>
            : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Tungi</>
          }
        </button>
        <div className="sidebar-user">
          <div className="user-avatar">{user?.avatar}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Chiqish">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
