import React, { useEffect, useState } from 'react';
import { apiFetch, specColors } from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, classes: 0, cours: 0, heures: 0 });
  const [recentCours, setRecentCours] = useState<any[]>([]);
  const [niveauCounts, setNiveauCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    setError(false);
    try {
      const [users, classes, cours] = await Promise.all([
        apiFetch('/utilisateurs'),
        apiFetch('/classes'),
        apiFetch('/cours')
      ]);

      const totalH = cours.reduce((s: number, c: any) => s + (c.nbHeures || 0), 0);
      setStats({
        users: users.length,
        classes: classes.length,
        cours: cours.length,
        heures: totalH
      });

      // Recent cours
      setRecentCours(cours.slice(-4).reverse());

      // Niveau bars
      const counts: Record<string, number> = {};
      classes.forEach((cl: any) => {
        counts[cl.niveau] = (counts[cl.niveau] || 0) + 1;
      });
      setNiveauCounts(counts);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const niveaux = ['PREMIERE', 'DEUXIEME', 'TROISIEME', 'QUATRIEME', 'CINQUIEME'];
  const maxNiveau = Math.max(...(Object.values(niveauCounts) as number[]), 1);

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <h2>Tableau de bord</h2>
          <p>Vue globale de l'application FST</p>
        </div>
        <button className="btn btn-secondary" onClick={loadDashboard}>↻ Actualiser</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Utilisateurs</div>
          <div className="stat-value">{error ? '!' : stats.users}</div>
          <div className="stat-sub">étudiants & admins</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Classes</div>
          <div className="stat-value">{error ? '!' : stats.classes}</div>
          <div className="stat-sub">niveaux actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Cours</div>
          <div className="stat-value">{error ? '!' : stats.cours}</div>
          <div className="stat-sub">cours classrooms</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total heures</div>
          <div className="stat-value">{error ? '!' : stats.heures}</div>
          <div className="stat-sub">heures enseignées</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header"><h3>Derniers cours</h3></div>
          <div>
            {loading ? <div className="empty-state">Chargement…</div> : recentCours.length ? (
               <table>
               <thead><tr><th>Nom</th><th>Spécialité</th><th>Heures</th></tr></thead>
               <tbody>
                  {recentCours.map((c, i) => (
                    <tr key={i}>
                      <td>{c.nom}</td>
                      <td><span className={`badge ${specColors[c.specialite] || 'badge-gray'}`}>{c.specialite || '—'}</span></td>
                      <td>{c.nbHeures}h</td>
                    </tr>
                  ))}
               </tbody>
             </table>
            ) : <div className="empty-state">Aucun cours</div>}
          </div>
        </div>
        
        <div className="card">
          <div className="card-header"><h3>Répartition par niveau</h3></div>
          <div className="card-body">
            {loading ? <div className="empty-state">Chargement…</div> : niveaux.map(nv => (
               <div className="metric-row" key={nv}>
                 <div className="metric-label">{nv}</div>
                 <div className="metric-bar-wrap">
                   <div className="metric-bar" style={{ width: `${Math.round((niveauCounts[nv] || 0) / maxNiveau * 100)}%` }}></div>
                 </div>
                 <div className="metric-val">{niveauCounts[nv] || 0}</div>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
