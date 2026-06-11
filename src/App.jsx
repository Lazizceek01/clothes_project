import { useState, useEffect, createContext, useContext } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Network from "./pages/Network";
import Analytics from "./pages/Analytics";
import MapView from "./pages/MapView";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export const AuthContext = createContext(null);
export const ThemeContext = createContext(null);

export function useAuth() { return useContext(AuthContext); }
export function useTheme() { return useContext(ThemeContext); }

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("cloudnet_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [dark, setDark] = useState(() => localStorage.getItem("cloudnet_dark") !== "false");
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("cloudnet_dark", dark);
  }, [dark]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("cloudnet_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cloudnet_user");
    setPage("dashboard");
  };

  if (!user) return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ThemeContext.Provider value={{ dark, setDark }}>
        <Login />
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );

  const pages = { dashboard: Dashboard, network: Network, analytics: Analytics, map: MapView };
  const PageComponent = pages[page] || Dashboard;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ThemeContext.Provider value={{ dark, setDark }}>
        <div className="app-shell">
          <Sidebar page={page} setPage={setPage} open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="main-area">
            <Topbar page={page} toggleSidebar={() => setSidebarOpen(o => !o)} />
            <main className="page-content">
              <PageComponent setPage={setPage} />
            </main>
          </div>
          {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        </div>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
