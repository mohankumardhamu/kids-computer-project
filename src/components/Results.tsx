import { useEffect } from 'react';
import { LEVELS, UNLOCK_ACCURACY, getLevel } from '../data/levels';
import type { Item } from '../data/levels';
import { sounds } from '../lib/sounds';
import { speak } from '../lib/speech';
import { stars } from '../lib/store';
import type { Session } from '../lib/store';
import { PartPhoto } from './PartPhoto';

interface Props {
  session: Session;
  previousBestScore: number | null;
  previousBestAccuracy: number | null;
  missed: Item[];
  onAgain: () => void;
  onLevels: () => void;
  onLearn: () => void;
}

export function Results({ session, previousBestScore, previousBestAccuracy, missed, onAgain, onLevels, onLearn }: Props) {
  const level = getLevel(session.levelId);
  const s = stars(session.accuracy);
  const newBest = previousBestScore === null || session.score > previousBestScore;
  const levelIndex = LEVELS.findIndex((l) => l.id === level.id);
  const nextLevel = LEVELS[levelIndex + 1];
  const justUnlocked =
    nextLevel && session.accuracy >= UNLOCK_ACCURACY && (previousBestAccuracy ?? 0) < UNLOCK_ACCURACY;

  useEffect(() => {
    sounds.fanfare();
    speak(
      justUnlocked
        ? `Amazing! You unlocked ${nextLevel.title}!`
        : newBest
          ? `New personal best! ${session.score} points!`
          : `You scored ${session.score} points!`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="screen center">
      {s >= 2 && <Confetti />}
      <h1>{s === 3 ? '🏆 Perfect!' : s === 2 ? '🌟 Fantastic!' : s === 1 ? '👍 Good try!' : '💪 Keep practising!'}</h1>
      <div className="card results-card">
        <div className="big-stars">{'★'.repeat(s)}<span className="dim">{'☆'.repeat(3 - s)}</span></div>
        <p className="score">{session.score} points</p>
        <p>{session.correct} of {session.total} right on the first try ({session.accuracy}%)</p>
        {newBest && <p className="badge">🎖️ New personal best!</p>}
        {!newBest && previousBestScore !== null && <p className="muted">Your best is {previousBestScore} points</p>}
        {justUnlocked && <p className="badge unlock">🔓 You unlocked {nextLevel.title}!</p>}
        {!justUnlocked && nextLevel && session.accuracy < UNLOCK_ACCURACY && (previousBestAccuracy ?? 0) < UNLOCK_ACCURACY && (
          <p className="muted">Get {UNLOCK_ACCURACY}% to unlock {nextLevel.title}</p>
        )}
      </div>

      {missed.length > 0 && (
        <div className="card">
          <h3>Let's remember these:</h3>
          <div className="missed-grid">
            {missed.map((m) => (
              <button key={m.id} className="missed" onClick={() => speak(`${m.name}. ${m.fact}`)}>
                <PartPhoto item={m} size={90} />
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="row">
        <button className="btn" onClick={onLevels}>🗺️ Levels</button>
        {missed.length > 0 && <button className="btn" onClick={onLearn}>📖 Learn again</button>}
        <button className="btn primary" style={{ background: level.color }} onClick={onAgain}>🔁 Play again</button>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => i);
  const colors = ['#f44336', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#ff9800'];
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((i) => (
        <span
          key={i}
          style={{
            left: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${2.5 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
