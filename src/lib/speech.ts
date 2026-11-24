// Text-to-speech (computer talks) and speech recognition (kid talks).
// Speech recognition works best in Chrome and Edge.

export function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
  u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

// The Web Speech API types aren't in TypeScript's DOM lib, so we declare the bits we use.
interface RecognitionResultList {
  length: number;
  [i: number]: { length: number; [j: number]: { transcript: string } };
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: { results: RecognitionResultList }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}
type RecognitionCtor = new () => Recognition;

function getCtor(): RecognitionCtor | undefined {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export const voiceSupported = () => !!getCtor();

/**
 * Listen once. Calls onResult with every alternative the browser heard,
 * or onError with a friendly message. Returns a function that stops listening.
 */
export function listen(
  onResult: (alternatives: string[]) => void,
  onError: (message: string) => void,
  onEnd: () => void,
): () => void {
  const Ctor = getCtor();
  if (!Ctor) {
    onError('Voice only works in Chrome or Edge.');
    onEnd();
    return () => {};
  }
  const rec = new Ctor();
  rec.lang = navigator.language || 'en-US';
  rec.interimResults = false;
  rec.maxAlternatives = 5;
  rec.continuous = false;
  rec.onresult = (e) => {
    const alts: string[] = [];
    for (let i = 0; i < e.results.length; i++) {
      for (let j = 0; j < e.results[i].length; j++) alts.push(e.results[i][j].transcript);
    }
    onResult(alts);
  };
  rec.onerror = (e) => {
    const messages: Record<string, string> = {
      'not-allowed': 'Please allow the microphone in the browser.',
      'no-speech': "I didn't hear anything. Try again!",
      network: 'Voice needs the internet. Try typing instead.',
      'audio-capture': 'No microphone found.',
    };
    if (e.error !== 'aborted') onError(messages[e.error] ?? 'Voice did not work. Try typing.');
  };
  rec.onend = onEnd;
  rec.start();
  return () => rec.abort();
}
