import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { getLevel } from '../data/levels';
import type { Item } from '../data/levels';
import { checkSpoken, checkTyped } from '../lib/match';
import { listen, speak, voiceSupported } from '../lib/speech';
import { sounds } from '../lib/sounds';
import { uid } from '../lib/store';
import type { Attempt, Session } from '../lib/store';
import { PartPhoto } from './PartPhoto';

const POINTS_FIRST_TRY = 10;
const POINTS_SECOND_TRY_OR_HINT = 5;
const STREAK_BONUS = 5; // every 3 correct answers in a row
const TRIES_PER_QUESTION = 2;

const PRAISE = ['Great job!', 'Awesome!', 'You got it!', 'Super!', 'Well done!', 'Brilliant!'];
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hintFor(name: string) {
  return name
    .split('')
    .map((c, i) => (i === 0 || c === ' ' || c === '-' ? c : '_'))
    .join(' ');
}

interface Feedback {
  kind: 'correct' | 'retry' | 'wrong';
  message: string;
  points?: number;
  bonus?: number;
}

interface Props {
  kidId: string;
  levelId: string;
  onFinish: (session: Session, attempts: Attempt[], missed: Item[]) => void;
  onQuit: () => void;
}

export function Quiz({ kidId, levelId, onFinish, onQuit }: Props) {
  const level = getLevel(levelId);
  const startedAt = useRef(Date.now());

  const [queue, setQueue] = useState<Item[]>(() => shuffle(level.items));
  const [pos, setPos] = useState(0);
  const [requeued, setRequeued] = useState<Set<string>>(new Set());
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [missed, setMissed] = useState<Item[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [answer, setAnswer] = useState('');
  const [triesLeft, setTriesLeft] = useState(TRIES_PER_QUESTION);
  const [hinted, setHinted] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceMsg, setVoiceMsg] = useState('');
  const stopListening = useRef<() => void>(() => {});
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const item = queue[pos];
  const isRetryRound = requeued.has(item.id) && queue.indexOf(item) !== pos;
  const canVoice = useMemo(voiceSupported, []);
  const done = feedback?.kind === 'correct' || feedback?.kind === 'wrong';

  useEffect(() => {
    if (done) nextRef.current?.focus();
    else inputRef.current?.focus();
  }, [done, pos]);

  useEffect(() => () => stopListening.current(), []);

  function record(correct: boolean, mode: Attempt['mode']) {
    setAttempts((a) => [
      ...a,
      { kidId, levelId, itemId: item.id, correct, mode, hinted, date: new Date().toISOString() },
    ]);
  }

  function handleCorrect(mode: Attempt['mode'], spellingNote: boolean) {
    const firstTry = triesLeft === TRIES_PER_QUESTION && !isRetryRound;
    const points = firstTry && !hinted ? POINTS_FIRST_TRY : POINTS_SECOND_TRY_OR_HINT;
    const newStreak = streak + 1;
    const bonus = newStreak % 3 === 0 ? STREAK_BONUS : 0;
    if (firstTry && !hinted) setFirstTryCorrect((n) => n + 1);
    setScore((s) => s + points + bonus);
    setStreak(newStreak);
    record(true, mode);
    sounds.correct();
    const praise = pick(PRAISE);
    speak(`${praise} ${item.name}!`);
    setFeedback({
      kind: 'correct',
      message: spellingNote ? `${praise} It's spelled "${item.name}".` : `${praise} It's "${item.name}".`,
      points,
      bonus,
    });
  }

  function handleWrong(mode: Attempt['mode'], heard?: string) {
    setStreak(0);
    const left = triesLeft - 1;
    setTriesLeft(left);
    if (left > 0 && mode !== 'skipped') {
      sounds.wrong();
      setFeedback({
        kind: 'retry',
        message: heard ? `I heard "${heard}". Not quite. Try again!` : 'Not quite. Try again!',
      });
      setAnswer('');
      return;
    }
    record(false, mode);
    if (!missed.some((m) => m.id === item.id)) setMissed((m) => [...m, item]);
    sounds.wrong();
    speak(`This is ${item.prompt ? '' : 'a '}${item.name}.`);
    setFeedback({ kind: 'wrong', message: `The answer is "${item.name}". We'll try it again later!` });
    // Bring this part back once at the end of the round.
    if (!requeued.has(item.id)) {
      setRequeued((r) => new Set(r).add(item.id));
      setQueue((q) => [...q, item]);
    }
  }

  function submitTyped(e: FormEvent) {
    e.preventDefault();
    if (done || !answer.trim()) return;
    const result = checkTyped(answer, item);
    if (result === 'wrong') handleWrong('typed');
    else handleCorrect('typed', result === 'close');
  }

  function startVoice() {
    if (listening || done) return;
    setVoiceMsg('');
    setListening(true);
    stopListening.current = listen(
      (alts) => {
        if (checkSpoken(alts, item)) handleCorrect('voice', false);
        else handleWrong('voice', alts[0]);
      },
      (msg) => setVoiceMsg(msg),
      () => setListening(false),
    );
  }

  function next() {
    stopListening.current();
    if (pos + 1 >= queue.length) {
      const total = level.items.length;
      const session: Session = {
        id: uid(),
        kidId,
        levelId,
        date: new Date().toISOString(),
        score,
        correct: firstTryCorrect,
        total,
        accuracy: Math.round((firstTryCorrect / total) * 100),
        durationSec: Math.round((Date.now() - startedAt.current) / 1000),
      };
      onFinish(session, attempts, missed);
      return;
    }
    setPos(pos + 1);
    setAnswer('');
    setTriesLeft(TRIES_PER_QUESTION);
    setHinted(false);
    setFeedback(null);
    setVoiceMsg('');
  }

  const progress = Math.min(pos, level.items.length) / level.items.length;

  return (
    <div className="screen center">
      <div className="topbar">
        <button className="btn link" onClick={onQuit}>✖ Stop</button>
        <span className="who" style={{ color: level.color }}>🎯 {level.title}</span>
        <span className="who">⭐ {score} {streak >= 2 && <span className="streak">🔥 {streak}</span>}</span>
      </div>
      <div className="progress"><div style={{ width: `${progress * 100}%`, background: level.color }} /></div>

      <div className={`card quiz-card ${feedback?.kind ?? ''}`}>
        {isRetryRound && <p className="muted">🔁 Let's try this one again</p>}
        <p className="prompt">{item.prompt ?? 'What is this called?'}</p>
        <PartPhoto item={item} />
        {hinted && !done && <p className="hint">{hintFor(item.name)}</p>}

        {!done && (
          <>
            <form className="answer-row" onSubmit={submitTyped}>
              <input
                ref={inputRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer…"
                autoComplete="off"
                spellCheck={false}
              />
              <button className="btn primary" type="submit" style={{ background: level.color }}>Check ✔</button>
            </form>
            <div className="row">
              {canVoice && (
                <button className={listening ? 'btn mic listening' : 'btn mic'} onClick={startVoice} type="button">
                  {listening ? '👂 Listening…' : '🎤 Say it'}
                </button>
              )}
              {!hinted && <button className="btn" type="button" onClick={() => setHinted(true)}>💡 Hint</button>}
              <button className="btn" type="button" onClick={() => speak(item.prompt ?? 'What is this called?')}>🔊</button>
              <button className="btn link" type="button" onClick={() => handleWrong('skipped')}>I don't know</button>
            </div>
            {voiceMsg && <p className="muted">{voiceMsg}</p>}
          </>
        )}

        {feedback && (
          <div className={`feedback ${feedback.kind}`}>
            <p>{feedback.kind === 'correct' ? '🎉 ' : feedback.kind === 'retry' ? '🤔 ' : '💡 '}{feedback.message}</p>
            {feedback.kind === 'correct' && (
              <p className="points">+{feedback.points} points{feedback.bonus ? ` · 🔥 +${feedback.bonus} streak bonus!` : ''}</p>
            )}
            {feedback.kind === 'wrong' && <p className="fact">{item.fact}</p>}
          </div>
        )}

        {done && (
          <button ref={nextRef} className="btn primary big" style={{ background: level.color }} onClick={next}>
            {pos + 1 >= queue.length ? 'See my score 🏆' : 'Next ➡'}
          </button>
        )}
      </div>
    </div>
  );
}
