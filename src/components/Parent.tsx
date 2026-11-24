import { useState } from 'react';
import { LEVELS } from '../data/levels';
import { actions, bestAccuracy, isUnlocked, totalPoints, useData } from '../lib/store';
import type { Data } from '../lib/store';
import { AVATARS, KidForm } from './Profiles';

const itemName = new Map(LEVELS.flatMap((l) => l.items.map((i) => [i.id, i.name] as const)));

function PinGate({ onUnlock, onBack }: { onUnlock: () => void; onBack: () => void }) {
  const data = useData();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const creating = data.pin === null;

  return (
    <div className="screen center">
      <h1>👨‍👩‍👧 Parent area</h1>
      <form
        className="card pin-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (creating) {
            if (!/^\d{4}$/.test(pin)) return setError('Use exactly 4 digits.');
            actions.setPin(pin);
            onUnlock();
          } else if (pin === data.pin) onUnlock();
          else {
            setError('Wrong PIN');
            setPin('');
          }
        }}
      >
        <p>{creating ? 'Create a 4-digit PIN so only grown-ups can see this page.' : 'Enter your PIN'}</p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          autoFocus
        />
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button type="button" className="btn" onClick={onBack}>Back</button>
          <button type="submit" className="btn primary">{creating ? 'Save PIN' : 'Open'}</button>
        </div>
      </form>
    </div>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  return m ? `${m}m ${sec % 60}s` : `${sec}s`;
}

