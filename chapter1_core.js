/* ==========================================================================
   BỘ KHUNG TRÒ CHƠI CHƯƠNG I: TẬP HỢP CÁC SỐ TỰ NHIÊN (BÀI 1 ĐẾN BÀI 7)
   Thiết kế bám sát KHBD Tuần 01 -> Tuần 04 (Tiết 1 -> Tiết 16) - GV: Lý Hoàng Em
   Hỗ trợ: Nhạc nền đa giai điệu (BGM), Hiệu ứng âm thanh (Sound),
           Máy tính đa năng Chương I (CasioCh1) & Quản lý Bản đồ / Sao / Điểm
   ========================================================================== */

const Sound = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) {
      btn.innerHTML = this.enabled ? '🔊 Hiệu ứng' : '🔇 Tắt hiệu ứng';
    }
    if (this.enabled) this.click();
  },

  playTone(freq, type = 'sine', duration = 0.14, delay = 0, vol = 0.11) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + delay;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    } catch (e) {}
  },

  click() {
    this.playTone(540, 'triangle', 0.06, 0, 0.08);
  },

  pop() {
    this.playTone(720, 'sine', 0.08, 0, 0.09);
  },

  success() {
    this.playTone(523.25, 'triangle', 0.12, 0, 0.12);
    this.playTone(659.25, 'triangle', 0.12, 0.1, 0.12);
    this.playTone(783.99, 'triangle', 0.14, 0.2, 0.12);
    this.playTone(1046.5, 'sine', 0.28, 0.3, 0.14);
  },

  error() {
    this.playTone(230, 'sawtooth', 0.15, 0, 0.09);
    this.playTone(175, 'sawtooth', 0.22, 0.13, 0.09);
  }
};

const BGM = {
  enabled: true,
  currentTrack: null,
  timerId: null,
  stepIndex: 0,

  tracks: {
    map: {
      name: 'Khám Phá Số Tự Nhiên',
      tempo: 320,
      wave: 'sine',
      vol: 0.032,
      notes: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 392.00]
    },
    stage1: {
      name: 'Khởi Động Hứng Khởi',
      tempo: 260,
      wave: 'triangle',
      vol: 0.034,
      notes: [329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23, 293.66]
    },
    stage2: {
      name: 'Vườn Tri Thức Mới',
      tempo: 280,
      wave: 'sine',
      vol: 0.033,
      notes: [293.66, 349.23, 440.00, 587.33, 523.25, 440.00, 392.00, 349.23]
    },
    stage3: {
      name: 'Thử Thách Tư Duy Logic',
      tempo: 250,
      wave: 'triangle',
      vol: 0.033,
      notes: [261.63, 329.63, 440.00, 523.25, 493.88, 392.00, 329.63, 293.66]
    },
    stage4: {
      name: 'Đấu Trường Tốc Độ',
      tempo: 215,
      wave: 'triangle',
      vol: 0.036,
      notes: [392.00, 440.00, 523.25, 587.33, 659.25, 587.33, 523.25, 440.00]
    },
    stage5: {
      name: 'Chinh Phục Đỉnh Cao',
      tempo: 265,
      wave: 'sine',
      vol: 0.035,
      notes: [349.23, 440.00, 523.25, 698.46, 659.25, 523.25, 440.00, 392.00]
    }
  },

  playTrack(trackKey) {
    this.currentTrack = trackKey;
    this.updateBadge();
    if (!this.enabled) return;
    this.startLoop();
  },

  startLoop() {
    this.stopLoop();
    const tr = this.tracks[this.currentTrack] || this.tracks.map;
    this.stepIndex = 0;

    const tick = () => {
      if (!this.enabled) return;
      const freq = tr.notes[this.stepIndex % tr.notes.length];
      if (freq > 0) {
        Sound.playTone(freq, tr.wave, (tr.tempo / 1000) * 0.85, 0, tr.vol);
      }
      this.stepIndex++;
      this.timerId = setTimeout(tick, tr.tempo);
    };
    tick();
  },

  stopLoop() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    const pill = document.getElementById('bgm-pill');
    const label = document.getElementById('bgm-label');
    if (pill) pill.classList.toggle('muted', !this.enabled);
    if (label) label.textContent = this.enabled ? '🎵 Nhạc nền: Bật' : '🔇 Nhạc nền: Tắt';

    if (this.enabled) {
      Sound.init();
      this.startLoop();
    } else {
      this.stopLoop();
    }
  },

  updateBadge() {
    const badge = document.getElementById('stage-music-badge');
    const tr = this.tracks[this.currentTrack];
    if (badge && tr) {
      badge.textContent = `🎶 Nhạc nền: ${tr.name}`;
    }
  }
};

