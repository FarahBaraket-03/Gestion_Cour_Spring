import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Utilisateurs from './pages/Utilisateurs';
import Classes from './pages/Classes';
import Cours from './pages/Cours';
import Affectations from './pages/Affectations';
import Stats from './pages/Stats';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'utilisateurs' && <Utilisateurs />}
        {activePage === 'classes' && <Classes />}
        {activePage === 'cours' && <Cours />}
        {activePage === 'affectations' && <Affectations />}
        {activePage === 'stats' && <Stats />}
      </main>
    </>
  );
}

