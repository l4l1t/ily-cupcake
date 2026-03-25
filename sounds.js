const SoundManager = (() => {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  let unlocked = false;
  let heartbeatNodes = null;
  let crackleNode = null;

  const noteFreq = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88];

  async function ensureResume() {
    if (ctx.state !== 'running') await ctx.resume();
    if (!unlocked) unlocked = true;
  }

  function bindUnlock() {
    const unlock = () => ensureResume();
    ['click', 'touchstart', 'keydown'].forEach((evt) =>
      window.addEventListener(evt, unlock, { once: true, passive: true })
    );
  }

  function noiseBuffer(duration = 0.2) {
    const length = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  function playOsc({ type = 'sine', freq = 440, duration = 0.2, gain = 0.2, when = ctx.currentTime }) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    g.gain.setValueAtTime(gain, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(g).connect(ctx.destination);
    osc.start(when);
    osc.stop(when + duration);
  }

  async function bootBlip() {
    await ensureResume();
    const now = ctx.currentTime;
    playOsc({ type: 'square', freq: 880, duration: 0.05, gain: 0.06, when: now });
    return new Promise((r) => setTimeout(r, 55));
  }

  async function paperRustle() {
    await ensureResume();
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(0.2);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1200;
    const g = ctx.createGain();
    g.gain.value = 0.08;
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start();
    return new Promise((r) => setTimeout(r, 210));
  }

  const heartbeat = {
    async start() {
      await ensureResume();
      this.stop();
      const interval = setInterval(() => {
        const t = ctx.currentTime;
        playOsc({ type: 'sine', freq: 60, duration: 0.09, gain: 0.25, when: t });
        playOsc({ type: 'sine', freq: 80, duration: 0.09, gain: 0.2, when: t + 0.08 });
      }, 700);
      heartbeatNodes = { interval };
    },
    stop() {
      if (heartbeatNodes?.interval) clearInterval(heartbeatNodes.interval);
      heartbeatNodes = null;
    }
  };

  async function chime(noteIndex = 0) {
    await ensureResume();
    const freq = noteFreq[Math.max(0, Math.min(6, noteIndex))];
    playOsc({ type: 'sine', freq, duration: 0.3, gain: 0.14 });
    return new Promise((r) => setTimeout(r, 310));
  }

  async function unlockClick() {
    await ensureResume();
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(0.15);
    const g = ctx.createGain();
    g.gain.value = 0.07;
    src.connect(g).connect(ctx.destination);
    src.start(now);
    playOsc({ type: 'sine', freq: 440, duration: 0.15, gain: 0.09, when: now });
    return new Promise((r) => setTimeout(r, 160));
  }

  async function fanfare() {
    await ensureResume();
    const notes = [261.63, 329.63, 392.0, 523.25];
    notes.forEach((freq, i) => playOsc({ type: 'square', freq, duration: 0.12, gain: 0.1, when: ctx.currentTime + i * 0.12 }));
    return new Promise((r) => setTimeout(r, 520));
  }

  const crackle = {
    async start() {
      await ensureResume();
      this.stop();
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(2);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      const gain = ctx.createGain();
      gain.gain.value = 0.025;
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
      crackleNode = src;
    },
    stop() {
      if (crackleNode) {
        try { crackleNode.stop(); } catch (_) {}
      }
      crackleNode = null;
    }
  };

  async function pageTurn() {
    await ensureResume();
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(0.15);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(3000, ctx.currentTime);
    lp.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
    const g = ctx.createGain();
    g.gain.value = 0.06;
    src.connect(lp).connect(g).connect(ctx.destination);
    src.start();
    return new Promise((r) => setTimeout(r, 160));
  }

  async function finalFanfare() {
    await ensureResume();
    const now = ctx.currentTime;
    const delay = ctx.createDelay(0.5);
    delay.delayTime.value = 0.18;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    delay.connect(feedback).connect(delay);
    delay.connect(ctx.destination);

    [261.63, 329.63, 392.0, 523.25].forEach((freq) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.13, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 2);
      osc.connect(g);
      g.connect(ctx.destination);
      g.connect(delay);
      osc.start(now);
      osc.stop(now + 2);
    });
    return new Promise((r) => setTimeout(r, 2000));
  }

  async function easterEggChime() {
    await ensureResume();
    const notes = [523.25, 440.0, 349.23, 261.63];
    notes.forEach((freq, i) => playOsc({ type: 'sine', freq, duration: 0.08, gain: 0.1, when: ctx.currentTime + i * 0.08 }));
    return new Promise((r) => setTimeout(r, 360));
  }

  bindUnlock();

  return {
    bootBlip,
    paperRustle,
    heartbeat,
    chime,
    unlockClick,
    fanfare,
    crackle,
    pageTurn,
    finalFanfare,
    easterEggChime
  };
})();

window.SoundManager = SoundManager;
export default SoundManager;
