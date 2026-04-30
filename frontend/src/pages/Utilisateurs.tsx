import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function Utilisateurs() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ prenom: '', nom: '', password: '' });
  const [alert, setAlert] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  const loadUtilisateurs = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/utilisateurs');
      setUsers(data || []);
    } catch (e) {
      setAlert({ msg: 'Erreur de connexion au serveur', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUtilisateurs();
  }, []);

  const handleAjouter = async () => {
    if (!form.prenom || !form.nom || !form.password) {
      return setAlert({ msg: 'Tous les champs sont requis', type: 'error' });
    }
    try {
      await apiFetch('/utilisateurs', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setAlert({ msg: 'Utilisateur ajouté avec succès !', type: 'success' });
      setForm({ prenom: '', nom: '', password: '' });
      loadUtilisateurs();
    } catch (e: any) {
      setAlert({ msg: 'Erreur : ' + e.message, type: 'error' });
    }
  };

  const handleSupprimer = async (id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await apiFetch('/utilisateurs/' + id, { method: 'DELETE' });
      loadUtilisateurs();
    } catch (e) {
      alert('Erreur suppression');
    }
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <h2>Utilisateurs</h2>
          <p>Gérer les étudiants et administrateurs</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header"><h3>Ajouter un utilisateur</h3></div>
        <div className="card-body">
          {alert && <div className={`alert alert-${alert.type} show`}>{alert.msg}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label>Prénom</label>
              <input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} placeholder="Amna" />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="Ammar" />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} type="password" placeholder="••••••" />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleAjouter}>+ Ajouter</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Liste des utilisateurs</h3>
          <button className="btn btn-secondary btn-sm" onClick={loadUtilisateurs}>↻</button>
        </div>
        <div>
          {loading ? <div className="empty-state">Chargement…</div> : users.length ? (
            <table>
              <thead><tr><th>ID</th><th>Prénom</th><th>Nom</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.idUtilisateur}>
                    <td style={{ color: 'var(--muted)', fontSize: '12px' }}>#{u.idUtilisateur}</td>
                    <td>{u.prenom}</td>
                    <td>{u.nom}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleSupprimer(u.idUtilisateur)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="empty-state">Aucun utilisateur</div>}
        </div>
      </div>
    </div>
  );
}
