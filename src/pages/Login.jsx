import { useState } from "react";
import { useAuth, useTheme } from "../App";
import { USERS } from "../db";

export default function Login() {
  const { login } = useAuth();
  const { dark, setDark } = useTheme();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const found = USERS.find(u => u.username === form.username && u.password === form.password);
      if (found) {
        login(found);
      } else {
        setError("Username yoki parol noto'g'ri");
        setLoading(false);
      }
    }, 800);
  };

  const quickLogin = (u) => {
    setForm({ username: u.username, password: u.password });
  };

  return (
    <div className="login-bg">
      <div className="login-grid-overlay" />
      <button className="login-theme-btn" onClick={() => setDark(d => !d)} title="Toggle dark mode">
        {dark ? "☀" : "☽"}
      </button>
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="6" fill="currentColor" opacity="0.15"/>
              <path d="M8 20 L8 14 L14 8 L20 14 L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="11" y="15" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
              <circle cx="20" cy="9" r="3" fill="var(--accent)"/>
            </svg>
          </div>
          <div>
            <div className="login-logo-name">CloudNet</div>
            <div className="login-logo-sub">Network Dashboard</div>
          </div>
        </div>

        <h1 className="login-title">Xush kelibsiz</h1>
        <p className="login-desc">Hisobingizga kiring</p>

        {error && <div className="login-error"><span>⚠</span> {error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Username</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="username"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                autoComplete="username"
                required
              />
            </div>
          </div>
          <div className="login-field">
            <label>Parol</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                autoComplete="current-password"
                required
              />
              <button type="button" className="login-eye" onClick={() => setShowPass(s => !s)}>
                {showPass
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="login-spinner" /> : "Kirish →"}
          </button>
        </form>

        <div className="login-demo">
          <p>Tezkor kirish:</p>
          <div className="login-demo-btns">
            {USERS.map(u => (
              <button key={u.id} type="button" className="login-demo-chip" onClick={() => quickLogin(u)}>
                <span className="demo-avatar">{u.avatar}</span>
                <span>
                  <span className="demo-name">{u.name.split(" ")[0]}</span>
                  <span className="demo-role">{u.role}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="login-footer">© 2025 CloudNet — Kiyim-kechak ulgurji kompaniyasi</div>
    </div>
  );
}
