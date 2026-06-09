import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Chat from './pages/Chat';
import Ingest from './pages/Ingest';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Audit from './pages/Audit';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="logo">
              <div className="logo-mark">⚕</div>
              <div>
                <div className="logo-title">CTMC</div>
                <div className="logo-sub">Clinical Trial Memory</div>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Workspace</div>
            <NavLink to="/" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <span className="nav-icon">💬</span> Memory Recall
            </NavLink>
            <NavLink to="/ingest" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <span className="nav-icon">📋</span> Log Session
            </NavLink>
            <NavLink to="/alerts" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <span className="nav-icon">🚨</span> Alerts
            </NavLink>
            <NavLink to="/reports" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <span className="nav-icon">📄</span> Reports
            </NavLink>
            <NavLink to="/audit" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <span className="nav-icon">🔍</span> Audit Trail
            </NavLink>
          </nav>
          <div className="sidebar-footer">
            <div className="trial-pill">
              <div className="trial-dot"/>
              <div>
                <div className="trial-name">TRIAL-001</div>
                <div className="trial-status">Active · Phase II</div>
              </div>
            </div>
          </div>
        </aside>
        <div className="main-wrapper">
          <header className="topbar">
            <div className="topbar-left">
              <Routes>
                <Route path="/" element={<span className="topbar-page">Memory Recall</span>} />
                <Route path="/ingest" element={<span className="topbar-page">Log Session</span>} />
                <Route path="/alerts" element={<span className="topbar-page">Alerts</span>} />
                <Route path="/reports" element={<span className="topbar-page">Report Generator</span>} />
                <Route path="/audit" element={<span className="topbar-page">Audit Trail</span>} />
              </Routes>
            </div>
            <div className="topbar-right">
              <div className="agent-pill">
                <span className="agent-avatar">🧠</span>
                <div>
                  <div className="agent-name">Memory Agent — Patient P042</div>
                  <div className="agent-status"><span className="status-dot"/>Online · TRIAL-001</div>
                </div>
              </div>
            </div>
          </header>
          <main className="main">
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/ingest" element={<Ingest />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/audit" element={<Audit />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