/* Máy tính đa năng Chương I: Tính biểu thức, Lũy thừa, Đổi số La Mã & Tách cấu tạo số */
const CasioCh1 = {
  expr: '5+3*2',

  insert(val) {
    Sound.click();
    if (this.expr === '0') this.expr = '';
    if (this.expr.length < 22) this.expr += val;
    this.render();
  },

  clear() {
    Sound.click();
    this.expr = '';
    this.render('0');
  },

  backspace() {
    Sound.click();
    this.expr = this.expr.slice(0, -1);
    this.render();
  },

  quickExpr(str) {
    Sound.click();
    this.expr = str;
    this.evaluate();
  },

  evaluate() {
    if (!this.expr.trim()) return;
    try {
      const safe = this.expr
        .replace(/×|·/g, '*')
        .replace(/:/g, '/')
        .replace(/\^/g, '**')
        .replace(/[^0-9+\-*/().]/g, '');
      const val = Function(`"use strict"; return (${safe});`)();
      if (typeof val === 'number' && isFinite(val)) {
        Sound.success();
        this.render(val.toLocaleString('vi-VN'));
      } else {
        throw new Error('Invalid');
      }
    } catch (e) {
      Sound.error();
      this.render('Lỗi biểu thức');
    }
  },

  toRoman() {
    const n = parseInt(this.expr.replace(/[^0-9]/g, ''), 10);
    if (isNaN(n) || n < 1 || n > 39) {
      Sound.error();
      this.render('Nhập 1 ≤ n ≤ 30');
      return;
    }
    const map = [
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let rem = n;
    let res = '';
    for (const [v, sym] of map) {
      while (rem >= v) {
        res += sym;
        rem -= v;
      }
    }
    Sound.success();
    this.render(`La Mã (${n}) = ${res}`);
  },

  expandBase10() {
    const raw = this.expr.replace(/[^0-9]/g, '');
    if (!raw || raw.length > 9) {
      Sound.error();
      this.render('Nhập một số tự nhiên');
      return;
    }
    const len = raw.length;
    const parts = [];
    for (let i = 0; i < len; i++) {
      const d = Number(raw[i]);
      const p = len - 1 - i;
      if (d > 0) {
        parts.push(p === 0 ? `${d}` : p === 1 ? `${d}·10` : `${d}·10^${p}`);
      }
    }
    Sound.success();
    this.render(parts.join(' + ') || '0');
  },

  render(resText) {
    const eEl = document.getElementById('casio-expr');
    const rEl = document.getElementById('casio-res');
    if (eEl) eEl.textContent = this.expr || '0';
    if (rEl && resText !== undefined) rEl.textContent = resText;
  }
};

function createChapter1App(config) {
  const app = {
    state: {
      playerName: '',
      playerClass: '',
      score: 0,
      stageStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      awardedKeys: {}
    },

    init() {
      const slot = document.getElementById('welcome-companion-slot');
      if (slot && typeof Mascots !== 'undefined') {
        slot.innerHTML = Mascots.renderPickerHTML();
      }

      const saved = localStorage.getItem(config.storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.state = { ...this.state, ...parsed };
        } catch (e) {}
      } else {
        const fallbackKeys = [
          'toan6_bai1_game_state', 'toan6_bai2_game_state', 'toan6_bai3_game_state',
          'toan6_bai4_game_state', 'toan6_bai5_game_state', 'toan6_bai6_game_state',
          'toan6_bai7_game_state', 'toan6_bai8_game_state', 'toan6_bai10_game_state',
          'toan6_bai11_game_state'
        ];
        for (const k of fallbackKeys) {
          const prev = localStorage.getItem(k);
          if (prev) {
            try {
              const p = JSON.parse(prev);
              if (p.playerName) {
                this.state.playerName = p.playerName;
                this.state.playerClass = p.playerClass || '';
                break;
              }
            } catch (e) {}
          }
        }
      }

      this.updateHUD();
      if (this.state.playerName) {
        const nEl = document.getElementById('player-name-input');
        const cEl = document.getElementById('player-class-input');
        if (nEl) nEl.value = this.state.playerName;
        if (cEl) cEl.value = this.state.playerClass || '';
        this.showMap();
      }
    },

    save() {
      localStorage.setItem(config.storageKey, JSON.stringify(this.state));
      this.updateHUD();
    },

    awardPoints(key, pts, stageId, starsIfCompleted = 0) {
      if (!this.state.awardedKeys[key]) {
        this.state.awardedKeys[key] = true;
        this.state.score += pts;
      }
      if (stageId && starsIfCompleted > (this.state.stageStars[stageId] || 0)) {
        this.state.stageStars[stageId] = starsIfCompleted;
      }
      this.save();
    },

    totalStars() {
      return Object.values(this.state.stageStars).reduce((a, b) => a + b, 0);
    },

    updateHUD() {
      const nameLabel = this.state.playerName
        ? `👤 ${this.state.playerName}${this.state.playerClass ? ' (' + this.state.playerClass + ')' : ''}`
        : '👤 Khách';
      const pEl = document.getElementById('hud-player');
      if (pEl) pEl.textContent = nameLabel;
      if (typeof Mascots !== 'undefined') Mascots.updateHUDCompanion();
      const scEl = document.getElementById('hud-score');
      const stEl = document.getElementById('hud-stars');
      if (scEl) scEl.textContent = this.state.score;
      if (stEl) stEl.textContent = this.totalStars();
    },

    toggleModal(id) {
      Sound.click();
      const el = document.getElementById(id);
      if (el) el.classList.toggle('open');
    },

    startGame() {
      Sound.init();
      Sound.click();
      const nameInput = document.getElementById('player-name-input').value.trim();
      const classInput = document.getElementById('player-class-input').value.trim();
      this.state.playerName = nameInput || 'Nhà Toán Học Nhí';
      this.state.playerClass = classInput || '6A';
      this.save();
      BGM.playTrack('map');
      this.showMap();
    },

    changePlayer() {
      Sound.click();
      document.getElementById('screen-map').style.display = 'none';
      document.getElementById('screen-stage').style.display = 'none';
      document.getElementById('screen-welcome').style.display = 'block';
    },

    resetProgress() {
      if (!confirm(`Em có chắc muốn xóa điểm ${config.shortTitle} để chơi lại từ đầu không?`)) return;
      Sound.click();
      this.state.score = 0;
      this.state.stageStars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      this.state.awardedKeys = {};
      this.save();
      this.showMap();
    },

    showMap() {
      Sound.click();
      if (typeof VoiceNarrator !== 'undefined') VoiceNarrator.stop();
      BGM.playTrack('map');
      document.getElementById('screen-welcome').style.display = 'none';
      document.getElementById('screen-stage').style.display = 'none';
      document.getElementById('screen-map').style.display = 'block';
      this.renderMap();
    },

    renderMap() {
      const grid = document.getElementById('quest-grid');
      grid.innerHTML = config.quests.map(q => {
        const stars = this.state.stageStars[q.id] || 0;
        const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
        const trName = BGM.tracks[q.musicTrack]?.name || 'Giai Điệu Toán Học';
        return `
          <div class="quest-card ${stars === 3 ? 'completed' : ''}">
            <div>
              <div class="quest-top">
                <div class="quest-icon" style="background:${q.color}">${q.icon}</div>
                <span class="quest-tag">${q.tag}</span>
              </div>
              <div class="quest-title">${q.title}</div>
              <p class="quest-desc">${q.desc}</p>
              <div style="font-size:0.76rem; color:#fde68a; margin-bottom:0.75rem;">
                🎵 Nhạc nền: <em>${trName}</em>
              </div>
            </div>
            <div class="quest-footer">
              <span class="star-display" title="${stars}/3 sao">${starStr}</span>
              <button class="btn ${stars === 3 ? 'btn-success' : 'btn-primary'} btn-sm" onclick="LessonApp.openStage(${q.id})">
                ${stars === 3 ? 'Chơi lại ▶' : 'Vào chơi ▶'}
              </button>
            </div>
          </div>
        `;
      }).join('');

      if (typeof VoiceNarrator !== 'undefined') VoiceNarrator.enhanceMapDOM();

      const certBox = document.getElementById('certificate-section');
      const total = this.totalStars();
      if (total >= 3) {
        const rank = total === 15
          ? config.ranks[0]
          : total >= 9
            ? config.ranks[1]
            : config.ranks[2];
        certBox.innerHTML = `
          <div class="cert-card">
            <div style="font-size:2.4rem;">🏆</div>
            <div style="font-size:0.85rem; color:#fde68a; font-weight:700;">BẢNG VINH DANH ${config.certHeader}</div>
            <div class="cert-title">${rank}</div>
            <p style="font-size:1.1rem; margin:0.4rem 0;">
              Học sinh: <strong style="color:#fff;">${this.state.playerName}</strong> • Lớp: <strong style="color:#fbbf24;">${this.state.playerClass}</strong>
            </p>
            <p style="color:var(--text-muted); font-size:0.95rem;">
              Tổng điểm ${config.shortTitle}: <strong style="color:#fbbf24;">${this.state.score} điểm</strong> | Số sao: <strong style="color:#38bdf8;">${total}/15 ⭐</strong>
            </p>
            ${config.nextLessonHref ? `
              <div style="margin-top:0.85rem;">
                <a href="${config.nextLessonHref}" class="btn btn-accent btn-sm" style="text-decoration:none;">${config.nextLessonLabel} ▶</a>
              </div>
            ` : ''}
          </div>
        `;
      } else {
        certBox.innerHTML = '';
      }
    },

    openStage(stageId) {
      Sound.click();
      const q = config.quests.find(x => x.id === stageId);
      BGM.playTrack(q ? q.musicTrack : 'map');

      document.getElementById('screen-welcome').style.display = 'none';
      document.getElementById('screen-map').style.display = 'none';
      document.getElementById('screen-stage').style.display = 'block';

      document.getElementById('stage-header-title').textContent = q ? q.title : `Trò chơi ${stageId}`;

      const stageHandler = config.stages[stageId];
      if (stageHandler && typeof stageHandler.render === 'function') {
        stageHandler.render(0);
      }

      if (typeof Mascots !== 'undefined') {
        Mascots.injectDialogue(config.lessonKey, stageId);
      }
    }
  };

  window.LessonApp = app;
  window.addEventListener('DOMContentLoaded', () => {
    app.init();
  });
  return app;
}

