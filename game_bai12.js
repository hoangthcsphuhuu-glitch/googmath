/* ==========================================================================
   VƯƠNG QUỐC BỘI CHUNG - TOÁN 6 (BÀI 12: BỘI CHUNG. BỘI CHUNG NHỎ NHẤT)
   Thiết kế bám sát KHBD Toán 6 - Tuần 07 (Tiết 28 - SGK tr. 49–53)
   Tích hợp Hệ thống Nhạc nền (BGM Synthesizer) riêng cho từng trò chơi
   ========================================================================== */

const Sound = {
  enabled: true,
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  toggle() {
    this.enabled = !this.enabled;
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) btn.textContent = this.enabled ? '🔊 Hiệu ứng' : '🔇 Tắt hiệu ứng';
  },
  playTone(freq, duration = 0.14, type = 'sine', delay = 0, vol = 0.13) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {}
  },
  click() { this.playTone(560, 0.06, 'triangle'); },
  pop() {
    this.playTone(440, 0.06, 'sine', 0);
    this.playTone(660, 0.09, 'sine', 0.05);
  },
  jump() {
    this.playTone(320, 0.07, 'sine', 0);
    this.playTone(480, 0.09, 'sine', 0.05);
  },
  success() {
    this.playTone(523.25, 0.12, 'sine', 0);
    this.playTone(659.25, 0.12, 'sine', 0.1);
    this.playTone(783.99, 0.22, 'sine', 0.2);
  },
  error() {
    this.playTone(230, 0.15, 'sawtooth', 0);
    this.playTone(175, 0.22, 'sawtooth', 0.12);
  },
  fanfare() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this.playTone(f, 0.18, 'triangle', i * 0.11);
    });
  }
};

/* ==========================================================================
   BỘ PHÁT NHẠC NỀN ĐA GIAI ĐIỆU (WEB AUDIO MULTI-TRACK BGM SYNTHESIZER)
   Mỗi hoạt động/trò chơi có một bản nhạc nền (Melody + Bass) riêng biệt!
   ========================================================================== */
const BGM = {
  enabled: true,
  currentTrackId: 'map',
  timer: null,
  step: 0,
  tracks: {
    map: {
      name: 'Khúc Dạo Đầu Vương Quốc',
      tempo: 260,
      wave: 'triangle',
      notes: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 392.00],
      bass:  [130.81, 130.81, 196.00, 196.00, 164.81, 164.81, 146.83, 196.00]
    },
    stage1: {
      name: 'Khu Mua Sắm Vui Nhộn (Khởi động)',
      tempo: 220,
      wave: 'sine',
      notes: [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 783.99, 523.25, 440.00, 523.25, 659.25, 587.33, 523.25, 392.00, 523.25, 0],
      bass:  [130.81, 196.00, 130.81, 196.00, 146.83, 196.00, 130.81, 196.00, 110.00, 164.81, 146.83, 196.00, 130.81, 196.00, 130.81, 130.81]
    },
    stage2: {
      name: 'Hồ Sen Phiêu Lưu (Hình thành kiến thức 1)',
      tempo: 210,
      wave: 'triangle',
      notes: [392.00, 440.00, 493.88, 587.33, 493.88, 440.00, 392.00, 329.63, 392.00, 440.00, 493.88, 659.25, 587.33, 493.88, 392.00, 0],
      bass:  [196.00, 196.00, 146.83, 146.83, 164.81, 164.81, 130.81, 130.81, 196.00, 196.00, 146.83, 146.83, 196.00, 146.83, 196.00, 196.00]
    },
    stage3: {
      name: 'Xưởng Máy Tương Lai (Luyện tập 1 & Vận dụng)',
      tempo: 230,
      wave: 'sine',
      notes: [440.00, 523.25, 659.25, 523.25, 392.00, 493.88, 587.33, 493.88, 349.23, 440.00, 523.25, 659.25, 587.33, 523.25, 493.88, 440.00],
      bass:  [110.00, 220.00, 110.00, 220.00, 98.00, 196.00, 98.00, 196.00, 87.31, 174.61, 87.31, 174.61, 98.00, 196.00, 110.00, 110.00]
    },
    stage4: {
      name: 'Đấu Trường Ánh Sáng (Luyện tập & Phản xạ BCNN)',
      tempo: 175,
      wave: 'triangle',
      notes: [587.33, 587.33, 698.46, 783.99, 880.00, 783.99, 698.46, 587.33, 523.25, 523.25, 659.25, 783.99, 698.46, 659.25, 587.33, 0],
      bass:  [146.83, 293.66, 146.83, 293.66, 174.61, 220.00, 146.83, 293.66, 130.81, 261.63, 130.81, 261.63, 146.83, 196.00, 146.83, 146.83]
    },
    stage5: {
      name: 'Đỉnh Tháp Vinh Quang (Mở rộng & Quy đồng mẫu)',
      tempo: 205,
      wave: 'sine',
      notes: [523.25, 659.25, 783.99, 1046.50, 987.77, 783.99, 659.25, 783.99, 698.46, 587.33, 659.25, 523.25, 587.33, 698.46, 783.99, 1046.50],
      bass:  [130.81, 196.00, 261.63, 196.00, 164.81, 196.00, 130.81, 196.00, 174.61, 146.83, 130.81, 196.00, 146.83, 196.00, 130.81, 261.63]
    }
  },

  playTrack(trackId) {
    this.currentTrackId = trackId || 'map';
    this.step = 0;
    const tr = this.tracks[this.currentTrackId] || this.tracks.map;
    const badge = document.getElementById('stage-music-badge');
    if (badge) badge.textContent = `🎶 Nhạc nền: ${tr.name}`;
    this.restartLoop();
  },

  restartLoop() {
    if (this.timer) clearInterval(this.timer);
    if (!this.enabled) return;
    const tr = this.tracks[this.currentTrackId] || this.tracks.map;
    this.timer = setInterval(() => {
      if (!this.enabled) return;
      Sound.init();
      if (!Sound.ctx || Sound.ctx.state !== 'running') return;
      const idx = this.step % tr.notes.length;
      const noteFreq = tr.notes[idx];
      const bassFreq = tr.bass[idx % tr.bass.length];
      if (noteFreq > 0) {
        this.playNote(noteFreq, tr.tempo / 1000 * 0.85, tr.wave, 0.032);
      }
      if (bassFreq > 0 && idx % 2 === 0) {
        this.playNote(bassFreq, tr.tempo / 1000 * 1.4, 'triangle', 0.025);
      }
      this.step++;
    }, tr.tempo);
  },

  playNote(freq, dur, type, vol) {
    try {
      const ctx = Sound.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  },

  toggle() {
    this.enabled = !this.enabled;
    const pill = document.getElementById('bgm-pill');
    const lbl = document.getElementById('bgm-label');
    if (pill) pill.classList.toggle('muted', !this.enabled);
    if (lbl) lbl.textContent = this.enabled ? '🎵 Nhạc nền: Bật' : '🔇 Nhạc nền: Tắt';
    if (this.enabled) {
      Sound.init();
      this.restartLoop();
    } else if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};

/* Máy tính cầm tay ảo Casio fx-580VN X tìm BCNN (LCM) */
const CasioLCM = {
  expr: 'LCM(6,9)',
  insert(token) {
    Sound.click();
    if (this.expr === '0') this.expr = '';
    this.expr += token;
    this.render('');
  },
  clear() {
    Sound.click();
    this.expr = '';
    this.render('0');
  },
  backspace() {
    Sound.click();
    if (this.expr.endsWith('LCM(')) {
      this.expr = this.expr.slice(0, -4);
    } else {
      this.expr = this.expr.slice(0, -1);
    }
    this.render('');
  },
  quickExample(a, b) {
    Sound.click();
    this.expr = `LCM(${a},${b})`;
    this.evaluate();
  },
  gcd(a, b) {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));
    while (b !== 0) { const t = b; b = a % b; a = t; }
    return a;
  },
  lcmTwo(a, b) {
    return (a * b) / this.gcd(a, b);
  },
  evaluate() {
    Sound.click();
    const raw = this.expr.trim().toUpperCase();
    const match = raw.match(/^LCM\(([\d,\s]+)\)?$/);
    if (!match) {
      this.render('Syntax ERROR');
      Sound.error();
      return;
    }
    const nums = match[1].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
    if (nums.length < 2) {
      this.render('Nhập ≥ 2 số!');
      Sound.error();
      return;
    }
    let ans = nums[0];
    for (let i = 1; i < nums.length; i++) {
      ans = this.lcmTwo(ans, nums[i]);
    }
    if (!this.expr.endsWith(')')) this.expr += ')';
    this.render(String(ans));
    Sound.success();
  },
  render(resText) {
    const eEl = document.getElementById('casio-expr');
    const rEl = document.getElementById('casio-res');
    if (eEl) eEl.textContent = this.expr || '0';
    if (rEl && resText !== undefined) rEl.textContent = resText;
  }
};

