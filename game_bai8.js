/* ==========================================================================
   TRÒ CHƠI BÀI 8: QUAN HỆ CHIA HẾT VÀ TÍNH CHẤT (SGK TOÁN 6 TRANG 29 - 33)
   Thiết kế bám sát KHBD Tuần 05 (Tiết 17, 18) - GV: Lý Hoàng Em
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

/* ==========================================================================
   HỆ THỐNG NHẠC NỀN (BGM) RIÊNG CHO TỪNG TRÒ CHƠI BÀI 8
   ========================================================================== */
const BGM = {
  enabled: true,
  currentTrack: null,
  timerId: null,
  stepIndex: 0,

  tracks: {
    map: {
      name: 'Khởi Đầu Chương Mới',
      tempo: 330,
      wave: 'sine',
      vol: 0.032,
      notes: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 392.00]
    },
    stage1: {
      name: 'Lớp Học Vui Nhộn',
      tempo: 260,
      wave: 'triangle',
      vol: 0.035,
      notes: [329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23, 293.66]
    },
    stage2: {
      name: 'Thợ Săn Ước & Bội',
      tempo: 280,
      wave: 'sine',
      vol: 0.034,
      notes: [293.66, 349.23, 440.00, 587.33, 523.25, 440.00, 392.00, 349.23]
    },
    stage3: {
      name: 'Nhịp Điệu Cân Bằng Tổng',
      tempo: 250,
      wave: 'triangle',
      vol: 0.033,
      notes: [261.63, 329.63, 440.00, 523.25, 493.88, 392.00, 329.63, 293.66]
    },
    stage4: {
      name: 'Đấu Trường Chia Hết',
      tempo: 215,
      wave: 'triangle',
      vol: 0.036,
      notes: [392.00, 440.00, 523.25, 587.33, 659.25, 587.33, 523.25, 440.00]
    },
    stage5: {
      name: 'Ngày Hội Thể Thao Khối 6',
      tempo: 270,
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

/* ==========================================================================
   MÁY TÍNH ƯỚC & BỘI ẢO (CASIO DIVISOR & MULTIPLE EXPLORER)
   ========================================================================== */
const CasioDiv = {
  expr: '20',

  insert(val) {
    Sound.click();
    if (this.expr === '0' || this.expr.startsWith('Ư(') || this.expr.startsWith('B(')) this.expr = '';
    if (this.expr.length < 5) this.expr += val;
    this.render();
  },

  clear() {
    Sound.click();
    this.expr = '';
    this.render('0');
  },

  backspace() {
    Sound.click();
    this.expr = this.expr.replace(/[^0-9]/g, '').slice(0, -1);
    this.render();
  },

  quickExample(n) {
    Sound.click();
    this.expr = String(n);
    this.findDivisors();
  },

  findDivisors() {
    const raw = this.expr.replace(/[^0-9]/g, '');
    const n = parseInt(raw, 10);
    if (isNaN(n) || n < 1 || n > 10000) {
      Sound.error();
      this.render('Nhập 1 ≤ n ≤ 9999');
      return;
    }
    const divs = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) divs.push(i);
    }
    Sound.success();
    this.expr = `Ư(${n})`;
    this.render(`{${divs.join('; ')}}`);
  },

  findMultiples() {
    const raw = this.expr.replace(/[^0-9]/g, '');
    const n = parseInt(raw, 10);
    if (isNaN(n) || n < 1 || n > 10000) {
      Sound.error();
      this.render('Nhập 1 ≤ n ≤ 9999');
      return;
    }
    const muls = [];
    for (let k = 0; k <= 8; k++) {
      muls.push(n * k);
    }
    Sound.success();
    this.expr = `B(${n})`;
    this.render(`{${muls.join('; ')}; ...}`);
  },

  render(resText) {
    const eEl = document.getElementById('casio-expr');
    const rEl = document.getElementById('casio-res');
    if (eEl) eEl.textContent = this.expr || '0';
    if (rEl && resText !== undefined) rEl.textContent = resText;
  }
};

/* ==========================================================================
   DANH SÁCH 5 TRÒ CHƠI BÀI 8 (TUẦN 05 - TIẾT 17, 18)
   ========================================================================== */
const QUESTS_8 = [
  {
    id: 1,
    tag: 'Hoạt động Khởi động (5 phút đầu Tiết 17 - SGK tr. 29)',
    title: 'Trò chơi 1: Chia Đều Phần Thưởng Lớp 6A',
    icon: '🎁',
    color: 'linear-gradient(135deg, #10b981, #059669)',
    musicTrack: 'stage1',
    desc: 'Lớp 6A được thưởng 50 cái bút rời và thêm 4 hộp bút nữa (số bút mỗi hộp như nhau). Khám phá xem có thể chia đều toàn bộ số bút cho 4 tổ được không!'
  },
  {
    id: 2,
    tag: 'Hình thành kiến thức: Mục 1 (Tiết 17 - SGK tr. 30–31)',
    title: 'Trò chơi 2: Thợ Săn Ước & Bội - Kí Hiệu Chia Hết',
    icon: '🎯',
    color: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    musicTrack: 'stage2',
    desc: 'Làm chủ kí hiệu ⋮ và ∤, tìm tập hợp Ư(12), Ư(20), các bội nhỏ hơn 50 của 4 và giải Thử thách nhỏ tìm 3 ước của 12 có tổng bằng 12.'
  },
  {
    id: 3,
    tag: 'Hình thành kiến thức: Mục 2 (Đầu Tiết 18 - SGK tr. 31–33)',
    title: 'Trò chơi 3: Cân Bằng Tính Chất Chia Hết Của Một Tổng',
    icon: '⚖️',
    color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    musicTrack: 'stage3',
    desc: 'Vận dụng Tính chất 1 (chia hết), Tính chất 2 (không chia hết) cho tổng và hiệu, giải Vận dụng 1, 2 và kiểm chứng mẹo chia hết trên mạng (NLS 1.2TC1a).'
  },
  {
    id: 4,
    tag: 'Hoạt động Luyện tập (Tiết 18 - Bài 2.1 đến 2.6 SGK tr. 33)',
    title: 'Trò chơi 4: Đấu Trường Nhận Diện Quan Hệ Chia Hết',
    icon: '⚡',
    color: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    musicTrack: 'stage4',
    desc: 'Tương tác tốc độ giải trọn bộ Bài tập 2.1, 2.2, 2.3, 2.4, 2.5 và 2.6 (SGK tr. 33) phát triển năng lực số 2.1TC1a.'
  },
  {
    id: 5,
    tag: 'Hoạt động Vận dụng (Tiết 18 - Bài 2.7 đến 2.9 SGK tr. 33)',
    title: 'Trò chơi 5: Nhà Tổ Chức Sự Kiện & Thể Thao Khối 6',
    icon: '🏅',
    color: 'linear-gradient(135deg, #ec4899, #be185d)',
    musicTrack: 'stage5',
    desc: 'Chia nhóm cho 40 học sinh (Bài 2.7), xếp nhóm cho 45 vận động viên (Bài 2.8) và tìm ẩn số x trong tổng chia hết / không chia hết (Bài 2.9).'
  }
];

/* ==========================================================================
   ĐIỀU KHIỂN ỨNG DỤNG BÀI 8 (APP8)
   ========================================================================== */
