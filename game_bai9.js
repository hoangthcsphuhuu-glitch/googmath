/* ==========================================================================
   TRÒ CHƠI BÀI 9: DẤU HIỆU CHIA HẾT (SGK TOÁN 6 TRANG 34 - 37)
   Thiết kế bám sát KHBD Tuần 05 (Tiết 19, 20) - GV: Lý Hoàng Em
   Tích hợp Nhạc nền đa giai điệu (BGM) & Giọng đọc câu dẫn Tiếng Việt (VoiceNarrator)
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
    this.playTone(560, 'triangle', 0.06, 0, 0.08);
  },

  pop() {
    this.playTone(740, 'sine', 0.08, 0, 0.09);
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

/* ==========================================================================
   HỆ THỐNG NHẠC NỀN (BGM) RIÊNG CHO TỪNG TRÒ CHƠI BÀI 9
   ========================================================================== */
const BGM = {
  enabled: true,
  currentTrack: null,
  timerId: null,
  stepIndex: 0,

  tracks: {
    map: {
      name: 'Hành Trình Dấu Hiệu Số',
      tempo: 320,
      wave: 'sine',
      vol: 0.032,
      notes: [293.66, 369.99, 440.00, 587.33, 440.00, 369.99, 329.63, 440.00]
    },
    stage1: {
      name: 'Thám Tử Con Số 71 001',
      tempo: 260,
      wave: 'triangle',
      vol: 0.035,
      notes: [329.63, 392.00, 493.88, 587.33, 493.88, 392.00, 329.63, 293.66]
    },
    stage2: {
      name: 'Nhịp Điệu Tận Cùng 2 & 5',
      tempo: 240,
      wave: 'sine',
      vol: 0.034,
      notes: [261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63]
    },
    stage3: {
      name: 'Mê Cung Đường Đến Siêu Thị',
      tempo: 250,
      wave: 'triangle',
      vol: 0.034,
      notes: [349.23, 440.00, 523.25, 698.46, 587.33, 523.25, 440.00, 392.00]
    },
    stage4: {
      name: 'Đấu Trường Giải Mã Dấu Sao',
      tempo: 215,
      wave: 'triangle',
      vol: 0.036,
      notes: [392.00, 493.88, 587.33, 659.25, 783.99, 659.25, 587.33, 493.88]
    },
    stage5: {
      name: 'Xưởng Ghép Thẻ Sáng Tạo',
      tempo: 265,
      wave: 'sine',
      vol: 0.035,
      notes: [329.63, 440.00, 523.25, 659.25, 587.33, 523.25, 440.00, 392.00]
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

/* ==========================================================================
   MÁY QUÉT DẤU HIỆU CHIA HẾT CHO 2, 5, 3, 9 (CASIO SIGN-SCANNER)
   ========================================================================== */
const CasioSign = {
  expr: '71001',

  insert(val) {
    Sound.click();
    if (this.expr === '0' || this.expr.includes('➔')) this.expr = '';
    if (this.expr.length < 9) this.expr += val;
    this.render();
  },

  clear() {
    Sound.click();
    this.expr = '';
    this.render('Nhập số để quét');
  },

  backspace() {
    Sound.click();
    this.expr = this.expr.replace(/[^0-9]/g, '').slice(0, -1);
    this.render();
  },

  quickExample(n) {
    Sound.click();
    this.expr = String(n);
    this.evaluate();
  },

  evaluate() {
    const raw = this.expr.replace(/[^0-9]/g, '');
    if (!raw) {
      Sound.error();
      this.render('Chưa nhập số');
      return;
    }
    const n = parseInt(raw, 10);
    const digits = raw.split('').map(Number);
    const sumDigits = digits.reduce((a, b) => a + b, 0);
    const lastDigit = digits[digits.length - 1];

    const div2 = lastDigit % 2 === 0;
    const div5 = lastDigit === 0 || lastDigit === 5;
    const div3 = sumDigits % 3 === 0;
    const div9 = sumDigits % 9 === 0;

    Sound.success();
    this.expr = `${raw} (Tận cùng ${lastDigit}, Tổng CS=${sumDigits})`;
    const parts = [
      div2 ? '⋮ 2' : '∤ 2',
      div5 ? '⋮ 5' : '∤ 5',
      div3 ? '⋮ 3' : '∤ 3',
      div9 ? '⋮ 9' : '∤ 9'
    ];
    this.render(parts.join(' • '));
  },

  render(resText) {
    const eEl = document.getElementById('casio-expr');
    const rEl = document.getElementById('casio-res');
    if (eEl) eEl.textContent = this.expr || '0';
    if (rEl && resText !== undefined) rEl.textContent = resText;
  }
};

/* ==========================================================================
   DANH SÁCH 5 TRÒ CHƠI BÀI 9 (TUẦN 05 - TIẾT 19, 20)
   ========================================================================== */
const QUESTS_9 = [
  {
    id: 1,
    tag: 'Hoạt động Khởi động (5 phút đầu Tiết 19 - SGK tr. 34)',
    title: 'Trò chơi 1: Bí Mật Của Tròn Với Số 71 001',
    icon: '🔍',
    color: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    musicTrack: 'stage1',
    desc: 'Tìm số dư của phép chia 71 001 cho 9 và khám phá vì sao bạn Tròn chỉ nhìn thoáng qua đã biết ngay 71 001 chia hết cho 9!'
  },
  {
    id: 2,
    tag: 'Hình thành kiến thức: Mục 1 (Tiết 19 - SGK tr. 34–35)',
    title: 'Trò chơi 2: Trạm Phân Loại Chữ Số Tận Cùng (2 & 5)',
    icon: '🚦',
    color: 'linear-gradient(135deg, #10b981, #059669)',
    musicTrack: 'stage2',
    desc: 'Khám phá số 23* = 230 + * (HĐ1, HĐ2) để rút ra dấu hiệu chia hết cho 2, cho 5, cho cả 2 và 5 và hoàn thành Luyện tập 1 (SGK tr. 35).'
  },
  {
    id: 3,
    tag: 'Hình thành kiến thức: Mục 2 (Đầu Tiết 20 - SGK tr. 35–36)',
    title: 'Trò chơi 3: Hàng Dừa 108m & Mê Cung Siêu Thị (9 & 3)',
    icon: '🛒',
    color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    musicTrack: 'stage3',
    desc: 'Giải Luyện tập 2 (12* ⋮ 9), Vận dụng trồng dừa trên mảnh đất 108m, Luyện tập 3 (12*5 ⋮ 3) và vượt Mê cung đường đi đến Siêu thị (SGK tr. 36).'
  },
  {
    id: 4,
    tag: 'Hoạt động Luyện tập (Tiết 20 - Bài 2.10 đến 2.14 SGK tr. 37)',
    title: 'Trò chơi 4: Đấu Trường Giải Mã Chữ Số Bí Ẩn 345*',
    icon: '⚡',
    color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    musicTrack: 'stage4',
    desc: 'Chinh phục Bài 2.10, 2.11, bài toán chia nhóm 290 HS và 162 HS (Bài 2.12, 2.13) và tìm chữ số * trong 345* (Bài 2.14).'
  },
  {
    id: 5,
    tag: 'Hoạt động Vận dụng & NLS 3.1TC2a (Bài 2.15, 2.16 & Em có biết)',
    title: 'Trò chơi 5: Xưởng Ghép Thẻ Chữ Số & Giải Mã 99a + 9b',
    icon: '🃏',
    color: 'linear-gradient(135deg, #ec4899, #be185d)',
    musicTrack: 'stage5',
    desc: 'Ghép các thẻ chữ số (3, 0, 4) và (2, 0, 4, 5) trong Bài 2.15, 2.16 và thiết kế sơ đồ giải thích vì sao dấu hiệu chia hết cho 9 dựa vào tổng các chữ số.'
  }
];

/* ==========================================================================
   ĐIỀU KHIỂN ỨNG DỤNG BÀI 9 (APP9)
   ========================================================================== */
const App9 = {
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

    const saved = localStorage.getItem('toan6_bai9_game_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      } catch (e) {}
    } else {
      const prev = localStorage.getItem('toan6_bai8_game_state') || localStorage.getItem('toan6_bai10_game_state') || localStorage.getItem('toan6_bai11_game_state');
      if (prev) {
        try {
          const p = JSON.parse(prev);
          if (p.playerName) {
            this.state.playerName = p.playerName;
            this.state.playerClass = p.playerClass || '';
          }
        } catch (e) {}
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
    localStorage.setItem('toan6_bai9_game_state', JSON.stringify(this.state));
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
    if (!confirm('Em có chắc muốn xóa điểm Bài 9 để chơi lại từ đầu không?')) return;
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
    grid.innerHTML = QUESTS_9.map(q => {
      const stars = this.state.stageStars[q.id] || 0;
      const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
      const trName = BGM.tracks[q.musicTrack]?.name || '';
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
            <button class="btn ${stars === 3 ? 'btn-success' : 'btn-primary'} btn-sm" onclick="App9.openStage(${q.id})">
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
        ? '🔍 ĐẠI THÁM TỬ DẤU HIỆU CHIA HẾT TOÁN 6'
        : total >= 9
          ? '🏅 CHUYÊN GIA NHẬN DIỆN SỐ CHIA HẾT'
          : '🌟 NHÀ THÁM HIỂM TOÁN HỌC KHỐI 6';
      certBox.innerHTML = `
        <div class="cert-card">
          <div style="font-size:2.4rem;">🏆</div>
          <div style="font-size:0.85rem; color:#fde68a; font-weight:700;">BẢNG VINH DANH BÀI 9: DẤU HIỆU CHIA HẾT (2, 5, 9, 3)</div>
          <div class="cert-title">${rank}</div>
          <p style="font-size:1.1rem; margin:0.4rem 0;">
            Học sinh: <strong style="color:#fff;">${this.state.playerName}</strong> • Lớp: <strong style="color:#fbbf24;">${this.state.playerClass}</strong>
          </p>
          <p style="color:var(--text-muted); font-size:0.95rem;">
            Tổng điểm Bài 9: <strong style="color:#fbbf24;">${this.state.score} điểm</strong> | Số sao: <strong style="color:#38bdf8;">${total}/15 ⭐</strong>
          </p>
          <div style="margin-top:0.85rem;">
            <a href="bai10.html" class="btn btn-purple btn-sm" style="text-decoration:none;">🌸 Tiếp tục chinh phục Bài 10 (Số nguyên tố) ▶</a>
          </div>
        </div>
      `;
    } else {
      certBox.innerHTML = '';
    }
  },

  openStage(stageId) {
    Sound.click();
    const q = QUESTS_9.find(x => x.id === stageId);
    BGM.playTrack(q ? q.musicTrack : 'map');

    document.getElementById('screen-welcome').style.display = 'none';
    document.getElementById('screen-map').style.display = 'none';
    document.getElementById('screen-stage').style.display = 'block';

    document.getElementById('stage-header-title').textContent = q ? q.title : `Trò chơi ${stageId}`;

    if (stageId === 1) Stage9_1.render();
    if (stageId === 2) Stage9_2.render(0);
    if (stageId === 3) Stage9_3.render(0);
    if (stageId === 4) Stage9_4.render();
    if (stageId === 5) Stage9_5.render(0);

    if (typeof Mascots !== 'undefined') {
      Mascots.injectDialogue('bai9', stageId);
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 1: BÍ MẬT CỦA BẠN TRÒN VỚI SỐ 71 001 (KHỞI ĐỘNG - SGK tr. 34)
   ========================================================================== */
const Stage9_1 = {
  scannedDigits: [false, false, false, false, false],

  render() {
    document.getElementById('stage-sub-pills').innerHTML = `
      <span class="sub-pill active">Mở đầu Bài 9 (SGK tr. 34)</span>
    `;

    const digits = [7, 1, 0, 0, 1];
    const activeSum = digits.reduce((acc, d, i) => acc + (this.scannedDigits[i] ? d : 0), 0);
    const allScanned = this.scannedDigits.every(Boolean);

    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🔍 Tình huống mở đầu (SGK Toán 6 trang 34)</h3>
        <p>
          Cô giáo yêu cầu tìm số dư của phép chia <strong>71 001</strong> cho <strong>9</strong>. Trong khi bạn Vuông đang cặm cụi đặt tính chia thì bạn Tròn chỉ nhìn thoáng qua đã reo lên: <em>"Phép chia hết, số dư bằng 0!"</em>. Em hãy bấm vào từng chữ số của số <strong>71 001</strong> bên dưới để khám phá bí quyết tính nhẩm của bạn Tròn nhé!
        </p>
      </div>

      <div class="step-card">
        <h4>Bước 1: Bấm vào cả 5 chữ số của số 71 001 để cộng tổng các chữ số</h4>
        <div style="display:flex; gap:0.65rem; justify-content:center; flex-wrap:wrap; margin:0.9rem 0;">
          ${digits.map((d, idx) => `
            <button class="btn ${this.scannedDigits[idx] ? 'btn-primary' : 'btn-outline'}"
                    style="width:68px; height:68px; font-size:1.5rem; font-weight:900; border-radius:14px;"
                    onclick="Stage9_1.toggleDigit(${idx})">
              ${d}
            </button>
          `).join('<span style="align-self:center; font-size:1.4rem; font-weight:800; color:#fbbf24;">+</span>')}
        </div>

        <div style="text-align:center; padding:0.8rem; background:rgba(15,23,42,0.65); border-radius:12px; font-size:1rem;">
          🧮 <strong>Tổng các chữ số đã bấm:</strong>
          <strong style="color:#fbbf24; font-size:1.25rem;">${activeSum}</strong>
          ${allScanned ? `<span style="color:#6ee7b7; margin-left:0.5rem;">(7 + 1 + 0 + 0 + 1 = 9 ⋮ 9!)</span>` : `<span style="color:#94a3b8; margin-left:0.5rem;">(Hãy bấm sáng cả 5 chữ số nhé!)</span>`}
        </div>
      </div>

      <div class="step-card">
        <h4>Bước 2: Giải mã bí quyết của bạn Tròn</h4>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:0.8rem;">
          <div>
            <p style="font-size:0.9rem; margin-bottom:0.35rem;">1. Số dư của phép chia <code>71 001</code> cho <code>9</code> bằng bao nhiêu?</p>
            <select id="s91-q1" class="input-field" style="width:100%;">
              <option value="">-- Chọn số dư --</option>
              <option value="0">Số dư bằng 0 (vì 71 001 = 9 × 7 889 chia hết cho 9)</option>
              <option value="1">Số dư bằng 1</option>
              <option value="7">Số dư bằng 7</option>
            </select>
          </div>
          <div>
            <p style="font-size:0.9rem; margin-bottom:0.35rem;">2. Vì sao bạn Tròn biết ngay <code>71 001</code> chia hết cho 9 mà không cần đặt tính?</p>
            <select id="s91-q2" class="input-field" style="width:100%;">
              <option value="">-- Chọn giải thích --</option>
              <option value="last">Vì chữ số tận cùng là 1</option>
              <option value="sum">Vì tổng các chữ số là 7 + 1 + 0 + 0 + 1 = 9 chia hết cho 9</option>
            </select>
          </div>
        </div>

        <div style="margin-top:0.85rem;">
          <button class="btn btn-success" onclick="Stage9_1.checkFinal()">✅ Kiểm tra &amp; Nhận 3 Sao</button>
        </div>
        <div id="s91-fb" class="feedback-box"></div>
      </div>
    `;
  },

  toggleDigit(idx) {
    Sound.pop();
    this.scannedDigits[idx] = !this.scannedDigits[idx];
    this.render();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai9', 1);
  },

  checkFinal() {
    const q1 = document.getElementById('s91-q1').value;
    const q2 = document.getElementById('s91-q2').value;
    const fb = document.getElementById('s91-fb');

    if (q1 === '0' && q2 === 'sum') {
      Sound.success();
      App9.awardPoints('s9_1_done', 100, 1, 3);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🎉 <strong>Chính xác (+100 điểm, 3 ⭐)!</strong><br/>
        Nhờ dấu hiệu chia hết cho 9 (xét tổng các chữ số <code>7 + 1 + 0 + 0 + 1 = 9 ⋮ 9</code>), bạn Tròn biết ngay <code>71 001 ⋮ 9</code> dư 0!<br/>
        <div style="margin-top:0.6rem;">
          <button class="btn btn-primary btn-sm" onclick="App9.openStage(2)">Sang Trò chơi 2: Dấu Hiệu Chia Hết Cho 2 &amp; 5 ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Em hãy chọn: Số dư bằng 0 và giải thích dựa vào tổng các chữ số 7 + 1 + 0 + 0 + 1 = 9 chia hết cho 9 nhé!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 2: TRẠM PHÂN LOẠI CHỮ SỐ TẬN CÙNG (MỤC 1: CHIA HẾT CHO 2, 5 - SGK tr. 34–35)
   ========================================================================== */
const Stage9_2 = {
  subStep: 0,
  selDiv2: {},
  selDiv5: {},

  render(sub = 0) {
    this.subStep = sub;
    const pills = [
      '2.1. Khám phá số 23* (HĐ1, HĐ2)',
      '2.2. Luyện tập 1 (SGK tr. 35)'
    ];
    document.getElementById('stage-sub-pills').innerHTML = pills.map((p, idx) => `
      <span class="sub-pill ${idx === sub ? 'active' : ''}" style="cursor:pointer" onclick="Stage9_2.render(${idx})">${p}</span>
    `).join('');

    const body = document.getElementById('stage-body');
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    if (sub === 0) {
      body.innerHTML = `
        <div class="story-box">
          <h3>🚦 Chặng 2.1: Khám phá dấu hiệu chia hết cho 2 và cho 5 (SGK tr. 34)</h3>
          <p>
            Xét số tự nhiên <code>n = 23*</code>, có thể viết thành <code>n = 230 + *</code>. Vì <code>230</code> có tận cùng là 0 nên <code>230</code> đã chia hết cho cả 2 và 5. Do đó, tính chia hết của <code>23*</code> cho 2 hoặc cho 5 phụ thuộc hoàn toàn vào chữ số tận cùng <code>*</code>!
          </p>
        </div>

        <div class="step-card">
          <h4>1. HĐ1: Bấm chọn TẤT CẢ các chữ số <code>*</code> để số <code>23*</code> chia hết cho 2:</h4>
          <div class="number-grid" style="margin:0.6rem 0;">
            ${digits.map(d => `
              <div class="num-chip ${this.selDiv2[d] ? 'selected-a' : ''}"
                   onclick="Stage9_2.toggleD2(${d})">${d}</div>
            `).join('')}
          </div>

          <h4 style="margin-top:0.95rem;">2. HĐ2: Bấm chọn TẤT CẢ các chữ số <code>*</code> để số <code>23*</code> chia hết cho 5:</h4>
          <div class="number-grid" style="margin:0.6rem 0;">
            ${digits.map(d => `
              <div class="num-chip ${this.selDiv5[d] ? 'selected-b' : ''}"
                   onclick="Stage9_2.toggleD5(${d})">${d}</div>
            `).join('')}
          </div>

          <h4 style="margin-top:0.95rem;">3. Câu hỏi nhấn mạnh (KHBD Tiết 19): Một số chia hết cho CẢ 2 VÀ 5 khi có chữ số tận cùng là chữ số nào?</h4>
          <select id="s92-both" class="input-field" style="width:100%; margin-top:0.35rem;">
            <option value="">-- Chọn chữ số tận cùng --</option>
            <option value="0">Chữ số tận cùng là 0</option>
            <option value="5">Chữ số tận cùng là 5</option>
            <option value="2">Chữ số tận cùng là 2</option>
          </select>

          <div style="margin-top:0.85rem;">
            <button class="btn btn-success" onclick="Stage9_2.checkSub0()">✅ Kiểm tra Chặng 2.1</button>
          </div>
          <div id="s92-fb0" class="feedback-box"></div>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="story-box">
          <h3>📝 Chặng 2.2: Luyện tập 1 (SGK Toán 6 trang 35)</h3>
          <p>
            Không thực hiện phép tính, em hãy xét chữ số tận cùng của từng số hạng và áp dụng tính chất chia hết của một tổng (hiệu) để hoàn thành Luyện tập 1!
          </p>
        </div>

        <div class="step-card">
          <h4>Chọn kết luận đúng cho 4 câu trong Luyện tập 1 (SGK tr. 35):</h4>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:0.8rem; margin-top:0.5rem;">
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">1a) Tổng <code>1 954 + 1 975</code> có chia hết cho 2 không?</p>
              <select id="s92-lt1a" class="input-field" style="width:100%;">
                <option value="">-- Chọn --</option>
                <option value="yes">Chia hết cho 2</option>
                <option value="no">Không chia hết cho 2 (vì 1954 ⋮ 2 nhưng 1975 ∤ 2)</option>
              </select>
            </div>
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">1b) Hiệu <code>2 020 - 938</code> có chia hết cho 2 không?</p>
              <select id="s92-lt1b" class="input-field" style="width:100%;">
                <option value="">-- Chọn --</option>
                <option value="yes">Chia hết cho 2 (vì 2020 ⋮ 2 và 938 ⋮ 2)</option>
                <option value="no">Không chia hết cho 2</option>
              </select>
            </div>
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">2a) Tổng <code>1 945 + 2 020</code> có chia hết cho 5 không?</p>
              <select id="s92-lt2a" class="input-field" style="width:100%;">
                <option value="">-- Chọn --</option>
                <option value="yes">Chia hết cho 5 (vì 1945 ⋮ 5 và 2020 ⋮ 5)</option>
                <option value="no">Không chia hết cho 5</option>
              </select>
            </div>
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">2b) Hiệu <code>1 954 - 1 930</code> có chia hết cho 5 không?</p>
              <select id="s92-lt2b" class="input-field" style="width:100%;">
                <option value="">-- Chọn --</option>
                <option value="yes">Chia hết cho 5</option>
                <option value="no">Không chia hết cho 5 (vì 1930 ⋮ 5 nhưng 1954 ∤ 5)</option>
              </select>
            </div>
          </div>

          <div style="margin-top:0.85rem;">
            <button class="btn btn-success" onclick="Stage9_2.checkSub1()">✅ Hoàn thành Trò chơi 2</button>
          </div>
          <div id="s92-fb1" class="feedback-box"></div>
        </div>
      `;
    }
  },

  toggleD2(d) {
    Sound.pop();
    this.selDiv2[d] = !this.selDiv2[d];
    this.render(0);
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai9', 2);
  },

  toggleD5(d) {
    Sound.pop();
    this.selDiv5[d] = !this.selDiv5[d];
    this.render(0);
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai9', 2);
  },

  checkSub0() {
    const p2 = Object.keys(this.selDiv2).filter(k => this.selDiv2[k]).map(Number).sort((a, b) => a - b);
    const p5 = Object.keys(this.selDiv5).filter(k => this.selDiv5[k]).map(Number).sort((a, b) => a - b);
    const both = document.getElementById('s92-both').value;
    const fb = document.getElementById('s92-fb0');

    if (JSON.stringify(p2) === JSON.stringify([0, 2, 4, 6, 8]) && JSON.stringify(p5) === JSON.stringify([0, 5]) && both === '0') {
      Sound.success();
      App9.awardPoints('s9_2_sub0', 50, 2, 2);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🎉 <strong>Chính xác (+50 điểm, 2 ⭐)!</strong><br/>
        • Tận cùng là <code>0, 2, 4, 6, 8</code> thì chia hết cho 2.<br/>
        • Tận cùng là <code>0 hoặc 5</code> thì chia hết cho 5.<br/>
        • Tận cùng là <code>0</code> thì chia hết cho cả 2 và 5!<br/>
        <div style="margin-top:0.55rem;">
          <button class="btn btn-primary btn-sm" onclick="Stage9_2.render(1)">Sang Chặng 2.2: Luyện tập 1 ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Kiểm tra lại nhé: Chia hết cho 2 gồm {0; 2; 4; 6; 8}; chia hết cho 5 gồm {0; 5}; chia hết cho cả 2 và 5 là chữ số 0!`;
    }
  },

  checkSub1() {
    const a1 = document.getElementById('s92-lt1a').value;
    const b1 = document.getElementById('s92-lt1b').value;
    const a2 = document.getElementById('s92-lt2a').value;
    const b2 = document.getElementById('s92-lt2b').value;
    const fb = document.getElementById('s92-fb1');

    if (a1 === 'no' && b1 === 'yes' && a2 === 'yes' && b2 === 'no') {
      Sound.success();
      App9.awardPoints('s9_2_sub1', 50, 2, 3);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🏆 <strong>Xuất sắc (+50 điểm, trọn vẹn 3 ⭐ Trò chơi 2)!</strong><br/>
        <code>(1954 + 1975) ∤ 2</code>; <code>(2020 - 938) ⋮ 2</code>; <code>(1945 + 2020) ⋮ 5</code>; <code>(1954 - 1930) ∤ 5</code>.<br/>
        <div style="margin-top:0.6rem;">
          <button class="btn btn-primary btn-sm" onclick="App9.openStage(3)">Sang Trò chơi 3: Dấu Hiệu Chia Hết Cho 9, Cho 3 &amp; Mê Cung ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Xem lại chữ số tận cùng nhé: 1a) Không chia hết cho 2; 1b) Chia hết cho 2; 2a) Chia hết cho 5; 2b) Không chia hết cho 5!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 3: HÀNG DỪA 108M & MÊ CUNG ĐƯỜNG ĐẾN SIÊU THỊ (MỤC 2 - SGK tr. 35–36)
   - Chặng 3.1: Luyện tập 2 (12* ⋮ 9), Vận dụng (108m trồng dừa 9m), Luyện tập 3 (12*5 ⋮ 3)
   - Chặng 3.2: Thử thách nhỏ - Mê cung đường đi đến Siêu thị (21 -> 15 -> 2020 -> 72 -> 123 -> 136 -> 1245)
   ========================================================================== */
const Stage9_3 = {
  subStep: 0,
  mazePath: [21],
  targetPath: [21, 15, 2020, 72, 123, 136, 1245],
  mazeNodes: [
    21, 15, 2020, 19,
    47, 72, 123, 85,
    109, 136, 1245, 97
  ],

  render(sub = 0) {
    this.subStep = sub;
    const pills = [
      '3.1. Luyện tập 2, 3 & Trồng dừa 108m',
      '3.2. Mê cung đường đến Siêu thị (SGK tr. 36)'
    ];
    document.getElementById('stage-sub-pills').innerHTML = pills.map((p, idx) => `
      <span class="sub-pill ${idx === sub ? 'active' : ''}" style="cursor:pointer" onclick="Stage9_3.render(${idx})">${p}</span>
    `).join('');

    const body = document.getElementById('stage-body');

    if (sub === 0) {
      body.innerHTML = `
        <div class="story-box">
          <h3>🌴 Chặng 3.1: Dấu hiệu chia hết cho 9, cho 3 &amp; Bài toán trồng dừa (SGK tr. 35–36)</h3>
          <p>
            • Các số có <strong>tổng các chữ số chia hết cho 9</strong> thì <strong>chia hết cho 9</strong>.<br/>
            • Các số có <strong>tổng các chữ số chia hết cho 3</strong> thì <strong>chia hết cho 3</strong>.
          </p>
        </div>

        <div class="step-card">
          <h4>1. Luyện tập 2 (SGK tr. 36): Thay dấu <code>*</code> bằng một chữ số để số <code>12*</code> chia hết cho 9:</h4>
          <select id="s93-lt2" class="input-field" style="width:100%; margin-top:0.3rem;">
            <option value="">-- Chọn chữ số * --</option>
            <option value="3">* = 3 (vì 1 + 2 + 3 = 6)</option>
            <option value="6">* = 6 (vì 1 + 2 + 6 = 9 ⋮ 9)</option>
            <option value="9">* = 9 (vì 1 + 2 + 9 = 12)</option>
          </select>

          <h4 style="margin-top:0.95rem;">2. Vận dụng (SGK tr. 36): Trên mảnh đất dài <code>108 m</code>, bác nông dân trồng một hàng cây dừa dọc theo mảnh đất sao cho hai cây cách đều nhau <code>9 m</code> và luôn có cây ở hai đầu đất. Bác có trồng được như vậy không và cần bao nhiêu cây dừa?</h4>
          <select id="s93-vd" class="input-field" style="width:100%; margin-top:0.3rem;">
            <option value="">-- Chọn đáp án đúng --</option>
            <option value="12">Trồng được vì 108 ⋮ 9; cần 108 : 9 = 12 cây dừa</option>
            <option value="13">Trồng được vì 108 ⋮ 9 (1+0+8=9); số cây dừa cần trồng là 108 : 9 + 1 = 13 (cây)</option>
            <option value="no">Không trồng được vì 108 không chia hết cho 9</option>
          </select>

          <h4 style="margin-top:0.95rem;">3. Luyện tập 3 (SGK tr. 36): Thay dấu <code>*</code> bằng một chữ số để số <code>12*5</code> chia hết cho 3:</h4>
          <select id="s93-lt3" class="input-field" style="width:100%; margin-top:0.3rem;">
            <option value="">-- Chọn tập hợp chữ số * --</option>
            <option value="correct">Vì 1 + 2 + * + 5 = 8 + * ⋮ 3 nên * ∈ {1; 4; 7}</option>
            <option value="wrong1">* ∈ {0; 3; 6; 9}</option>
            <option value="wrong2">* = 1</option>
          </select>

          <div style="margin-top:0.85rem;">
            <button class="btn btn-success" onclick="Stage9_3.checkSub0()">✅ Kiểm tra Chặng 3.1</button>
          </div>
          <div id="s93-fb0" class="feedback-box"></div>
        </div>
      `;
    } else {
      const nextIdx = this.mazePath.length;
      const isComplete = nextIdx === this.targetPath.length;

      body.innerHTML = `
        <div class="story-box">
          <h3>🛒 Chặng 3.2: Thử thách nhỏ - Đường đi đến Siêu thị (SGK tr. 36)</h3>
          <p>
            Hãy giúp bạn nhỏ tìm đường đến <strong>Siêu thị</strong> bằng cách đi qua các ô theo đúng lộ trình trong Kế hoạch bài dạy:
            <code>21 ➔ 15 ➔ 2020 ➔ 72 ➔ 123 ➔ 136 ➔ 1245 ➔ Siêu thị</code>!
          </p>
        </div>

        <div class="step-card">
          <h4>Bấm vào ô tiếp theo trên đường đi đến Siêu thị (Đang ở bước ${nextIdx}/${this.targetPath.length}):</h4>
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:0.65rem; max-width:520px; margin:0.85rem auto;">
            ${this.mazeNodes.map(num => {
              const stepIdx = this.mazePath.indexOf(num);
              const visited = stepIdx !== -1;
              return `
                <button class="btn ${visited ? 'btn-success' : 'btn-outline'}"
                        style="height:62px; font-size:1.05rem; font-weight:800; position:relative;"
                        onclick="Stage9_3.stepMaze(${num})">
                  ${visited ? `<span style="font-size:0.7rem; position:absolute; top:4px; right:6px;">#${stepIdx + 1}</span>` : ''}
                  ${num}
                </button>
              `;
            }).join('')}
          </div>

          <div style="padding:0.75rem; background:rgba(15,23,42,0.65); border-radius:10px; font-size:0.92rem; margin-bottom:0.75rem;">
            🚩 <strong>Lộ trình đã đi:</strong> <code>${this.mazePath.join(' ➔ ')}${isComplete ? ' ➔ 🏪 SIÊU THỊ!' : ' ➔ ...'}</code>
          </div>

          <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
            <button class="btn btn-outline btn-sm" onclick="Stage9_3.resetMaze()">🔄 Đi lại từ ô 21</button>
            ${isComplete ? `<button class="btn btn-primary btn-sm" onclick="App9.openStage(4)">Sang Trò chơi 4: Đấu Trường Bài 2.10 – 2.14 ▶</button>` : ''}
          </div>
          <div id="s93-fb1" class="feedback-box ${isComplete ? 'show success' : ''}">
            ${isComplete ? '🏆 <strong>Chúc mừng (+60 điểm, trọn vẹn 3 ⭐ Trò chơi 3)!</strong> Em đã dẫn bạn nhỏ đến Siêu thị thành công qua lộ trình: 21 ➔ 15 ➔ 2020 ➔ 72 ➔ 123 ➔ 136 ➔ 1245!' : ''}
          </div>
        </div>
      `;
    }
  },

  checkSub0() {
    const lt2 = document.getElementById('s93-lt2').value;
    const vd = document.getElementById('s93-vd').value;
    const lt3 = document.getElementById('s93-lt3').value;
    const fb = document.getElementById('s93-fb0');

    if (lt2 === '6' && vd === '13' && lt3 === 'correct') {
      Sound.success();
      App9.awardPoints('s9_3_sub0', 50, 3, 2);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🎉 <strong>Chính xác cả 3 bài (+50 điểm, 2 ⭐)!</strong><br/>
        • LT2: <code>* = 6</code> (số 126 ⋮ 9).<br/>
        • Vận dụng: Cần <code>108 : 9 + 1 = 13</code> cây dừa.<br/>
        • LT3: <code>* ∈ {1; 4; 7}</code>.<br/>
        <div style="margin-top:0.55rem;">
          <button class="btn btn-primary btn-sm" onclick="Stage9_3.render(1)">Sang Chặng 3.2: Mê cung đường đến Siêu thị ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Kiểm tra lại nhé: LT2 chọn * = 6; Vận dụng trồng dừa hai đầu đất nên số cây là 108 : 9 + 1 = 13 cây; LT3 chọn * ∈ {1; 4; 7}!`;
    }
  },

  stepMaze(num) {
    const nextExpected = this.targetPath[this.mazePath.length];
    const fb = document.getElementById('s93-fb1');
    if (num === nextExpected) {
      Sound.pop();
      this.mazePath.push(num);
      if (this.mazePath.length === this.targetPath.length) {
        Sound.success();
        App9.awardPoints('s9_3_sub1', 60, 3, 3);
      }
      this.render(1);
      if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai9', 3);
    } else {
      Sound.error();
      if (fb) {
        fb.className = 'feedback-box show error';
        fb.innerHTML = `❌ Ô tiếp theo trong lộ trình phải là số <strong>${nextExpected}</strong> nhé!`;
      }
    }
  },

  resetMaze() {
    Sound.click();
    this.mazePath = [21];
    this.render(1);
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai9', 3);
  }
};

/* ==========================================================================
   TRÒ CHƠI 4: ĐẤU TRƯỜNG GIẢI MÃ CHỮ SỐ BÍ ẨN 345* (BÀI 2.10 – 2.14 SGK tr. 37)
   ========================================================================== */
const Stage9_4 = {
  idx: 0,
  correctCount: 0,
  questions: [
    {
      title: 'Bài 2.10 (SGK tr. 37): Trong các số sau: 324; 248; 2 020; 2 025, số nào chia hết cho 2? Số nào chia hết cho 5?',
      options: [
        'Chia hết cho 2 là: 324; 248; 2 020. Chia hết cho 5 là: 2 020; 2 025',
        'Chia hết cho 2 là: 324; 248. Chia hết cho 5 là: 2 025',
        'Cả 4 số đều chia hết cho 2 và 5'
      ],
      ans: 0,
      explain: '324, 248, 2020 có chữ số tận cùng là 4, 8, 0 nên chia hết cho 2. 2020 và 2025 có tận cùng là 0 và 5 nên chia hết cho 5.'
    },
    {
      title: 'Bài 2.11 (SGK tr. 37): Trong các số sau: 450; 123; 2 019; 2 025, số nào chia hết cho 3? Số nào chia hết cho 9?',
      options: [
        'Chia hết cho 3 là cả 4 số: 450; 123; 2 019; 2 025. Chia hết cho 9 là: 450; 2 025',
        'Chia hết cho 3 là: 123; 2 019. Chia hết cho 9 là: 450; 2 025',
        'Chia hết cho 9 là cả 4 số: 450; 123; 2 019; 2 025'
      ],
      ans: 0,
      explain: 'Tổng các chữ số của 450 (9), 123 (6), 2019 (12), 2025 (9) đều chia hết cho 3; riêng 450 và 2025 có tổng các chữ số bằng 9 nên chia hết cho 9.'
    },
    {
      title: 'Bài 2.12 (SGK tr. 37): Khối lớp 6 của một trường có 290 học sinh đi dã ngoại. Cô phụ trách muốn chia đều số học sinh của khối 6 thành 9 nhóm. Hỏi cô có chia nhóm được như vậy không?',
      options: [
        'Không chia đều được, vì 2 + 9 + 0 = 11 ∤ 9 nên 290 không chia hết cho 9',
        'Chia đều được thành 9 nhóm',
        'Chỉ chia đều được khi mỗi nhóm có 30 học sinh'
      ],
      ans: 0,
      explain: 'Tổng các chữ số của 290 là 2 + 9 + 0 = 11 không chia hết cho 9 nên 290 ∤ 9. Vậy không chia đều thành 9 nhóm được.'
    },
    {
      title: 'Bài 2.13 (SGK tr. 37): Có 162 học sinh tham gia chương trình đào tạo bóng đá, được chia vào các đội. Mỗi đội cần có 9 học sinh. Hỏi có đội nào không đủ 9 học sinh hay không?',
      options: [
        'Không có đội nào thiếu người (các đội đều đủ 9 HS), vì 1 + 6 + 2 = 9 ⋮ 9 nên 162 ⋮ 9',
        'Có 1 đội bị thiếu 2 học sinh',
        'Không chia được vì 162 không chia hết cho 9'
      ],
      ans: 0,
      explain: 'Vì 1 + 6 + 2 = 9 ⋮ 9 nên 162 ⋮ 9 (chia được đúng 18 đội, mỗi đội đủ 9 học sinh).'
    },
    {
      title: 'Bài 2.14 (SGK tr. 37): Thay dấu * bởi một chữ số để số 345* thỏa mãn: a) Chia hết cho 2; b) Chia hết cho 3; c) Chia hết cho 5; d) Chia hết cho 9.',
      options: [
        'a) * ∈ {0; 2; 4; 6; 8};  b) * ∈ {0; 3; 6; 9};  c) * ∈ {0; 5};  d) * = 6',
        'a) * ∈ {0; 2; 4; 6; 8};  b) * ∈ {3; 6; 9};  c) * = 5;  d) * ∈ {0; 9}',
        'a) * ∈ {2; 4; 6; 8};  b) * = 6;  c) * ∈ {0; 5};  d) * = 6'
      ],
      ans: 0,
      explain: 'Tổng các chữ số của 345* là 3 + 4 + 5 + * = 12 + *. Để chia hết cho 3 thì * ∈ {0; 3; 6; 9}; để chia hết cho 9 thì 12 + * = 18 ➔ * = 6!'
    }
  ],

  render() {
    document.getElementById('stage-sub-pills').innerHTML = `
      <span class="sub-pill active">Đấu trường Bài 2.10 – 2.14 (${this.idx + 1}/${this.questions.length})</span>
    `;

    const q = this.questions[this.idx];
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>⚡ Đấu Trường Giải Mã Dấu Hiệu Chia Hết (Bài 2.10 – 2.14 SGK tr. 37)</h3>
        <p>
          Vận dụng linh hoạt dấu hiệu chia hết cho 2, 5, 9, 3 để vượt qua 5 bài tập luyện tập trọng tâm trong SGK trang 37!
        </p>
      </div>

      <div class="step-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <span class="quest-tag">Bài tập ${this.idx + 1} / ${this.questions.length}</span>
          <span style="color:#fbbf24; font-weight:700;">Hoàn thành: ${this.correctCount}/${this.questions.length}</span>
        </div>
        <h4>${q.title}</h4>

        <div style="display:flex; flex-direction:column; gap:0.65rem; margin-top:0.8rem;">
          ${q.options.map((opt, i) => `
            <button class="btn btn-outline" style="text-align:left; justify-content:flex-start; padding:0.75rem 1rem;"
                    onclick="Stage9_4.answer(${i})">
              <strong>${String.fromCharCode(65 + i)}.</strong>&nbsp; ${opt}
            </button>
          `).join('')}
        </div>

        <div id="s94-fb" class="feedback-box"></div>
      </div>
    `;
  },

  answer(choice) {
    const q = this.questions[this.idx];
    const fb = document.getElementById('s94-fb');

    if (choice === q.ans) {
      Sound.success();
      this.correctCount++;
      App9.awardPoints(`s9_4_q${this.idx}`, 30, 4, this.idx === this.questions.length - 1 ? 3 : 2);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        ✅ <strong>Chính xác!</strong> ${q.explain}<br/>
        <div style="margin-top:0.6rem;">
          ${this.idx < this.questions.length - 1
            ? `<button class="btn btn-primary btn-sm" onclick="Stage9_4.next()">Bài tiếp theo ▶</button>`
            : `<button class="btn btn-success btn-sm" onclick="App9.openStage(5)">🏆 Hoàn thành Đấu Trường ➔ Sang Trò chơi 5 ▶</button>`}
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ <strong>Chưa đúng!</strong> Gợi ý: ${q.explain}`;
    }
  },

  next() {
    this.idx++;
    this.render();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai9', 4);
  }
};

/* ==========================================================================
   TRÒ CHƠI 5: XƯỞNG GHÉP THẺ CHỮ SỐ & GIẢI MÃ 99a + 9b (BÀI 2.15, 2.16 & EM CÓ BIẾT)
   ========================================================================== */
const Stage9_5 = {
  subStep: 0,
  sel216: {},

  render(sub = 0) {
    this.subStep = sub;
    const pills = [
      '5.1. Bài 2.15: Ghép thẻ (3, 0, 4)',
      '5.2. Bài 2.16: Ghép thẻ (2, 0, 4, 5)',
      '5.3. Em có biết (NLS 3.1TC2a)'
    ];
    document.getElementById('stage-sub-pills').innerHTML = pills.map((p, idx) => `
      <span class="sub-pill ${idx === sub ? 'active' : ''}" style="cursor:pointer" onclick="Stage9_5.render(${idx})">${p}</span>
    `).join('');

    const body = document.getElementById('stage-body');

    if (sub === 0) {
      body.innerHTML = `
        <div class="story-box">
          <h3>🃏 Chặng 5.1: Bài 2.15 (SGK Toán 6 trang 37)</h3>
          <p>
            Dùng cả ba chữ số <strong>3, 0, 4</strong>, hãy viết các số tự nhiên có <strong>ba chữ số khác nhau</strong> thỏa mãn điều kiện:
          </p>
        </div>

        <div class="step-card">
          <div style="display:flex; gap:0.7rem; justify-content:center; margin:0.65rem 0;">
            <span class="num-chip selected-a" style="width:58px; height:58px; font-size:1.4rem;">3</span>
            <span class="num-chip selected-common" style="width:58px; height:58px; font-size:1.4rem;">0</span>
            <span class="num-chip selected-b" style="width:58px; height:58px; font-size:1.4rem;">4</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.8rem; margin-top:0.75rem;">
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">a) Các số có 3 chữ số khác nhau ghép từ <code>{3, 0, 4}</code> và <strong>chia hết cho 2</strong> là:</p>
              <select id="s95-215a" class="input-field" style="width:100%;">
                <option value="">-- Chọn các số chia hết cho 2 --</option>
                <option value="correct">304; 340; 430 (chữ số hàng trăm khác 0 và tận cùng là 0 hoặc 4)</option>
                <option value="wrong1">034; 304; 340; 430</option>
                <option value="wrong2">340; 403; 430</option>
              </select>
            </div>

            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">b) Các số có 3 chữ số khác nhau ghép từ <code>{3, 0, 4}</code> và <strong>chia hết cho 5</strong> là:</p>
              <select id="s95-215b" class="input-field" style="width:100%;">
                <option value="">-- Chọn các số chia hết cho 5 --</option>
                <option value="wrong1">304; 340; 430</option>
                <option value="correct">340; 430 (tận cùng phải là chữ số 0)</option>
                <option value="wrong2">403; 340</option>
              </select>
            </div>
          </div>

          <div style="margin-top:0.85rem;">
            <button class="btn btn-success" onclick="Stage9_5.checkSub0()">✅ Kiểm tra Bài 2.15</button>
          </div>
          <div id="s95-fb0" class="feedback-box"></div>
        </div>
      `;
    } else if (sub === 1) {
      const candidates216 = [204, 240, 245, 402, 420, 405, 450, 502, 504, 520, 540];
      body.innerHTML = `
        <div class="story-box">
          <h3>🃏 Chặng 5.2: Bài 2.16 (SGK Toán 6 trang 37)</h3>
          <p>
            Từ bốn chữ số <strong>2, 0, 4, 5</strong>, hãy lấy ra <strong>ba chữ số</strong> để ghép thành các số tự nhiên có ba chữ số khác nhau sao cho các số đó <strong>vừa chia hết cho 2, vừa chia hết cho 3</strong>!
          </p>
        </div>

        <div class="step-card">
          <h4>Bấm chọn TẤT CẢ 8 số vừa chia hết cho 2, vừa chia hết cho 3:</h4>
          <p style="font-size:0.84rem; color:var(--text-muted);">
            💡 <em>Gợi ý:</em> Bộ 3 chữ số có tổng chia hết cho 3 là <code>{2, 0, 4}</code> (tổng = 6) và <code>{0, 4, 5}</code> (tổng = 9). Sau đó chọn các số có tận cùng chẵn!
          </p>
          <div class="number-grid" style="margin:0.75rem 0;">
            ${candidates216.map(n => `
              <div class="num-chip ${this.sel216[n] ? 'selected-common' : ''}"
                   style="width:74px; height:52px;"
                   onclick="Stage9_5.toggle216(${n})">${n}</div>
            `).join('')}
          </div>

          <button class="btn btn-success" onclick="Stage9_5.checkSub1()">✅ Kiểm tra Bài 2.16</button>
          <div id="s95-fb1" class="feedback-box"></div>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="story-box">
          <h3>💡 Chặng 5.3: Mục "Em có biết?" &amp; Sơ đồ giải thích dấu hiệu chia hết cho 9 (NLS 3.1TC2a - SGK tr. 37)</h3>
          <p>
            Vì sao một số có tổng các chữ số chia hết cho 9 thì số đó lại chia hết cho 9? Em hãy hoàn thành sơ đồ tách số <code>abc</code> dưới đây để giải thích điều kỳ diệu này nhé!
          </p>
        </div>

        <div class="step-card">
          <h4>Hoàn thành sơ đồ biến đổi số có 3 chữ số <code>abc = 100a + 10b + c</code>:</h4>
          <div style="padding:0.9rem; background:rgba(15,23,42,0.65); border-radius:12px; font-family:monospace; font-size:1rem; margin:0.65rem 0; color:#fde68a;">
            abc = 100a + 10b + c = (99a + 9b) + (a + b + c)
          </div>

          <div style="display:flex; flex-direction:column; gap:0.8rem; margin-top:0.75rem;">
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">1. Tổng <code>(99a + 9b)</code> có luôn chia hết cho 9 với mọi chữ số <code>a, b</code> không?</p>
              <select id="s95-ecb1" class="input-field" style="width:100%;">
                <option value="">-- Chọn câu trả lời --</option>
                <option value="yes">Luôn chia hết cho 9 (vì 99 ⋮ 9 và 9 ⋮ 9)</option>
                <option value="no">Không chia hết cho 9</option>
              </select>
            </div>
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">2. Vậy theo tính chất chia hết của một tổng, số <code>abc</code> chia hết cho 9 khi và chỉ khi nào?</p>
              <select id="s95-ecb2" class="input-field" style="width:100%;">
                <option value="">-- Chọn kết luận --</option>
                <option value="sum">Khi tổng các chữ số (a + b + c) chia hết cho 9</option>
                <option value="last">Khi chữ số c bằng 9</option>
              </select>
            </div>
          </div>

          <div style="margin-top:0.9rem;">
            <button class="btn btn-success" onclick="Stage9_5.checkSub2()">🏆 Hoàn thành Bài 9 &amp; Nhận Bằng Đại Thám Tử</button>
          </div>
          <div id="s95-fb2" class="feedback-box"></div>
        </div>
      `;
    }
  },

  checkSub0() {
    const a = document.getElementById('s95-215a').value;
    const b = document.getElementById('s95-215b').value;
    const fb = document.getElementById('s95-fb0');

    if (a === 'correct' && b === 'correct') {
      Sound.success();
      App9.awardPoints('s9_5_sub0', 40, 5, 1);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🎉 <strong>Chính xác (+40 điểm, 1 ⭐)!</strong><br/>
        • Chia hết cho 2: <code>304; 340; 430</code>.<br/>
        • Chia hết cho 5: <code>340; 430</code>.<br/>
        <div style="margin-top:0.55rem;">
          <button class="btn btn-primary btn-sm" onclick="Stage9_5.render(1)">Sang Chặng 5.2: Bài 2.16 ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Kiểm tra lại nhé: Chữ số hàng trăm phải khác 0. Chia hết cho 2 gồm {304; 340; 430}; chia hết cho 5 gồm {340; 430}!`;
    }
  },

  toggle216(n) {
    Sound.pop();
    this.sel216[n] = !this.sel216[n];
    this.render(1);
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai9', 5);
  },

  checkSub1() {
    const target = [204, 240, 402, 405, 420, 450, 504, 540];
    const picked = Object.keys(this.sel216).filter(k => this.sel216[k]).map(Number).sort((a, b) => a - b);
    const fb = document.getElementById('s95-fb1');

    if (JSON.stringify(picked) === JSON.stringify(target)) {
      Sound.success();
      App9.awardPoints('s9_5_sub1', 45, 5, 2);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🎉 <strong>Tuyệt vời (+45 điểm, 2 ⭐)!</strong><br/>
        Các số lập được theo KHBD là: <code>204; 240; 402; 420; 405; 450; 504; 540</code>!<br/>
        <div style="margin-top:0.55rem;">
          <button class="btn btn-primary btn-sm" onclick="Stage9_5.render(2)">Sang Chặng 5.3: Giải mã 99a + 9b ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Theo KHBD Bài 9 (Bài 2.16), hãy chọn đúng 8 số thuộc hai bộ {2,0,4} và {0,4,5}: 204, 240, 402, 420, 405, 450, 504, 540 (không chọn 245, 502, 520 vì tổng các chữ số không chia hết cho 3)!`;
    }
  },

  checkSub2() {
    const e1 = document.getElementById('s95-ecb1').value;
    const e2 = document.getElementById('s95-ecb2').value;
    const fb = document.getElementById('s95-fb2');

    if (e1 === 'yes' && e2 === 'sum') {
      Sound.success();
      App9.awardPoints('s9_5_sub2', 60, 5, 3);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🏆 <strong>CHÚC MỪNG EM ĐÃ HOÀN THÀNH XUẤT SẮC BÀI 9 (+60 điểm, 3 ⭐)!</strong><br/>
        Em đã làm chủ toàn bộ dấu hiệu chia hết cho 2, 5, 9, 3 và hiểu tận gốc bản chất toán học của chúng!<br/>
        <div style="margin-top:0.65rem; display:flex; gap:0.6rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="App9.showMap()">🗺️ Về Bản Đồ Bài 9 Xem Bằng Vinh Danh</button>
          <a href="bai10.html" class="btn btn-purple btn-sm" style="text-decoration:none;">🌸 Sang Bài 10: Số Nguyên Tố ▶</a>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Hãy chọn: (99a + 9b) luôn chia hết cho 9, và abc chia hết cho 9 khi tổng các chữ số (a + b + c) chia hết cho 9!`;
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  App9.init();
});