/* Danh sách 5 Trò Chơi tương ứng với từng Hoạt động trong KHBD Bài 12 */
const QUESTS_12 = [
  {
    id: 1,
    tag: 'Hoạt động Khởi động (5 phút đầu giờ)',
    title: 'Trò chơi 1: Siêu Thị Bữa Tiệc Của Mai',
    icon: '🛒',
    color: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    musicTrack: 'stage1',
    desc: 'Giúp bạn Mai mua các gói đĩa giấy (4 cái/gói) và cốc giấy (6 cái/gói) sao cho số đĩa bằng số cốc với số gói ít nhất (SGK tr. 49).'
  },
  {
    id: 2,
    tag: 'Hình thành kiến thức: Phần 1 (SGK tr. 49–50)',
    title: 'Trò chơi 2: Ếch Xanh Nhảy Lá Sen Tìm BC',
    icon: '🐸',
    color: 'linear-gradient(135deg, #10b981, #059669)',
    musicTrack: 'stage2',
    desc: 'Cùng hai chú ếch nhảy bước 6 và bước 9 trên hồ sen để khám phá B(6), B(9), BC(6, 9), BCNN(6, 9) và trường hợp đặc biệt BCNN(36, 9).'
  },
  {
    id: 3,
    tag: 'Hình thành kiến thức: Phần 2 (SGK tr. 50)',
    title: 'Trò chơi 3: Kỹ Sư Điều Phối Nhà Máy',
    icon: '⚙️',
    color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    musicTrack: 'stage3',
    desc: 'Chinh phục Luyện tập 1 (BCNN(6,8) và BCNN(8,9,72)) & lập lịch bảo dưỡng đồng thời hai máy A và B trong nhà máy (Vận dụng SGK tr. 50).'
  },
  {
    id: 4,
    tag: 'Hoạt động Luyện tập & Tích hợp NLS (2.1TC1a)',
    title: 'Trò chơi 4: Thợ Săn Sao & Đấu Trường BCNN',
    icon: '☄️',
    color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    musicTrack: 'stage4',
    desc: 'Săn các ngôi sao bội chung nhỏ hơn 200 trong Bài 2.36 (SGK tr. 53) và thi phản xạ tìm nhanh BCNN trên màn hình!'
  },
  {
    id: 5,
    tag: 'Hoạt động Vận dụng & Chuẩn bị Mục 2, 3',
    title: 'Trò chơi 5: Tháp BCNN & Quy Đồng Phân Số',
    icon: '🔮',
    color: 'linear-gradient(135deg, #ec4899, #be185d)',
    musicTrack: 'stage5',
    desc: 'Củng cố lưu ý BCNN ≠ 0 và khám phá 3 bước tìm BCNN bằng thừa số nguyên tố để quy đồng mẫu các phân số (SGK tr. 50–53).'
  }
];