const App8 = {
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

    const saved = localStorage.getItem('toan6_bai8_game_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      } catch (e) {}
    } else {
      const prev10 = localStorage.getItem('toan6_bai10_game_state') || localStorage.getItem('toan6_bai11_game_state');
      if (prev10) {
        try {
          const p10 = JSON.parse(prev10);
          if (p10.playerName) {
            this.state.playerName = p10.playerName;
            this.state.playerClass = p10.playerClass || '';
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
    localStorage.setItem('toan6_bai8_game_state', JSON.stringify(this.state));
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
    if (!confirm('Em có chắc muốn xóa điểm Bài 8 để chơi lại từ đầu không?')) return;
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
    grid.innerHTML = QUESTS_8.map(q => {
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
            <div style="font-size:0.76rem; color:#a7f3d0; margin-bottom:0.75rem;">
              🎵 Nhạc nền: <em>${trName}</em>
            </div>
          </div>
          <div class="quest-footer">
            <span class="star-display" title="${stars}/3 sao">${starStr}</span>
            <button class="btn ${stars === 3 ? 'btn-success' : 'btn-primary'} btn-sm" onclick="App8.openStage(${q.id})">
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
        ? '⚖️ ĐẠI KIỆN TƯỚNG QUAN HỆ CHIA HẾT TOÁN 6'
        : total >= 9
          ? '🏅 CHIẾN BINH ƯỚC & BỘI XUẤT SẮC'
          : '🌟 NHÀ THÁM HIỂM TOÁN HỌC KHỐI 6';
      certBox.innerHTML = `
        <div class="cert-card">
          <div style="font-size:2.4rem;">🏆</div>
          <div style="font-size:0.85rem; color:#6ee7b7; font-weight:700;">BẢNG VINH DANH BÀI 8: QUAN HỆ CHIA HẾT & TÍNH CHẤT</div>
          <div class="cert-title">${rank}</div>
          <p style="font-size:1.1rem; margin:0.4rem 0;">
            Học sinh: <strong style="color:#fff;">${this.state.playerName}</strong> • Lớp: <strong style="color:#fbbf24;">${this.state.playerClass}</strong>
          </p>
          <p style="color:var(--text-muted); font-size:0.95rem;">
            Tổng điểm Bài 8: <strong style="color:#fbbf24;">${this.state.score} điểm</strong> | Số sao: <strong style="color:#38bdf8;">${total}/15 ⭐</strong>
          </p>
          <div style="margin-top:0.85rem;">
            <a href="bai9.html" class="btn btn-accent btn-sm" style="text-decoration:none;">🔍 Tiếp tục chinh phục Bài 9 (Dấu hiệu chia hết) ▶</a>
          </div>
        </div>
      `;
    } else {
      certBox.innerHTML = '';
    }
  },

  openStage(stageId) {
    Sound.click();
    const q = QUESTS_8.find(x => x.id === stageId);
    BGM.playTrack(q ? q.musicTrack : 'map');

    document.getElementById('screen-welcome').style.display = 'none';
    document.getElementById('screen-map').style.display = 'none';
    document.getElementById('screen-stage').style.display = 'block';

    document.getElementById('stage-header-title').textContent = q ? q.title : `Trò chơi ${stageId}`;

    if (stageId === 1) Stage8_1.render();
    if (stageId === 2) Stage8_2.render(0);
    if (stageId === 3) Stage8_3.render(0);
    if (stageId === 4) Stage8_4.render();
    if (stageId === 5) Stage8_5.render(0);

    if (typeof Mascots !== 'undefined') {
      Mascots.injectDialogue('bai8', stageId);
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 1: CHIA ĐỀU PHẦN THƯỞNG LỚP 6A (KHỞI ĐỘNG - SGK tr. 29)
   Lớp 6A được thưởng 50 cái bút và thêm 4 hộp bút nữa. Có chia đều cho 4 tổ được không?
   ========================================================================== */
const Stage8_1 = {
  pensPerBox: 10,

  render() {
    document.getElementById('stage-sub-pills').innerHTML = `
      <span class="sub-pill active">Mở đầu Chương II (SGK tr. 29)</span>
    `;

    const totalInBoxes = 4 * this.pensPerBox;
    const grandTotal = 50 + totalInBoxes;
    const perGroup = Math.floor(grandTotal / 4);
    const rem = grandTotal % 4;

    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🎁 Bài toán mở đầu (SGK Toán 6 trang 29)</h3>
        <p>
          Nhân dịp sơ kết thi đua, lớp 6A được thưởng <strong>50 cái bút rời</strong> và thêm <strong>4 hộp bút</strong> nữa (số bút trong mỗi hộp là như nhau). Cô giáo muốn chia đều toàn bộ số bút đó cho <strong>4 tổ</strong>. Em hãy thử thay đổi số bút trong mỗi hộp bên dưới và quan sát xem <strong>có khi nào chia đều vừa khít cho 4 tổ mà không bị dư cái bút nào không</strong> nhé!
        </p>
      </div>

      <div class="step-card">
        <h4>Bước 1: Thử nghiệm chọn số bút trong mỗi hộp</h4>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin:0.65rem 0;">
          ${[6, 8, 10, 12, 15, 20].map(k => `
            <button class="btn ${this.pensPerBox === k ? 'btn-primary' : 'btn-outline'} btn-sm"
                    onclick="Stage8_1.setBoxPens(${k})">
              📦 Mỗi hộp có ${k} bút
            </button>
          `).join('')}
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:0.8rem; margin-top:0.8rem;">
          <div style="background:rgba(16,185,129,0.14); border:1px solid rgba(16,185,129,0.4); border-radius:12px; padding:0.9rem;">
            <div style="font-weight:800; color:#6ee7b7; margin-bottom:0.35rem;">📦 4 Hộp bút nguyên (${this.pensPerBox} bút/hộp)</div>
            <div style="font-size:1.4rem; margin:0.25rem 0;">📦 📦 📦 📦</div>
            <div style="font-size:0.88rem; color:#d1fae5;">
              Tổng: <strong>4 × ${this.pensPerBox} = ${totalInBoxes} bút</strong><br/>
              ➔ Chia cho 4 tổ: mỗi tổ nhận đúng <strong>1 hộp (${this.pensPerBox} bút)</strong>, <strong>dư 0 bút</strong>!
            </div>
          </div>

          <div style="background:rgba(244,63,94,0.14); border:1px solid rgba(244,63,94,0.4); border-radius:12px; padding:0.9rem;">
            <div style="font-weight:800; color:#fda4af; margin-bottom:0.35rem;">🖊️ 50 Cái bút rời</div>
            <div style="font-size:1.4rem; margin:0.25rem 0;">🖊️ × 50</div>
            <div style="font-size:0.88rem; color:#ffe4e6;">
              Ta có: <strong>50 = 4 × 12 + 2</strong><br/>
              ➔ Chia cho 4 tổ: mỗi tổ nhận thêm <strong>12 bút</strong>, và <strong>LUÔN DƯ ${rem} BÚT</strong>!
            </div>
          </div>
        </div>

        <div style="margin-top:0.75rem; padding:0.75rem; background:rgba(15,23,42,0.65); border-radius:10px; font-size:0.92rem;">
          📊 <strong>Kết quả khi mỗi hộp có ${this.pensPerBox} bút:</strong> Tổng số bút là <code>50 + ${totalInBoxes} = ${grandTotal}</code> bút. Chia cho 4 tổ thì mỗi tổ được <strong>${perGroup} bút</strong> và vẫn <strong>dư ${rem} cái bút</strong>!
        </div>
      </div>

      <div class="step-card">
        <h4>Bước 2: Rút ra kết luận mở đầu Chương II</h4>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:0.85rem;">
          <div>
            <p style="font-size:0.9rem; margin-bottom:0.35rem;">1. Số bút trong 4 hộp (<code>4 × k</code>) có luôn chia hết cho 4 tổ không?</p>
            <select id="s81-q1" class="input-field" style="width:100%;">
              <option value="">-- Chọn câu trả lời --</option>
              <option value="yes">Luôn chia hết cho 4 (vì mỗi tổ nhận nguyên 1 hộp)</option>
              <option value="no">Không chia hết cho 4</option>
            </select>
          </div>
          <div>
            <p style="font-size:0.9rem; margin-bottom:0.35rem;">2. Vậy không cần biết mỗi hộp có bao nhiêu bút, có thể chia đều toàn bộ số bút cho 4 tổ được không?</p>
            <select id="s81-q2" class="input-field" style="width:100%;">
              <option value="">-- Chọn kết luận --</option>
              <option value="can">Có thể chia đều cho 4 tổ</option>
              <option value="cannot">Không thể chia đều cho 4 tổ (vì 50 không chia hết cho 4, luôn dư 2 bút)</option>
            </select>
          </div>
        </div>

        <div style="margin-top:0.9rem;">
          <button class="btn btn-success" onclick="Stage8_1.checkFinal()">✅ Kiểm tra &amp; Nhận 3 Sao</button>
        </div>
        <div id="s81-fb" class="feedback-box"></div>
      </div>
    `;
  },

  setBoxPens(k) {
    Sound.pop();
    this.pensPerBox = k;
    this.render();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai8', 1);
  },

  checkFinal() {
    const q1 = document.getElementById('s81-q1').value;
    const q2 = document.getElementById('s81-q2').value;
    const fb = document.getElementById('s81-fb');

    if (q1 === 'yes' && q2 === 'cannot') {
      Sound.success();
      App8.awardPoints('s8_1_done', 100, 1, 3);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🎉 <strong>Chính xác tuyệt đối (+100 điểm, 3 ⭐)!</strong><br/>
        • Vì số bút trong 4 hộp là <code>4 · k</code> luôn chia hết cho 4, còn <code>50 = 4 · 12 + 2</code> không chia hết cho 4, nên tổng số bút <code>(50 + 4 · k)</code> <strong>không chia hết cho 4</strong>!<br/>
        <div style="margin-top:0.6rem;">
          <button class="btn btn-primary btn-sm" onclick="App8.openStage(2)">Sang Trò chơi 2: Thợ Săn Ước &amp; Bội ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Em hãy nhìn lại nhé: 4 hộp bút chia đều cho 4 tổ (mỗi tổ 1 hộp), nhưng 50 cái bút rời chia cho 4 tổ thì dư 2 bút. Vậy tổng số bút không thể chia đều cho 4 tổ!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 2: THỢ SĂN ƯỚC & BỘI - KÍ HIỆU CHIA HẾT (MỤC 1 - SGK tr. 30–31)
   - Chặng 2.1: Kí hiệu ⋮ và ∤ (? SGK tr. 30: 24 ⋮ 6, 45 ∤ 10, 35 ⋮ 5, 42 ∤ 4) & HĐ1, HĐ2
   - Chặng 2.2: Luyện tập 1 (SGK tr. 31): a) Ư(20); b) Các bội nhỏ hơn 50 của 4
   - Chặng 2.3: Thử thách nhỏ (SGK tr. 31): Ba ước khác nhau của 12 có tổng bằng 12
   ========================================================================== */
const Stage8_2 = {
  subStep: 0,
  selectedDiv20: {},
  selectedMul4: {},
  selectedPerf12: {},

  render(sub = 0) {
    this.subStep = sub;
    const pills = ['2.1. Kí hiệu ⋮ & ∤', '2.2. Luyện tập 1: Ư(20) & B(4)', '2.3. Thử thách nhỏ: Tổng 3 ước = 12'];
    document.getElementById('stage-sub-pills').innerHTML = pills.map((p, idx) => `
      <span class="sub-pill ${idx === sub ? 'active' : ''}" style="cursor:pointer" onclick="Stage8_2.render(${idx})">${p}</span>
    `).join('');

    const body = document.getElementById('stage-body');

    if (sub === 0) {
      body.innerHTML = `
        <div class="story-box">
          <h3>🎯 Chặng 2.1: Quan hệ chia hết và kí hiệu ⋮, ∤ (SGK tr. 30)</h3>
          <p>
            Cho hai số tự nhiên <code>a</code> và <code>b</code> (<code>b ≠ 0</code>). Nếu có số tự nhiên <code>k</code> sao cho <code>a = k · b</code> thì ta nói <code>a</code> chia hết cho <code>b</code>, kí hiệu là <strong>a ⋮ b</strong>. Nếu <code>a</code> không chia hết cho <code>b</code>, ta kí hiệu là <strong>a ∤ b</strong>. Em hãy hoàn thành câu hỏi <code>?</code> và HĐ1, HĐ2 trang 30 nhé!
          </p>
        </div>

        <div class="step-card">
          <h4>1. Câu hỏi ? (SGK tr. 30): Chọn kí hiệu thích hợp (⋮ hoặc ∤)</h4>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap:0.75rem; margin-top:0.6rem;">
            <div style="background:rgba(15,23,42,0.6); padding:0.75rem; border-radius:10px;">
              <strong>a) 24 ... 6</strong>
              <select id="s82-sym1" class="input-field" style="width:100%; margin-top:0.35rem;">
                <option value="">-- Chọn --</option>
                <option value="div">24 ⋮ 6 (Chia hết)</option>
                <option value="ndiv">24 ∤ 6 (Không chia hết)</option>
              </select>
            </div>
            <div style="background:rgba(15,23,42,0.6); padding:0.75rem; border-radius:10px;">
              <strong>b) 45 ... 10</strong>
              <select id="s82-sym2" class="input-field" style="width:100%; margin-top:0.35rem;">
                <option value="">-- Chọn --</option>
                <option value="div">45 ⋮ 10 (Chia hết)</option>
                <option value="ndiv">45 ∤ 10 (Không chia hết)</option>
              </select>
            </div>
            <div style="background:rgba(15,23,42,0.6); padding:0.75rem; border-radius:10px;">
              <strong>c) 35 ... 5</strong>
              <select id="s82-sym3" class="input-field" style="width:100%; margin-top:0.35rem;">
                <option value="">-- Chọn --</option>
                <option value="div">35 ⋮ 5 (Chia hết)</option>
                <option value="ndiv">35 ∤ 5 (Không chia hết)</option>
              </select>
            </div>
            <div style="background:rgba(15,23,42,0.6); padding:0.75rem; border-radius:10px;">
              <strong>d) 42 ... 4</strong>
              <select id="s82-sym4" class="input-field" style="width:100%; margin-top:0.35rem;">
                <option value="">-- Chọn --</option>
                <option value="div">42 ⋮ 4 (Chia hết)</option>
                <option value="ndiv">42 ∤ 4 (Không chia hết)</option>
              </select>
            </div>
          </div>

          <div style="margin-top:0.9rem;">
            <p style="font-size:0.9rem; margin-bottom:0.35rem;"><strong>2. HĐ1 (SGK tr. 30):</strong> Vì <code>12 ⋮ 6</code> nên trong hai số 12 và 6, số nào là <strong>ước</strong>, số nào là <strong>bội</strong>?</p>
            <select id="s82-hd1" class="input-field" style="width:100%;">
              <option value="">-- Chọn khẳng định đúng --</option>
              <option value="correct">6 là ước của 12 và 12 là bội của 6</option>
              <option value="wrong">12 là ước của 6 và 6 là bội của 12</option>
            </select>
          </div>

          <div style="margin-top:0.85rem;">
            <button class="btn btn-success" onclick="Stage8_2.checkSub0()">✅ Kiểm tra Chặng 2.1</button>
          </div>
          <div id="s82-fb0" class="feedback-box"></div>
        </div>
      `;
    } else if (sub === 1) {
      const candidates20 = [1, 2, 3, 4, 5, 6, 8, 10, 15, 20];
      const candidatesB4 = [0, 4, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52];

      body.innerHTML = `
        <div class="story-box">
          <h3>💎 Chặng 2.2: Luyện tập 1 - Tìm Ư(20) và các bội của 4 (SGK tr. 31)</h3>
          <p>
            • Muốn tìm các ước của <code>a</code> (<code>a &gt; 1</code>), ta lần lượt chia <code>a</code> cho các số tự nhiên từ <code>1</code> đến <code>a</code>.<br/>
            • Muốn tìm các bội của <code>b</code> (<code>b ≠ 0</code>), ta nhân <code>b</code> lần lượt với <code>0; 1; 2; 3; ...</code>
          </p>
        </div>

        <div class="step-card">
          <h4>Câu a) Bấm chọn TẤT CẢ các phần tử của tập hợp Ư(20)</h4>
          <div class="number-grid" style="margin:0.65rem 0;">
            ${candidates20.map(n => `
              <div class="num-chip ${this.selectedDiv20[n] ? 'selected-a' : ''}"
                   onclick="Stage8_2.toggleDiv20(${n})">${n}</div>
            `).join('')}
          </div>

          <h4 style="margin-top:1rem;">Câu b) Bấm chọn TẤT CẢ các bội nhỏ hơn 50 của 4</h4>
          <p style="font-size:0.84rem; color:var(--text-muted);">Gợi ý: Nhân 4 lần lượt với 0, 1, 2, ..., 12 (chú ý nhỏ hơn 50 và không quên số 0!).</p>
          <div class="number-grid" style="margin:0.65rem 0;">
            ${candidatesB4.map(n => `
              <div class="num-chip ${this.selectedMul4[n] ? 'selected-b' : ''}"
                   onclick="Stage8_2.toggleMul4(${n})">${n}</div>
            `).join('')}
          </div>

          <div style="margin-top:0.85rem;">
            <button class="btn btn-success" onclick="Stage8_2.checkSub1()">✅ Kiểm tra Luyện tập 1</button>
          </div>
          <div id="s82-fb1" class="feedback-box"></div>
        </div>
      `;
    } else {
      const divs12 = [1, 2, 3, 4, 6, 12];
      const chosen = Object.keys(this.selectedPerf12).filter(k => this.selectedPerf12[k]).map(Number);
      const sumChosen = chosen.reduce((a, b) => a + b, 0);

      body.innerHTML = `
        <div class="story-box">
          <h3>🧩 Chặng 2.3: Thử thách nhỏ (SGK Toán 6 trang 31)</h3>
          <p>
            Hãy tìm <strong>ba ước khác nhau của 12</strong> sao cho <strong>tổng của chúng bằng 12</strong>!
          </p>
        </div>

        <div class="step-card">
          <h4>Bấm chọn đúng 3 ước trong tập hợp Ư(12) = {1; 2; 3; 4; 6; 12}</h4>
          <div class="number-grid" style="margin:0.75rem 0;">
            ${divs12.map(n => `
              <div class="num-chip ${this.selectedPerf12[n] ? 'selected-common' : ''}"
                   style="width:68px; height:58px; font-size:1.15rem;"
                   onclick="Stage8_2.togglePerf12(${n})">${n}</div>
            `).join('')}
          </div>

          <div style="padding:0.75rem; background:rgba(15,23,42,0.65); border-radius:10px; font-size:0.95rem; margin-bottom:0.8rem;">
            🧮 <strong>Các ước đang chọn (${chosen.length}/3):</strong>
            <code>${chosen.length ? chosen.join(' + ') + ' = ' + sumChosen : 'Chưa chọn'}</code>
          </div>

          <button class="btn btn-success" onclick="Stage8_2.checkSub2()">✅ Kiểm tra Thử thách nhỏ</button>
          <div id="s82-fb2" class="feedback-box"></div>
        </div>
      `;
    }
  },

  checkSub0() {
    const s1 = document.getElementById('s82-sym1').value;
    const s2 = document.getElementById('s82-sym2').value;
    const s3 = document.getElementById('s82-sym3').value;
    const s4 = document.getElementById('s82-sym4').value;
    const hd1 = document.getElementById('s82-hd1').value;
    const fb = document.getElementById('s82-fb0');

    if (s1 === 'div' && s2 === 'ndiv' && s3 === 'div' && s4 === 'ndiv' && hd1 === 'correct') {
      Sound.success();
      App8.awardPoints('s8_2_sub0', 40, 2, 1);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🎉 <strong>Tuyệt vời (+40 điểm, 1 ⭐)!</strong>
        <code>24 ⋮ 6</code>; <code>45 ∤ 10</code>; <code>35 ⋮ 5</code>; <code>42 ∤ 4</code> và 6 là ước của 12, 12 là bội của 6.<br/>
        <div style="margin-top:0.55rem;">
          <button class="btn btn-primary btn-sm" onclick="Stage8_2.render(1)">Sang Chặng 2.2: Luyện tập 1 ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Kiểm tra lại nhé: 24 = 6·4 nên 24 ⋮ 6; 45 chia 10 dư 5 nên 45 ∤ 10; 35 = 5·7 nên 35 ⋮ 5; 42 chia 4 dư 2 nên 42 ∤ 4!`;
    }
  },

  toggleDiv20(n) {
    Sound.pop();
    this.selectedDiv20[n] = !this.selectedDiv20[n];
    this.render(1);
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai8', 2);
  },

  toggleMul4(n) {
    Sound.pop();
    this.selectedMul4[n] = !this.selectedMul4[n];
    this.render(1);
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai8', 2);
  },

  checkSub1() {
    const target20 = [1, 2, 4, 5, 10, 20];
    const targetB4 = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48];
    const picked20 = Object.keys(this.selectedDiv20).filter(k => this.selectedDiv20[k]).map(Number).sort((a, b) => a - b);
    const pickedB4 = Object.keys(this.selectedMul4).filter(k => this.selectedMul4[k]).map(Number).sort((a, b) => a - b);
    const fb = document.getElementById('s82-fb1');

    const ok20 = JSON.stringify(picked20) === JSON.stringify(target20);
    const okB4 = JSON.stringify(pickedB4) === JSON.stringify(targetB4);

    if (ok20 && okB4) {
      Sound.success();
      App8.awardPoints('s8_2_sub1', 40, 2, 2);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🎉 <strong>Chính xác cả 2 câu (+40 điểm, 2 ⭐)!</strong><br/>
        • <code>Ư(20) = {1; 2; 4; 5; 10; 20}</code><br/>
        • Các bội nhỏ hơn 50 của 4 là: <code>0; 4; 8; 12; 16; 20; 24; 28; 32; 36; 40; 44; 48</code>.<br/>
        <div style="margin-top:0.55rem;">
          <button class="btn btn-primary btn-sm" onclick="Stage8_2.render(2)">Sang Chặng 2.3: Thử thách nhỏ ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ ${!ok20 ? 'Tập hợp Ư(20) gồm 6 ước: 1, 2, 4, 5, 10, 20. ' : ''}${!okB4 ? 'Các bội nhỏ hơn 50 của 4 bắt đầu từ 0 đến 48 (không lấy 6 và không lấy 52 vì 52 > 50).' : ''}`;
    }
  },

  togglePerf12(n) {
    Sound.pop();
    this.selectedPerf12[n] = !this.selectedPerf12[n];
    this.render(2);
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai8', 2);
  },

  checkSub2() {
    const chosen = Object.keys(this.selectedPerf12).filter(k => this.selectedPerf12[k]).map(Number).sort((a, b) => a - b);
    const fb = document.getElementById('s82-fb2');

    if (JSON.stringify(chosen) === JSON.stringify([2, 4, 6])) {
      Sound.success();
      App8.awardPoints('s8_2_sub2', 50, 2, 3);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🏆 <strong>Xuất sắc (+50 điểm, trọn vẹn 3 ⭐ Trò chơi 2)!</strong><br/>
        Ba ước khác nhau của 12 có tổng bằng 12 chính là <strong>2, 4 và 6</strong> vì <code>2 + 4 + 6 = 12</code>!<br/>
        <div style="margin-top:0.6rem;">
          <button class="btn btn-primary btn-sm" onclick="App8.openStage(3)">Sang Trò chơi 3: Tính Chất Chia Hết Của Một Tổng ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Em cần chọn đúng 3 ước khác nhau của 12 có tổng bằng 12. Hãy thử kiểm tra bộ 3 số: 2, 4 và 6 nhé!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 3: CÂN BẰNG TÍNH CHẤT CHIA HẾT CỦA MỘT TỔNG (MỤC 2 - SGK tr. 31–33)
   - Chặng 3.1: Tính chất 1 (Luyện tập 2 & Vận dụng 1)
   - Chặng 3.2: Tính chất 2 (Luyện tập 3 & Vận dụng 2)
   - Chặng 3.3: Tranh luận & Năng lực số 1.2TC1a (Kiểm chứng mẹo trên mạng)
   ========================================================================== */
const Stage8_3 = {
  subStep: 0,

  render(sub = 0) {
    this.subStep = sub;
    const pills = [
      '3.1. Tính chất 1 (LT2 & VD1)',
      '3.2. Tính chất 2 (LT3 & VD2)',
      '3.3. Tranh luận & NLS 1.2TC1a'
    ];
    document.getElementById('stage-sub-pills').innerHTML = pills.map((p, idx) => `
      <span class="sub-pill ${idx === sub ? 'active' : ''}" style="cursor:pointer" onclick="Stage8_3.render(${idx})">${p}</span>
    `).join('');

    const body = document.getElementById('stage-body');

    if (sub === 0) {
      body.innerHTML = `
        <div class="story-box">
          <h3>⚖️ Chặng 3.1: Tính chất 1 - Trường hợp chia hết (SGK tr. 31–32)</h3>
          <p>
            <strong>Tính chất 1:</strong> Nếu tất cả các số hạng của một tổng đều chia hết cho cùng một số thì tổng chia hết cho số đó: <code>Nếu a ⋮ m và b ⋮ m thì (a + b) ⋮ m</code> (cũng đúng cho một hiệu <code>(a - b) ⋮ m</code>).
          </p>
        </div>

        <div class="step-card">
          <h4>1. Luyện tập 2 (SGK tr. 32): Không thực hiện phép tính, hãy cho biết:</h4>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:0.8rem; margin-top:0.5rem;">
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">a) Tổng <code>24 + 48</code> có chia hết cho 4 không?</p>
              <select id="s83-lt2a" class="input-field" style="width:100%;">
                <option value="">-- Chọn giải thích --</option>
                <option value="yes">Có, vì 24 ⋮ 4 và 48 ⋮ 4 nên (24 + 48) ⋮ 4</option>
                <option value="no">Không chia hết cho 4</option>
              </select>
            </div>
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">b) Biểu thức <code>48 + 12 - 36</code> có chia hết cho 6 không?</p>
              <select id="s83-lt2b" class="input-field" style="width:100%;">
                <option value="">-- Chọn giải thích --</option>
                <option value="yes">Có, vì 48 ⋮ 6, 12 ⋮ 6 và 36 ⋮ 6 nên (48 + 12 - 36) ⋮ 6</option>
                <option value="no">Không chia hết cho 6</option>
              </select>
            </div>
          </div>

          <h4 style="margin-top:1rem;">2. Vận dụng 1 (SGK tr. 32): Tìm tất cả các số <code>x ∈ {12; 14; 22; 28; 36}</code> để tổng <code>21 + x</code> chia hết cho 7</h4>
          <select id="s83-vd1" class="input-field" style="width:100%; margin-top:0.35rem;">
            <option value="">-- Chọn tập hợp các giá trị x đúng --</option>
            <option value="w1">x ∈ {12; 22; 36}</option>
            <option value="correct">Vì 21 ⋮ 7 nên để (21 + x) ⋮ 7 thì x ⋮ 7 ➔ x ∈ {14; 28}</option>
            <option value="w2">x ∈ {14; 22; 28}</option>
          </select>

          <div style="margin-top:0.85rem;">
            <button class="btn btn-success" onclick="Stage8_3.checkSub0()">✅ Kiểm tra Chặng 3.1</button>
          </div>
          <div id="s83-fb0" class="feedback-box"></div>
        </div>
      `;
    } else if (sub === 1) {
      body.innerHTML = `
        <div class="story-box">
          <h3>⚖️ Chặng 3.2: Tính chất 2 - Trường hợp không chia hết (SGK tr. 32–33)</h3>
          <p>
            <strong>Tính chất 2:</strong> Nếu chỉ có một số hạng của tổng không chia hết cho một số, còn các số hạng khác đều chia hết cho số đó thì tổng không chia hết cho số đó: <code>Nếu a ⋮ m và b ∤ m thì (a + b) ∤ m</code>.
          </p>
        </div>

        <div class="step-card">
          <h4>1. Luyện tập 3 (SGK tr. 33): Không thực hiện phép tính, hãy cho biết:</h4>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:0.8rem; margin-top:0.5rem;">
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">a) Tổng <code>20 + 81</code> có chia hết cho 5 không?</p>
              <select id="s83-lt3a" class="input-field" style="width:100%;">
                <option value="">-- Chọn giải thích --</option>
                <option value="yes">Có chia hết cho 5</option>
                <option value="no">Không, vì 20 ⋮ 5 nhưng 81 ∤ 5 nên (20 + 81) ∤ 5</option>
              </select>
            </div>
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">b) Biểu thức <code>34 + 28 - 12</code> có chia hết cho 4 không?</p>
              <select id="s83-lt3b" class="input-field" style="width:100%;">
                <option value="">-- Chọn giải thích --</option>
                <option value="yes">Có chia hết cho 4</option>
                <option value="no">Không, vì 28 ⋮ 4, 12 ⋮ 4 nhưng 34 ∤ 4 nên (34 + 28 - 12) ∤ 4</option>
              </select>
            </div>
          </div>

          <h4 style="margin-top:1rem;">2. Vận dụng 2 (SGK tr. 33): Tìm <code>x ∈ {15; 39; 50; 54; 65}</code> để tổng <code>20 + 45 + x</code> KHÔNG chia hết cho 5</h4>
          <select id="s83-vd2" class="input-field" style="width:100%; margin-top:0.35rem;">
            <option value="">-- Chọn tập hợp các giá trị x đúng --</option>
            <option value="w1">x ∈ {15; 50; 65}</option>
            <option value="correct">Vì 20 ⋮ 5 và 45 ⋮ 5 nên để (20 + 45 + x) ∤ 5 thì x ∤ 5 ➔ x ∈ {39; 54}</option>
            <option value="w2">x ∈ {39; 50; 54}</option>
          </select>

          <div style="margin-top:0.85rem;">
            <button class="btn btn-success" onclick="Stage8_3.checkSub1()">✅ Kiểm tra Chặng 3.2</button>
          </div>
          <div id="s83-fb1" class="feedback-box"></div>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="story-box">
          <h3>🌐 Chặng 3.3: Tranh luận &amp; Kiểm chứng mẹo chia hết trên mạng (NLS 1.2TC1a - SGK tr. 33)</h3>
          <p>
            Một video ngắn trên mạng Internet phát biểu rằng: <em>"Nếu hai số đều không chia hết cho 4 thì tổng của chúng cũng không bao giờ chia hết cho 4"</em>. Hai bạn Tròn và Vuông đang tranh luận xem phát biểu đó đúng hay sai!
          </p>
        </div>

        <div class="step-card">
          <h4>Hãy giúp Vuông và Tròn đánh giá độ tin cậy của mẹo trên mạng:</h4>
          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:0.5rem;">
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">1. Phát biểu "Hai số đều không chia hết cho 4 thì tổng của chúng không chia hết cho 4" là đúng hay sai?</p>
              <select id="s83-nls1" class="input-field" style="width:100%;">
                <option value="">-- Chọn đánh giá --</option>
                <option value="true">Đúng hoàn toàn</option>
                <option value="false">SAI! Tổng của hai số không chia hết cho 4 vẫn CÓ THỂ chia hết cho 4</option>
              </select>
            </div>
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">2. Chọn một phản ví dụ chứng minh hai số không chia hết cho 4 nhưng tổng lại chia hết cho 4:</p>
              <select id="s83-nls2" class="input-field" style="width:100%;">
                <option value="">-- Chọn phản ví dụ --</option>
                <option value="ex1">3 ∤ 4 và 5 ∤ 4, nhưng 3 + 5 = 8 ⋮ 4</option>
                <option value="ex2">4 ⋮ 4 và 8 ⋮ 4 nên 4 + 8 = 12 ⋮ 4</option>
                <option value="ex3">3 ∤ 4 và 6 ∤ 4 và 3 + 6 = 9 ∤ 4</option>
              </select>
            </div>
          </div>

          <div style="margin-top:0.85rem;">
            <button class="btn btn-success" onclick="Stage8_3.checkSub2()">✅ Hoàn thành Trò chơi 3</button>
          </div>
          <div id="s83-fb2" class="feedback-box"></div>
        </div>
      `;
    }
  },

  checkSub0() {
    const a = document.getElementById('s83-lt2a').value;
    const b = document.getElementById('s83-lt2b').value;
    const vd = document.getElementById('s83-vd1').value;
    const fb = document.getElementById('s83-fb0');

    if (a === 'yes' && b === 'yes' && vd === 'correct') {
      Sound.success();
      App8.awardPoints('s8_3_sub0', 40, 3, 1);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🎉 <strong>Chính xác (+40 điểm, 1 ⭐)!</strong> Em đã nắm vững Tính chất 1 của một tổng và hiệu.<br/>
        <div style="margin-top:0.55rem;">
          <button class="btn btn-primary btn-sm" onclick="Stage8_3.render(1)">Sang Chặng 3.2: Tính chất 2 ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Kiểm tra lại nhé: (24 + 48) ⋮ 4; (48 + 12 - 36) ⋮ 6; và ở Vận dụng 1: x ∈ {14; 28} vì 14 ⋮ 7 và 28 ⋮ 7!`;
    }
  },

  checkSub1() {
    const a = document.getElementById('s83-lt3a').value;
    const b = document.getElementById('s83-lt3b').value;
    const vd = document.getElementById('s83-vd2').value;
    const fb = document.getElementById('s83-fb1');

    if (a === 'no' && b === 'no' && vd === 'correct') {
      Sound.success();
      App8.awardPoints('s8_3_sub1', 40, 3, 2);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🎉 <strong>Rất giỏi (+40 điểm, 2 ⭐)!</strong> Khi chỉ có 1 số hạng không chia hết cho m còn các số hạng khác đều chia hết cho m thì tổng không chia hết cho m!<br/>
        <div style="margin-top:0.55rem;">
          <button class="btn btn-primary btn-sm" onclick="Stage8_3.render(2)">Sang Chặng 3.3: Tranh luận &amp; Kiểm chứng mẹo trên mạng ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Xem lại nhé: (20 + 81) ∤ 5 vì 81 ∤ 5; (34 + 28 - 12) ∤ 4 vì 34 ∤ 4; và ở Vận dụng 2: x ∈ {39; 54}!`;
    }
  },

  checkSub2() {
    const n1 = document.getElementById('s83-nls1').value;
    const n2 = document.getElementById('s83-nls2').value;
    const fb = document.getElementById('s83-fb2');

    if (n1 === 'false' && n2 === 'ex1') {
      Sound.success();
      App8.awardPoints('s8_3_sub2', 50, 3, 3);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🏆 <strong>Tuyệt vời (+50 điểm, trọn vẹn 3 ⭐ Trò chơi 3)!</strong><br/>
        Em đã rèn luyện năng lực số <code>1.2TC1a</code>: Biết kiểm chứng thông tin toán học trên Internet bằng phản ví dụ <code>3 + 5 = 8 ⋮ 4</code>!<br/>
        <div style="margin-top:0.6rem;">
          <button class="btn btn-primary btn-sm" onclick="App8.openStage(4)">Sang Trò chơi 4: Đấu Trường Bài 2.1 – 2.6 ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Hãy chọn "SAI" và phản ví dụ "3 ∤ 4 và 5 ∤ 4, nhưng 3 + 5 = 8 ⋮ 4" nhé!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 4: ĐẤU TRƯỜNG NHẬN DIỆN QUAN HỆ CHIA HẾT (BÀI 2.1 – 2.6 SGK tr. 33)
   ========================================================================== */
const Stage8_4 = {
  idx: 0,
  correctCount: 0,
  questions: [
    {
      title: 'Bài 2.1 (SGK tr. 33): Hãy tìm các ước của mỗi số 30, 35 và 17.',
      options: [
        'Ư(30) = {1; 2; 3; 5; 6; 10; 15; 30}; Ư(35) = {1; 5; 7; 35}; Ư(17) = {1; 17}',
        'Ư(30) = {1; 2; 5; 10; 30}; Ư(35) = {1; 5; 35}; Ư(17) = {1; 7; 17}',
        'Ư(30) = {0; 1; 2; 3; 5; 6; 10; 15; 30}; Ư(35) = {1; 5; 7; 35}; Ư(17) = {1; 17}'
      ],
      ans: 0,
      explain: 'Số 0 không phải là ước của bất kỳ số tự nhiên nào. Ư(30) có 8 ước, Ư(35) có 4 ước và Ư(17) có 2 ước là 1 và 17.'
    },
    {
      title: 'Bài 2.2 (SGK tr. 33): Trong các số sau, số nào là bội của 4: 16; 24; 35?',
      options: [
        'Chỉ có 16 và 24 là bội của 4 (vì 16 ⋮ 4 và 24 ⋮ 4, còn 35 ∤ 4)',
        'Cả ba số 16; 24; 35 đều là bội của 4',
        'Chỉ có 24 là bội của 4'
      ],
      ans: 0,
      explain: '16 = 4 · 4 và 24 = 4 · 6 nên 16 và 24 là bội của 4; còn 35 chia 4 dư 3 nên 35 không là bội của 4.'
    },
    {
      title: 'Bài 2.3 (SGK tr. 33): Tìm tất cả các số tự nhiên x, y sao cho: a) x ∈ B(7) và x < 70; b) y ∈ Ư(50) và y > 5.',
      options: [
        'a) x ∈ {0; 7; 14; 21; 28; 35; 42; 49; 56; 63};  b) y ∈ {10; 25; 50}',
        'a) x ∈ {7; 14; 21; 28; 35; 42; 49; 56; 63; 70};  b) y ∈ {5; 10; 25; 50}',
        'a) x ∈ {0; 7; 14; 21; 28; 35; 42; 49; 56; 63};  b) y ∈ {5; 10; 20; 50}'
      ],
      ans: 0,
      explain: 'Nhớ lấy số 0 trong B(7) và nhỏ hơn 70 nên dừng ở 63. Ư(50) = {1; 2; 5; 10; 25; 50}, lấy y > 5 nên y ∈ {10; 25; 50}.'
    },
    {
      title: 'Bài 2.4 (SGK tr. 33): Không thực hiện phép tính, tổng nào sau đây chia hết cho 5? a) 15 + 1 975 + 2 019;  b) 20 + 90 + 115 + 55',
      options: [
        'Tổng b) (20 + 90 + 115 + 55) chia hết cho 5 vì tất cả các số hạng đều chia hết cho 5',
        'Tổng a) (15 + 1 975 + 2 019) chia hết cho 5',
        'Cả hai tổng a và b đều chia hết cho 5'
      ],
      ans: 0,
      explain: 'Ở câu a: 15 ⋮ 5, 1975 ⋮ 5 nhưng 2019 ∤ 5 nên tổng không chia hết cho 5. Ở câu b: 20, 90, 115, 55 đều chia hết cho 5 nên tổng chia hết cho 5.'
    },
    {
      title: 'Bài 2.5 (SGK tr. 33): Không thực hiện phép tính, hiệu nào sau đây chia hết cho 8? a) 100 - 40;  b) 80 - 16',
      options: [
        'Hiệu b) (80 - 16) chia hết cho 8 vì 80 ⋮ 8 và 16 ⋮ 8',
        'Hiệu a) (100 - 40) chia hết cho 8',
        'Cả hai hiệu đều chia hết cho 8'
      ],
      ans: 0,
      explain: 'Ở câu a: 40 ⋮ 8 nhưng 100 ∤ 8 nên (100 - 40) ∤ 8. Ở câu b: 80 ⋮ 8 và 16 ⋮ 8 nên (80 - 16) ⋮ 8.'
    },
    {
      title: 'Bài 2.6 (SGK tr. 33): Khẳng định nào sau đây là ĐÚNG? a) 219 · 7 + 8 chia hết cho 7;  b) 8 · 12 + 9 chia hết cho 3',
      options: [
        'Khẳng định b) ĐÚNG vì (8 · 12) ⋮ 3 và 9 ⋮ 3 nên (8 · 12 + 9) ⋮ 3',
        'Khẳng định a) ĐÚNG vì 219 · 7 chia hết cho 7',
        'Cả hai khẳng định đều sai'
      ],
      ans: 0,
      explain: 'Ở câu a: (219 · 7) ⋮ 7 nhưng 8 ∤ 7 nên tổng không chia hết cho 7. Ở câu b: 12 ⋮ 3 nên (8 · 12) ⋮ 3, và 9 ⋮ 3 nên tổng chia hết cho 3!'
    }
  ],

  render() {
    document.getElementById('stage-sub-pills').innerHTML = `
      <span class="sub-pill active">Đấu trường Bài 2.1 – 2.6 (${this.idx + 1}/${this.questions.length})</span>
    `;

    const q = this.questions[this.idx];
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>⚡ Đấu Trường Nhận Diện Quan Hệ Chia Hết (Bài 2.1 – 2.6 SGK tr. 33)</h3>
        <p>
          Hoàn thành 6 câu hỏi luyện tập liên tiếp để rèn luyện kỹ năng tìm ước, bội và vận dụng tính chất chia hết của một tổng (hiệu)!
        </p>
      </div>

      <div class="step-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <span class="quest-tag">Câu ${this.idx + 1} / ${this.questions.length}</span>
          <span style="color:#fbbf24; font-weight:700;">Đúng: ${this.correctCount}/${this.questions.length}</span>
        </div>
        <h4>${q.title}</h4>

        <div style="display:flex; flex-direction:column; gap:0.65rem; margin-top:0.8rem;">
          ${q.options.map((opt, i) => `
            <button class="btn btn-outline" style="text-align:left; justify-content:flex-start; padding:0.75rem 1rem;"
                    onclick="Stage8_4.answer(${i})">
              <strong>${String.fromCharCode(65 + i)}.</strong>&nbsp; ${opt}
            </button>
          `).join('')}
        </div>

        <div id="s84-fb" class="feedback-box"></div>
      </div>
    `;
  },

  answer(choice) {
    const q = this.questions[this.idx];
    const fb = document.getElementById('s84-fb');

    if (choice === q.ans) {
      Sound.success();
      this.correctCount++;
      App8.awardPoints(`s8_4_q${this.idx}`, 25, 4, this.idx === this.questions.length - 1 ? 3 : 2);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        ✅ <strong>Chính xác!</strong> ${q.explain}<br/>
        <div style="margin-top:0.6rem;">
          ${this.idx < this.questions.length - 1
            ? `<button class="btn btn-primary btn-sm" onclick="Stage8_4.next()">Câu tiếp theo ▶</button>`
            : `<button class="btn btn-success btn-sm" onclick="App8.openStage(5)">🏆 Hoàn thành Đấu Trường ➔ Sang Trò chơi 5 ▶</button>`}
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
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai8', 4);
  }
};

/* ==========================================================================
   TRÒ CHƠI 5: NHÀ TỔ CHỨC SỰ KIỆN & THỂ THAO KHỐI 6 (BÀI 2.7 – 2.9 SGK tr. 33)
   ========================================================================== */
const Stage8_5 = {
  subStep: 0,
  selectedGroups40: {},
  selectedAthletes45: {},

  render(sub = 0) {
    this.subStep = sub;
    const pills = [
      '5.1. Bài 2.7: Chia nhóm 40 HS',
      '5.2. Bài 2.8: Đội thể thao 45 VĐV',
      '5.3. Bài 2.9: Tìm ẩn số x'
    ];
    document.getElementById('stage-sub-pills').innerHTML = pills.map((p, idx) => `
      <span class="sub-pill ${idx === sub ? 'active' : ''}" style="cursor:pointer" onclick="Stage8_5.render(${idx})">${p}</span>
    `).join('');

    const body = document.getElementById('stage-body');

    if (sub === 0) {
      const groupOptions = [4, 5, 6, 8, 10];
      body.innerHTML = `
        <div class="story-box">
          <h3>🏕️ Chặng 5.1: Bài 2.7 (SGK Toán 6 trang 33)</h3>
          <p>
            Cô giáo muốn chia lớp có <strong>40 học sinh</strong> thành các nhóm để thực hiện các dự án học tập. Biết rằng các nhóm đều có số người bằng nhau. Trong các số nhóm sau: <strong>4 nhóm, 5 nhóm, 6 nhóm, 8 nhóm, 10 nhóm</strong>, hãy bấm chọn tất cả các cách chia nhóm thực hiện được và cho biết số người trong mỗi nhóm!
          </p>
        </div>

        <div class="step-card">
          <h4>Bấm chọn các số nhóm mà 40 học sinh có thể chia đều được:</h4>
          <div style="display:flex; gap:0.7rem; flex-wrap:wrap; margin:0.75rem 0;">
            ${groupOptions.map(g => {
              const isSelected = !!this.selectedGroups40[g];
              const perG = 40 % g === 0 ? `${40 / g} HS/nhóm` : `Dư ${40 % g} HS`;
              return `
                <button class="btn ${isSelected ? 'btn-primary' : 'btn-outline'}"
                        onclick="Stage8_5.toggleG40(${g})">
                  👥 ${g} nhóm ${isSelected ? `(${perG})` : ''}
                </button>
              `;
            }).join('')}
          </div>

          <button class="btn btn-success" onclick="Stage8_5.checkSub0()">✅ Kiểm tra Bài 2.7</button>
          <div id="s85-fb0" class="feedback-box"></div>
        </div>
      `;
    } else if (sub === 1) {
      const sizeOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 15];
      body.innerHTML = `
        <div class="story-box">
          <h3>🏃 Chặng 5.2: Bài 2.8 (SGK Toán 6 trang 33)</h3>
          <p>
            Một đội thể thao có <strong>45 vận động viên</strong>. Huấn luyện viên muốn chia thành các nhóm sao cho mỗi nhóm có số người bằng nhau, và mỗi nhóm có <strong>ít nhất 3 người và nhiều nhất 10 người</strong> (tức là từ 3 đến 10 người). Hỏi mỗi nhóm có thể có bao nhiêu vận động viên?
          </p>
        </div>

        <div class="step-card">
          <h4>Bấm chọn các số vận động viên trong mỗi nhóm thỏa mãn đề bài:</h4>
          <div class="number-grid" style="margin:0.75rem 0;">
            ${sizeOptions.map(s => `
              <div class="num-chip ${this.selectedAthletes45[s] ? 'selected-common' : ''}"
                   style="width:74px; height:54px;"
                   onclick="Stage8_5.toggleA45(${s})">${s} VĐV</div>
            `).join('')}
          </div>

          <button class="btn btn-success" onclick="Stage8_5.checkSub1()">✅ Kiểm tra Bài 2.8</button>
          <div id="s85-fb1" class="feedback-box"></div>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="story-box">
          <h3>🔐 Chặng 5.3: Bài 2.9 (SGK Toán 6 trang 33) &amp; Củng cố cuối bài</h3>
          <p>
            Vận dụng tính chất chia hết của một tổng để tìm các giá trị của <code>x</code> trong Bài 2.9 và hoàn thành trọn vẹn Bài 8!
          </p>
        </div>

        <div class="step-card">
          <h4>Giải Bài 2.9 (SGK tr. 33):</h4>
          <div style="display:flex; flex-direction:column; gap:0.8rem; margin-top:0.5rem;">
            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">a) Tìm <code>x</code> thuộc tập hợp <code>{12; 19; 45; 70}</code> (hoặc <code>{24; 19; 35}</code>) sao cho tổng <code>12 + 28 + x</code> chia hết cho 4:</p>
              <select id="s85-b29a" class="input-field" style="width:100%;">
                <option value="">-- Chọn đáp án đúng --</option>
                <option value="correct">Vì 12 ⋮ 4 và 28 ⋮ 4 nên cần x ⋮ 4 ➔ chọn x = 12 (hoặc x = 24)</option>
                <option value="wrong1">Chọn x = 19 hoặc x = 45</option>
              </select>
            </div>

            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">b) Tìm <code>x</code> thuộc tập hợp <code>{15; 22; 45; 60}</code> sao cho tổng <code>15 + 30 + x</code> KHÔNG chia hết cho 15:</p>
              <select id="s85-b29b" class="input-field" style="width:100%;">
                <option value="">-- Chọn đáp án đúng --</option>
                <option value="wrong1">x ∈ {15; 45; 60}</option>
                <option value="correct">Vì 15 ⋮ 15 và 30 ⋮ 15 nên cần x ∤ 15 ➔ x = 22</option>
              </select>
            </div>

            <div>
              <p style="font-size:0.9rem; margin-bottom:0.3rem;">c) Câu hỏi củng cố (KHBD Tiết 18): Số tự nhiên nào là <strong>bội của mọi số tự nhiên khác 0</strong>?</p>
              <select id="s85-zero" class="input-field" style="width:100%;">
                <option value="">-- Chọn số đặc biệt --</option>
                <option value="0">Số 0 (vì 0 = 0 · b với mọi b ≠ 0)</option>
                <option value="1">Số 1</option>
              </select>
            </div>
          </div>

          <div style="margin-top:0.9rem;">
            <button class="btn btn-success" onclick="Stage8_5.checkSub2()">🏆 Hoàn thành Bài 8 &amp; Nhận Bằng Kiện Tướng</button>
          </div>
          <div id="s85-fb2" class="feedback-box"></div>
        </div>
      `;
    }
  },

  toggleG40(g) {
    Sound.pop();
    this.selectedGroups40[g] = !this.selectedGroups40[g];
    this.render(0);
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai8', 5);
  },

  checkSub0() {
    const picked = Object.keys(this.selectedGroups40).filter(k => this.selectedGroups40[k]).map(Number).sort((a, b) => a - b);
    const fb = document.getElementById('s85-fb0');

    if (JSON.stringify(picked) === JSON.stringify([4, 5, 8, 10])) {
      Sound.success();
      App8.awardPoints('s8_5_sub0', 40, 5, 1);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🎉 <strong>Chính xác (+40 điểm, 1 ⭐)!</strong><br/>
        • Chia 4 nhóm (10 người/nhóm), 5 nhóm (8 người/nhóm), 8 nhóm (5 người/nhóm), 10 nhóm (4 người/nhóm). Không chia đều được thành 6 nhóm vì <code>40 ∤ 6</code>!<br/>
        <div style="margin-top:0.55rem;">
          <button class="btn btn-primary btn-sm" onclick="Stage8_5.render(1)">Sang Chặng 5.2: Bài 2.8 ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Em hãy chọn tất cả các ước của 40 trong danh sách: 4 nhóm, 5 nhóm, 8 nhóm và 10 nhóm (không chọn 6 nhóm vì 40 không chia hết cho 6)!`;
    }
  },

  toggleA45(s) {
    Sound.pop();
    this.selectedAthletes45[s] = !this.selectedAthletes45[s];
    this.render(1);
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai8', 5);
  },

  checkSub1() {
    const picked = Object.keys(this.selectedAthletes45).filter(k => this.selectedAthletes45[k]).map(Number).sort((a, b) => a - b);
    const fb = document.getElementById('s85-fb1');

    if (JSON.stringify(picked) === JSON.stringify([3, 5, 9])) {
      Sound.success();
      App8.awardPoints('s8_5_sub1', 40, 5, 2);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🎉 <strong>Tuyệt vời (+40 điểm, 2 ⭐)!</strong><br/>
        Các ước của 45 từ 3 đến 10 là: <strong>3, 5 và 9</strong> vận động viên mỗi nhóm!<br/>
        <div style="margin-top:0.55rem;">
          <button class="btn btn-primary btn-sm" onclick="Stage8_5.render(2)">Sang Chặng 5.3: Bài 2.9 ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Số VĐV mỗi nhóm phải là ước của 45 và từ 3 đến 10. Ư(45) = {1; 3; 5; 9; 15; 45}, vậy em hãy chọn 3, 5 và 9 nhé!`;
    }
  },

  checkSub2() {
    const a = document.getElementById('s85-b29a').value;
    const b = document.getElementById('s85-b29b').value;
    const z = document.getElementById('s85-zero').value;
    const fb = document.getElementById('s85-fb2');

    if (a === 'correct' && b === 'correct' && z === '0') {
      Sound.success();
      App8.awardPoints('s8_5_sub2', 60, 5, 3);
      fb.className = 'feedback-box show success';
      fb.innerHTML = `
        🏆 <strong>CHÚC MỪNG EM ĐÃ HOÀN THÀNH XUẤT SẮC BÀI 8 (+60 điểm, 3 ⭐)!</strong><br/>
        Em đã nắm chắc Quan hệ chia hết, cách tìm Ước &amp; Bội và hai Tính chất chia hết của một tổng!<br/>
        <div style="margin-top:0.65rem; display:flex; gap:0.6rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="App8.showMap()">🗺️ Về Bản Đồ Bài 8 Xem Bằng Vinh Danh</button>
          <a href="bai9.html" class="btn btn-accent btn-sm" style="text-decoration:none;">🔍 Sang Bài 9: Dấu Hiệu Chia Hết ▶</a>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show error';
      fb.innerHTML = `❌ Kiểm tra lại nhé: Câu a cần x ⋮ 4; câu b cần x ∤ 15 (x = 22); và số 0 là bội của mọi số tự nhiên khác 0!`;
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  App8.init();
});
