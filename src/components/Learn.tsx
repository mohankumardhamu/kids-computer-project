import { useEffect, useState } from 'react';
import { getLevel } from '../data/levels';
import { speak } from '../lib/speech';
import { PartPhoto } from './PartPhoto';

export function Learn({ levelId, onQuiz, onBack }: { levelId: string; onQuiz: () => void; onBack: () => void }) {
  const level = getLevel(levelId);
  const [i, setI] = useState(0);
  const item = level.items[i];
  const last = i === level.items.length - 1;

  const sayIt = () => speak(`${item.prompt ? '' : 'This is a '}${item.name}. ${item.fact}`);
  useEffect(sayIt, [item.id]);

  return (
    <div className="screen center">
      <div className="topbar">
        <button className="btn link" onClick={onBack}>← Levels</button>
        <span className="who" style={{ color: level.color }}>📖 {level.title} · {i + 1} / {level.items.length}</span>
      </div>
      <div className="card learn-card">
        {item.prompt && <p className="prompt">{item.prompt}</p>}
        <PartPhoto item={item} />
        <h2 className="part-name">{item.name}</h2>
        <p className="fact">{item.fact}</p>
        <button className="btn" onClick={sayIt}>🔊 Hear it again</button>
      </div>
      <div className="row">
        <button className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>⬅ Back</button>
        {last ? (
          <button className="btn primary" style={{ background: level.color }} onClick={onQuiz}>I'm ready for the quiz! 🎯</button>
        ) : (
          <button className="btn primary" style={{ background: level.color }} onClick={() => setI(i + 1)}>Next ➡</button>
        )}
      </div>
    </div>
  );
}