const App12 = {
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
    // Đồng bộ tên học sinh từ Bài 11 nếu đã nhập
    const saved11 = localStorage.getItem('toan6_bai11_game_state');
    let defaultName = '', defaultClass = '';
    if (saved11) {
      try {
        const p11 = JSON.parse(saved11);
        defaultName = p11.playerName || '';
        defaultClass = p11.playerClass || '';
      } catch (e) {}
    }

    const saved12 = localStorage.getItem('toan6_bai12_game_state');
    if (saved12) {
      try {
        const parsed = JSON.parse(saved12);
        this.state = { ...this.state, ...parsed };
      } catch (e) {}
    } else if (defaultName) {
      this.state.playerName = defaultName;
      this.state.playerClass = defaultClass;
    }

    this.updateHUD();
    if (this.state.playerName) {
      document.getElementById('player-name-input').value = this.state.playerName;
      document.getElementById('player-class-input').value = this.state.playerClass || '';
      this.showMap();
    }
  },

  save() {
    localStorage.setItem('toan6_bai12_game_state', JSON.stringify(this.state));
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
    document.getElementById('hud-player').textContent = nameLabel;
    if (typeof Mascots !== 'undefined') Mascots.updateHUDCompanion();
    document.getElementById('hud-score').textContent = this.state.score;
    document.getElementById('hud-stars').textContent = this.totalStars();
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
    if (!confirm('Em có chắc muốn xóa điểm Bài 12 để chơi lại từ đầu không?')) return;
    Sound.click();
    this.state.score = 0;
    this.state.stageStars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.state.awardedKeys = {};
    this.save();
    this.showMap();
  },

  showMap() {
    Sound.click();
    BGM.playTrack('map');
    document.getElementById('screen-welcome').style.display = 'none';
    document.getElementById('screen-stage').style.display = 'none';
    document.getElementById('screen-map').style.display = 'block';
    this.renderMap();
  },

  renderMap() {
    const grid = document.getElementById('quest-grid');
    grid.innerHTML = QUESTS_12.map(q => {
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
            <div style="font-size:0.76rem; color:#c4b5fd; margin-bottom:0.75rem;">
              🎵 Nhạc nền: <em>${trName}</em>
            </div>
          </div>
          <div class="quest-footer">
            <span class="star-display" title="${stars}/3 sao">${starStr}</span>
            <button class="btn ${stars === 3 ? 'btn-success' : 'btn-primary'} btn-sm" onclick="App12.openStage(${q.id})">
              ${stars === 3 ? 'Chơi lại ▶' : 'Vào chơi ▶'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    const certBox = document.getElementById('certificate-section');
    const total = this.totalStars();
    if (total >= 3) {
      const rank = total === 15
        ? '👑 ĐẠI SỨ BỘI CHUNG TOÁN 6'
        : total >= 9
          ? '🏅 KIỆN TƯỚNG BỘI CHUNG NHỎ NHẤT'
          : '🌟 NHÀ THÁM HIỂM BỘI CHUNG';
      certBox.innerHTML = `
        <div class="cert-card">
          <div style="font-size:2.4rem;">🏆</div>
          <div style="font-size:0.85rem; color:#38bdf8; font-weight:700;">BẢNG VINH DANH BÀI 12: BỘI CHUNG & BCNN</div>
          <div class="cert-title">${rank}</div>
          <p style="font-size:1.1rem; margin:0.4rem 0;">
            Học sinh: <strong style="color:#fff;">${this.state.playerName}</strong> • Lớp: <strong style="color:#fbbf24;">${this.state.playerClass}</strong>
          </p>
          <p style="color:var(--text-muted); font-size:0.95rem;">
            Tổng điểm Bài 12: <strong style="color:#fbbf24;">${this.state.score} điểm</strong> | Số sao đạt được: <strong style="color:#38bdf8;">${total}/15 ⭐</strong>
          </p>
        </div>
      `;
    } else {
      certBox.innerHTML = '';
    }
  },

  openStage(stageId) {
    Sound.init();
    Sound.click();
    document.getElementById('screen-welcome').style.display = 'none';
    document.getElementById('screen-map').style.display = 'none';
    document.getElementById('screen-stage').style.display = 'block';

    const q = QUESTS_12.find(x => x.id === stageId);
    document.getElementById('stage-header-title').textContent = q ? q.title : `Trò chơi ${stageId}`;
    BGM.playTrack(q ? q.musicTrack : 'map');

    if (stageId === 1) Game1Party.render();
    if (stageId === 2) Game2Frog.render();
    if (stageId === 3) Game3Factory.render();
    if (stageId === 4) Game4Stars.render(0);
    if (stageId === 5) Game5Tower.render();
  }
};

/* ==========================================================================
   TRÒ CHƠI 1 (HOẠT ĐỘNG KHỞI ĐỘNG): SIÊU THỊ BỮA TIỆC CỦA MAI (SGK tr. 49)
   Đĩa giấy: 4 cái/gói | Cốc giấy: 6 cái/gói.
   Tìm số gói ít nhất để số đĩa = số cốc (3 gói đĩa & 2 gói cốc = 12 cái).
   ========================================================================== */
const Game1Party = {
  platePacks: 1,
  cupPacks: 1,

  render() {
    document.getElementById('stage-sub-pills').innerHTML = `
      <span class="sub-pill active">Mở đầu: Mua đĩa giấy & cốc giấy (SGK tr. 49)</span>
    `;

    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🛒 Bài toán mở đầu: Bữa Tiệc Sinh Nhật Của Mai (SGK Toán 6 trang 49)</h3>
        <p>
          Để chuẩn bị cho buổi liên hoan lớp, bạn Mai đi siêu thị mua <strong>đĩa giấy</strong> và <strong>cốc giấy</strong>.<br/>
          • Đĩa giấy được bán theo gói <strong>4 cái/gói</strong>.<br/>
          • Cốc giấy được bán theo gói <strong>6 cái/gói</strong>.<br/>
          Mai muốn mua <strong>số đĩa và số cốc bằng nhau</strong> thì phải mua <strong>ít nhất</strong> bao nhiêu gói mỗi loại? Em hãy bấm nút <strong>+ / -</strong> trên hai kệ hàng bên dưới để giúp Mai nhé!
        </p>
      </div>

      <div class="party-shop">
        <!-- Kệ Đĩa Giấy -->
        <div class="shop-counter">
          <div style="font-size:2rem;">🍽️</div>
          <h4 style="color:#fbbf24; margin:0.25rem 0;">Kệ Đĩa Giấy (4 cái / gói)</h4>
          <p style="font-size:0.84rem; color:var(--text-muted);">Số đĩa luôn là bội của 4: 4, 8, 12, 16, 20...</p>
          <div class="item-packs" id="g1-plate-packs"></div>
          <div style="font-size:1.1rem; font-weight:800; margin-bottom:0.65rem;">
            Đang chọn: <span id="g1-plate-count" style="color:#fbbf24;">1</span> gói = <span id="g1-plate-total" style="color:#6ee7b7;">4</span> cái đĩa
          </div>
          <div style="display:flex; justify-content:center; gap:0.5rem;">
            <button class="btn btn-outline btn-sm" onclick="Game1Party.changePlates(-1)">➖ Bớt 1 gói</button>
            <button class="btn btn-accent btn-sm" onclick="Game1Party.changePlates(1)">➕ Thêm 1 gói (4 đĩa)</button>
          </div>
        </div>

        <!-- Kệ Cốc Giấy -->
        <div class="shop-counter">
          <div style="font-size:2rem;">🥤</div>
          <h4 style="color:#38bdf8; margin:0.25rem 0;">Kệ Cốc Giấy (6 cái / gói)</h4>
          <p style="font-size:0.84rem; color:var(--text-muted);">Số cốc luôn là bội của 6: 6, 12, 18, 24...</p>
          <div class="item-packs" id="g1-cup-packs"></div>
          <div style="font-size:1.1rem; font-weight:800; margin-bottom:0.65rem;">
            Đang chọn: <span id="g1-cup-count" style="color:#38bdf8;">1</span> gói = <span id="g1-cup-total" style="color:#6ee7b7;">6</span> cái cốc
          </div>
          <div style="display:flex; justify-content:center; gap:0.5rem;">
            <button class="btn btn-outline btn-sm" onclick="Game1Party.changeCups(-1)">➖ Bớt 1 gói</button>
            <button class="btn btn-primary btn-sm" onclick="Game1Party.changeCups(1)">➕ Thêm 1 gói (6 cốc)</button>
          </div>
        </div>
      </div>

      <div id="g1-balance-status" style="margin-bottom:1.15rem;"></div>

      <div class="step-card">
        <h4>🧾 Quầy Thu Ngân Siêu Thị: Chốt đơn hàng tối ưu cho Mai</h4>
        <div class="formula-row">
          <span>Số đĩa và cốc ít nhất bằng nhau là:</span>
          <input type="number" id="g1-ans-items" class="exp-input" placeholder="?" />
          <span>cái (gồm</span>
          <input type="number" id="g1-ans-plates" class="exp-input" placeholder="?" />
          <span>gói đĩa và</span>
          <input type="number" id="g1-ans-cups" class="exp-input" placeholder="?" />
          <span>gói cốc).</span>
        </div>
        <button class="btn btn-success" style="margin-top:0.75rem;" onclick="Game1Party.checkCheckout()">
          💳 Thanh toán đơn hàng & Mở khóa BCNN
        </button>
        <div class="feedback-box" id="g1-fb"></div>
      </div>
    `;

    this.updateShopUI();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai12', 1);
  },

  changePlates(delta) {
    Sound.pop();
    this.platePacks = Math.max(1, Math.min(8, this.platePacks + delta));
    this.updateShopUI();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai12', 1);
  },

  changeCups(delta) {
    Sound.pop();
    this.cupPacks = Math.max(1, Math.min(8, this.cupPacks + delta));
    this.updateShopUI();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai12', 1);
  },

  updateShopUI() {
    const pTotal = this.platePacks * 4;
    const cTotal = this.cupPacks * 6;

    document.getElementById('g1-plate-count').textContent = this.platePacks;
    document.getElementById('g1-plate-total').textContent = pTotal;
    document.getElementById('g1-cup-count').textContent = this.cupPacks;
    document.getElementById('g1-cup-total').textContent = cTotal;

    let pHtml = '';
    for (let i = 1; i <= this.platePacks; i++) {
      pHtml += `<div class="pack-box">🍽️ Gói ${i} (4)</div>`;
    }
    document.getElementById('g1-plate-packs').innerHTML = pHtml;

    let cHtml = '';
    for (let i = 1; i <= this.cupPacks; i++) {
      cHtml += `<div class="pack-box">🥤 Gói ${i} (6)</div>`;
    }
    document.getElementById('g1-cup-packs').innerHTML = cHtml;

    const statusEl = document.getElementById('g1-balance-status');
    const isEqual = pTotal === cTotal;
    const isMin = pTotal === 12 && cTotal === 12;

    if (isMin) {
      statusEl.innerHTML = `
        <div style="padding:0.9rem 1.1rem; border-radius:12px; background:rgba(16,185,129,0.22); border:1px solid #10b981; color:#a7f3d0; font-weight:700;">
          🎉 <strong>Cân bằng hoàn hảo ở mức nhỏ nhất!</strong> 3 gói đĩa (12 cái) = 2 gói cốc (12 cái). Hãy điền số 12, 3, 2 vào Quầy Thu Ngân bên dưới nhé!
        </div>
      `;
      document.getElementById('g1-ans-items').value = 12;
      document.getElementById('g1-ans-plates').value = 3;
      document.getElementById('g1-ans-cups').value = 2;
    } else if (isEqual) {
      statusEl.innerHTML = `
        <div style="padding:0.9rem 1.1rem; border-radius:12px; background:rgba(245,158,11,0.2); border:1px solid #f59e0b; color:#fde68a; font-weight:700;">
          💡 Số đĩa và số cốc đã bằng nhau (${pTotal} cái), nhưng vẫn có thể mua <strong>ít gói hơn</strong> nữa! Hãy thử giảm bớt số gói nhé!
        </div>
      `;
    } else {
      statusEl.innerHTML = `
        <div style="padding:0.9rem 1.1rem; border-radius:12px; background:rgba(239,68,68,0.16); border:1px solid rgba(239,68,68,0.5); color:#fecaca; font-weight:600;">
          ⚖️ Hiện tại: <strong>${pTotal} đĩa</strong> ${pTotal > cTotal ? '>' : '<'} <strong>${cTotal} cốc</strong> (Chưa bằng nhau). Hãy bấm thêm/bớt gói để hai bên bằng nhau!
        </div>
      `;
    }
  },

  checkCheckout() {
    const items = parseInt(document.getElementById('g1-ans-items').value, 10);
    const plates = parseInt(document.getElementById('g1-ans-plates').value, 10);
    const cups = parseInt(document.getElementById('g1-ans-cups').value, 10);
    const fb = document.getElementById('g1-fb');

    if (items === 12 && plates === 3 && cups === 2) {
      Sound.fanfare();
      App12.awardPoints('b12_s1', 100, 1, 3);
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🌟 <strong>Thanh toán thành công (+100 điểm & 3 ⭐)!</strong><br/>
        • Số <strong>12</strong> vừa là bội của 4, vừa là bội của 6 và là số nhỏ nhất khác 0 nên gọi là <strong>Bội chung nhỏ nhất của 4 và 6</strong>: <code>BCNN(4, 6) = 12</code>.<br/>
        • Khi đó Mai cần mua ít nhất <strong>12 : 4 = 3 gói đĩa</strong> và <strong>12 : 6 = 2 gói cốc</strong>!
        <div style="margin-top:0.85rem;">
          <button class="btn btn-success" onclick="App12.openStage(2)">Qua Trò chơi 2: Ếch Xanh Nhảy Lá Sen ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Kiểm tra lại nhé: Mua <strong>3 gói đĩa</strong> được 3 × 4 = <strong>12 cái đĩa</strong>; mua <strong>2 gói cốc</strong> được 2 × 6 = <strong>12 cái cốc</strong>!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 2 (HÌNH THÀNH KIẾN THỨC - PHẦN 1): ẾCH XANH NHẢY LÁ SEN (SGK tr. 49–50)
   HĐ1, HĐ2, HĐ3: Tìm B(6), B(9), BC(6, 9) và BCNN(6, 9) = 18;
   Nhận xét đặc biệt (? SGK tr. 50): BCNN(36, 9) = 36.
   ========================================================================== */
const Game2Frog = {
  selectedPads: new Set(),

  render() {
    this.selectedPads = new Set();
    document.getElementById('stage-sub-pills').innerHTML = `
      <span class="sub-pill active">HĐ1, HĐ2, HĐ3 & Nhận xét đặc biệt (SGK tr. 49–50)</span>
    `;

    const pads = [0, 6, 9, 12, 18, 24, 27, 30, 36];
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🐸 Trò chơi: Hai Chú Ếch Nhảy Lá Sen (HĐ1, HĐ2, HĐ3 - SGK tr. 49)</h3>
        <p>
          Trên mặt hồ có các lá sen đánh số. Xuất phát từ bờ (số 0):<br/>
          • <strong>Ếch Xanh 🐸</strong> mỗi lần nhảy xa <strong>6 đơn vị</strong> (đáp xuống các bội của 6: <code>0, 6, 12, 18, 24, 30, 36...</code>).<br/>
          • <strong>Ếch Vàng 👑</strong> mỗi lần nhảy xa <strong>9 đơn vị</strong> (đáp xuống các bội của 9: <code>0, 9, 18, 27, 36...</code>).
        </p>
      </div>

      <div class="step-card">
        <h4>Nhiệm vụ 1: Bấm chọn TẤT CẢ các lá sen mà CẢ HAI chú ếch cùng đáp xuống (tức các số thuộc BC(6, 9) từ 0 đến 36):</h4>
        <div class="pond-grid" id="g2-pond">
          ${pads.map(n => {
            const hasGreen = n % 6 === 0;
            const hasGold = n % 9 === 0;
            return `
              <div class="lily-pad" id="pad-${n}" onclick="Game2Frog.togglePad(${n})">
                <div class="lily-num">${n}</div>
                <div class="lily-frogs">
                  ${hasGreen ? '🐸' : ''}${hasGold ? '👑' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <h4>Nhiệm vụ 2: Tìm BCNN(6, 9) và trả lời câu hỏi Nhận xét đặc biệt (? SGK tr. 50):</h4>
        <div class="formula-row">
          <span>• Số nhỏ nhất <strong>khác 0</strong> trong tập hợp BC(6, 9) là <code>BCNN(6, 9)</code> = </span>
          <input type="number" id="g2-bcnn-6-9" class="exp-input" placeholder="?" />
        </div>
        <div class="formula-row">
          <span>• <strong>Nhận xét đặc biệt (? SGK tr. 50):</strong> Vì 36 ⋮ 9 nên <code>BCNN(36, 9)</code> = </span>
          <input type="number" id="g2-bcnn-36-9" class="exp-input" placeholder="?" />
        </div>

        <button class="btn btn-primary" style="margin-top:0.85rem;" onclick="Game2Frog.check()">
          ✔ Kiểm tra kết quả Hồ Sen
        </button>
        <div class="feedback-box" id="g2-fb"></div>
      </div>
    `;
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai12', 2);
  },

  togglePad(n) {
    Sound.jump();
    if (this.selectedPads.has(n)) {
      this.selectedPads.delete(n);
    } else {
      this.selectedPads.add(n);
    }
    const el = document.getElementById(`pad-${n}`);
    if (el) el.classList.toggle('selected-common', this.selectedPads.has(n));
  },

  check() {
    const arr = Array.from(this.selectedPads).sort((a, b) => a - b);
    const b1 = parseInt(document.getElementById('g2-bcnn-6-9').value, 10);
    const b2 = parseInt(document.getElementById('g2-bcnn-36-9').value, 10);
    const fb = document.getElementById('g2-fb');

    const padsOk = arr.length === 3 && arr[0] === 0 && arr[1] === 18 && arr[2] === 36;
    if (padsOk && b1 === 18 && b2 === 36) {
      Sound.fanfare();
      App12.awardPoints('b12_s2', 100, 2, 3);
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🐸 <strong>Xuất sắc (+100 điểm & 3 ⭐)!</strong><br/>
        • Hai chú ếch cùng gặp nhau tại các lá sen <strong>0, 18, 36...</strong> ⇒ <code>BC(6, 9) = {0; 18; 36; 54; ...}</code>.<br/>
        • Lá sen đầu tiên khác 0 là <strong>18</strong> ⇒ <code>BCNN(6, 9) = 18</code>.<br/>
        • Vì 36 chia hết cho 9 nên số lớn nhất là bội của số còn lại ⇒ <code>BCNN(36, 9) = 36</code>!
        <div style="margin-top:0.85rem;">
          <button class="btn btn-success" onclick="App12.openStage(3)">Qua Trò chơi 3: Kỹ Sư Điều Phối Nhà Máy ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Gợi ý: Hãy bấm chọn cả 3 lá sen có mặt CẢ Ếch Xanh 🐸 và Ếch Vàng 👑 (đó là các lá sen số <strong>0, 18, 36</strong>). Số nhỏ nhất khác 0 là <strong>18</strong>, và BCNN(36, 9) = <strong>36</strong>!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 3 (HÌNH THÀNH KIẾN THỨC - PHẦN 2): KỸ SƯ ĐIỀU PHỐI NHÀ MÁY (SGK tr. 50)
   - Luyện tập 1: a) BCNN(6, 8) = 24;  b) BCNN(8, 9, 72) = 72
   - Vận dụng: Máy A bảo dưỡng 6 tháng/lần, Máy B bảo dưỡng 9 tháng/lần -> 18 tháng.
   ========================================================================== */
const Game3Factory = {
  render() {
    document.getElementById('stage-sub-pills').innerHTML = `
      <span class="sub-pill active">Luyện tập 1 & Vận dụng: Bảo dưỡng máy A, B (SGK tr. 50)</span>
    `;

    let timelineHtml = '';
    for (let m = 1; m <= 36; m++) {
      const isA = m % 6 === 0;
      const isB = m % 9 === 0;
      const both = isA && isB;
      timelineHtml += `
        <div class="month-cell ${both ? 'both-machines' : ''}">
          <div style="font-weight:800; color:${both ? '#6ee7b7' : '#cbd5e1'}">T${m}</div>
          <div style="font-size:0.72rem; min-height:16px;">
            ${isA ? '🅰️' : ''}${isB ? '🅱️' : ''}
          </div>
        </div>
      `;
    }

    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>⚙️ Trò chơi: Kỹ Sư Điều Phối Nhà Máy (Luyện tập 1 & Vận dụng - SGK tr. 50)</h3>
        <p>
          Trong nhà máy thông minh, hai dây chuyền <strong>Máy A 🅰️</strong> và <strong>Máy B 🅱️</strong> có lịch bảo dưỡng định kì:<br/>
          • <strong>Máy A:</strong> cứ <strong>6 tháng</strong> bảo dưỡng một lần.<br/>
          • <strong>Máy B:</strong> cứ <strong>9 tháng</strong> bảo dưỡng một lần.<br/>
          Bảng radar 36 tháng bên dưới hiển thị các tháng bảo dưỡng của hai máy:
        </p>
      </div>

      <div class="step-card">
        <h4>📊 Bảng Radar Lịch Bảo Dưỡng 36 Tháng (🅰️ = Máy A, 🅱️ = Máy B):</h4>
        <div class="timeline-grid">${timelineHtml}</div>
      </div>

      <div class="step-card">
        <h4>Nhiệm vụ 1 — Luyện tập 1 (SGK tr. 50):</h4>
        <div class="formula-row">
          <span>a) Tìm <code>BCNN(6, 8)</code> = </span>
          <input type="number" id="g3-lt1a" class="exp-input" placeholder="?" />
          <span style="margin-left:1rem;">b) Tìm <code>BCNN(8, 9, 72)</code> = </span>
          <input type="number" id="g3-lt1b" class="exp-input" placeholder="?" />
        </div>
        <p style="font-size:0.84rem; color:var(--text-muted);">
          <em>Mẹo câu b: Nhận xét xem 72 có chia hết cho cả 8 và 9 không nhé!</em>
        </p>

        <h4 style="margin-top:1.1rem;">Nhiệm vụ 2 — Bài toán Vận dụng (SGK tr. 50):</h4>
        <p style="font-size:0.92rem; color:var(--text-muted); margin-bottom:0.4rem;">
          Hai máy A và B vừa cùng được bảo dưỡng vào tháng 10. Hỏi sau <strong>ít nhất bao nhiêu tháng nữa</strong> thì hai máy lại cùng được bảo dưỡng trong một tháng?
        </p>
        <div class="formula-row">
          <span>Sau ít nhất <code>BCNN(6, 9)</code> = </span>
          <input type="number" id="g3-vd" class="exp-input" placeholder="?" />
          <span>tháng nữa.</span>
        </div>

        <div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin-top:0.85rem;">
          <button class="btn btn-primary" onclick="Game3Factory.check()">✔ Xác nhận Lịch Điều Phối</button>
          <button class="btn btn-accent btn-sm" onclick="App12.toggleModal('casio-modal')">🧮 Mở máy tính Casio LCM</button>
        </div>
        <div class="feedback-box" id="g3-fb"></div>
      </div>
    `;
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai12', 3);
  },

  check() {
    const a = parseInt(document.getElementById('g3-lt1a').value, 10);
    const b = parseInt(document.getElementById('g3-lt1b').value, 10);
    const vd = parseInt(document.getElementById('g3-vd').value, 10);
    const fb = document.getElementById('g3-fb');

    if (a === 24 && b === 72 && vd === 18) {
      Sound.fanfare();
      App12.awardPoints('b12_s3', 100, 3, 3);
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        ⚙️ <strong>Điều phối nhà máy thành công (+100 điểm & 3 ⭐)!</strong><br/>
        • <strong>Luyện tập 1:</strong> a) B(6) = {0; 6; 12; 18; 24...}, B(8) = {0; 8; 16; 24...} ⇒ <code>BCNN(6, 8) = 24</code>.<br/>
        &nbsp;&nbsp;b) Vì 72 ⋮ 8 và 72 ⋮ 9 nên <code>BCNN(8, 9, 72) = 72</code>.<br/>
        • <strong>Vận dụng:</strong> Sau ít nhất <code>BCNN(6, 9) = 18 tháng</code> nữa thì hai máy A và B lại cùng được bảo dưỡng trong một tháng!
        <div style="margin-top:0.85rem;">
          <button class="btn btn-success" onclick="App12.openStage(4)">Qua Trò chơi 4: Thợ Săn Sao & Đấu Trường BCNN ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Kiểm tra lại nhé: a) BCNN(6, 8) = 24; b) Vì 72 chia hết cho 8 và 9 nên BCNN(8, 9, 72) = 72; Vận dụng: nhìn vào Bảng Radar, ô đầu tiên có cả 🅰️🅱️ là <strong>T18 (18 tháng)</strong>!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 4 (HOẠT ĐỘNG LUYỆN TẬP & TÍCH HỢP NLS 2.1TC1a - SGK tr. 53)
   - Chặng 4.1: Bài 2.36a (BCNN(5, 7) = 35 -> BC nhỏ hơn 200 của 5 và 7)
   - Chặng 4.2: Bài 2.36b (BCNN(3, 4, 10) = 60 -> BC nhỏ hơn 200 của 3, 4, 10)
   - Chặng 4.3: Đấu Trường Tìm Nhanh BCNN (4 câu tốc độ)
   ========================================================================== */
const Game4Stars = {
  subIdx: 0,
  selectedA: new Set(),
  selectedB: new Set(),
  speedIdx: 0,
  speedQuestions: [
    { q: 'Tìm nhanh BCNN(4, 10):', opts: ['10', '20', '40', '2'], ans: 1, exp: 'Bội của 10 là 0, 10, 20... Số nhỏ nhất khác 0 chia hết cho 4 là 20.' },
    { q: 'Tìm nhanh BCNN(12, 36):', opts: ['12', '24', '36', '72'], ans: 2, exp: 'Vì 36 ⋮ 12 nên theo nhận xét đặc biệt, BCNN(12, 36) = 36.' },
    { q: 'Tìm nhanh BCNN(15, 1):', opts: ['1', '15', '30', '0'], ans: 1, exp: 'Theo nhận xét đặc biệt: BCNN(a, 1) = a ⇒ BCNN(15, 1) = 15.' },
    { q: 'Tìm nhanh BCNN(8, 12):', opts: ['4', '16', '24', '96'], ans: 2, exp: 'B(12) = {0; 12; 24; 36...}. Số nhỏ nhất khác 0 chia hết cho 8 là 24.' }
  ],

  render(subIdx = 0) {
    this.subIdx = subIdx;
    const titles = [
      '4.1. Bài 2.36a: Săn sao BC(5, 7)',
      '4.2. Bài 2.36b: Săn sao BC(3, 4, 10)',
      '4.3. Đấu trường Phản xạ BCNN'
    ];
    document.getElementById('stage-sub-pills').innerHTML = titles.map((t, i) => `
      <span class="sub-pill ${i === subIdx ? 'active' : ''} ${App12.state.awardedKeys['b12_s4_' + i] ? 'done' : ''}"
            onclick="Game4Stars.render(${i})">${t}</span>
    `).join('');

    if (subIdx === 0) this.renderSub0();
    if (subIdx === 1) this.renderSub1();
    if (subIdx === 2) this.renderSub2(0);
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai12', 4);
  },

  renderSub0() {
    this.selectedA = new Set();
    const starNums = [0, 25, 35, 50, 70, 95, 105, 125, 140, 175, 210];
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>☄️ Chặng 4.1: Bài tập 2.36a (SGK Toán 6 trang 53)</h3>
        <p>
          Tìm <strong>BCNN(5, 7)</strong>, từ đó hãy bấm chọn <strong>tất cả các ngôi sao mang bội chung nhỏ hơn 200</strong> của 5 và 7!
        </p>
      </div>

      <div class="step-card">
        <h4>Bước 1: Điền BCNN(5, 7):</h4>
        <div class="formula-row">
          <span>Vì 5 và 7 là hai số nguyên tố cùng nhau nên <code>BCNN(5, 7)</code> = </span>
          <input type="number" id="g4-bcnn-5-7" class="exp-input" placeholder="?" />
        </div>

        <h4 style="margin-top:1rem;">Bước 2: Bấm chọn các ngôi sao là bội của 35 và <strong>nhỏ hơn 200</strong> (Lưu ý đừng quên số 0 và không chọn số ≥ 200!):</h4>
        <div class="chip-grid">
          ${starNums.map(n => `
            <div class="num-chip" id="star-a-${n}" onclick="Game4Stars.toggleStarA(${n})">⭐ ${n}</div>
          `).join('')}
        </div>

        <button class="btn btn-primary" onclick="Game4Stars.checkSub0()">✔ Kiểm tra chòm sao 2.36a</button>
        <div class="feedback-box" id="g4-fb-0"></div>
      </div>
    `;
  },

  toggleStarA(n) {
    Sound.pop();
    if (this.selectedA.has(n)) this.selectedA.delete(n);
    else this.selectedA.add(n);
    const el = document.getElementById(`star-a-${n}`);
    if (el) el.classList.toggle('common-active', this.selectedA.has(n));
  },

  checkSub0() {
    const bcnn = parseInt(document.getElementById('g4-bcnn-5-7').value, 10);
    const arr = Array.from(this.selectedA).sort((a, b) => a - b);
    const expected = [0, 35, 70, 105, 140, 175];
    const fb = document.getElementById('g4-fb-0');

    const isMatch = bcnn === 35 && arr.length === expected.length && arr.every((v, i) => v === expected[i]);
    if (isMatch) {
      Sound.success();
      App12.awardPoints('b12_s4_0', 50, 4, Math.max(1, App12.state.stageStars[4]));
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🌟 <strong>Chính xác (+50 điểm)!</strong><br/>
        • <code>BCNN(5, 7) = 35</code>.<br/>
        • Các bội chung nhỏ hơn 200 của 5 và 7 là các bội nhỏ hơn 200 của 35: <strong>0; 35; 70; 105; 140; 175</strong>.
        <div style="margin-top:0.75rem;">
          <button class="btn btn-success btn-sm" onclick="Game4Stars.render(1)">Tiếp tục Bài 2.36b ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Kiểm tra lại nhé: BCNN(5, 7) = 35. Nhân 35 lần lượt với 0, 1, 2, 3, 4, 5 ta được 6 ngôi sao nhỏ hơn 200 là: <strong>0, 35, 70, 105, 140, 175</strong> (không chọn 210 vì 210 > 200)!`;
    }
  },

  renderSub1() {
    this.selectedB = new Set();
    const starNums = [0, 30, 40, 60, 80, 120, 150, 180, 240];
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>☄️ Chặng 4.2: Bài tập 2.36b (SGK Toán 6 trang 53)</h3>
        <p>
          Tìm <strong>BCNN(3, 4, 10)</strong>, từ đó hãy bấm chọn <strong>tất cả các ngôi sao mang bội chung nhỏ hơn 200</strong> của 3, 4 và 10!
        </p>
      </div>

      <div class="step-card">
        <h4>Bước 1: Điền BCNN(3, 4, 10):</h4>
        <div class="formula-row">
          <span><code>BCNN(3, 4, 10)</code> = </span>
          <input type="number" id="g4-bcnn-3-4-10" class="exp-input" placeholder="?" />
        </div>

        <h4 style="margin-top:1rem;">Bước 2: Bấm chọn các ngôi sao là bội chung nhỏ hơn 200 của 3, 4 và 10:</h4>
        <div class="chip-grid">
          ${starNums.map(n => `
            <div class="num-chip" id="star-b-${n}" onclick="Game4Stars.toggleStarB(${n})">🌟 ${n}</div>
          `).join('')}
        </div>

        <button class="btn btn-primary" onclick="Game4Stars.checkSub1()">✔ Kiểm tra chòm sao 2.36b</button>
        <div class="feedback-box" id="g4-fb-1"></div>
      </div>
    `;
  },

  toggleStarB(n) {
    Sound.pop();
    if (this.selectedB.has(n)) this.selectedB.delete(n);
    else this.selectedB.add(n);
    const el = document.getElementById(`star-b-${n}`);
    if (el) el.classList.toggle('common-active', this.selectedB.has(n));
  },

  checkSub1() {
    const bcnn = parseInt(document.getElementById('g4-bcnn-3-4-10').value, 10);
    const arr = Array.from(this.selectedB).sort((a, b) => a - b);
    const expected = [0, 60, 120, 180];
    const fb = document.getElementById('g4-fb-1');

    const isMatch = bcnn === 60 && arr.length === expected.length && arr.every((v, i) => v === expected[i]);
    if (isMatch) {
      Sound.success();
      App12.awardPoints('b12_s4_1', 50, 4, Math.max(2, App12.state.stageStars[4]));
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🌟 <strong>Tuyệt vời (+50 điểm)!</strong><br/>
        • <code>BCNN(3, 4, 10) = 60</code>.<br/>
        • Các bội chung nhỏ hơn 200 của 3, 4 và 10 là: <strong>0; 60; 120; 180</strong>.
        <div style="margin-top:0.75rem;">
          <button class="btn btn-success btn-sm" onclick="Game4Stars.render(2)">Vào Đấu Trường Phản Xạ BCNN ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Gợi ý: Số nhỏ nhất khác 0 chia hết cho cả 3, 4 và 10 là <strong>60</strong>. Các bội nhỏ hơn 200 của 60 là: <strong>0, 60, 120, 180</strong>!`;
    }
  },

  renderSub2(qIdx = 0) {
    this.speedIdx = qIdx;
    const item = this.speedQuestions[qIdx];
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>⚡ Chặng 4.3: Trò chơi Tìm Nhanh BCNN (Tích hợp NLS 2.1TC1a — Câu ${qIdx + 1}/${this.speedQuestions.length})</h3>
        <p style="font-size:1.1rem; font-weight:800; color:#fff; margin-top:0.25rem;">${item.q}</p>
      </div>

      <div class="options-grid" id="g4-speed-opts">
        ${item.opts.map((o, idx) => `
          <button class="option-btn" onclick="Game4Stars.answerSpeed(${idx}, this)">
            <strong>${String.fromCharCode(65 + idx)}.</strong> ${o}
          </button>
        `).join('')}
      </div>

      <div class="feedback-box" id="g4-fb-2"></div>
    `;
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai12', 4);
  },

  answerSpeed(choice, btnEl) {
    const item = this.speedQuestions[this.speedIdx];
    const fb = document.getElementById('g4-fb-2');
    document.querySelectorAll('#g4-speed-opts .option-btn').forEach(b => b.classList.remove('correct', 'wrong'));

    if (choice === item.ans) {
      btnEl.classList.add('correct');
      const isLast = this.speedIdx === this.speedQuestions.length - 1;
      if (isLast) {
        Sound.fanfare();
        App12.awardPoints('b12_s4_2', 60, 4, 3);
      } else {
        Sound.success();
      }
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        ✅ <strong>Chính xác!</strong> ${item.exp}
        <div style="margin-top:0.75rem;">
          ${!isLast
            ? `<button class="btn btn-primary btn-sm" onclick="Game4Stars.renderSub2(${this.speedIdx + 1})">Câu tiếp theo (${this.speedIdx + 2}/${this.speedQuestions.length}) ▶</button>`
            : `<button class="btn btn-success" onclick="App12.openStage(5)">Qua Trò chơi 5: Tháp BCNN & Quy Đồng Phân Số ▶</button>`
          }
        </div>
      `;
    } else {
      Sound.error();
      btnEl.classList.add('wrong');
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Chưa đúng! Em hãy nhớ: BCNN phải chia hết cho tất cả các số đã cho và khác 0 nhé!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 5 (HOẠT ĐỘNG VẬN DỤNG & CHUẨN BỊ MỤC 2, 3 - SGK tr. 50–53)
   - Củng cố lưu ý: BCNN luôn là số nhỏ nhất KHÁC 0 trong tập BC.
   - Mở rộng chuẩn bị Tuần 08: Tìm BCNN bằng phân tích TSNT & Quy đồng mẫu phân số.
   ========================================================================== */
const Game5Tower = {
  render() {
    document.getElementById('stage-sub-pills').innerHTML = `
      <span class="sub-pill active">Củng cố & Chuẩn bị Mục 2, 3 (SGK tr. 50–53)</span>
    `;

    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🔮 Trò chơi 5: Đỉnh Tháp BCNN & Phép Thuật Quy Đồng Mẫu Số (SGK tr. 50–53)</h3>
        <p>
          Hoàn thành 3 tầng thử thách cuối cùng để củng cố kiến thức Tiết 28 và sẵn sàng cho Mục 2, Mục 3 của Bài 12!
        </p>
      </div>

      <div class="step-card">
        <h4>Tầng 1 (Củng cố kiến thức): Vì sao định nghĩa BCNN phải nhấn mạnh là số nhỏ nhất "KHÁC 0" trong tập hợp các bội chung?</h4>
        <div class="options-grid" id="g5-opts">
          <button class="option-btn" onclick="Game5Tower.selectReason(0, this)">
            A. Vì số 0 luôn là bội chung của mọi số tự nhiên khác 0 (nếu không trừ số 0 thì BCNN của mọi cặp số đều bằng 0).
          </button>
          <button class="option-btn" onclick="Game5Tower.selectReason(1, this)">
            B. Vì số 0 không chia hết cho số tự nhiên nào cả.
          </button>
        </div>
      </div>

      <div class="step-card">
        <h4>Tầng 2 (Khám phá Mục 2 - Cách tìm BCNN bằng phân tích thừa số nguyên tố):</h4>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.5rem;">
          Để tìm <code>BCNN(8, 12)</code>, ta phân tích: <code>8 = 2³</code> và <code>12 = 2² · 3¹</code>. Chọn các thừa số nguyên tố <strong>chung và riêng</strong> (là 2 và 3), mỗi thừa số lấy với <strong>số mũ lớn nhất</strong>:
        </p>
        <div class="formula-row">
          <span><code>BCNN(8, 12) = 2³ · 3¹</code> = </span>
          <input type="number" id="g5-bcnn-8-12" class="exp-input" placeholder="?" />
        </div>

        <h4 style="margin-top:1.1rem;">Tầng 3 (Khám phá Mục 3 - Ứng dụng BCNN để quy đồng mẫu hai phân số <code>1/8</code> và <code>5/12</code>):</h4>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.5rem;">
          Lấy mẫu chung là <code>BCNN(8, 12) = 24</code>. Hãy điền tử số mới sau khi quy đồng:
        </p>
        <div class="formula-row">
          <span><code>1/8 = </code></span>
          <input type="number" id="g5-num1" class="exp-input" placeholder="Tử?" />
          <span><code>/ 24</code> &nbsp;&nbsp; và &nbsp;&nbsp; <code>5/12 = </code></span>
          <input type="number" id="g5-num2" class="exp-input" placeholder="Tử?" />
          <span><code>/ 24</code></span>
        </div>

        <button class="btn btn-primary" style="margin-top:0.85rem;" onclick="Game5Tower.checkAll()">
          👑 Chinh phục Đỉnh Tháp & Nhận Bằng Đại Sứ Bội Chung
        </button>
        <div class="feedback-box" id="g5-fb"></div>
      </div>
    `;
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai12', 5);
  },

  reasonSelected: -1,

  selectReason(idx, btnEl) {
    Sound.click();
    this.reasonSelected = idx;
    document.querySelectorAll('#g5-opts .option-btn').forEach(b => b.classList.remove('selected', 'correct', 'wrong'));
    btnEl.classList.add('selected');
  },

  checkAll() {
    const bcnn = parseInt(document.getElementById('g5-bcnn-8-12').value, 10);
    const n1 = parseInt(document.getElementById('g5-num1').value, 10);
    const n2 = parseInt(document.getElementById('g5-num2').value, 10);
    const fb = document.getElementById('g5-fb');

    if (this.reasonSelected === 0 && bcnn === 24 && n1 === 3 && n2 === 10) {
      Sound.fanfare();
      App12.awardPoints('b12_s5', 120, 5, 3);
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🏆 <strong>CHÚC MỪNG EM ĐÃ CHINH PHỤC ĐỈNH THÁP BỘI CHUNG (+120 điểm & 3 ⭐)!</strong><br/>
        • Số 0 chia hết cho mọi số tự nhiên khác 0 nên luôn nằm trong tập BC; vì vậy <strong>BCNN phải là số nhỏ nhất khác 0</strong>.<br/>
        • <code>BCNN(8, 12) = 2³ · 3 = 24</code>.<br/>
        • Quy đồng mẫu số với mẫu chung 24: <code>1/8 = 3/24</code> (nhân cả tử và mẫu với 3) và <code>5/12 = 10/24</code> (nhân cả tử và mẫu với 2)!
        <div style="margin-top:0.9rem;">
          <button class="btn btn-accent" onclick="App12.showMap()">👑 Về Bản Đồ Xem Bảng Vinh Danh</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Kiểm tra lại nhé:<br/>
        • Tầng 1: Chọn đáp án <strong>A</strong> (vì 0 luôn là bội chung của mọi số tự nhiên khác 0).<br/>
        • Tầng 2: 2³ · 3 = 8 · 3 = <strong>24</strong>.<br/>
        • Tầng 3: 24 : 8 = 3 ⇒ 1/8 = <strong>3</strong>/24; và 24 : 12 = 2 ⇒ 5/12 = <strong>10</strong>/24!`;
    }
  }
};

window.addEventListener('DOMContentLoaded', () => App12.init());
