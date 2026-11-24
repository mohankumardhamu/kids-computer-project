import type { Item } from '../data/levels';

export type MatchResult = 'exact' | 'close' | 'wrong';

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(a|an|the|it is|its|it s|this is) /, '');
}

function singular(s: string): string {
  return s.length > 3 && s.endsWith('s') && !s.endsWith('ss') ? s.slice(0, -1) : s;
}

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[a.length][b.length];
}

/** How many spelling mistakes we forgive, based on word length. Short words must be exact. */
function allowedTypos(len: number): number {
  if (len <= 4) return 0;
  if (len <= 7) return 1;
  return 2;
}

function answers(item: Item): string[] {
  return [item.name, ...(item.accept ?? [])].map(normalize);
}

/** Check a typed answer. Small spelling mistakes count as "close" (still correct). */
export function checkTyped(input: string, item: Item): MatchResult {
  const guess = normalize(input);
  if (!guess) return 'wrong';
  const g = singular(guess.replace(/ /g, ''));
  let close = false;
  for (const ans of answers(item)) {
    const a = singular(ans.replace(/ /g, ''));
    if (g === a) return 'exact';
    if (levenshtein(g, a) <= allowedTypos(a.length)) close = true;
  }
  return close ? 'close' : 'wrong';
}

/**
 * Check what speech recognition heard. It gives several guesses, and kids often say
 * a full sentence ("it's a keyboard"), so we also look for the answer inside the phrase.
 */
export function checkSpoken(transcripts: string[], item: Item): boolean {
  for (const t of transcripts) {
    if (checkTyped(t, item) !== 'wrong') return true;
    const heard = ` ${normalize(t)} `;
    const heardJoined = heard.replace(/ /g, '');
    for (const ans of answers(item)) {
      if (heard.includes(` ${ans} `) || heard.includes(` ${ans}s `)) return true;
      if (ans.length >= 5 && heardJoined.includes(ans.replace(/ /g, ''))) return true;
    }
  }
  return false;
}
