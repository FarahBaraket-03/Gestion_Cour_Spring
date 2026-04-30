import React, { useEffect, useState } from 'react';
import { apiFetch, niveauColors } from '../lib/api';

export default function Classes() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ titre: '', niveau: '' });
  const [alert, setAlert] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/classes');
      setClasses(data || []);
    } catch (e) {
      setAlert({ msg: 'Erreur de connexion au serveur', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleAjouter = async () => {
    if (!form.titre || !form.niveau) {
      return setAlert({ msg: 'Tous les champs sont requis', type: 'error' });
    }
    try {
      await apiFetch('/classes', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setAlert({ msg: 'Classe ajoutée avec succès !', type: 'success' });
      setForm({ titre: '', niveau: '' });
      loadClasses();
    } catch (e: any) {
      setAlert({ msg: 'Erreur : ' + e.message, type: 'error' });
    }
  };

  const handleSupprimer = async (id: number) => {
    if (!confirm('Supprimer cette classe ?')) return;
    try {
      await apiFetch('/classes/' + id, { method: 'DELETE' });
      loadClasses();
    } catch (e) {
      alert('Erreur suppression');
    }
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <h2>Classes</h2>
          <p>Gérer les classes par niveau</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header"><h3>Ajouter une classe</h3></div>
        <div className="card-body">
          {alert && <div className={`alert alert-${alert.type} show`}>{alert.msg}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label>Titre</label>
              <input value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} placeholder="4AG1" />
            </div>
            <div className="form-group">
              <label>Niveau</label>
              <select value={form.niveau} onChange={e => setForm({...form, niveau: e.target.value})}>
                <option value="">-- Sélectionner --</option>
                <option value="PREMIERE">PREMIERE</option>
                <option value="DEUXIEME">DEUXIEME</option>
                <option value="TROISIEME">TROISIEME</option>
                <option value="QUATRIEME">QUATRIEME</option>
                <option value="CINQUIEME">CINQUIEME</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleAjouter}>+ Ajouter</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Liste des classes</h3>
          <button className="btn btn-secondary btn-sm" onClick={loadClasses}>↻</button>
        </div>
        <div>
          {loading ? <div className="empty-state">Chargement…</div> : classes.length ? (
            <table>
              <thead><tr><th>Code</th><th>Titre</th><th>Niveau</th><th>Actions</th></tr></thead>
              <tbody>
                {classes.map(c => (
                  <tr key={c.codeClasse}>
                    <td style={{ color: 'var(--muted)', fontSize: '12px' }}>#{c.codeClasse}</td>
                    <td><strong>{c.titre}</strong></td>
                    <td><span className={`badge ${niveauColors[c.niveau] || 'badge-gray'}`}>{c.niveau || '—'}</span></td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleSupprimer(c.codeClasse)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="empty-state">Aucune classe</div>}
        </div>
      </div>
    </div>
  );
}
