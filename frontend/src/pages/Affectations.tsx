import React, { useEffect, useState } from 'react';
import { apiFetch, niveauColors, specColors } from '../lib/api';

export default function Affectations() {
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [coursNonAffectes, setCoursNonAffectes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Formulaire affectation utilisateur
  const [formUser, setFormUser] = useState({ idUtilisateur: '', codeClasse: '' });
  const [alertUser, setAlertUser] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);
  
  // Formulaire affectation cours
  const [formCours, setFormCours] = useState({ idCours: '', codeClasse: '' });
  const [alertCours, setAlertCours] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, classesData, coursData] = await Promise.all([
        apiFetch('/utilisateurs'),
        apiFetch('/classes'),
        apiFetch('/cours')
      ]);
      setUtilisateurs(usersData || []);
      setClasses(classesData || []);
      // Filtrer les cours non affectés (ceux sans classe)
      const nonAffectes = (coursData || []).filter((c: any) => !c.classe);
      setCoursNonAffectes(nonAffectes);
    } catch (e) {
      console.error('Erreur de chargement:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAffecterUtilisateur = async () => {
    if (!formUser.idUtilisateur || !formUser.codeClasse) {
      return setAlertUser({ msg: 'Veuillez sélectionner un utilisateur et une classe', type: 'error' });
    }
    try {
      await apiFetch(`/affecter?idUtilisateur=${formUser.idUtilisateur}&codeClasse=${formUser.codeClasse}`, {
        method: 'POST'
      });
      setAlertUser({ msg: 'Utilisateur affecté avec succès !', type: 'success' });
      setFormUser({ idUtilisateur: '', codeClasse: '' });
      loadData();
    } catch (e: any) {
      setAlertUser({ msg: 'Erreur : ' + e.message, type: 'error' });
    }
  };

  const handleAffecterCours = async () => {
    if (!formCours.idCours || !formCours.codeClasse) {
      return setAlertCours({ msg: 'Veuillez sélectionner un cours et une classe', type: 'error' });
    }
    try {
      await apiFetch(`/cours/affecter/${formCours.idCours}?codeClasse=${formCours.codeClasse}`, {
        method: 'PUT'
      });
      setAlertCours({ msg: 'Cours affecté avec succès !', type: 'success' });
      setFormCours({ idCours: '', codeClasse: '' });
      loadData();
    } catch (e: any) {
      setAlertCours({ msg: 'Erreur : ' + e.message, type: 'error' });
    }
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <h2>Affectations</h2>
          <p>Affecter des utilisateurs et des cours aux classes</p>
        </div>
      </div>

      {/* Section Affecter Utilisateur */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3>Affecter un utilisateur à une classe</h3>
        </div>
        <div className="card-body">
          {alertUser && <div className={`alert alert-${alertUser.type} show`}>{alertUser.msg}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label>Utilisateur</label>
              <select 
                value={formUser.idUtilisateur} 
                onChange={e => setFormUser({...formUser, idUtilisateur: e.target.value})}
              >
                <option value="">-- Sélectionner un utilisateur --</option>
                {utilisateurs.map(u => (
                  <option key={u.idUtilisateur} value={u.idUtilisateur}>
                    {u.prenom} {u.nom} (ID: {u.idUtilisateur})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Classe</label>
              <select 
                value={formUser.codeClasse} 
                onChange={e => setFormUser({...formUser, codeClasse: e.target.value})}
              >
                <option value="">-- Sélectionner une classe --</option>
                {classes.map(c => (
                  <option key={c.codeClasse} value={c.codeClasse}>
                    {c.titre} - {c.niveau} (Code: {c.codeClasse})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleAffecterUtilisateur}>
              ✓ Affecter Utilisateur
            </button>
          </div>
        </div>
      </div>

      {/* Section Affecter Cours */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3>Affecter un cours à une classe</h3>
          <span className="badge badge-amber">{coursNonAffectes.length} cours non affectés</span>
        </div>
        <div className="card-body">
          {alertCours && <div className={`alert alert-${alertCours.type} show`}>{alertCours.msg}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label>Cours (non affectés)</label>
              <select 
                value={formCours.idCours} 
                onChange={e => setFormCours({...formCours, idCours: e.target.value})}
              >
                <option value="">-- Sélectionner un cours --</option>
                {coursNonAffectes.map(c => (
                  <option key={c.idCours} value={c.idCours}>
                    {c.nom} - {c.specialite} ({c.nbHeures}h) [ID: {c.idCours}]
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Classe</label>
              <select 
                value={formCours.codeClasse} 
                onChange={e => setFormCours({...formCours, codeClasse: e.target.value})}
              >
                <option value="">-- Sélectionner une classe --</option>
                {classes.map(c => (
                  <option key={c.codeClasse} value={c.codeClasse}>
                    {c.titre} - {c.niveau} (Code: {c.codeClasse})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleAffecterCours}>
              ✓ Affecter Cours
            </button>
          </div>
        </div>
      </div>

      {/* Liste des cours non affectés */}
      <div className="card">
        <div className="card-header">
          <h3>Cours non affectés (classe = null)</h3>
          <button className="btn btn-secondary btn-sm" onClick={loadData}>↻</button>
        </div>
        <div>
          {loading ? (
            <div className="empty-state">Chargement…</div>
          ) : coursNonAffectes.length ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Spécialité</th>
                  <th>Heures</th>
                  <th>Archivé</th>
                </tr>
              </thead>
              <tbody>
                {coursNonAffectes.map(c => (
                  <tr key={c.idCours}>
                    <td style={{ color: 'var(--muted)', fontSize: '12px' }}>#{c.idCours}</td>
                    <td>{c.nom}</td>
                    <td>
                      <span className={`badge ${specColors[c.specialite] || 'badge-gray'}`}>
                        {c.specialite || '—'}
                      </span>
                    </td>
                    <td>{c.nbHeures}h</td>
                    <td>
                      <span className={`badge ${c.archive ? 'badge-amber' : 'badge-green'}`}>
                        {c.archive ? 'Oui' : 'Non'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">Tous les cours sont affectés ✓</div>
          )}
        </div>
      </div>
    </div>
  );
}
