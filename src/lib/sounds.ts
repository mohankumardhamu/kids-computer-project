// Tiny sound effects made with the Web Audio API, so we don't need any sound files.
let ctx: AudioContext | null = null;

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine') {
  ctx ??= new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ctx.currentTime + start;
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration);
}

export const sounds = {
  correct() {
    tone(523, 0, 0.15);
    tone(659, 0.1, 0.15);
    tone(784, 0.2, 0.25);
  },
  wrong() {
    tone(220, 0, 0.25, 'triangle');
    tone(180, 0.15, 0.3, 'triangle');
  },
  fanfare() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3));
  },
};
