import { useState } from 'react';
import { actions, totalPoints, useData } from '../lib/store';

export const AVATARS = ['🦁', '🐼', '🦊', '🐯', '🐸', '🦄', '🐵', '🐧', '🚀', '🤖', '🦖', '🐬'];

export function KidForm({ onDone, submitLabel = 'Add' }: { onDone?: () => void; submitLabel?: string }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  return (
    <form
      className="kid-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        actions.addKid(name.trim(), avatar);
        setName('');
        onDone?.();
      }}
    >
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" maxLength={20} />
      <div className="avatar-picker">
        {AVATARS.map((a) => (
          <button type="button" key={a} className={a === avatar ? 'avatar selected' : 'avatar'} onClick={() => setAvatar(a)}>
            {a}
          </button>
        ))}
      </div>
      <button className="btn primary" type="submit" disabled={!name.trim()}>{submitLabel}</button>
    </form>
  );
}

export function Profiles({ onPick, onParent }: { onPick: (kidId: string) => void; onParent: () => void }) {
  const data = useData();
  const [adding, setAdding] = useState(false);

  if (data.kids.length === 0) {
    return (
      <div className="screen center">
        <h1>💻 Computer Explorers</h1>
        <p className="lead">Let's set up a player! Add each child one at a time.</p>
        <div className="card"><KidForm submitLabel="Add player" /></div>
      </div>
    );
  }

  return (
    <div className="screen center">
      <h1>💻 Computer Explorers</h1>
      <p className="lead">Who is playing?</p>
      <div className="kid-grid">
        {data.kids.map((k) => (
          <button key={k.id} className="kid-card" onClick={() => onPick(k.id)}>
            <span className="kid-avatar">{k.avatar}</span>
            <span className="kid-name">{k.name}</span>
            <span className="kid-points">⭐ {totalPoints(data, k.id)} points</span>
          </button>
        ))}
        {!adding && (
          <button className="kid-card add" onClick={() => setAdding(true)}>
            <span className="kid-avatar">➕</span>
            <span className="kid-name">Add player</span>
          </button>
        )}
      </div>
      {adding && <div className="card"><KidForm onDone={() => setAdding(false)} /></div>}
      <button className="btn link parent-link" onClick={onParent}>👨‍👩‍👧 Parent dashboard</button>
    </div>
  );
}
