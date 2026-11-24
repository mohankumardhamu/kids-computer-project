import { LEVELS, UNLOCK_ACCURACY } from '../data/levels';
import { bestAccuracy, bestScore, isUnlocked, stars, totalPoints, useData } from '../lib/store';

interface Props {
  kidId: string;
  onLearn: (levelId: string) => void;
  onQuiz: (levelId: string) => void;
  onBack: () => void;
}

export function Levels({ kidId, onLearn, onQuiz, onBack }: Props) {
  const data = useData();
  const kid = data.kids.find((k) => k.id === kidId);
  if (!kid) return null;

  return (
    <div className="screen">
      <div className="topbar">
        <button className="btn link" onClick={onBack}>← Players</button>
        <span className="who">{kid.avatar} {kid.name} · ⭐ {totalPoints(data, kidId)}</span>
      </div>
      <h1>Choose a level</h1>
      <div className="level-list">
        {LEVELS.map((level, i) => {
          const unlocked = isUnlocked(data, kidId, i);
          const acc = bestAccuracy(data, kidId, level.id);
          const best = bestScore(data, kidId, level.id);
          const s = stars(acc);
          return (
            <div key={level.id} className={unlocked ? 'level-card' : 'level-card locked'} style={{ borderColor: level.color }}>
              <div className="level-head" style={{ background: level.color }}>
                <span>{i + 1}. {level.title}</span>
                <span className="stars">{'★'.repeat(s)}{'☆'.repeat(3 - s)}</span>
              </div>
              <p>{level.subtitle}</p>
              {unlocked ? (
                <>
                  <p className="muted">
                    {acc === null ? 'Not played yet' : `Best: ${acc}% correct · ${best} points`}
                  </p>
                  <div className="row">
                    <button className="btn" onClick={() => onLearn(level.id)}>📖 Learn</button>
                    <button className="btn primary" style={{ background: level.color }} onClick={() => onQuiz(level.id)}>🎯 Quiz</button>
                  </div>
                </>
              ) : (
                <p className="muted">🔒 Get {UNLOCK_ACCURACY}% in {LEVELS[i - 1].title} to unlock</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
