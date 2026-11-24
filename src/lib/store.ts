import { useSyncExternalStore } from 'react';
import { LEVELS, UNLOCK_ACCURACY } from '../data/levels';

export interface Kid {
  id: string;
  name: string;
  avatar: string;
}

export interface Attempt {
  kidId: string;
  levelId: string;
  itemId: string;
  correct: boolean;
  mode: 'typed' | 'voice' | 'skipped';
  hinted: boolean;
  date: string;
}

export interface Session {
  id: string;
  kidId: string;
  levelId: string;
  date: string;
  score: number;
  correct: number; // correct on first try
  total: number;
  accuracy: number; // 0-100
  durationSec: number;
}

export interface Data {
  kids: Kid[];
  pin: string | null;
  sessions: Session[];
  attempts: Attempt[];
}

const KEY = 'kids-computer-quiz-v1';
const EMPTY: Data = { kids: [], pin: null, sessions: [], attempts: [] };

function load(): Data {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

let data: Data = load();
const listeners = new Set<() => void>();

function set(next: Data) {
  data = next;
  localStorage.setItem(KEY, JSON.stringify(data));
  listeners.forEach((l) => l());
}

export function useData(): Data {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => data,
  );
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export const actions = {
  addKid(name: string, avatar: string) {
    set({ ...data, kids: [...data.kids, { id: uid(), name, avatar }] });
  },
  updateKid(id: string, patch: Partial<Kid>) {
    set({ ...data, kids: data.kids.map((k) => (k.id === id ? { ...k, ...patch } : k)) });
  },
  removeKid(id: string) {
    set({
      ...data,
      kids: data.kids.filter((k) => k.id !== id),
      sessions: data.sessions.filter((s) => s.kidId !== id),
      attempts: data.attempts.filter((a) => a.kidId !== id),
    });
  },
  resetKidScores(id: string) {
    set({
      ...data,
      sessions: data.sessions.filter((s) => s.kidId !== id),
      attempts: data.attempts.filter((a) => a.kidId !== id),
    });
  },
  setPin(pin: string) {
    set({ ...data, pin });
  },
  saveSession(session: Session, attempts: Attempt[]) {
    set({ ...data, sessions: [...data.sessions, session], attempts: [...data.attempts, ...attempts] });
  },
};

// ---- derived stats ----

export function bestAccuracy(d: Data, kidId: string, levelId: string): number | null {
  const s = d.sessions.filter((x) => x.kidId === kidId && x.levelId === levelId);
  return s.length ? Math.max(...s.map((x) => x.accuracy)) : null;
}

export function bestScore(d: Data, kidId: string, levelId: string): number | null {
  const s = d.sessions.filter((x) => x.kidId === kidId && x.levelId === levelId);
  return s.length ? Math.max(...s.map((x) => x.score)) : null;
}

export function totalPoints(d: Data, kidId: string): number {
  return d.sessions.filter((s) => s.kidId === kidId).reduce((sum, s) => sum + s.score, 0);
}

export function isUnlocked(d: Data, kidId: string, levelIndex: number): boolean {
  if (levelIndex === 0) return true;
  const prev = bestAccuracy(d, kidId, LEVELS[levelIndex - 1].id);
  return prev !== null && prev >= UNLOCK_ACCURACY;
}

export function stars(accuracy: number | null): number {
  if (accuracy === null) return 0;
  if (accuracy === 100) return 3;
  if (accuracy >= UNLOCK_ACCURACY) return 2;
  if (accuracy >= 50) return 1;
  return 0;
}
