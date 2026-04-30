import React from 'react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>FST Gestion</h1>
        <p>Cours & Classrooms</p>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">Tableau de bord</div>
        <button 
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} 
          onClick={() => setActivePage('dashboard')}
        >
          <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/>
          </svg>
          Vue d'ensemble
        </button>
        
        <div className="nav-section">Entités</div>
        
        <button 
          className={`nav-item ${activePage === 'utilisateurs' ? 'active' : ''}`} 
          onClick={() => setActivePage('utilisateurs')}
        >
          <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="10" cy="7" r="3.5"/><path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"/>
          </svg>
          Utilisateurs
        </button>
        
        <button 
          className={`nav-item ${activePage === 'classes' ? 'active' : ''}`} 
          onClick={() => setActivePage('classes')}
        >
          <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="16" height="12" rx="2"/><path d="M7 8h6M7 12h4"/>
          </svg>
          Classes
        </button>
        
        <button 
          className={`nav-item ${activePage === 'cours' ? 'active' : ''}`} 
          onClick={() => setActivePage('cours')}
        >
          <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6h12M4 10h12M4 14h7"/><circle cx="15" cy="14" r="2.5"/>
          </svg>
          Cours Classrooms
        </button>
        
        <button 
          className={`nav-item ${activePage === 'affectations' ? 'active' : ''}`} 
          onClick={() => setActivePage('affectations')}
        >
          <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 3v14M3 10h14"/><circle cx="10" cy="10" r="7.5"/>
          </svg>
          Affectations
        </button>
        
        <div className="nav-section">Analyses</div>
        
        <button 
          className={`nav-item ${activePage === 'stats' ? 'active' : ''}`} 
          onClick={() => setActivePage('stats')}
        >
          <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 16V10M8 16V4M12 16V8M16 16v-4"/>
          </svg>
          Statistiques
        </button>
      </nav>
    </aside>
  );
}
