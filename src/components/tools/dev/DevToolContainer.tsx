"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '../shared/ToolLayout';
import { TextBox } from '../shared/TextBox';
import { ResultBox } from '../shared/ResultBox';
import { Button } from '@/components/ui/Button';
import { format as formatSql } from 'sql-formatter';
import { sanitizeHtml } from '@/lib/sanitization';
import { useHtmlPreviewerStore } from '@/store/useCompilerStore';
import { MonacoEditorWrapper } from '../shared/MonacoEditorWrapper';
import { DevicePreviewFrame } from '../shared/DevicePreviewFrame';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Play, Download, Layout, FileJson, AlignLeft, Image as ImageIcon } from 'lucide-react';
import { saveAs } from 'file-saver';
import { getDevContent } from './devContent';

interface DevToolContainerProps {
  toolId: string;
  toolName: string;
  toolDescription: string;
}

// Color conversion helpers
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const sanitized = hex.trim().replace('#', '');
  if (sanitized.length !== 3 && sanitized.length !== 6) return null;
  const r = parseInt(sanitized.length === 3 ? sanitized[0] + sanitized[0] : sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.length === 3 ? sanitized[1] + sanitized[1] : sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.length === 3 ? sanitized[2] + sanitized[2] : sanitized.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function CronGeneratorUI() {
  const [expr, setExpr] = useState('* * * * *');
  const [copied, setCopied] = useState(false);

  const fields = [
    { label: 'Minute', range: '0-59', options: ['*', '0', '15', '30', '45', '*/5', '*/10', '*/15', '*/30'] },
    { label: 'Hour', range: '0-23', options: ['*', '0', '6', '8', '9', '12', '18', '23', '*/2', '*/6', '*/12'] },
    { label: 'Day', range: '1-31', options: ['*', '1', '15', 'L', '*/2', '*/7'] },
    { label: 'Month', range: '1-12', options: ['*', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
    { label: 'Weekday', range: '0-7', options: ['*', '0', '1', '2', '3', '4', '5', '6', '1-5'] },
  ];

  const parts = expr.trim().split(/\s+/);
  while (parts.length < 5) parts.push('*');

  const updateField = (idx: number, val: string) => {
    const p = expr.trim().split(/\s+/);
    while (p.length < 5) p.push('*');
    p[idx] = val;
    setExpr(p.join(' '));
  };

  const explain = () => {
    const p = expr.trim().split(/\s+/);
    while (p.length < 5) p.push('*');
    const [m, h, d, mo, wd] = p;
    const result: string[] = [];
    if (m === '*') result.push('every minute');
    else if (m.startsWith('*/')) result.push(`every ${m.slice(2)} minutes`);
    else result.push(`at minute ${m}`);
    if (h !== '*') {
      if (h.startsWith('*/')) result.push(`every ${h.slice(2)} hours`);
      else result.push(`past hour ${h}`);
    }
    if (d !== '*') result.push(`on day ${d} of the month`);
    const months = ['','January','February','March','April','May','June','July','August','September','October','November','December'];
    if (mo !== '*') result.push(`in ${months[parseInt(mo)] || mo}`);
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    if (wd !== '*') result.push(`on ${wd.includes('-') ? wd : (days[parseInt(wd)] || wd)}`);
    return result.length ? result.join(', ') : 'every minute';
  };

  const copy = () => {
    navigator.clipboard.writeText(expr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 bg-background border border-border rounded-xl p-6 font-sans">
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-bold text-slate uppercase tracking-wider">CRON Expression</label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={expr}
            onChange={e => setExpr(e.target.value)}
            className="flex-1 font-mono text-lg font-bold text-primary bg-surface border border-border rounded-lg px-4 py-3 outline-none focus:border-primary"
            spellCheck={false}
          />
          <button
            onClick={copy}
            className="px-4 py-3 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {fields.map((f, i) => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate uppercase tracking-wider text-center">{f.label}<br/><span className="font-normal normal-case">{f.range}</span></label>
            <select
              value={parts[i] || '*'}
              onChange={e => updateField(i, e.target.value)}
              className="w-full p-2 border border-border rounded-lg bg-surface text-ink text-sm outline-none focus:border-primary text-center"
            >
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2 text-center">
        {['Minute', 'Hour', 'Day', 'Month', 'Weekday'].map((l, i) => (
          <div key={l} className="p-2 bg-surface border border-border rounded-lg">
            <div className="text-lg font-mono font-bold text-primary">{parts[i] || '*'}</div>
            <div className="text-[11px] text-slate">{l}</div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-surface/50 border border-border rounded-xl">
        <p className="text-[12px] font-bold text-slate uppercase tracking-wider mb-1">Translation</p>
        <p className="text-base text-ink font-medium">Runs <span className="text-primary font-bold">{explain()}</span></p>
      </div>

      <div>
        <p className="text-[12px] font-bold text-slate uppercase tracking-wider mb-2">Common Presets</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Every minute', val: '* * * * *' },
            { label: 'Every hour', val: '0 * * * *' },
            { label: 'Every day at midnight', val: '0 0 * * *' },
            { label: 'Every Monday 9am', val: '0 9 * * 1' },
            { label: 'Every 5 minutes', val: '*/5 * * * *' },
            { label: '1st of month', val: '0 0 1 * *' },
          ].map(p => (
            <button
              key={p.val}
              onClick={() => setExpr(p.val)}
              className="px-3 py-1.5 text-[12px] font-medium border border-border rounded-lg bg-surface hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PasswordGeneratorUI() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState<'weak'|'fair'|'strong'|'very strong'>('strong');

  const generatePassword = () => {
    let chars = '';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { setPassword('Select at least one character type'); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    const pw = Array.from(arr).map(n => chars[n % chars.length]).join('');
    setPassword(pw);
    setCopied(false);
    const sets = [useLower, useUpper, useNumbers, useSymbols].filter(Boolean).length;
    if (length < 8 || sets < 2) setStrength('weak');
    else if (length < 12 || sets < 3) setStrength('fair');
    else if (length < 16) setStrength('strong');
    else setStrength('very strong');
  };

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strengthColor = { weak: 'text-red-400', fair: 'text-yellow-400', strong: 'text-green-400', 'very strong': 'text-primary' }[strength];

  return (
    <div className="space-y-5 bg-background border border-border rounded-xl p-6 font-sans">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label className="text-[12px] font-bold text-slate uppercase tracking-wider">Length</label>
          <span className="text-[12px] font-bold text-primary">{length} characters</span>
        </div>
        <input type="range" min={4} max={128} value={length} onChange={e => setLength(Number(e.target.value))}
          className="w-full accent-primary" />
        <div className="flex justify-between text-[11px] text-slate">
          <span>4</span><span>32</span><span>64</span><span>128</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Uppercase (A-Z)', val: useUpper, set: setUseUpper },
          { label: 'Lowercase (a-z)', val: useLower, set: setUseLower },
          { label: 'Numbers (0-9)', val: useNumbers, set: setUseNumbers },
          { label: 'Symbols (!@#...)', val: useSymbols, set: setUseSymbols },
        ].map(({ label, val, set }) => (
          <label key={label} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
            val ? 'border-primary bg-primary/10' : 'border-border bg-surface hover:border-primary/50'
          }`}>
            <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} className="accent-primary" />
            <span className="text-[12px] font-medium text-ink">{label}</span>
          </label>
        ))}
      </div>

      {password && (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl">
            <code className="font-mono text-sm text-ink break-all flex-1 mr-4">{password}</code>
            <button onClick={copy} className="shrink-0 px-3 py-2 bg-primary text-white rounded-lg text-[12px] font-bold hover:bg-primary/90 transition-colors">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-slate">Strength:</span>
            <span className={`text-[12px] font-bold uppercase ${strengthColor}`}>{strength}</span>
          </div>
        </div>
      )}

      <button
        onClick={generatePassword}
        className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
      >
        Generate Password
      </button>
    </div>
  );
}

function BcryptGeneratorUI() {
  const [plaintext, setPlaintext] = useState('');
  const [saltRounds, setSaltRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyHash, setVerifyHash] = useState('');
  const [verifyResult, setVerifyResult] = useState<null | boolean>(null);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateHash = async () => {
    if (!plaintext.trim()) { setError('Please enter a password to hash.'); return; }
    setError(''); setLoading(true); setHash('');
    try {
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(saltRounds);
      const h = await bcrypt.hash(plaintext, salt);
      setHash(h);
    } catch {
      setError('Hashing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async () => {
    if (!plaintext.trim() || !verifyHash.trim()) { setError('Enter both plain text and hash to verify.'); return; }
    setError(''); setVerifying(true); setVerifyResult(null);
    try {
      const bcrypt = await import('bcryptjs');
      const result = await bcrypt.compare(plaintext, verifyHash);
      setVerifyResult(result);
    } catch {
      setError('Verification failed. Make sure the hash is a valid bcrypt hash.');
    } finally {
      setVerifying(false);
    }
  };

  const copyHash = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="space-y-4 bg-background border border-border rounded-xl p-6">
        <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider">Generate Hash</h3>
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-slate">Plain Text Password</label>
          <input
            type="password"
            value={plaintext}
            onChange={e => setPlaintext(e.target.value)}
            placeholder="Enter password to hash..."
            className="w-full p-3 bg-surface border border-border rounded-lg text-ink text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-[12px] font-bold text-slate">Salt Rounds (Cost Factor)</label>
            <span className="text-[12px] font-bold text-primary">{saltRounds} rounds (~{(2**saltRounds / 1000000).toFixed(1)}M operations)</span>
          </div>
          <input type="range" min={8} max={14} value={saltRounds} onChange={e => setSaltRounds(Number(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-[11px] text-slate">
            <span>8 (fast)</span><span>10 (recommended)</span><span>12 (secure)</span><span>14 (slow)</span>
          </div>
        </div>
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        <button
          onClick={generateHash}
          disabled={loading}
          className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Hashing...' : 'Generate Hash'}
        </button>
        {hash && (
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-slate">Generated Hash</label>
            <div className="flex items-start gap-3 p-3 bg-surface border border-border rounded-lg">
              <code className="font-mono text-xs text-primary break-all flex-1">{hash}</code>
              <button onClick={copyHash} className="shrink-0 text-xs font-bold text-primary hover:underline">{copied ? 'Copied!' : 'Copy'}</button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 bg-background border border-border rounded-xl p-6">
        <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider">Verify Hash</h3>
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-slate">Bcrypt Hash</label>
          <input
            type="text"
            value={verifyHash}
            onChange={e => { setVerifyHash(e.target.value); setVerifyResult(null); }}
            placeholder="$2a$10$..."
            className="w-full p-3 bg-surface border border-border rounded-lg text-ink font-mono text-xs outline-none focus:border-primary"
          />
        </div>
        <p className="text-[12px] text-slate">Use the same plain text password from above to verify against this hash.</p>
        <button
          onClick={verifyPassword}
          disabled={verifying}
          className="w-full py-3 bg-surface border border-border text-ink rounded-xl font-bold hover:border-primary transition-colors disabled:opacity-50"
        >
          {verifying ? 'Verifying...' : 'Verify Password'}
        </button>
        {verifyResult !== null && (
          <div className={`p-4 rounded-xl text-center font-bold text-lg border ${
            verifyResult ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {verifyResult ? '✓ Password Matches' : '✗ Password Does Not Match'}
          </div>
        )}
      </div>
    </div>
  );
}

function CssGradientGeneratorUI() {
  const [type, setType] = useState<'linear'|'radial'|'conic'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([
    { color: '#6366f1', pos: 0 },
    { color: '#0ea5e9', pos: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const css = () => {
    const s = [...stops].sort((a,b) => a.pos - b.pos);
    const stopsStr = s.map(st => `${st.color} ${st.pos}%`).join(', ');
    if (type === 'linear') return `linear-gradient(${angle}deg, ${stopsStr})`;
    if (type === 'radial') return `radial-gradient(circle, ${stopsStr})`;
    return `conic-gradient(from ${angle}deg, ${stopsStr})`;
  };

  const addStop = () => setStops(prev => [...prev, { color: '#22d3ee', pos: 50 }]);
  const removeStop = (i: number) => setStops(prev => prev.length > 2 ? prev.filter((_,idx) => idx !== i) : prev);
  const updateStop = (i: number, field: 'color'|'pos', val: string|number) => {
    setStops(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: field === 'pos' ? Number(val) : val } : s));
  };

  const copyCss = () => {
    navigator.clipboard.writeText(`background: ${css()};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 font-sans">
      <div
        className="w-full h-40 rounded-2xl border border-border shadow-inner"
        style={{ background: css() }}
      />

      <div className="flex gap-2">
        {(['linear','radial','conic'] as const).map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${
              type === t ? 'bg-primary text-white' : 'bg-surface border border-border text-ink hover:border-primary'
            }`}
          >{t}</button>
        ))}
      </div>

      {(type === 'linear' || type === 'conic') && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-[12px] font-bold text-slate uppercase tracking-wider">Angle</label>
            <span className="text-[12px] font-bold text-primary">{angle}°</span>
          </div>
          <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))}
            className="w-full accent-primary" />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[12px] font-bold text-slate uppercase tracking-wider">Color Stops</label>
          <button onClick={addStop} className="text-[12px] font-bold text-primary hover:underline">+ Add Stop</button>
        </div>
        {stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-lg">
            <input
              type="color"
              value={stop.color}
              onChange={e => updateStop(i, 'color', e.target.value)}
              className="w-10 h-10 rounded border-0 cursor-pointer p-0 bg-transparent"
            />
            <span className="font-mono text-sm text-ink w-20">{stop.color}</span>
            <input
              type="range" min={0} max={100} value={stop.pos}
              onChange={e => updateStop(i, 'pos', e.target.value)}
              className="flex-1 accent-primary"
            />
            <span className="text-[12px] text-slate w-10 text-right">{stop.pos}%</span>
            {stops.length > 2 && (
              <button onClick={() => removeStop(i)} className="text-red-400 hover:text-red-300 text-lg leading-none">×</button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-[12px] font-bold text-slate uppercase tracking-wider">CSS Code</label>
        <div className="flex items-start gap-3 p-4 bg-surface border border-border rounded-xl">
          <code className="flex-1 font-mono text-sm text-primary break-all">{`background: ${css()};`}</code>
          <button onClick={copyCss} className="shrink-0 text-[12px] font-bold text-primary hover:underline">{copied ? 'Copied!' : 'Copy'}</button>
        </div>
      </div>
    </div>
  );
}

function CssBoxShadowUI() {
  const [shadows, setShadows] = useState([{
    x: 0, y: 4, blur: 16, spread: 0, color: '#000000', opacity: 25, inset: false
  }]);
  const [copied, setCopied] = useState(false);

  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${opacity/100})`;
  };

  const shadowStr = shadows.map(s =>
    `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`
  ).join(', ');

  const cssStr = `box-shadow: ${shadowStr};`;

  const addShadow = () => setShadows(prev => [...prev, { x:4, y:4, blur:8, spread:0, color:'#000000', opacity:20, inset:false }]);
  const removeShadow = (i: number) => setShadows(prev => prev.length > 1 ? prev.filter((_,idx) => idx !== i) : prev);
  const update = (i: number, field: string, val: number | string | boolean) =>
    setShadows(prev => prev.map((s,idx) => idx === i ? { ...s, [field]: val } : s));

  const copy = () => { navigator.clipboard.writeText(cssStr); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex items-center justify-center p-10 bg-surface border border-border rounded-2xl">
        <div
          className="w-32 h-32 bg-background rounded-2xl border border-border/50 transition-all duration-300"
          style={{ boxShadow: shadowStr }}
        />
      </div>

      {shadows.map((s, i) => (
        <div key={i} className="p-4 bg-background border border-border rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-bold text-slate uppercase tracking-wider">Shadow {i+1}</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-[12px] text-ink cursor-pointer">
                <input type="checkbox" checked={s.inset} onChange={e => update(i,'inset',e.target.checked)} className="accent-primary" />
                Inset
              </label>
              {shadows.length > 1 && <button onClick={() => removeShadow(i)} className="text-red-400 text-sm hover:text-red-300">Remove</button>}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label:'X Offset', field:'x', min:-100, max:100, val:s.x },
              { label:'Y Offset', field:'y', min:-100, max:100, val:s.y },
              { label:'Blur', field:'blur', min:0, max:100, val:s.blur },
              { label:'Spread', field:'spread', min:-50, max:50, val:s.spread },
            ].map(({label,field,min,max,val}) => (
              <div key={field} className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate">{label}</span>
                  <span className="text-[11px] font-bold text-primary">{val}px</span>
                </div>
                <input type="range" min={min} max={max} value={val}
                  onChange={e => update(i, field, Number(e.target.value))}
                  className="w-full accent-primary" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate">Color</span>
              <input type="color" value={s.color} onChange={e => update(i,'color',e.target.value)}
                className="w-10 h-10 rounded border-0 cursor-pointer p-0 bg-transparent" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-[11px] text-slate">Opacity</span>
                <span className="text-[11px] font-bold text-primary">{s.opacity}%</span>
              </div>
              <input type="range" min={0} max={100} value={s.opacity}
                onChange={e => update(i,'opacity',Number(e.target.value))}
                className="w-full accent-primary" />
            </div>
          </div>
        </div>
      ))}

      <button onClick={addShadow} className="w-full py-2.5 border-2 border-dashed border-border rounded-xl text-slate hover:border-primary hover:text-primary font-medium text-sm transition-colors">
        + Add Another Shadow Layer
      </button>

      <div className="flex items-start gap-3 p-4 bg-surface border border-border rounded-xl">
        <code className="flex-1 font-mono text-sm text-primary break-all">{cssStr}</code>
        <button onClick={copy} className="shrink-0 text-[12px] font-bold text-primary hover:underline">{copied ? 'Copied!' : 'Copy'}</button>
      </div>
    </div>
  );
}

function ColorContrastCheckerUI() {
  const [fg, setFg] = useState('#ffffff');
  const [bg, setBg] = useState('#0f766e');

  const hexToLinear = (hex: string) => {
    const h = hex.replace('#','');
    if (h.length !== 6 && h.length !== 3) return null;
    const full = h.length === 3 ? h.split('').map(c=>c+c).join('') : h;
    const r = parseInt(full.slice(0,2),16)/255;
    const g = parseInt(full.slice(2,4),16)/255;
    const b = parseInt(full.slice(4,6),16)/255;
    const toLinear = (c: number) => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
    return 0.2126*toLinear(r) + 0.7152*toLinear(g) + 0.0722*toLinear(b);
  };

  const calcRatio = () => {
    const l1 = hexToLinear(fg);
    const l2 = hexToLinear(bg);
    if (l1 === null || l2 === null) return null;
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
  };

  const ratio = calcRatio();
  const valid = ratio !== null;

  const aaNormal = valid && ratio! >= 4.5;
  const aaLarge = valid && ratio! >= 3;
  const aaaNormal = valid && ratio! >= 7;
  const aaaLarge = valid && ratio! >= 4.5;

  const isValidHex = (h: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h);

  return (
    <div className="space-y-5 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[{label:'Foreground (Text)', val:fg, set:setFg, id:'fg'},{label:'Background', val:bg, set:setBg, id:'bg'}].map(({label,val,set,id}) => (
          <div key={id} className="space-y-2">
            <label className="text-[12px] font-bold text-slate uppercase tracking-wider">{label}</label>
            <div className="flex items-center gap-3 p-3 bg-surface border border-border rounded-xl">
              <input type="color" value={isValidHex(val) ? val : '#000000'} onChange={e => set(e.target.value)}
                className="w-10 h-10 rounded border-0 cursor-pointer p-0 bg-transparent shrink-0" />
              <input type="text" value={val} onChange={e => set(e.target.value)}
                className={`flex-1 font-mono text-sm bg-transparent border-b outline-none pb-0.5 ${
                  isValidHex(val) ? 'border-border text-ink' : 'border-red-400 text-red-400'
                }`}
                maxLength={7} />
            </div>
          </div>
        ))}
      </div>

      {valid && isValidHex(fg) && isValidHex(bg) && (
        <div className="rounded-2xl overflow-hidden border border-border">
          <div className="p-6 text-center" style={{ backgroundColor: bg, color: fg }}>
            <p className="text-xl font-bold">The quick brown fox</p>
            <p className="text-sm mt-1">Small text sample — 14px body copy</p>
            <p className="text-[11px] mt-1 opacity-75">Very small caption text for comparison</p>
          </div>
          <div className="p-4 text-center" style={{ backgroundColor: fg, color: bg }}>
            <p className="text-xl font-bold">Inverted preview</p>
            <p className="text-sm">Same colors, inverted</p>
          </div>
        </div>
      )}

      {valid && (
        <>
          <div className="text-center p-6 bg-background border border-border rounded-2xl">
            <p className="text-[12px] font-bold text-slate uppercase tracking-wider mb-2">Contrast Ratio</p>
            <p className="text-5xl font-bold text-primary">{ratio}:1</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'AA Normal', req: '≥ 4.5:1', pass: aaNormal },
              { label: 'AA Large', req: '≥ 3:1', pass: aaLarge },
              { label: 'AAA Normal', req: '≥ 7:1', pass: aaaNormal },
              { label: 'AAA Large', req: '≥ 4.5:1', pass: aaaLarge },
            ].map(({label, req, pass}) => (
              <div key={label} className={`p-4 rounded-xl border text-center ${
                pass ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'
              }`}>
                <div className={`text-2xl font-bold mb-1 ${pass ? 'text-green-400' : 'text-red-400'}`}>{pass ? '✓' : '✗'}</div>
                <div className="text-[12px] font-bold text-ink">{label}</div>
                <div className="text-[11px] text-slate">{req}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SvgOptimizerUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const [copied, setCopied] = useState(false);

  const optimize = () => {
    if (!input.trim()) return;
    setOriginalSize(new Blob([input]).size);
    // Basic optimization: strip XML declaration, doctype, comments, and empty whitespace
    let opt = input
      .replace(/<\?xml.*?\?>/gi, '')
      .replace(/<!DOCTYPE.*?>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/>\s+</g, '><')
      .trim();
    setOutput(opt);
    setNewSize(new Blob([opt]).size);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-slate uppercase tracking-wider">Original SVG</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste raw SVG code here..."
            className="w-full h-64 p-3 bg-surface border border-border rounded-xl text-ink font-mono text-xs outline-none focus:border-primary resize-none"
          />
          <button onClick={optimize} className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
            Optimize SVG
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-slate uppercase tracking-wider">Optimized SVG</label>
          <textarea
            value={output}
            readOnly
            placeholder="Optimized code will appear here..."
            className="w-full h-64 p-3 bg-surface border border-border rounded-xl text-primary font-mono text-xs outline-none resize-none"
          />
          <button onClick={copy} disabled={!output} className="w-full py-3 bg-surface border border-border text-ink rounded-xl font-bold hover:border-primary transition-colors disabled:opacity-50">
            {copied ? '✓ Copied' : 'Copy Output'}
          </button>
        </div>
      </div>
      {output && (
        <div className="flex justify-around items-center p-4 bg-background border border-border rounded-xl">
          <div className="text-center">
            <p className="text-[11px] text-slate uppercase font-bold tracking-wider mb-1">Original</p>
            <p className="text-lg font-bold text-ink">{originalSize} B</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-slate uppercase font-bold tracking-wider mb-1">Optimized</p>
            <p className="text-lg font-bold text-primary">{newSize} B</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-slate uppercase font-bold tracking-wider mb-1">Saved</p>
            <p className="text-lg font-bold text-green-400">
              {originalSize > 0 ? Math.round((1 - newSize / originalSize) * 100) : 0}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PdfImageExtractorUI() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    setLoading(true);
    setError('');
    setImages([]);

    try {
      // @ts-ignore
      const pdfjsLib = await import('pdfjs-dist/build/pdf.min.mjs');
      // Set worker to the CDN
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs';
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const extracted: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const ops = await page.getOperatorList();
        
        for (let i = 0; i < ops.fnArray.length; i++) {
          if (ops.fnArray[i] === pdfjsLib.OPS.paintImageXObject || ops.fnArray[i] === pdfjsLib.OPS.paintInlineImageXObject) {
            try {
              const objId = ops.argsArray[i][0];
              const imgData = await page.objs.get(objId);
              if (imgData && imgData.data) {
                // Convert to canvas
                const canvas = document.createElement('canvas');
                canvas.width = imgData.width;
                canvas.height = imgData.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  const clamped = new Uint8ClampedArray(imgData.data.length);
                  // Determine color space depending on length
                  if (imgData.data.length === imgData.width * imgData.height * 3) {
                     for (let j = 0; j < imgData.data.length / 3; j++) {
                       clamped[j * 4] = imgData.data[j * 3];
                       clamped[j * 4 + 1] = imgData.data[j * 3 + 1];
                       clamped[j * 4 + 2] = imgData.data[j * 3 + 2];
                       clamped[j * 4 + 3] = 255;
                     }
                  } else {
                     for (let j=0; j<imgData.data.length; j++) clamped[j] = imgData.data[j];
                  }
                  const imgDataObj = new ImageData(clamped, imgData.width, imgData.height);
                  ctx.putImageData(imgDataObj, 0, 0);
                  extracted.push(canvas.toDataURL('image/png'));
                }
              }
            } catch (e) {
              console.warn("Failed to extract image on page", pageNum);
            }
          }
        }
      }
      
      if (extracted.length === 0) {
        setError('No extractable images found in this PDF.');
      }
      setImages(extracted);
    } catch (err) {
      console.error(err);
      setError('Failed to process PDF.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = () => {
    images.forEach((img, i) => {
      const a = document.createElement('a');
      a.href = img;
      a.download = `extracted_image_${i + 1}.png`;
      a.click();
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center mb-2">
          <svg className="w-5 h-5 text-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        </div>
        <p className="font-bold text-ink">Select PDF File</p>
        <p className="text-[12px] text-slate">Drop file here or click to browse</p>
        <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files && processFile(e.target.files[0])} />
      </div>

      {loading && (
        <div className="text-center p-8 bg-surface rounded-xl border border-border">
          <p className="text-primary font-bold text-sm animate-pulse">Scanning PDF and extracting images...</p>
        </div>
      )}
      {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-background border border-border p-4 rounded-xl">
            <span className="font-bold text-sm text-ink">{images.length} images extracted</span>
            <button onClick={downloadAll} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
              Download All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((src, i) => (
              <div key={i} className="group relative bg-surface border border-border rounded-xl overflow-hidden aspect-square flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Extracted ${i}`} className="max-w-full max-h-full object-contain" />
                <a href={src} download={`extracted_image_${i + 1}.png`} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="px-3 py-1.5 bg-white text-black font-bold text-xs rounded-md">Download</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DevToolContainer({ toolId, toolName, toolDescription, article }: DevToolContainerProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  
  // Custom states for specific tools
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z]+');
  const [regexFlags, setRegexFlags] = useState('g');
  const [hashType, setHashType] = useState('SHA-256');
  const [unixTime, setUnixTime] = useState<number>(0);
  
  // Color Picker states
  const [colorInput, setColorInput] = useState('#0f766e');
  const [colorRgb, setColorRgb] = useState('rgb(15, 118, 110)');
  const [colorHsl, setColorHsl] = useState('hsl(175, 77%, 26%)');
  const [colorError, setColorError] = useState('');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Code Beautifier language selection
  const [beautifyLanguage, setBeautifyLanguage] = useState<'js' | 'html' | 'css'>('js');
  const [beautifierLoaded, setBeautifierLoaded] = useState(false);

  // UUID states
  const [uuidResult, setUuidResult] = useState('');
  const [copiedUuid, setCopiedUuid] = useState(false);

  // HTML Previewer states & store
  const htmlPreviewStore = useHtmlPreviewerStore();
  const [srcDoc, setSrcDoc] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Dynamic script loader for js-beautify CDN
  useEffect(() => {
    if (toolId !== 'code-beautifier' && toolId !== 'html-previewer') return;

    let active = true;
    const loadScript = (url: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.4/beautify.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.4/beautify-css.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.4/beautify-html.min.js')
    ]).then(() => {
      if (active) setBeautifierLoaded(true);
    }).catch((err) => {
      if (active) setError('Failed to load code beautifier libraries: ' + err.message);
    });

    return () => {
      active = false;
    };
  }, [toolId]);

  // Resize listener for mobile/desktop layout threshold
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // HTML Previewer auto-run logic
  useEffect(() => {
    if (toolId !== 'html-previewer') return;
    if (htmlPreviewStore.autoRun) {
      const timeout = setTimeout(() => {
        setSrcDoc(htmlPreviewStore.html);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [htmlPreviewStore.html, htmlPreviewStore.autoRun, toolId]);
  
  // Reset all states when switching/re-entering tools
  useEffect(() => {
    setInput('');
    setOutput('');
    setError('');
    setRegexPattern('[a-zA-Z]+');
    setRegexFlags('g');
    setHashType('SHA-256');
    setColorInput('#0f766e');
    setColorRgb('rgb(15, 118, 110)');
    setColorHsl('hsl(175, 77%, 26%)');
    setColorError('');
    setCopiedType(null);
    setBeautifyLanguage('js');
    setUuidResult('');
    setCopiedUuid(false);
    if (toolId === 'html-previewer') {
      setSrcDoc(htmlPreviewStore.html);
    } else {
      setSrcDoc('');
    }
  }, [toolId]);

  // Live Unix clock interval
  useEffect(() => {
    if (toolId !== 'unix-time-converter') return;
    setUnixTime(Math.floor(Date.now() / 1000));
    const interval = setInterval(() => {
      setUnixTime(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [toolId]);

  // Auto-run logic for immediate formatters/converters
  useEffect(() => {
    setError('');
    
    if (!input && !['uuid-generator', 'unix-time-converter', 'color-picker-tool'].includes(toolId)) {
      setOutput('');
      return;
    }

    try {
      switch (toolId) {
        case 'json-formatter': {
          const parsed = JSON.parse(input);
          setOutput(JSON.stringify(parsed, null, 2));
          break;
        }
        case 'json-validator': {
          JSON.parse(input);
          setOutput("JSON is Valid.");
          break;
        }
        case 'base64-encoder-decoder': {
          try {
            if (/^[a-zA-Z0-9+/]*={0,2}$/.test(input.trim()) && input.length % 4 === 0) {
              setOutput(decodeURIComponent(escape(atob(input.trim()))));
            } else {
              setOutput(btoa(unescape(encodeURIComponent(input))));
            }
          } catch {
            setOutput(btoa(unescape(encodeURIComponent(input))));
          }
          break;
        }
        case 'url-encoder-decoder': {
          if (input.includes('%')) {
            setOutput(decodeURIComponent(input));
          } else {
            setOutput(encodeURIComponent(input));
          }
          break;
        }
        case 'jwt-decoder': {
          const parts = input.split('.');
          if (parts.length < 2) {
            throw new Error("Invalid JWT token format (must contain at least Header and Payload segments separated by dots).");
          }
          const base64UrlDecode = (str: string) => {
            let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
              base64 += '=';
            }
            return decodeURIComponent(escape(atob(base64)));
          };
          const header = JSON.parse(base64UrlDecode(parts[0]));
          const payload = JSON.parse(base64UrlDecode(parts[1]));
          setOutput(`// HEADER:\n${JSON.stringify(header, null, 2)}\n\n// PAYLOAD:\n${JSON.stringify(payload, null, 2)}`);
          break;
        }
        case 'html-encoder-decoder': {
          if (input.includes('&') && input.includes(';')) {
            const txt = document.createElement("textarea");
            txt.innerHTML = input;
            setOutput(txt.value);
          } else {
            setOutput(input.replace(/[\u00A0-\u9999<>&]/g, (i) => `&#${i.charCodeAt(0)};`));
          }
          break;
        }
        case 'html-minifier':
          setOutput(input.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim());
          break;
        case 'css-minifier':
          setOutput(input.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([\{\}:;,])\s*/g, '$1').trim());
          break;
        case 'js-minifier':
          setOutput(input.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/\s+/g, ' ').trim());
          break;
        case 'hex-to-rgb': {
          const hex = input.trim().replace('#', '');
          if (hex.length !== 3 && hex.length !== 6) {
            throw new Error("Invalid HEX color code (must be 3 or 6 hex characters).");
          }
          const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
          const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
          const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
          setOutput(`rgb(${r}, ${g}, ${b})`);
          break;
        }
        case 'rgb-to-hex': {
          const matches = input.match(/\d+/g);
          if (!matches || matches.length < 3) {
            throw new Error("Please enter three comma-separated numbers (e.g. 255, 255, 255).");
          }
          const r = Math.min(255, Math.max(0, parseInt(matches[0])));
          const g = Math.min(255, Math.max(0, parseInt(matches[1])));
          const b = Math.min(255, Math.max(0, parseInt(matches[2])));
          const hex = "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
          setOutput(hex.toUpperCase());
          break;
        }
        case 'timestamp-converter': {
          if (/^\d+$/.test(input.trim())) {
            let val = parseInt(input.trim());
            if (input.trim().length === 10) val *= 1000;
            const date = new Date(val);
            setOutput(`GMT: ${date.toUTCString()}\nLocal Time: ${date.toString()}`);
          } else {
            const date = new Date(input.trim());
            if (isNaN(date.getTime())) {
              throw new Error("Invalid date string. Try: '2026-06-04 12:00:00' or UTC format.");
            }
            setOutput(`Seconds: ${Math.floor(date.getTime() / 1000)}\nMilliseconds: ${date.getTime()}`);
          }
          break;
        }
        case 'xml-formatter': {
          let formatted = '';
          const reg = /(>)(<)(\/*)/g;
          const xml = input.replace(reg, '$1\r\n$2$3');
          let pad = 0;
          xml.split('\r\n').forEach((node) => {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
              indent = 0;
            } else if (node.match(/^<\/\w/)) {
              if (pad !== 0) pad -= 1;
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
              indent = 1;
            }
            formatted += '  '.repeat(pad) + node + '\r\n';
            pad += indent;
          });
          setOutput(formatted.trim());
          break;
        }
        case 'yaml-formatter': {
          let indentLevel = 0;
          const lines = input.split('\n');
          const beauty = lines.map(line => {
            const l = line.trim();
            if (l.startsWith('}') || l.startsWith(']')) indentLevel = Math.max(0, indentLevel - 1);
            const res = '  '.repeat(indentLevel) + l;
            if (l.endsWith('{') || l.endsWith('[') || l.endsWith('(')) indentLevel += 1;
            return res;
          }).join('\n');
          setOutput(beauty);
          break;
        }
        case 'sql-formatter': {
          if (!input.trim()) {
            setOutput('');
            break;
          }
          try {
            const formatted = formatSql(input, {
              language: 'sql',
              tabWidth: 2,
              keywordCase: 'upper'
            });
            setOutput(formatted);
          } catch (e) { const err = e as Error;
            throw new Error('Invalid SQL syntax: ' + (err.message || 'Check your query syntax.'));
          }
          break;
        }
        case 'code-beautifier': {
          if (!input.trim()) {
            setOutput('');
            break;
          }
          if (!beautifierLoaded) {
            setOutput('Loading beautifier libraries...');
            break;
          }
          try {
            const options = {
              indent_size: 2,
              space_in_empty_paren: true,
              jslint_happy: true,
              end_with_newline: true
            };
            let formatted = '';
            const w = window as any;
            if (beautifyLanguage === 'js' && typeof w.js_beautify === 'function') {
              formatted = w.js_beautify(input, options);
            } else if (beautifyLanguage === 'html' && typeof w.html_beautify === 'function') {
              formatted = w.html_beautify(input, options);
            } else if (beautifyLanguage === 'css' && typeof w.css_beautify === 'function') {
              formatted = w.css_beautify(input, options);
            } else {
              throw new Error('Beautifier library is not loaded yet.');
            }
            setOutput(formatted);
          } catch (e) { const err = e as Error;
            throw new Error('Beautification failed: ' + (err.message || 'Verify your code layout.'));
          }
          break;
        }
        case 'markdown-previewer': {
          const html = input
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/`(.*)`/gim, '<code>$1</code>')
            .replace(/\n$/gim, '<br />');
          setOutput(html);
          break;
        }
        default:
          break;
      }
    } catch (e) { const err = e as Error;
      setError(err.message || 'Formatting error. Please check your syntax.');
    }
  }, [input, toolId, beautifyLanguage]);

  // Execute hash generation (uses async Web Crypto)
  const handleHash = async () => {
    setError('');
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest(hashType, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setOutput(hashHex);
    } catch (e) { const err = e as Error;
      setError('Hash generation failed.');
    }
  };

  const handleRegexTest = () => {
    setError('');
    try {
      const regex = new RegExp(regexPattern, regexFlags);
      const matches = input.match(regex);
      if (matches) {
        setOutput(`Matches Found (${matches.length}):\n${JSON.stringify(matches, null, 2)}`);
      } else {
        setOutput("No matches found.");
      }
    } catch (e) { const err = e as Error;
      setError(err.message || 'Invalid regex pattern.');
    }
  };

  const generateUuid = () => {
    setError('');
    try {
      const uuid = crypto.randomUUID();
      setUuidResult(uuid);
      setCopiedUuid(false);
    } catch (err) {
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      setUuidResult(uuid);
      setCopiedUuid(false);
    }
  };

  const handleCopyUuid = () => {
    if (!uuidResult) return;
    navigator.clipboard.writeText(uuidResult);
    setCopiedUuid(true);
    setTimeout(() => setCopiedUuid(false), 2000);
  };

  const handleColorChange = (value: string) => {
    setColorInput(value);
    
    let hex = value.trim();
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }
    
    const hexReg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    if (!hexReg.test(hex)) {
      setColorError('Invalid HEX color code (must be e.g. #0f766e or #0f7).');
      return;
    }
    
    setColorError('');
    const rgb = hexToRgb(hex);
    if (rgb) {
      const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      
      setColorRgb(rgbStr);
      setColorHsl(hslStr);
    }
  };

  const handleCopyValue = (val: string, type: string) => {
    navigator.clipboard.writeText(val);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleManualRun = () => {
    setSrcDoc(htmlPreviewStore.html);
  };

  const loadHtmlTemplate = (name: string) => {
    if (name === 'blank') {
      htmlPreviewStore.setHtml('<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <title>Blank Template</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>');
    } else if (name === 'login') {
      htmlPreviewStore.setHtml('<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <title>Login Form</title>\n  <style>\n    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f1f5f9; margin: 0; }\n    .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); width: 300px; }\n    h2 { margin-top: 0; color: #0f766e; }\n    input { width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; }\n    button { width: 100%; padding: 0.5rem; background: #0f766e; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }\n  </style>\n</head>\n<body>\n  <div class="card">\n    <h2>Login</h2>\n    <input type="email" placeholder="Email">\n    <input type="password" placeholder="Password">\n    <button>Sign In</button>\n  </div>\n</body>\n</html>');
    }
  };

  const handleExportHTML = () => {
    const blob = new Blob([htmlPreviewStore.html], { type: 'text/html;charset=utf-8' });
    saveAs(blob, 'singulariti-preview.html');
  };

  const formatHtmlCode = () => {
    const w = window as any;
    if (typeof w.html_beautify === 'function') {
      try {
        const formatted = w.html_beautify(htmlPreviewStore.html, { indent_size: 2 });
        htmlPreviewStore.setHtml(formatted);
      } catch (err) {
        console.error('HTML Beautification failed', err);
      }
    } else {
      setError('Beautifier library is not loaded yet.');
    }
  };
  const content = getDevContent(toolId);

  return (    <ToolLayout
      utilityId={toolId}
      title={toolName}
      description={toolDescription}
      howToUse={content.howToUse}
      faqs={content.faqs}
      article={article || content.article}
    >
      <div className="space-y-6">
        {/* Custom Actions */}
        {toolId === 'uuid-generator' && (
          <div className="space-y-6 bg-background border border-border rounded-xl p-6 text-center max-w-xl mx-auto font-sans">
            <div className="space-y-3">
              <span className="text-[12px] uppercase font-bold text-slate tracking-wider block">Generated UUID</span>
              {uuidResult ? (
                <h2 className="text-2xl md:text-3xl font-mono font-bold text-primary break-all p-4 bg-surface rounded-xl border border-border select-all">
                  {uuidResult}
                </h2>
              ) : (
                <div className="p-4 bg-surface rounded-xl border border-border text-slate font-mono">
                  No UUID generated yet.
                </div>
              )}
            </div>
            
            <div className="flex justify-center gap-3">
              {uuidResult && (
                <Button variant="outline" onClick={handleCopyUuid}>
                  {copiedUuid ? 'Copied!' : 'Copy UUID'}
                </Button>
              )}
              <Button variant="primary" onClick={generateUuid}>
                {uuidResult ? 'Generate Another' : 'Generate UUID'}
              </Button>
            </div>
          </div>
        )}

        {toolId === 'unix-time-converter' && (
          <div className="p-5 bg-background border border-border rounded-xl text-center space-y-3">
            <p className="text-[12px] uppercase font-sans font-bold text-slate tracking-wider">Current Unix Epoch Time</p>
            <h2 className="text-3xl font-mono font-bold text-primary">{unixTime}</h2>
            <p className="text-sm font-sans text-slate">Updates live every second. Copy the value below.</p>
            <div className="flex justify-center gap-3">
              <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(unixTime.toString())}>Copy Timestamp</Button>
            </div>
          </div>
        )}

        {toolId === 'hash-generator' && (
          <div className="flex items-center gap-4 p-4 bg-background border border-border rounded-xl">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-sans font-bold text-ink">Algorithm:</label>
              <select 
                value={hashType} 
                onChange={(e) => setHashType(e.target.value)}
                className="p-2 border border-border rounded bg-surface text-ink text-sm outline-none w-36"
              >
                <option value="SHA-256">SHA-256</option>
                <option value="SHA-512">SHA-512</option>
                <option value="SHA-1">SHA-1</option>
              </select>
            </div>
            <Button variant="primary" onClick={handleHash} className="mt-5">Generate Hash</Button>
          </div>
        )}

        {toolId === 'regex-tester' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background border border-border rounded-xl">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-sans font-bold text-ink">Regex Pattern:</label>
              <input 
                type="text" 
                value={regexPattern} 
                onChange={(e) => setRegexPattern(e.target.value)} 
                placeholder="[a-zA-Z]+" 
                className="p-2 border border-border rounded bg-surface text-ink text-sm outline-none" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-sans font-bold text-ink">Flags:</label>
              <input 
                type="text" 
                value={regexFlags} 
                onChange={(e) => setRegexFlags(e.target.value)} 
                placeholder="g" 
                className="p-2 border border-border rounded bg-surface text-ink text-sm outline-none" 
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button variant="primary" onClick={handleRegexTest}>Test Pattern</Button>
            </div>
          </div>
        )}

        {toolId === 'code-beautifier' && (
          <div className="flex items-center gap-4 p-4 bg-background border border-border rounded-xl font-sans">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-ink">Language:</label>
              <select 
                value={beautifyLanguage} 
                onChange={(e) => setBeautifyLanguage(e.target.value as any)}
                className="p-2 border border-border rounded bg-surface text-ink text-sm outline-none w-36"
              >
                <option value="js">JavaScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </div>
          </div>
        )}

        {/* Color Picker Custom UI */}
        {toolId === 'color-picker-tool' && (
          <div className="space-y-6 bg-background border border-border rounded-xl p-6 font-sans">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Color Block Preview */}
              <div 
                className="w-24 h-24 rounded-2xl border border-border shadow-inner shrink-0 transition-colors" 
                style={{ backgroundColor: colorError ? '#ccc' : colorInput }} 
              />
              
              {/* Pickers and Inputs */}
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-ink">Choose Color:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={colorError ? '#000000' : (colorInput.startsWith('#') ? colorInput : '#' + colorInput)}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-10 h-10 rounded border border-border cursor-pointer p-0 bg-transparent"
                      />
                      <span className="text-xs text-slate">Click to pick</span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-ink">Hex Code Input:</label>
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => handleColorChange(e.target.value)}
                      placeholder="#0f766e"
                      className={`p-2 border rounded bg-surface text-ink font-mono text-sm outline-none w-full ${
                        colorError ? 'border-red-500/80 focus:border-red-500' : 'border-border'
                      }`}
                    />
                  </div>
                </div>
                {colorError && (
                  <p className="text-xs text-red-500 font-medium">{colorError}</p>
                )}
              </div>
            </div>

            {/* Results Grid with Copy Buttons */}
            {!colorError && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div className="flex flex-col gap-1.5 p-3.5 bg-surface border border-border rounded-lg relative">
                  <span className="text-[11px] font-bold text-slate uppercase tracking-wider">HEX Code</span>
                  <div className="flex justify-between items-center mt-1">
                    <code className="text-[14px] font-mono font-bold text-primary">{colorInput}</code>
                    <button
                      onClick={() => handleCopyValue(colorInput, 'hex')}
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      {copiedType === 'hex' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 p-3.5 bg-surface border border-border rounded-lg relative">
                  <span className="text-[11px] font-bold text-slate uppercase tracking-wider">RGB Format</span>
                  <div className="flex justify-between items-center mt-1">
                    <code className="text-[14px] font-mono font-bold text-primary">{colorRgb}</code>
                    <button
                      onClick={() => handleCopyValue(colorRgb, 'rgb')}
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      {copiedType === 'rgb' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 p-3.5 bg-surface border border-border rounded-lg relative">
                  <span className="text-[11px] font-bold text-slate uppercase tracking-wider">HSL Format</span>
                  <div className="flex justify-between items-center mt-1">
                    <code className="text-[14px] font-mono font-bold text-primary">{colorHsl}</code>
                    <button
                      onClick={() => handleCopyValue(colorHsl, 'hsl')}
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      {copiedType === 'hsl' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {toolId === 'cron-generator' && <CronGeneratorUI />}
        {toolId === 'password-generator' && <PasswordGeneratorUI />}
        {toolId === 'bcrypt-generator' && <BcryptGeneratorUI />}
        {toolId === 'css-gradient-generator' && <CssGradientGeneratorUI />}
        {toolId === 'css-box-shadow' && <CssBoxShadowUI />}
        {toolId === 'color-contrast-checker' && <ColorContrastCheckerUI />}
        {toolId === 'svg-optimizer' && <SvgOptimizerUI />}
        {toolId === 'pdf-image-extractor' && <PdfImageExtractorUI />}

        {/* HTML Previewer UI */}
        {toolId === 'html-previewer' && (
          <div className="flex flex-col w-full h-[80vh] border border-border rounded-2xl overflow-hidden bg-background shadow-sm relative">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <Button 
                  id="html-preview-run-btn"
                  onClick={handleManualRun}
                  variant="primary"
                  className="flex items-center gap-2 text-[13px] font-bold"
                >
                  <Play className="w-4 h-4 fill-current" /> Run
                </Button>
                <div className="h-6 w-px bg-border mx-2" />
                <select 
                  id="html-preview-template-select"
                  onChange={(e) => loadHtmlTemplate(e.target.value)}
                  className="px-3 py-1.5 bg-background border border-border rounded-lg text-[13px] font-medium text-ink outline-none focus:border-primary cursor-pointer hidden md:block"
                >
                  <option value="">Load Template...</option>
                  <option value="blank">Blank HTML5</option>
                  <option value="login">Login Form</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  id="html-preview-beautify-btn"
                  onClick={formatHtmlCode}
                  className="p-2 text-slate hover:bg-slate/10 hover:text-ink rounded-lg transition-colors flex items-center gap-2 text-[13px] font-medium"
                  title="Beautify HTML"
                >
                  <AlignLeft className="w-4 h-4" /> <span className="hidden md:inline">Beautify</span>
                </button>
                <button 
                  id="html-preview-export-btn"
                  onClick={handleExportHTML}
                  className="p-2 text-slate hover:bg-slate/10 hover:text-ink rounded-lg transition-colors flex items-center gap-2 text-[13px] font-medium"
                  title="Download HTML"
                >
                  <Download className="w-4 h-4" /> <span className="hidden md:inline">Export</span>
                </button>
                <div className="h-6 w-px bg-border mx-2 hidden md:block" />
                <div className="hidden md:flex items-center gap-1 bg-background p-1 rounded-lg border border-border">
                  <button 
                    id="html-preview-layout-horiz-btn"
                    onClick={() => htmlPreviewStore.setLayout('horizontal')}
                    className={`p-1.5 rounded-md ${htmlPreviewStore.layout === 'horizontal' ? 'bg-primary text-white' : 'text-slate hover:bg-slate/10'}`}
                    title="Horizontal Split"
                  >
                    <Layout className="w-4 h-4" />
                  </button>
                  <button 
                    id="html-preview-layout-vert-btn"
                    onClick={() => htmlPreviewStore.setLayout('vertical')}
                    className={`p-1.5 rounded-md ${htmlPreviewStore.layout === 'vertical' ? 'bg-primary text-white' : 'text-slate hover:bg-slate/10'}`}
                    title="Vertical Split"
                  >
                    <Layout className="w-4 h-4 rotate-90" />
                  </button>
                  <button 
                    id="html-preview-layout-preview-btn"
                    onClick={() => htmlPreviewStore.setLayout('preview-only')}
                    className={`p-1.5 rounded-md ${htmlPreviewStore.layout === 'preview-only' ? 'bg-primary text-white' : 'text-slate hover:bg-slate/10'}`}
                    title="Preview Only"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 overflow-hidden relative">
              {isMobile ? (
                <div className="flex flex-col h-full bg-surface">
                  <div className="flex border-b border-border bg-background shrink-0">
                    <button
                      id="html-preview-tab-editor"
                      onClick={() => setActiveTab('editor')}
                      className={`flex-1 py-3 text-[13px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'editor' ? 'border-b-2 border-primary text-primary' : 'text-slate hover:bg-slate/5'}`}
                    >
                      Code Editor
                    </button>
                    <button
                      id="html-preview-tab-preview"
                      onClick={() => setActiveTab('preview')}
                      className={`flex-1 py-3 text-[13px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'preview' ? 'border-b-2 border-primary text-primary' : 'text-slate hover:bg-slate/5'}`}
                    >
                      Live Preview
                    </button>
                  </div>
                  <div className="flex-1 relative">
                    {activeTab === 'editor' ? (
                      <MonacoEditorWrapper 
                        language="html" 
                        value={htmlPreviewStore.html} 
                        onChange={(v: string | undefined) => htmlPreviewStore.setHtml(v || '')} 
                      />
                    ) : (
                      <DevicePreviewFrame 
                        srcDoc={srcDoc} 
                        deviceView={htmlPreviewStore.deviceView} 
                        setDeviceView={htmlPreviewStore.setDeviceView} 
                      />
                    )}
                  </div>
                </div>
              ) : htmlPreviewStore.layout === 'preview-only' ? (
                <div className="w-full h-full relative p-2">
                  <DevicePreviewFrame 
                    srcDoc={srcDoc} 
                    deviceView={htmlPreviewStore.deviceView} 
                    setDeviceView={htmlPreviewStore.setDeviceView} 
                  />
                </div>
              ) : htmlPreviewStore.layout === 'code-only' ? (
                <MonacoEditorWrapper 
                  language="html" 
                  value={htmlPreviewStore.html} 
                  onChange={(v: string | undefined) => htmlPreviewStore.setHtml(v || '')} 
                />
              ) : (
                <PanelGroup orientation={htmlPreviewStore.layout === 'vertical' ? 'horizontal' : 'vertical'}>
                  <Panel defaultSize={50} minSize={30}>
                    <div className="flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden m-1 relative">
                      <MonacoEditorWrapper 
                        language="html" 
                        value={htmlPreviewStore.html} 
                        onChange={(v: string | undefined) => htmlPreviewStore.setHtml(v || '')} 
                      />
                    </div>
                  </Panel>
                  <PanelResizeHandle className={`bg-border hover:bg-primary/50 transition-colors ${htmlPreviewStore.layout === 'horizontal' ? 'h-2' : 'w-2'}`} />
                  <Panel defaultSize={50} minSize={30}>
                    <div className="w-full h-full relative flex flex-col p-1">
                      <DevicePreviewFrame 
                        srcDoc={srcDoc} 
                        deviceView={htmlPreviewStore.deviceView} 
                        setDeviceView={htmlPreviewStore.setDeviceView} 
                      />
                    </div>
                  </Panel>
                </PanelGroup>
              )}
            </div>
          </div>
        )}

        {/* Input & Output */}
        {toolId !== 'uuid-generator' && toolId !== 'unix-time-converter' && toolId !== 'color-picker-tool' && toolId !== 'html-previewer' && toolId !== 'cron-generator' && toolId !== 'password-generator' && toolId !== 'bcrypt-generator' && toolId !== 'css-gradient-generator' && toolId !== 'css-box-shadow' && toolId !== 'color-contrast-checker' && (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <TextBox 
                value={input} 
                onChange={setInput} 
                label="Source Input" 
                error={error} 
                rows={8}
                placeholder={
                  toolId === 'jwt-decoder' 
                    ? 'Paste encoded JWT token here...' 
                    : 'Paste raw content here...'
                }
              />
            </div>
            {toolId === 'markdown-previewer' && output && (
              <div className="space-y-2">
                <label className="text-[13px] font-sans font-semibold text-ink uppercase tracking-wider">Markdown Output Preview</label>
                <div 
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(output) }}
                  className="w-full p-4 border border-border bg-surface rounded-xl prose max-w-none text-ink font-sans"
                />
              </div>
            )}
            <ResultBox value={output} downloadFileName={`${toolId}-result.txt`} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