/* Công cụ tạo nhanh Màn chơi Đấu trường Tương tác hoặc Thử thách Đa bước */
function createInteractiveStage(opts) {
  const state = {
    idx: 0,
    correctCount: 0,
    selectedChips: {}
  };

  return {
    state,
    render() {
      const q = opts.steps[state.idx];
      document.getElementById('stage-sub-pills').innerHTML = opts.steps.map((s, i) => `
        <span class="sub-pill ${i === state.idx ? 'active' : ''}" style="cursor:pointer"
              onclick="window['${opts.globalName}'].goStep(${i})">${s.pill || ('Bước ' + (i + 1))}</span>
      `).join('');

      const body = document.getElementById('stage-body');
      let interactiveHtml = '';

      if (q.chips) {
        const picked = state.selectedChips[state.idx] || {};
        interactiveHtml = `
          <div style="margin:0.75rem 0;">
            <p style="font-size:0.86rem; color:#fde68a; margin-bottom:0.45rem;">👇 <strong>Bấm chọn các thẻ đúng bên dưới:</strong></p>
            <div class="number-grid">
              ${q.chips.map(c => `
                <div class="num-chip ${picked[c] ? 'selected-common' : ''}"
                     style="min-width:68px; padding:0 0.65rem; height:50px; width:auto;"
                     onclick="window['${opts.globalName}'].toggleChip('${c}')">${c}</div>
              `).join('')}
            </div>
          </div>
        `;
      }

      if (q.visualHtml) {
        interactiveHtml = q.visualHtml + interactiveHtml;
      }

      body.innerHTML = `
        <div class="story-box">
          <h3>${opts.storyTitle}</h3>
          <p>${opts.storyDesc}</p>
        </div>

        <div class="step-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.45rem;">
            <span class="quest-tag">${q.pill || ('Thử thách ' + (state.idx + 1) + '/' + opts.steps.length)}</span>
            <span style="color:#fbbf24; font-weight:700;">Bước ${state.idx + 1}/${opts.steps.length}</span>
          </div>
          <h4>${q.title}</h4>
          ${q.prompt ? `<p style="font-size:0.9rem; color:var(--text-muted); margin-top:0.25rem;">${q.prompt}</p>` : ''}

          ${interactiveHtml}

          <div style="display:flex; flex-direction:column; gap:0.6rem; margin-top:0.8rem;">
            ${q.options.map((opt, i) => `
              <button class="btn btn-outline" style="text-align:left; justify-content:flex-start; padding:0.75rem 1rem;"
                      onclick="window['${opts.globalName}'].answer(${i})">
                <strong>${String.fromCharCode(65 + i)}.</strong>&nbsp; ${opt}
              </button>
            `).join('')}
          </div>

          <div id="${opts.globalName}-fb" class="feedback-box"></div>
        </div>
      `;
    },

    goStep(i) {
      Sound.click();
      state.idx = i;
      this.render();
      if (typeof Mascots !== 'undefined') Mascots.injectDialogue(opts.lessonKey, opts.stageId);
    },

    toggleChip(val) {
      Sound.pop();
      if (!state.selectedChips[state.idx]) state.selectedChips[state.idx] = {};
      state.selectedChips[state.idx][val] = !state.selectedChips[state.idx][val];
      this.render();
      if (typeof Mascots !== 'undefined') Mascots.injectDialogue(opts.lessonKey, opts.stageId);
    },

    answer(choice) {
      const q = opts.steps[state.idx];
      const fb = document.getElementById(`${opts.globalName}-fb`);

      if (q.requiredChips) {
        const pickedObj = state.selectedChips[state.idx] || {};
        const picked = Object.keys(pickedObj).filter(k => pickedObj[k]).sort();
        const req = [...q.requiredChips].map(String).sort();
        if (JSON.stringify(picked) !== JSON.stringify(req)) {
          Sound.error();
          fb.className = 'feedback-box show error';
          fb.innerHTML = `❌ <strong>Em hãy bấm chọn đúng các thẻ phía trên trước nhé!</strong> Cần chọn: <code>${q.requiredChips.join('; ')}</code>.`;
          return;
        }
      }

      if (choice === q.ans) {
        Sound.success();
        const isLast = state.idx === opts.steps.length - 1;
        const stars = isLast ? 3 : (state.idx + 1 >= Math.ceil(opts.steps.length / 2) ? 2 : 1);
        LessonApp.awardPoints(`${opts.lessonKey}_s${opts.stageId}_step${state.idx}`, q.pts || 40, opts.stageId, stars);

        fb.className = 'feedback-box show success';
        fb.innerHTML = `
          🎉 <strong>Chính xác (+${q.pts || 40} điểm)!</strong> ${q.explain}<br/>
          <div style="margin-top:0.6rem; display:flex; gap:0.6rem; flex-wrap:wrap;">
            ${!isLast
              ? `<button class="btn btn-primary btn-sm" onclick="window['${opts.globalName}'].goStep(${state.idx + 1})">Tiếp tục Bước ${state.idx + 2} ▶</button>`
              : (opts.nextStageId
                  ? `<button class="btn btn-success btn-sm" onclick="LessonApp.openStage(${opts.nextStageId})">🏆 Hoàn thành 3 ⭐ ➔ Sang Trò chơi ${opts.nextStageId} ▶</button>`
                  : `<button class="btn btn-success btn-sm" onclick="LessonApp.showMap()">🏆 Hoàn thành trọn vẹn bài học ➔ Xem Bằng Vinh Danh</button>`
                )
            }
          </div>
        `;
      } else {
        Sound.error();
        fb.className = 'feedback-box show error';
        fb.innerHTML = `❌ <strong>Chưa chính xác!</strong> Gợi ý: ${q.explain}`;
      }
    }
  };
}

