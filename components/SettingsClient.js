'use client';
import { useEffect, useState } from 'react';

const REGIONS = [
  ['US','United States'],['GB','United Kingdom'],['AU','Australia'],['CA','Canada'],
  ['IN','India'],['DE','Germany'],['FR','France'],['JP','Japan'],['BR','Brazil'],
  ['MX','Mexico'],['KR','South Korea'],['MY','Malaysia'],['SG','Singapore'],['ID','Indonesia'],
];

const LANGS = [
  ['','All Languages'],['en','English'],['es','Spanish'],['fr','French'],['de','German'],
  ['ja','Japanese'],['ko','Korean'],['zh','Chinese'],['pt','Portuguese'],['hi','Hindi'],['ar','Arabic'],
];

export default function SettingsClient() {
  const [region, setRegion] = useState('US');
  const [lang, setLang] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      setRegion(localStorage.getItem('bf:region') || 'US');
      setLang(localStorage.getItem('bf:lang') || '');
    } catch {}
  }, []);

  const save = () => {
    try {
      localStorage.setItem('bf:region', region);
      localStorage.setItem('bf:lang', lang);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
  };

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label htmlFor="s-region">Region</label>
        <p className="settings-hint">Determines which streaming providers and availability are shown.</p>
        <select id="s-region" value={region} onChange={e => setRegion(e.target.value)}>
          {REGIONS.map(([v, n]) => <option key={v} value={v}>{n} ({v})</option>)}
        </select>
      </div>

      <div className="settings-group">
        <label htmlFor="s-lang">Content Language</label>
        <p className="settings-hint">Preference for filtering content by original language.</p>
        <select id="s-lang" value={lang} onChange={e => setLang(e.target.value)}>
          {LANGS.map(([v, n]) => <option key={v} value={v}>{n}</option>)}
        </select>
      </div>

      <button className="btn" onClick={save}>{saved ? '✓ Saved!' : 'Save Settings'}</button>
      <p className="settings-note">Settings are stored locally in your browser only.</p>
    </div>
  );
}
