/* ระบบเสียงของเกม — สังเคราะห์ด้วย Web Audio API ไม่ต้องใช้ไฟล์เสียง
   ปรับระดับเสียงแยกกัน: เพลง (music) และเอฟเฟกต์+บรรยากาศ (sfx) ช่วง 0–100%
   บันทึกค่าในคีย์ fishgame1_audio แยกจากเซฟเกม */
const SFX = (() => {
  const KEY = 'fishgame1_audio';
  let ctx = null, master = null, sfxBus = null, musicBus = null, ambBus = null;
  let vol = {music: 70, sfx: 80}, muted = false, noiseBuf = null, panel = null;
  let amb = null, chargeVoice = null, musicTimer = null, musicStep = 0, nextNoteTime = 0;
  let env = {weather: 0, night: false, area: 0}, lastThunder = 0;

  const clampVol = n => Math.max(0, Math.min(100, Math.round(+n / 5) * 5));
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (typeof v.music === 'number') vol.music = clampVol(v.music);
    if (typeof v.sfx === 'number') vol.sfx = clampVol(v.sfx);
    if (typeof v.muted === 'boolean') muted = v.muted;
    if (v.mode === 1) vol.music = 0;      // รองรับค่าเดิมจากรุ่นก่อน
    if (v.mode === 2) muted = true;
  } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({music: vol.music, sfx: vol.sfx, muted})); } catch (e) {} };

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = .9;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp); comp.connect(ctx.destination);
    sfxBus = ctx.createGain(); sfxBus.gain.value = .8; sfxBus.connect(master);
    musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(master);
    ambBus = ctx.createGain(); ambBus.gain.value = 0; ambBus.connect(master);
    const len = ctx.sampleRate * 2;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }

  const on = () => ctx && !muted && vol.sfx > 0 && ctx.state === 'running';

  /* ---------- ตัวช่วยสร้างเสียง ---------- */
  function tone({f = 440, f2 = null, type = 'sine', t = 0, dur = .2, vol = .3, attack = .005, bus = sfxBus, detune = 0}) {
    const t0 = ctx.currentTime + t;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.detune.value = detune;
    o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(bus);
    o.start(t0); o.stop(t0 + dur + .05);
  }

  function noise({t = 0, dur = .3, vol = .3, type = 'lowpass', f = 1000, f2 = null, q = 1, attack = .005, bus = sfxBus}) {
    const t0 = ctx.currentTime + t;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.Q.value = q;
    fl.frequency.setValueAtTime(f, t0);
    if (f2) fl.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(fl); fl.connect(g); g.connect(bus);
    s.start(t0, Math.random()); s.stop(t0 + dur + .05);
  }

  const N = {C4: 261.63, D4: 293.66, E4: 329.63, G4: 392, A4: 440, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5};
  const arp = (notes, gap = .08, o = {}) => notes.forEach((n, i) => tone({f: N[n] || n, t: i * gap, ...o}));

  /* ---------- เสียงเอฟเฟกต์ ---------- */
  const fx = {
    click() { tone({f: 900, f2: 600, type: 'triangle', dur: .06, vol: .12}); },
    nav() { tone({f: 520, f2: 760, type: 'triangle', dur: .09, vol: .13}); },
    cast(perfect) {
      noise({dur: .4, vol: .35, type: 'bandpass', f: 600, f2: 2600, q: 1.2, attack: .03});
      tone({f: 300, f2: 120, type: 'sine', t: .28, dur: .25, vol: .22});
      noise({t: .3, dur: .5, vol: .3, type: 'lowpass', f: 2400, f2: 500});
      if (perfect) arp(['E5', 'G5', 'C6'], .07, {t: .1, type: 'sine', dur: .35, vol: .16});
    },
    bite() {
      tone({f: 1175, type: 'sine', dur: .3, vol: .3});
      tone({f: 880, type: 'sine', t: .12, dur: .35, vol: .3});
      tone({f: 1175, type: 'sine', t: .28, dur: .4, vol: .26});
      noise({dur: .15, vol: .2, type: 'lowpass', f: 900, f2: 300});
    },
    hook() {
      tone({f: 160, f2: 70, type: 'sawtooth', dur: .2, vol: .2});
      noise({dur: .25, vol: .25, type: 'bandpass', f: 1400, q: 3});
    },
    reel(power) {
      const j = 1 + Math.random() * .12;
      tone({f: 1500 * j, f2: 900 * j, type: 'square', dur: .035, vol: .05});
      tone({f: 220 * j, f2: 140, type: 'triangle', dur: .07, vol: .09});
      if (power) noise({dur: .06, vol: .05, type: 'highpass', f: 3000});
    },
    surge() {
      tone({f: 110, f2: 60, type: 'sawtooth', dur: .35, vol: .22});
      noise({dur: .4, vol: .22, type: 'lowpass', f: 1200, f2: 250});
    },
    fail() {
      arp([N.G4, N.E4, N.C4], .12, {type: 'triangle', dur: .3, vol: .2});
      noise({t: .05, dur: .4, vol: .12, type: 'lowpass', f: 700, f2: 200});
    },
    splashOut() {
      noise({dur: .5, vol: .38, type: 'lowpass', f: 3200, f2: 400, attack: .01});
      noise({t: .05, dur: .3, vol: .2, type: 'highpass', f: 2500});
    },
    catchFish(tier, isNew, mutation) {
      fx.splashOut();
      const base = ['C5', 'E5', 'G5'];
      const seq = tier >= 4 ? ['C5', 'E5', 'G5', 'C6', 'E6', 'G5', 'C6', 'E6']
        : tier >= 2 ? ['C5', 'E5', 'G5', 'C6', 'E6'] : base;
      arp(seq, tier >= 2 ? .09 : .1, {t: .25, type: 'triangle', dur: .45, vol: .2});
      arp(seq, tier >= 2 ? .09 : .1, {t: .25, type: 'sine', dur: .6, vol: .1, detune: 7});
      if (mutation > 0) arp([N.C6, N.E6, N.C6 * 1.5].map(x => x), .07, {t: .25 + seq.length * .09, type: 'sine', dur: .5, vol: .13 + mutation * .02});
      if (isNew) arp(['G5', 'C6', 'E6'], .1, {t: .25 + seq.length * .09 + .15, type: 'square', dur: .25, vol: .07});
    },
    levelUp() {
      arp(['C5', 'E5', 'G5', 'C6', 'G5', 'C6', 'E6'], .1, {type: 'triangle', dur: .5, vol: .22});
      arp(['C5', 'E5', 'G5', 'C6'], .1, {t: .3, type: 'sine', dur: .8, vol: .12});
    },
    coin() {
      tone({f: 1568, type: 'square', dur: .08, vol: .09});
      tone({f: 2093, type: 'square', t: .07, dur: .3, vol: .09});
      tone({f: 3136, type: 'sine', t: .07, dur: .35, vol: .08});
    },
    sell() { for (let i = 0; i < 4; i++) { tone({f: 1568 + i * 120, type: 'square', t: i * .07, dur: .1, vol: .07}); tone({f: 2093 + i * 160, type: 'sine', t: i * .07 + .03, dur: .22, vol: .08}); } },
    buy() {
      tone({f: 440, f2: 880, type: 'triangle', dur: .15, vol: .18});
      arp(['G5', 'C6'], .09, {t: .12, type: 'sine', dur: .3, vol: .16});
    },
    upgrade() { arp(['C5', 'G5', 'C6', 'E6'], .08, {type: 'triangle', dur: .4, vol: .2}); },
    deny() { tone({f: 180, f2: 140, type: 'square', dur: .14, vol: .1}); },
    thunder() {
      noise({dur: 2.4, vol: .6, type: 'lowpass', f: 380, f2: 60, attack: .08});
      noise({t: .2, dur: 1.8, vol: .35, type: 'lowpass', f: 220, f2: 50, attack: .2});
    }
  };

  /* ---------- เสียงชาร์จ (ไต่โทนตามแถบชาร์จ) ---------- */
  function chargeStart() {
    if (!on()) return;
    chargeStop();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = 220;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.linearRampToValueAtTime(.07, ctx.currentTime + .05);
    o.connect(g); g.connect(sfxBus); o.start();
    chargeVoice = {o, g};
  }
  function chargeSet(v) {
    if (!chargeVoice || !ctx) return;
    chargeVoice.o.frequency.setTargetAtTime(220 + v * 520, ctx.currentTime, .03);
  }
  function chargeStop() {
    if (!chargeVoice) return;
    const {o, g} = chargeVoice; chargeVoice = null;
    try { g.gain.cancelScheduledValues(ctx.currentTime); g.gain.setTargetAtTime(0.0001, ctx.currentTime, .02); o.stop(ctx.currentTime + .12); } catch (e) {}
  }

  /* ---------- บรรยากาศ: คลื่น ลม ฝน ---------- */
  function startAmbient() {
    if (amb || !ctx) return;
    const mk = (type, f, q) => {
      const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
      const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
      const g = ctx.createGain(); g.gain.value = 0;
      s.connect(fl); fl.connect(g); g.connect(ambBus); s.start();
      return {s, fl, g};
    };
    const wave = mk('lowpass', 500, .7), rain = mk('highpass', 2600, .5), wind = mk('bandpass', 700, 1.4);
    const lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = .11; lg.gain.value = .16;
    lfo.connect(lg); lg.connect(wave.g.gain); lfo.start();
    amb = {wave, rain, wind, lfo};
    applyEnv();
  }
  function applyEnv() {
    if (!amb || !ctx) return;
    const w = env.weather, now = ctx.currentTime;
    const rainy = w === 2 ? .12 : w === 3 ? .2 : 0;
    const windy = w === 3 ? .16 : w === 1 || w === 4 ? .05 : .02;
    const deep = env.area === 2 ? .7 : 1;
    amb.wave.g.gain.setTargetAtTime((.2 + (w === 3 ? .12 : 0)) * deep, now, 1);
    amb.wave.fl.frequency.setTargetAtTime((env.night ? 380 : 520) * deep, now, 1);
    amb.rain.g.gain.setTargetAtTime(rainy, now, 1.2);
    amb.wind.g.gain.setTargetAtTime(windy, now, 1.2);
    amb.wind.fl.frequency.setTargetAtTime(w === 3 ? 1100 : 650, now, 1);
  }
  function setEnv(weather, night, area) {
    const changed = env.weather !== weather || env.night !== night || env.area !== area;
    env = {weather, night, area};
    if (changed) applyEnv();
    if (weather === 3 && on() && ctx.currentTime - lastThunder > 14 && Math.random() < .12) {
      lastThunder = ctx.currentTime; fx.thunder();
    }
  }

  /* ---------- เพลงพื้นหลังเบา ๆ ---------- */
  const PROG = [[N.C4, N.E4, N.G4], [N.A4 / 2, N.C4, N.E4], [N.D4 / 1, N.A4 / 2 * 1.5, N.A4], [N.G4 / 2, N.D4, N.G4]];
  const MEL = ['E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5', 'D5'];
  function scheduleMusic() {
    if (!ctx || muted || vol.music <= 0) return;
    const beat = .62;
    while (nextNoteTime < ctx.currentTime + .6) {
      const step = musicStep, bar = Math.floor(step / 8) % PROG.length, t = nextNoteTime - ctx.currentTime;
      const chord = PROG[bar];
      if (step % 8 === 0) chord.forEach(f => tone({f: f / (f > 400 ? 2 : 1), type: 'sine', t, dur: beat * 7, vol: .035, attack: .4, bus: musicBus}));
      if (step % 2 === 0) tone({f: chord[(step / 2) % 3] * 2, type: 'triangle', t, dur: beat * 1.6, vol: .03, attack: .02, bus: musicBus});
      if (step % 4 === 2 && Math.random() < .75) tone({f: N[MEL[(step * 3 + bar) % MEL.length]], type: 'sine', t, dur: beat * 2, vol: .04, attack: .03, bus: musicBus});
      nextNoteTime += beat; musicStep++;
    }
  }
  function startMusic() {
    if (musicTimer || !ctx) return;
    nextNoteTime = ctx.currentTime + .1;
    musicTimer = setInterval(scheduleMusic, 200);
  }
  function stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }

  /* ---------- ควบคุมระดับเสียง ---------- */
  function apply() {
    if (!ctx) return;
    const t = ctx.currentTime, s = muted ? 0 : vol.sfx / 100, m = muted ? 0 : vol.music / 100;
    sfxBus.gain.setTargetAtTime(s * .9, t, .05);
    ambBus.gain.setTargetAtTime(s, t, .15);
    musicBus.gain.setTargetAtTime(m * 1.6, t, .1);
    if (m > 0) startMusic(); else stopMusic();
    if (s <= 0) chargeStop();
    updateButton();
  }
  const silent = () => muted || (vol.music <= 0 && vol.sfx <= 0);
  function updateButton() {
    const b = document.getElementById('soundBtn');
    if (b) {
      const use = b.querySelector('use');
      if (use) use.setAttribute('href', silent() ? '#i-mute' : '#i-sound');
      b.setAttribute('aria-pressed', String(!silent()));
      b.setAttribute('aria-expanded', String(!!panel && !panel.hidden));
      b.classList.toggle('off', silent());
    }
    if (panel) {
      ['music', 'sfx'].forEach(k => {
        const r = panel.querySelector(`input[data-k="${k}"]`), o = panel.querySelector(`output[data-k="${k}"]`);
        if (r) r.value = vol[k];
        if (o) o.textContent = vol[k] + '%';
        panel.querySelector(`.sp-b[data-k="${k}"][data-d="-1"]`).disabled = vol[k] <= 0;
        panel.querySelector(`.sp-b[data-k="${k}"][data-d="1"]`).disabled = vol[k] >= 100;
      });
      const mb = panel.querySelector('.sp-mute');
      mb.textContent = muted ? 'เปิดเสียงทั้งหมด' : 'ปิดเสียงทั้งหมด';
      panel.classList.toggle('is-muted', muted);
    }
  }

  let previewAt = 0;
  function setVolume(kind, value, preview = true) {
    if (!(kind in vol)) return;
    vol[kind] = clampVol(value);
    if (muted && vol[kind] > 0) muted = false;   // ขยับเสียงแล้วให้เปิดเสียงอัตโนมัติ
    save(); unlock(); apply();
    if (preview && kind === 'sfx' && performance.now() - previewAt > 140) { previewAt = performance.now(); api.coin(); }
  }
  function nudge(kind, d) { setVolume(kind, vol[kind] + d * 10); }
  function toggleMute() { muted = !muted; save(); unlock(); apply(); if (!muted) api.coin(); }

  function buildPanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'soundPanel'; panel.className = 'sound-panel'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'ตั้งค่าเสียง');
    const row = (k, name, hint) => `<div class="sp-row"><span class="sp-name">${name}<small>${hint}</small></span>` +
      `<button type="button" class="sp-b" data-k="${k}" data-d="-1" aria-label="ลดเสียง${name}">−</button>` +
      `<input type="range" min="0" max="100" step="5" data-k="${k}" aria-label="ระดับเสียง${name}">` +
      `<button type="button" class="sp-b" data-k="${k}" data-d="1" aria-label="เพิ่มเสียง${name}">+</button>` +
      `<output data-k="${k}"></output></div>`;
    panel.innerHTML = `<div class="sp-head"><b>ตั้งค่าเสียง</b><button type="button" class="sp-x" aria-label="ปิดหน้าต่างตั้งค่าเสียง">✕</button></div>` +
      row('music', 'เพลง', 'ดนตรีพื้นหลัง') + row('sfx', 'เอฟเฟกต์', 'เสียงตกปลา + บรรยากาศ') +
      `<button type="button" class="sp-mute"></button>`;
    panel.addEventListener('click', e => {
      const b = e.target.closest('.sp-b'), x = e.target.closest('.sp-x'), m = e.target.closest('.sp-mute');
      if (b) nudge(b.dataset.k, +b.dataset.d);
      else if (m) toggleMute();
      else if (x) togglePanel(false);
    });
    panel.addEventListener('input', e => { const r = e.target.closest('input[type=range]'); if (r) setVolume(r.dataset.k, r.value); });
    (document.getElementById('app') || document.body).appendChild(panel);
    return panel;
  }
  function togglePanel(force) {
    unlock();
    const p = buildPanel(), open = typeof force === 'boolean' ? force : p.hidden;
    p.hidden = !open;
    updateButton();
  }

  function unlock() {
    if (!ensure()) return;
    if (ctx.state === 'suspended' && !document.hidden) ctx.resume();
    if (!amb) startAmbient();
    apply();
  }

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (!muted) ctx.resume();
  });
  document.addEventListener('DOMContentLoaded', updateButton);
  document.addEventListener('pointerdown', e => {
    if (panel && !panel.hidden && !e.target.closest('#soundPanel, #soundBtn')) togglePanel(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel && !panel.hidden) togglePanel(false); });
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('button:not(#soundBtn):not(.sp-b), .prof')) api.click(); });
  window.addEventListener('pointerdown', unlock, {once: true});
  window.addEventListener('keydown', unlock, {once: true});

  /* ฟังก์ชันสาธารณะ: เรียกผ่าน SFX.ชื่อ() และปลอดภัยแม้ยังไม่ปลดล็อกเสียง */
  const api = {unlock, togglePanel, setVolume, toggleMute, setEnv, chargeStart, chargeSet, chargeStop, updateButton, get muted() { return muted; }, get volume() { return {...vol}; }};
  Object.keys(fx).forEach(k => { api[k] = (...a) => { if (on()) { try { fx[k](...a); } catch (e) {} } }; });
  return api;
})();