function KidReport({ data, kidId }: { data: Data; kidId: string }) {
  const kid = data.kids.find((k) => k.id === kidId)!;
  const sessions = data.sessions.filter((s) => s.kidId === kidId);
  const attempts = data.attempts.filter((a) => a.kidId === kidId);
  const totalTime = sessions.reduce((t, s) => t + s.durationSec, 0);
  const firstAccuracy = (levelId: string) => sessions.find((s) => s.levelId === levelId)?.accuracy ?? null;

  // Per-part right/wrong counts.
  const perItem = new Map<string, { right: number; wrong: number }>();
  for (const a of attempts) {
    const e = perItem.get(a.itemId) ?? { right: 0, wrong: 0 };
    if (a.correct) e.right++;
    else e.wrong++;
    perItem.set(a.itemId, e);
  }
  const weak = [...perItem.entries()]
    .filter(([, e]) => e.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong || a[1].right - b[1].right)
    .slice(0, 8);
  const voice = attempts.filter((a) => a.mode === 'voice').length;
  const typed = attempts.filter((a) => a.mode === 'typed').length;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(kid.name);

  return (
    <div className="report">
      <div className="stat-row">
        <div className="stat"><b>{totalPoints(data, kidId)}</b><span>total points</span></div>
        <div className="stat"><b>{sessions.length}</b><span>quizzes played</span></div>
        <div className="stat"><b>{fmtDuration(totalTime)}</b><span>time playing</span></div>
        <div className="stat"><b>{typed} / {voice}</b><span>typed / spoken answers</span></div>
      </div>

      <h3>Levels</h3>
      <table>
        <thead>
          <tr><th>Level</th><th>Status</th><th>Played</th><th>First quiz</th><th>Best</th><th>Latest</th></tr>
        </thead>
        <tbody>
          {LEVELS.map((l, i) => {
            const ls = sessions.filter((s) => s.levelId === l.id);
            return (
              <tr key={l.id}>
                <td><span className="dot" style={{ background: l.color }} /> {l.title}</td>
                <td>{isUnlocked(data, kidId, i) ? (ls.length ? 'Playing' : 'Unlocked') : '🔒 Locked'}</td>
                <td>{ls.length}×</td>
                <td>{firstAccuracy(l.id) ?? '–'}{ls.length ? '%' : ''}</td>
                <td>{bestAccuracy(data, kidId, l.id) ?? '–'}{ls.length ? '%' : ''}</td>
                <td>{ls.length ? `${ls[ls.length - 1].accuracy}%` : '–'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3>Parts to practise</h3>
      {weak.length === 0 ? (
        <p className="muted">No mistakes yet. 🎉</p>
      ) : (
        <table>
          <thead><tr><th>Part</th><th>Wrong</th><th>Right</th></tr></thead>
          <tbody>
            {weak.map(([id, e]) => (
              <tr key={id}><td>{itemName.get(id) ?? id}</td><td className="bad">{e.wrong}</td><td className="good">{e.right}</td></tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Recent quizzes</h3>
      {sessions.length === 0 ? (
        <p className="muted">No quizzes yet.</p>
      ) : (
        <table>
          <thead><tr><th>When</th><th>Level</th><th>Score</th><th>First try</th><th>Time</th></tr></thead>
          <tbody>
            {[...sessions].reverse().slice(0, 15).map((s) => (
              <tr key={s.id}>
                <td>{fmtDate(s.date)}</td>
                <td>{LEVELS.find((l) => l.id === s.levelId)?.title}</td>
                <td>{s.score}</td>
                <td>{s.correct}/{s.total} ({s.accuracy}%)</td>
                <td>{fmtDuration(s.durationSec)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Manage {kid.name}</h3>
      {editing ? (
        <div className="manage">
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} />
          <div className="avatar-picker">
            {AVATARS.map((a) => (
              <button key={a} className={a === kid.avatar ? 'avatar selected' : 'avatar'} onClick={() => actions.updateKid(kid.id, { avatar: a })}>{a}</button>
            ))}
          </div>
          <button className="btn primary" onClick={() => { if (name.trim()) actions.updateKid(kid.id, { name: name.trim() }); setEditing(false); }}>Save</button>
        </div>
      ) : (
        <div className="row left">
          <button className="btn" onClick={() => setEditing(true)}>✏️ Edit name / avatar</button>
          <button className="btn" onClick={() => confirm(`Reset all scores for ${kid.name}?`) && actions.resetKidScores(kid.id)}>♻️ Reset scores</button>
          <button className="btn danger" onClick={() => confirm(`Delete ${kid.name} and all their scores?`) && actions.removeKid(kid.id)}>🗑️ Delete player</button>
        </div>
      )}
    </div>
  );
}

export function Parent({ onBack }: { onBack: () => void }) {
  const data = useData();
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState<string>('overview');

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} onBack={onBack} />;
  const currentKid = data.kids.find((k) => k.id === tab);

  return (
    <div className="screen">
      <div className="topbar">
        <button className="btn link" onClick={onBack}>← Back to game</button>
        <span className="who">👨‍👩‍👧 Parent dashboard</span>
      </div>
      <div className="tabs">
        <button className={tab === 'overview' ? 'tab active' : 'tab'} onClick={() => setTab('overview')}>Overview</button>
        {data.kids.map((k) => (
          <button key={k.id} className={tab === k.id ? 'tab active' : 'tab'} onClick={() => setTab(k.id)}>{k.avatar} {k.name}</button>
        ))}
        <button className={tab === 'add' ? 'tab active' : 'tab'} onClick={() => setTab('add')}>➕ Add player</button>
      </div>

      {tab === 'overview' && (
        <div className="report">
          <table>
            <thead>
              <tr>
                <th>Player</th><th>Points</th><th>Quizzes</th>
                {LEVELS.map((l) => <th key={l.id}>{l.title}<br /><small>best</small></th>)}
              </tr>
            </thead>
            <tbody>
              {data.kids.map((k) => (
                <tr key={k.id}>
                  <td>{k.avatar} {k.name}</td>
                  <td>{totalPoints(data, k.id)}</td>
                  <td>{data.sessions.filter((s) => s.kidId === k.id).length}</td>
                  {LEVELS.map((l) => {
                    const acc = bestAccuracy(data, k.id, l.id);
                    return <td key={l.id}>{acc === null ? '–' : `${acc}%`}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted">"First try" accuracy = parts answered correctly on the first attempt without a hint or a second try. A level unlocks at 80%.</p>
        </div>
      )}
      {currentKid && <KidReport key={currentKid.id} data={data} kidId={currentKid.id} />}
      {tab === 'add' && <div className="card"><KidForm onDone={() => setTab('overview')} /></div>}
    </div>
  );
}
