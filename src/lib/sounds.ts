/**
 * Sonidos UI ligeros generados con WebAudio API (sin assets externos).
 * Carga instantánea, < 1KB de código, no bloquea render.
 */

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (muted) return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, duration = 0.08, type: OscillatorType = "sine", gain = 0.08, delay = 0) {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const start = ac.currentTime + delay;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export const sfx = {
  /** Click suave para hover/select. */
  tick() {
    tone(880, 0.04, "triangle", 0.04);
  },
  /** Agregar al carrito: dos notas ascendentes. */
  pop() {
    tone(660, 0.08, "sine", 0.09, 0);
    tone(990, 0.1, "sine", 0.07, 0.06);
  },
  /** Éxito / confirmación (pedido). */
  success() {
    tone(523, 0.1, "sine", 0.08, 0);
    tone(659, 0.1, "sine", 0.08, 0.08);
    tone(784, 0.18, "sine", 0.09, 0.16);
  },
  /** Error suave. */
  error() {
    tone(220, 0.18, "sawtooth", 0.05);
  },
  /** Apertura de carrito. */
  swoosh() {
    tone(440, 0.06, "triangle", 0.05, 0);
    tone(330, 0.08, "triangle", 0.04, 0.05);
  },
  setMuted(v: boolean) {
    muted = v;
  },
  isMuted() {
    return muted;
  },
};
