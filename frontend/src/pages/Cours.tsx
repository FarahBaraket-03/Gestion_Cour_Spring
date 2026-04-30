import React, { useEffect, useState } from 'react';
import { apiFetch, specColors } from '../lib/api';

export default function Cours() {
  const [cours, setCours] = useState<any[]>([]);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nom: '', specialite: '', nbHeures: '', codeClasse: '' });
  const [alert, setAlert] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursData, classesData] = await Promise.all([
        apiFetch('/cours'),
        apiFetch('/classes')
      ]);
      setCours(coursData || []);
      setClassesList(classesData || []);
    } catch (e) {
      setAlert({ msg: 'Erreur de connexion au serveur', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAjouter = async () => {
    if (!form.nom || !form.specialite || !form.nbHeures || !form.codeClasse) {
      return setAlert({ msg: 'Tous les champs sont requis', type: 'error' });
    }
    try {
      await apiFetch(`/cours?codeClasse=${form.codeClasse}`, {
        method: 'POST',
        body: JSON.stringify({
          nom: form.nom,
          specialite: form.specialite,
          nbHeures: parseInt(form.nbHeures),
          archive: false
        })
      });
      setAlert({ msg: 'Cours ajouté avec succès !', type: 'success' });
      setForm({ nom: '', specialite: '', nbHeures: '', codeClasse: '' });
      loadData();
    } catch (e: any) {
      setAlert({ msg: 'Erreur : ' + e.message, type: 'error' });
    }
  };

  const handleDesaffecter = async (id: number) => {
    if (!confirm('Désaffecter ce cours de sa classe ?')) return;
    try {
      await apiFetch('/cours/desaffecter/' + id, { method: 'PUT' });
      loadData();
    } catch (e) {
      alert('Erreur');
    }
  };

  const handleAffecter = async (idCours: number) => {
    const codeClasse = prompt('Entrez le code de la classe :');
    if (!codeClasse) return;
    try {
      await apiFetch(`/cours/affecter/${idCours}?codeClasse=${codeClasse}`, { method: 'PUT' });
      setAlert({ msg: 'Cours affecté avec succès !', type: 'success' });
      loadData();
    } catch (e: any) {
      setAlert({ msg: 'Erreur : ' + e.message, type: 'error' });
    }
  };

  const handleSupprimer = async (id: number) => {
    if (!confirm('Supprimer ce cours ?')) return;
    try {
      await apiFetch('/cours/' + id, { method: 'DELETE' });
      loadData();
    } catch (e) {
      alert('Erreur suppression');
    }
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <h2>Cours Classrooms</h2>
          <p>Gérer les cours et les affecter aux classes</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header"><h3>Ajouter un cours</h3></div>
        <div className="card-body">
          {alert && <div className={`alert alert-${alert.type} show`}>{alert.msg}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label>Nom</label>
              <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="Programmation C" />
            </div>
            <div className="form-group">
              <label>Spécialité</label>
              <select value={form.specialite} onChange={e => setForm({...form, specialite: e.target.value})}>
                <option value="">-- Sélectionner --</option>
                <option value="INFORMATIQUE">INFORMATIQUE</option>
                <option value="GENIECIVIL">GENIECIVIL</option>
                <option value="AGRICULTURE">AGRICULTURE</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nb Heures</label>
              <input type="number" value={form.nbHeures} onChange={e => setForm({...form, nbHeures: e.target.value})} placeholder="42" />
            </div>
            <div className="form-group">
              <label>Classe (codeClasse)</label>
              <select value={form.codeClasse} onChange={e => setForm({...form, codeClasse: e.target.value})}>
                <option value="">-- Classe --</option>
                {classesList.map(c => (
                  <option key={c.codeClasse} value={c.codeClasse}>{c.titre} ({c.niveau})</option>
                ))}
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
          <h3>Liste des cours</h3>
          <button className="btn btn-secondary btn-sm" onClick={loadData}>↻</button>
        </div>
        <div>
          {loading ? <div className="empty-state">Chargement…</div> : cours.length ? (
            <table>
              <thead><tr><th>ID</th><th>Nom</th><th>Spécialité</th><th>Heures</th><th>Classe</th><th>Archivé</th><th>Actions</th></tr></thead>
              <tbody>
                {cours.map(c => (
                  <tr key={c.idCours}>
                    <td style={{ color: 'var(--muted)', fontSize: '12px' }}>#{c.idCours}</td>
                    <td>{c.nom}</td>
                    <td><span className={`badge ${specColors[c.specialite] || 'badge-gray'}`}>{c.specialite || '—'}</span></td>
                    <td>{c.nbHeures}h</td>
                    <td>
                      {c.classe ? (
                        <span className="badge badge-blue">{c.classe.titre}</span>
                      ) : (
                        <span className="badge badge-gray">Non affecté</span>
                      )}
                    </td>
                    <td><span className={`badge ${c.archive ? 'badge-amber' : 'badge-green'}`}>{c.archive ? 'Oui' : 'Non'}</span></td>
                    <td className="action-row">
                      {c.classe ? (
                        <button className="btn btn-secondary btn-sm" onClick={() => handleDesaffecter(c.idCours)}>Désaffecter</button>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => handleAffecter(c.idCours)}>Affecter</button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleSupprimer(c.idCours)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="empty-state">Aucun cours</div>}
        </div>
      </div>
    </div>
  );
}
