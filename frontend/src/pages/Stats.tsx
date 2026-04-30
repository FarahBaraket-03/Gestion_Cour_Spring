import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function Stats() {
  const [users, setUsers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [cours, setCours] = useState<any[]>([]);
  
  const [statNiveau, setStatNiveau] = useState('QUATRIEME');
  const [nbUsersResult, setNbUsersResult] = useState<string | null>(null);

  const [statSpec, setStatSpec] = useState('AGRICULTURE');
  const [statHeuresNiv, setStatHeuresNiv] = useState('QUATRIEME');
  const [heuresResult, setHeuresResult] = useState<string | null>(null);

  const [affUser, setAffUser] = useState('');
  const [affClasse, setAffClasse] = useState('');
  const [alertAffecter, setAlertAffecter] = useState<{ msg: string, type: string } | null>(null);

  const [desaffCours, setDesaffCours] = useState('');
  const [alertDesaff, setAlertDesaff] = useState<{ msg: string, type: string } | null>(null);

  const loadSelects = async () => {
    try {
      const [usersData, classesData, coursData] = await Promise.all([
        apiFetch('/utilisateurs'),
        apiFetch('/classes'),
        apiFetch('/cours')
      ]);
      setUsers(usersData || []);
      setClasses(classesData || []);
      setCours(coursData || []);
    } catch (e) {}
  };

  useEffect(() => {
    loadSelects();
  }, []);

  const queryNbUtilisateurs = async () => {
    try {
      const res = await apiFetch('/utilisateurs/niveau?nv=' + statNiveau);
      setNbUsersResult(res);
    } catch (e) {
      setNbUsersResult('Erreur');
    }
  };

  const queryNbHeures = async () => {
    try {
      const res = await apiFetch(`/cours/heures?sp=${statSpec}&nv=${statHeuresNiv}`);
      setHeuresResult(res);
    } catch (e) {
      setHeuresResult('Erreur');
    }
  };

  const affecterUtilisateur = async () => {
    if (!affUser || !affClasse) return setAlertAffecter({ msg: 'Veuillez sélectionner un utilisateur et une classe', type: 'error' });
    try {
      await apiFetch(`/affecter?idUtilisateur=${affUser}&codeClasse=${affClasse}`, { method: 'POST' });
      setAlertAffecter({ msg: 'Utilisateur affecté avec succès !', type: 'success' });
    } catch (e: any) {
      setAlertAffecter({ msg: 'Erreur : ' + e.message, type: 'error' });
    }
  };

  const desaffecterCours = async () => {
    if (!desaffCours) return;
    try {
      await apiFetch('/cours/desaffecter/' + desaffCours, { method: 'PUT' });
      setAlertDesaff({ msg: 'Cours désaffecté avec succès !', type: 'success' });
      loadSelects();
    } catch (e: any) {
      setAlertDesaff({ msg: 'Erreur : ' + e.message, type: 'error' });
    }
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <h2>Statistiques</h2>
          <p>Analyses et requêtes métier</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* e) nbUtilisateursParNiveau */}
        <div className="card">
          <div className="card-header"><h3>Utilisateurs par niveau</h3></div>
          <div className="card-body">
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label>Niveau</label>
              <select value={statNiveau} onChange={e => setStatNiveau(e.target.value)}>
                <option value="PREMIERE">PREMIERE</option>
                <option value="DEUXIEME">DEUXIEME</option>
                <option value="TROISIEME">TROISIEME</option>
                <option value="QUATRIEME">QUATRIEME</option>
                <option value="CINQUIEME">CINQUIEME</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={queryNbUtilisateurs}>Calculer</button>
            {nbUsersResult !== null && (
              <div style={{ marginTop: '16px', fontSize: '28px', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                {nbUsersResult === 'Erreur' ? 'Erreur' : (
                  <>
                    <span style={{ color: 'var(--accent)' }}>{nbUsersResult}</span> 
                    <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--muted)' }}> utilisateur(s) en {statNiveau}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* h) nbHeuresParSpecEtNiv */}
        <div className="card">
          <div className="card-header"><h3>Heures par spécialité & niveau</h3></div>
          <div className="card-body">
            <div className="form-grid" style={{ marginBottom: '14px' }}>
              <div className="form-group">
                <label>Spécialité</label>
                <select value={statSpec} onChange={e => setStatSpec(e.target.value)}>
                  <option value="INFORMATIQUE">INFORMATIQUE</option>
                  <option value="GENIECIVIL">GENIECIVIL</option>
                  <option value="AGRICULTURE">AGRICULTURE</option>
                </select>
              </div>
              <div className="form-group">
                <label>Niveau</label>
                <select value={statHeuresNiv} onChange={e => setStatHeuresNiv(e.target.value)}>
                  <option value="PREMIERE">PREMIERE</option>
                  <option value="DEUXIEME">DEUXIEME</option>
                  <option value="TROISIEME">TROISIEME</option>
                  <option value="QUATRIEME">QUATRIEME</option>
                  <option value="CINQUIEME">CINQUIEME</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={queryNbHeures}>Calculer</button>
            {heuresResult !== null && (
              <div style={{ marginTop: '16px', fontSize: '28px', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                {heuresResult === 'Erreur' ? 'Erreur' : (
                  <>
                    <span style={{ color: 'var(--accent)' }}>{heuresResult}h</span> 
                    <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--muted)' }}> {statSpec} / {statHeuresNiv}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* d) Affecter utilisateur */}
        <div className="card">
          <div className="card-header"><h3>Affecter utilisateur à classe</h3></div>
          <div className="card-body">
            {alertAffecter && <div className={`alert alert-${alertAffecter.type} show`}>{alertAffecter.msg}</div>}
            <div className="form-grid" style={{ marginBottom: '14px' }}>
              <div className="form-group">
                <label>Utilisateur</label>
                <select value={affUser} onChange={e => setAffUser(e.target.value)}>
                  <option value="">-- Utilisateur --</option>
                  {users.map(u => <option key={u.idUtilisateur} value={u.idUtilisateur}>{u.prenom} {u.nom}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Classe</label>
                <select value={affClasse} onChange={e => setAffClasse(e.target.value)}>
                  <option value="">-- Classe --</option>
                  {classes.map(c => <option key={c.codeClasse} value={c.codeClasse}>{c.titre}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={affecterUtilisateur}>Affecter</button>
          </div>
        </div>

        {/* f) Désaffecter cours */}
        <div className="card">
          <div className="card-header"><h3>Désaffecter un cours</h3></div>
          <div className="card-body">
            {alertDesaff && <div className={`alert alert-${alertDesaff.type} show`}>{alertDesaff.msg}</div>}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label>Cours à désaffecter</label>
              <select value={desaffCours} onChange={e => setDesaffCours(e.target.value)}>
                <option value="">-- Sélectonner un cours --</option>
                {cours.map(c => <option key={c.idCours} value={c.idCours}>{c.nom} ({c.specialite})</option>)}
              </select>
            </div>
            <button className="btn btn-danger" onClick={desaffecterCours}>Désaffecter</button>
          </div>
        </div>

      </div>
    </div>
  );
}
