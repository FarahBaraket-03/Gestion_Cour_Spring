export const API = 'http://localhost:8081/api';

export async function apiFetch(url: string, opts: RequestInit = {}) {
  const res = await fetch(API + url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const niveauColors: Record<string, string> = {
  PREMIERE: 'badge-blue', 
  DEUXIEME: 'badge-blue',
  TROISIEME: 'badge-amber', 
  QUATRIEME: 'badge-green', 
  CINQUIEME: 'badge-green'
};

export const specColors: Record<string, string> = {
  INFORMATIQUE: 'badge-blue', 
  AGRICULTURE: 'badge-green', 
  GENIECIVIL: 'badge-amber'
};
