/* ==========================================================================
   HÀNH TRÌNH ƯỚC CHUNG - TOÁN 6 (BÀI 11: ƯỚC CHUNG. ƯỚC CHUNG LỚN NHẤT)
   Thiết kế bám sát KHBD Toán 6 - Tuần 07 (Tiết 25, 26, 27)
   ========================================================================== */

const Sound = {
  enabled: true,
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  toggle() {
    this.enabled = !this.enabled;
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) btn.textContent = this.enabled ? '🔊 Âm thanh' : '🔇 Tắt tiếng';
  },
  playTone(freq, duration = 0.14, type = 'sine', delay = 0) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.14, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {}
  },
  click() { this.playTone(520, 0.06, 'triangle'); },
  saw() {
    this.playTone(220, 0.08, 'sawtooth', 0);
    this.playTone(280, 0.1, 'sawtooth', 0.08);
  },
  success() {
    this.playTone(523.25, 0.12, 'sine', 0);
    this.playTone(659.25, 0.12, 'sine', 0.1);
    this.playTone(783.99, 0.22, 'sine', 0.2);
  },
  error() {
    this.playTone(240, 0.15, 'sawtooth', 0);
    this.playTone(180, 0.22, 'sawtooth', 0.12);
  },
  fanfare() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this.playTone(f, 0.18, 'triangle', i * 0.11);
    });
  }
};

/* Hệ thống Nhạc nền (BGM Synthesizer) cho từng ải của Bài 11 */
const BGM = {
  enabled: true,
  currentTrackId: 'map',
  timer: null,
  step: 0,
  tracks: {
    map:    { tempo: 260, wave: 'triangle', notes: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 392.00], bass: [130.81, 130.81, 196.00, 196.00] },
    stage1: { tempo: 225, wave: 'sine',     notes: [392.00, 440.00, 523.25, 587.33, 523.25, 440.00, 392.00, 329.63], bass: [130.81, 196.00, 146.83, 196.00] },
    stage2: { tempo: 215, wave: 'triangle', notes: [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 440.00], bass: [130.81, 164.81, 196.00, 130.81] },
    stage3: { tempo: 230, wave: 'sine',     notes: [440.00, 523.25, 659.25, 587.33, 493.88, 587.33, 659.25, 440.00], bass: [110.00, 164.81, 146.83, 110.00] },
    stage4: { tempo: 180, wave: 'triangle', notes: [587.33, 659.25, 698.46, 783.99, 880.00, 783.99, 698.46, 587.33], bass: [146.83, 220.00, 174.61, 146.83] },
    stage5: { tempo: 205, wave: 'sine',     notes: [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 587.33, 523.25], bass: [130.81, 196.00, 261.63, 130.81] }
  },
  playTrack(id) {
    this.currentTrackId = id || 'map';
    this.step = 0;
    if (this.timer) clearInterval(this.timer);
    if (!this.enabled) return;
    const tr = this.tracks[this.currentTrackId] || this.tracks.map;
    this.timer = setInterval(() => {
      if (!this.enabled) return;
      Sound.init();
      if (!Sound.ctx) return;
      if (Sound.ctx.state === 'suspended') Sound.ctx.resume();
      const idx = this.step % tr.notes.length;
      const freq = tr.notes[idx];
      const bFreq = tr.bass[idx % tr.bass.length];
      if (freq > 0) Sound.playTone(freq, tr.tempo / 1000 * 0.85, tr.wave, 0);
      if (bFreq > 0 && idx % 2 === 0) Sound.playTone(bFreq, tr.tempo / 1000 * 1.3, 'triangle', 0);
      this.step++;
    }, tr.tempo);
  },
  toggle() {
    this.enabled = !this.enabled;
    const pill = document.getElementById('bgm-pill');
    const lbl = document.getElementById('bgm-label');
    if (pill) pill.classList.toggle('muted', !this.enabled);
    if (lbl) lbl.textContent = this.enabled ? '🎵 Nhạc nền: Bật' : '🔇 Nhạc nền: Tắt';
    if (this.enabled) this.playTrack(this.currentTrackId);
    else if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }
};

/* Máy tính cầm tay ảo Casio fx-580VN X (Năng lực số 5.2TC1b) */
const Casio = {
  expr: 'GCD(36,84)',
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
    if (this.expr.endsWith('GCD(')) {
      this.expr = this.expr.slice(0, -4);
    } else {
      this.expr = this.expr.slice(0, -1);
    }
    this.render('');
  },
  quickExample(a, b) {
    Sound.click();
    this.expr = `GCD(${a},${b})`;
    this.evaluate();
  },
  gcdTwo(a, b) {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));
    while (b !== 0) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  },
  evaluate() {
    Sound.click();
    const raw = this.expr.trim().toUpperCase();
    const match = raw.match(/^GCD\(([\d,\s]+)\)?$/);
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
      ans = this.gcdTwo(ans, nums[i]);
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

/* Cấu trúc 5 ải tương ứng 5 Hoạt động trong KHBD Bài 11 */
const QUESTS = [
  {
    id: 1,
    tag: 'Hoạt động Khởi động (Tiết 25)',
    title: 'Ải 1: Xưởng Mộc Thông Thái',
    icon: '🪚',
    color: 'linear-gradient(135deg, #f59e0b, #b45309)',
    desc: 'Giúp bác thợ mộc cắt hai tấm gỗ dài 18 dm và 30 dm thành các thanh gỗ bằng nhau mà không thừa mẩu nào (SGK tr. 44).'
  },
  {
    id: 2,
    tag: 'Hoạt động 1: Hình thành kiến thức (Tiết 25)',
    title: 'Ải 2: Kho Báu Ước Chung & Biển Xanh',
    icon: '💎',
    color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    desc: 'Khám phá Ư(24), Ư(28), ƯC(24,28), chia bóng cho 3 anh em và chia nhóm tình nguyện làm sạch bờ biển (SGK tr. 44–45).'
  },
  {
    id: 3,
    tag: 'Hoạt động 2: Hình thành kiến thức (Tiết 26 & 27)',
    title: 'Ải 3: Phòng Thí Nghiệm Thừa Số Nguyên Tố',
    icon: '🧪',
    color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    desc: 'Thực hành 3 bước tìm ƯCLN bằng phân tích thừa số nguyên tố, xếp hàng văn nghệ, hội chợ và rút gọn phân số tối giản (SGK tr. 46–48).'
  },
  {
    id: 4,
    tag: 'Hoạt động Luyện tập (Tiết 27 • 2.1TC1a)',
    title: 'Ải 4: Đấu Trường Tốc Độ (Bài 2.30 – 2.35)',
    icon: '⚡',
    color: 'linear-gradient(135deg, #10b981, #047857)',
    desc: 'Chinh phục trọn bộ 6 bài tập SGK trang 48 (từ Bài 2.30 đến 2.35) với chuỗi Combo điểm thưởng!'
  },
  {
    id: 5,
    tag: 'Hoạt động Vận dụng & Mở rộng (SGK tr. 48)',
    title: 'Ải 5: Giải Mã Cỗ Máy Euclid Cổ Đại',
    icon: '🏛️',
    color: 'linear-gradient(135deg, #ec4899, #be185d)',
    desc: 'Khám phá Thuật toán Euclid tìm nhanh ƯCLN của hai số lớn bằng phép chia lấy dư và nhận Bằng Kiện Tướng!'
  }
];

const App = {
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
    const saved = localStorage.getItem('toan6_bai11_game_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      } catch (e) {}
    }
    this.updateHUD();
    if (this.state.playerName) {
      document.getElementById('player-name-input').value = this.state.playerName;
      document.getElementById('player-class-input').value = this.state.playerClass || '';
      this.showMap();
    }
  },

  save() {
    localStorage.setItem('toan6_bai11_game_state', JSON.stringify(this.state));
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
    Sound.click();
    const nameInput = document.getElementById('player-name-input').value.trim();
    const classInput = document.getElementById('player-class-input').value.trim();
    this.state.playerName = nameInput || 'Nhà Toán Học Nhí';
    this.state.playerClass = classInput || '6A';
    this.save();
    this.showMap();
  },

  changePlayer() {
    Sound.click();
    document.getElementById('screen-map').style.display = 'none';
    document.getElementById('screen-stage').style.display = 'none';
    document.getElementById('screen-welcome').style.display = 'block';
  },

  resetProgress() {
    if (!confirm('Em có chắc muốn xóa điểm để chơi lại từ đầu không?')) return;
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
    grid.innerHTML = QUESTS.map(q => {
      const stars = this.state.stageStars[q.id] || 0;
      const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
      return `
        <div class="quest-card ${stars === 3 ? 'completed' : ''}">
          <div>
            <div class="quest-top">
              <div class="quest-icon" style="background:${q.color}">${q.icon}</div>
              <span class="quest-tag">${q.tag}</span>
            </div>
            <div class="quest-title">${q.title}</div>
            <p class="quest-desc">${q.desc}</p>
          </div>
          <div class="quest-footer">
            <span class="star-display" title="${stars}/3 sao">${starStr}</span>
            <button class="btn ${stars === 3 ? 'btn-success' : 'btn-primary'} btn-sm" onclick="App.openStage(${q.id})">
              ${stars === 3 ? 'Chơi lại ải' : 'Vào ải ▶'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    const certBox = document.getElementById('certificate-section');
    const total = this.totalStars();
    if (total >= 3) {
      const rank = total === 15
        ? '👑 ĐẠI KIỆN TƯỚNG ƯỚC CHUNG TOÁN 6'
        : total >= 9
          ? '🏅 CHIẾN BINH ƯỚC CHUNG XUẤT SẮC'
          : '🌟 NHÀ THÁM HIỂM TOÁN HỌC';
      certBox.innerHTML = `
        <div class="cert-card">
          <div style="font-size:2.4rem;">🏆</div>
          <div style="font-size:0.85rem; color:#93c5fd; font-weight:700;">BẢNG VINH DANH BÀI 11: ƯỚC CHUNG & ƯCLN</div>
          <div class="cert-title">${rank}</div>
          <p style="font-size:1.1rem; margin:0.4rem 0;">
            Học sinh: <strong style="color:#fff;">${this.state.playerName}</strong> • Lớp: <strong style="color:#fbbf24;">${this.state.playerClass}</strong>
          </p>
          <p style="color:var(--text-muted); font-size:0.95rem;">
            Tổng điểm tích lũy: <strong style="color:#fbbf24;">${this.state.score} điểm</strong> | Số sao đạt được: <strong style="color:#38bdf8;">${total}/15 ⭐</strong>
          </p>
        </div>
      `;
    } else {
      certBox.innerHTML = '';
    }
  },

  openStage(stageId) {
    Sound.click();
    BGM.playTrack('stage' + stageId);
    document.getElementById('screen-welcome').style.display = 'none';
    document.getElementById('screen-map').style.display = 'none';
    document.getElementById('screen-stage').style.display = 'block';

    const q = QUESTS.find(x => x.id === stageId);
    document.getElementById('stage-header-title').textContent = q ? q.title : `Ải ${stageId}`;

    if (stageId === 1) Stage1.render();
    if (stageId === 2) Stage2.render(0);
    if (stageId === 3) Stage3.render(0);
    if (stageId === 4) Stage4.render(0);
    if (stageId === 5) Stage5.render();
  }
};

/* ==========================================================================
   ẢI 1: HOẠT ĐỘNG KHỞI ĐỘNG - XƯỞNG MỘC THÔNG THÁI (SGK tr. 44)
   Cắt 2 tấm gỗ 18 dm và 30 dm thành các thanh có cùng độ dài không thừa.
   ========================================================================== */
const Stage1 = {
  sawSizes: [1, 2, 3, 4, 5, 6, 9, 10],
  currentSaw: 4,
  foundValid: {},

  render() {
    document.getElementById('stage-sub-pills').innerHTML = `
      <span class="sub-pill active">Mở đầu: Cắt gỗ 18 dm & 30 dm</span>
    `;

    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🪚 Bài toán mở đầu (SGK Toán 6 trang 44)</h3>
        <p>
          Bác thợ mộc muốn cắt hai tấm gỗ dài <strong>18 dm</strong> và <strong>30 dm</strong> thành các thanh gỗ có <strong>cùng độ dài</strong> mà <strong>không để thừa mẩu gỗ nào</strong>. Em hãy thử các lưỡi cưa bên dưới để giúp bác tìm độ dài lớn nhất có thể của mỗi thanh gỗ được cắt ra nhé!
        </p>
      </div>

      <div class="wood-workshop">
        <div style="font-weight:700; color:#fbbf24;">
          Bước 1: Chọn kích thước lưỡi cưa (độ dài mỗi đoạn cắt) để thử máy cưa:
        </div>
        <div class="saw-selector" id="s1-saw-list"></div>

        <div id="s1-visualizer"></div>
      </div>

      <div class="step-card">
        <h4>Bước 2: Trả lời câu hỏi của Bác Thợ Mộc</h4>
        <p style="font-size:0.92rem; color:var(--text-muted); margin-bottom:0.75rem;">
          Sau khi thử máy cưa, độ dài <strong>lớn nhất</strong> (theo đơn vị dm) để cắt cả hai tấm gỗ <strong>18 dm</strong> và <strong>30 dm</strong> vừa khít không dư mẩu nào là bao nhiêu?
        </p>

        <div class="options-grid" id="s1-options">
          <button class="option-btn" onclick="Stage1.checkAnswer(3, this)">A. 3 dm</button>
          <button class="option-btn" onclick="Stage1.checkAnswer(6, this)">B. 6 dm (Ước chung lớn nhất của 18 và 30)</button>
          <button class="option-btn" onclick="Stage1.checkAnswer(9, this)">C. 9 dm</button>
          <button class="option-btn" onclick="Stage1.checkAnswer(10, this)">D. 10 dm</button>
        </div>

        <div class="feedback-box" id="s1-feedback"></div>
      </div>
    `;

    this.updateSawUI();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai11', 1);
  },

  selectSaw(size) {
    Sound.saw();
    this.currentSaw = size;
    if (18 % size === 0 && 30 % size === 0) {
      this.foundValid[size] = true;
    }
    this.updateSawUI();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai11', 1);
  },

  renderBar(totalLen, cutSize) {
    const count = Math.floor(totalLen / cutSize);
    const rem = totalLen % cutSize;
    let html = '';
    for (let i = 0; i < count; i++) {
      const w = (cutSize / totalLen) * 100;
      html += `<div class="wood-piece" style="width:${w}%">${cutSize}</div>`;
    }
    if (rem > 0) {
      const w = (rem / totalLen) * 100;
      html += `<div class="wood-rem" style="width:${w}%">Dư ${rem}</div>`;
    }
    return html;
  },

  updateSawUI() {
    const sawList = document.getElementById('s1-saw-list');
    sawList.innerHTML = this.sawSizes.map(s => {
      const isValid = this.foundValid[s];
      return `
        <button class="saw-btn ${this.currentSaw === s ? 'selected' : ''} ${isValid ? 'valid-found' : ''}"
                onclick="Stage1.selectSaw(${s})">
          🪚 Lưỡi cưa ${s} dm ${isValid ? '✅' : ''}
        </button>
      `;
    }).join('');

    const d = this.currentSaw;
    const ok18 = 18 % d === 0;
    const ok30 = 30 % d === 0;
    const bothOk = ok18 && ok30;

    const vis = document.getElementById('s1-visualizer');
    vis.innerHTML = `
      <div class="log-row">
        <div class="log-label">
          <span>🪵 Tấm gỗ thứ nhất (18 dm) ÷ ${d} dm:</span>
          <span style="color:${ok18 ? '#6ee7b7' : '#fca5a5'}">
            ${ok18 ? `✔ Cắt vừa khít ${18 / d} đoạn (Không dư)` : `✘ Được ${Math.floor(18 / d)} đoạn, bị thừa ${18 % d} dm!`}
          </span>
        </div>
        <div class="wood-bar">${this.renderBar(18, d)}</div>
      </div>

      <div class="log-row">
        <div class="log-label">
          <span>🪵 Tấm gỗ thứ hai (30 dm) ÷ ${d} dm:</span>
          <span style="color:${ok30 ? '#6ee7b7' : '#fca5a5'}">
            ${ok30 ? `✔ Cắt vừa khít ${30 / d} đoạn (Không dư)` : `✘ Được ${Math.floor(30 / d)} đoạn, bị thừa ${30 % d} dm!`}
          </span>
        </div>
        <div class="wood-bar">${this.renderBar(30, d)}</div>
      </div>

      <div style="padding:0.75rem 1rem; border-radius:10px; background:${bothOk ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.18)'}; border:1px solid ${bothOk ? '#10b981' : '#ef4444'};">
        ${bothOk
          ? `🎉 <strong>Tuyệt vời!</strong> Độ dài <strong>${d} dm</strong> vừa là ước của 18, vừa là ước của 30 nên cắt cả hai tấm gỗ đều không thừa mẩu nào!`
          : `⚠️ Với độ dài <strong>${d} dm</strong>, vẫn còn mẩu gỗ thừa vì ${d} không đồng thời là ước của cả 18 và 30.`}
      </div>
    `;
  },

  checkAnswer(ans, btnEl) {
    const fb = document.getElementById('s1-feedback');
    document.querySelectorAll('#s1-options .option-btn').forEach(b => b.classList.remove('correct', 'wrong'));

    if (ans === 6) {
      Sound.fanfare();
      btnEl.classList.add('correct');
      App.awardPoints('s1_done', 100, 1, 3);
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🌟 <strong>Chính xác (+100 điểm & 3 ⭐)!</strong><br/>
        Các độ dài cắt vừa khít cả hai tấm gỗ là <strong>1 dm, 2 dm, 3 dm, 6 dm</strong> (đây là các <em>ước chung</em> của 18 và 30).
        Trong đó, độ dài lớn nhất là <strong>6 dm</strong> — gọi là <strong>Ước chung lớn nhất</strong> của 18 và 30!
        <div style="margin-top:0.85rem;">
          <button class="btn btn-success" onclick="App.openStage(2)">Qua Ải 2: Kho Báu Ước Chung ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      btnEl.classList.add('wrong');
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Chưa đúng rồi! Em hãy thử bấm vào lưỡi cưa <strong>6 dm</strong> ở máy cưa phía trên để kiểm tra xem 18 và 30 có chia hết cho 6 không nhé!`;
    }
  }
};

/* ==========================================================================
   ẢI 2: HÌNH THÀNH KIẾN THỨC 1 - ƯỚC CHUNG & ƯCLN (Tiết 25 - SGK tr. 44-45)
   Gồm 3 chặng:
   - Chặng 2.1: HĐ1, HĐ2, HĐ3 tìm Ư(24), Ư(28), ƯC(24,28) và ƯCLN(24,28)
   - Chặng 2.2: Trường hợp đặc biệt ƯCLN(90,10) & Luyện tập 1 (Chia bóng 12 xanh, 15 đỏ)
   - Chặng 2.3: Vận dụng 1 - Bảo vệ môi trường biển (40 nam, 36 nữ)
   ========================================================================== */
const Stage2 = {
  subIndex: 0,
  selectedCommon24_28: new Set(),

  render(subIdx = 0) {
    this.subIndex = subIdx;
    const titles = [
      '2.1. Kho Báu ƯC(24, 28)',
      '2.2. Chia Bóng Cho 3 Anh Em',
      '2.3. Chiến Dịch Làm Sạch Bờ Biển'
    ];
    document.getElementById('stage-sub-pills').innerHTML = titles.map((t, idx) => `
      <span class="sub-pill ${idx === subIdx ? 'active' : ''} ${App.state.awardedKeys['s2_' + idx] ? 'done' : ''}"
            onclick="Stage2.render(${idx})">${t}</span>
    `).join('');

    if (subIdx === 0) this.renderSub0();
    if (subIdx === 1) this.renderSub1();
    if (subIdx === 2) this.renderSub2();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai11', 2);
  },

  renderSub0() {
    this.selectedCommon24_28 = new Set();
    const candidates = [1, 2, 3, 4, 6, 7, 8, 12, 14, 24, 28];
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>💎 Chặng 2.1: Khám phá ƯC(24, 28) và ƯCLN(24, 28) (HĐ1, HĐ2, HĐ3 - SGK tr. 44)</h3>
        <p>
          Ta đã liệt kê được hai rương ngọc:<br/>
          • Các ước của 24 là: <strong>Ư(24) = {1; 2; 3; 4; 6; 8; 12; 24}</strong><br/>
          • Các ước của 28 là: <strong>Ư(28) = {1; 2; 4; 7; 14; 28}</strong>
        </p>
      </div>

      <div class="step-card">
        <h4>Nhiệm vụ 1: Bấm chọn TẤT CẢ các viên ngọc xuất hiện ở CẢ HAI rương để lập tập hợp ƯC(24, 28):</h4>
        <div class="chip-grid" id="s2-chips">
          ${candidates.map(n => `
            <div class="num-chip" id="chip-24-28-${n}" onclick="Stage2.toggleChip(${n})">${n}</div>
          `).join('')}
        </div>

        <h4 style="margin-top:1rem;">Nhiệm vụ 2: Viên ngọc lớn nhất trong ƯC(24, 28) là số mấy? Điền ƯCLN(24, 28):</h4>
        <div class="formula-row">
          <span>ƯCLN(24, 28) = </span>
          <input type="number" id="s2-gcd-input" class="exp-input" placeholder="?" />
          <button class="btn btn-primary" onclick="Stage2.checkSub0()">✔ Kiểm tra kho báu</button>
        </div>

        <div class="feedback-box" id="s2-fb-0"></div>
      </div>
    `;
  },

  toggleChip(n) {
    Sound.click();
    if (this.selectedCommon24_28.has(n)) {
      this.selectedCommon24_28.delete(n);
    } else {
      this.selectedCommon24_28.add(n);
    }
    const el = document.getElementById(`chip-24-28-${n}`);
    if (el) el.classList.toggle('common-active', this.selectedCommon24_28.has(n));
  },

  checkSub0() {
    const chosen = Array.from(this.selectedCommon24_28).sort((a, b) => a - b);
    const gcdVal = parseInt(document.getElementById('s2-gcd-input').value, 10);
    const fb = document.getElementById('s2-fb-0');

    const isSetOk = chosen.length === 3 && chosen[0] === 1 && chosen[1] === 2 && chosen[2] === 4;
    if (isSetOk && gcdVal === 4) {
      Sound.success();
      App.awardPoints('s2_0', 50, 2, Math.max(1, App.state.stageStars[2]));
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🎉 <strong>Chính xác (+50 điểm)!</strong><br/>
        • Tập hợp ước chung là <strong>ƯC(24, 28) = {1; 2; 4}</strong>.<br/>
        • Số lớn nhất trong tập hợp đó là <strong>ƯCLN(24, 28) = 4</strong>.
        <div style="margin-top:0.75rem;">
          <button class="btn btn-success btn-sm" onclick="Stage2.render(1)">Tiếp tục Chặng 2.2 ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Hãy kiểm tra lại: Những số nào vừa có trong {1; 2; 3; 4; 6; 8; 12; 24} vừa có trong {1; 2; 4; 7; 14; 28}? (Gợi ý: chỉ có 3 số thôi!)`;
    }
  },

  renderSub1() {
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>⚽ Chặng 2.2: Trường hợp đặc biệt & Luyện tập 1 (SGK tr. 45)</h3>
        <p>
          • <strong>Nhận xét đặc biệt:</strong> Trong các số đã cho, nếu số nhỏ nhất là ước của các số còn lại thì ƯCLN bằng chính số nhỏ nhất đó: <code>Nếu a ⋮ b thì ƯCLN(a, b) = b</code>; và <code>ƯCLN(a, 1) = 1</code>.<br/>
          • <strong>Luyện tập 1:</strong> Bố có <strong>12 quả bóng màu xanh</strong> và <strong>15 quả bóng màu đỏ</strong>. Bố muốn chia đều số bóng cho <strong>3 anh em Việt, Hà, Nam</strong>.
        </p>
      </div>

      <div class="step-card">
        <h4>1. Câu hỏi nhanh (? SGK tr. 45): Vì 90 ⋮ 10 nên ƯCLN(90, 10) bằng bao nhiêu?</h4>
        <div class="formula-row">
          <span>ƯCLN(90, 10) = </span>
          <input type="number" id="s2-q1" class="exp-input" placeholder="?" />
        </div>

        <h4 style="margin-top:1rem;">2. Luyện tập 1 (SGK tr. 45): Vì 12 ⋮ 3 và 15 ⋮ 3 (3 là ước chung của 12 và 15), bố chia đều được cho 3 anh em. Khi đó mỗi anh em nhận được:</h4>
        <div class="formula-row">
          <span>Số bóng xanh mỗi người = </span>
          <input type="number" id="s2-blue" class="exp-input" placeholder="?" />
          <span>quả; &nbsp; Số bóng đỏ mỗi người = </span>
          <input type="number" id="s2-red" class="exp-input" placeholder="?" />
          <span>quả.</span>
        </div>

        <button class="btn btn-primary" style="margin-top:0.75rem;" onclick="Stage2.checkSub1()">✔ Kiểm tra đáp án</button>
        <div class="feedback-box" id="s2-fb-1"></div>
      </div>
    `;
  },

  checkSub1() {
    const q1 = parseInt(document.getElementById('s2-q1').value, 10);
    const blue = parseInt(document.getElementById('s2-blue').value, 10);
    const red = parseInt(document.getElementById('s2-red').value, 10);
    const fb = document.getElementById('s2-fb-1');

    if (q1 === 10 && blue === 4 && red === 5) {
      Sound.success();
      App.awardPoints('s2_1', 50, 2, Math.max(2, App.state.stageStars[2]));
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🌟 <strong>Hoàn hảo (+50 điểm)!</strong><br/>
        • Vì 90 ⋮ 10 nên <strong>ƯCLN(90, 10) = 10</strong>.<br/>
        • Vì 3 ∈ ƯC(12, 15) nên bố chia đều được: mỗi người nhận <strong>12 : 3 = 4 bóng xanh</strong> và <strong>15 : 3 = 5 bóng đỏ</strong>!
        <div style="margin-top:0.75rem;">
          <button class="btn btn-success btn-sm" onclick="Stage2.render(2)">Tiếp tục Chặng 2.3: Bảo vệ bờ biển ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Kiểm tra lại nhé: 90 chia hết cho 10 nên ƯCLN(90, 10) = 10. Chia 12 bóng xanh và 15 bóng đỏ cho 3 người thì lấy 12 : 3 và 15 : 3!`;
    }
  },

  renderSub2() {
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🌊 Chặng 2.3: Vận dụng 1 - Chiến Dịch Làm Sạch Bờ Biển (SGK tr. 45)</h3>
        <p>
          Một nhóm gồm <strong>40 học sinh nam</strong> và <strong>36 học sinh nữ</strong> tham gia bảo vệ môi trường làm sạch bờ biển. Cô phụ trách muốn chia các bạn thành các nhóm sao cho số nam và số nữ được chia đều vào các nhóm.
        </p>
      </div>

      <div class="step-card">
        <h4>Câu a) Số nhóm chia được phải là ước chung của 40 và 36. Biết ƯC(40, 36) = {1; 2; 4}, vậy có thể chia được thành mấy nhóm?</h4>
        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:0.65rem;">
          ✔ Có thể chia thành <strong>1 nhóm, 2 nhóm hoặc 4 nhóm</strong>.
        </p>

        <h4>Câu b) Có thể chia được NHIỀU NHẤT bao nhiêu nhóm? Khi đó mỗi nhóm có bao nhiêu bạn nam và bao nhiêu bạn nữ?</h4>
        <div class="formula-row">
          <span>Nhiều nhất:</span>
          <input type="number" id="s2-max-grp" class="exp-input" placeholder="?" />
          <span>nhóm (tức ƯCLN(40, 36))</span>
        </div>
        <div class="formula-row">
          <span>Khi đó mỗi nhóm có:</span>
          <input type="number" id="s2-boys" class="exp-input" placeholder="?" />
          <span>bạn nam và</span>
          <input type="number" id="s2-girls" class="exp-input" placeholder="?" />
          <span>bạn nữ.</span>
        </div>

        <button class="btn btn-primary" style="margin-top:0.75rem;" onclick="Stage2.checkSub2()">✔ Hoàn thành Ải 2</button>
        <div class="feedback-box" id="s2-fb-2"></div>
      </div>
    `;
  },

  checkSub2() {
    const g = parseInt(document.getElementById('s2-max-grp').value, 10);
    const boys = parseInt(document.getElementById('s2-boys').value, 10);
    const girls = parseInt(document.getElementById('s2-girls').value, 10);
    const fb = document.getElementById('s2-fb-2');

    if (g === 4 && boys === 10 && girls === 9) {
      Sound.fanfare();
      App.awardPoints('s2_2', 80, 2, 3);
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🌊 <strong>Tuyệt vời (+80 điểm & Đạt 3 ⭐ Ải 2)!</strong><br/>
        • Số nhóm nhiều nhất là <strong>ƯCLN(40, 36) = 4 nhóm</strong>.<br/>
        • Mỗi nhóm có <strong>40 : 4 = 10 bạn nam</strong> và <strong>36 : 4 = 9 bạn nữ</strong> cùng chung tay làm sạch bờ biển!
        <div style="margin-top:0.85rem;">
          <button class="btn btn-success" onclick="App.openStage(3)">Qua Ải 3: Phòng Thí Nghiệm Thừa Số Nguyên Tố ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Gợi ý: ƯCLN(40, 36) = 4 nhóm. Lấy 40 : 4 để tìm số nam và 36 : 4 để tìm số nữ trong mỗi nhóm nhé!`;
    }
  }
};

/* ==========================================================================
   ẢI 3: HÌNH THÀNH KIẾN THỨC 2 - TÌM ƯCLN BẰNG TSNT & RÚT GỌN PHÂN SỐ (Tiết 26-27)
   - Chặng 3.1: 3 Bước tìm ƯCLN(36, 84) (Luyện tập 2 SGK tr. 46)
   - Chặng 3.2: Vận dụng 2 (Xếp hàng văn nghệ 24, 28, 36) & Thử thách nhỏ (56, 28, 42, 98) + Máy tính GCD
   - Chặng 3.3: Rút gọn phân số tối giản Luyện tập 3 (90/27 và 50/125 - SGK tr. 48)
   ========================================================================== */
const Stage3 = {
  render(subIdx = 0) {
    const titles = [
      '3.1. Ba bước tìm ƯCLN(36, 84)',
      '3.2. Đội văn nghệ & Hội chợ (Casio GCD)',
      '3.3. Rút gọn Phân số tối giản'
    ];
    document.getElementById('stage-sub-pills').innerHTML = titles.map((t, idx) => `
      <span class="sub-pill ${idx === subIdx ? 'active' : ''} ${App.state.awardedKeys['s3_' + idx] ? 'done' : ''}"
            onclick="Stage3.render(${idx})">${t}</span>
    `).join('');

    if (subIdx === 0) this.renderSub0();
    if (subIdx === 1) this.renderSub1();
    if (subIdx === 2) this.renderSub2();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai11', 3);
  },

  renderSub0() {
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🧪 Chặng 3.1: Ba bước tìm ƯCLN bằng phân tích thừa số nguyên tố (Luyện tập 2 - SGK tr. 46)</h3>
        <p>Em hãy thực hiện lần lượt 3 bước trong phòng thí nghiệm để tìm <strong>ƯCLN(36, 84)</strong>:</p>
      </div>

      <div class="step-card">
        <h4>Bước 1: Phân tích 36 và 84 ra thừa số nguyên tố (điền số mũ thích hợp):</h4>
        <div class="formula-row">
          <span>36 = 2<sup><input type="number" id="s3-e1" class="exp-input" style="width:48px" value="2" /></sup> · 3<sup><input type="number" id="s3-e2" class="exp-input" style="width:48px" placeholder="?" /></sup></span>
          <span style="margin-left:1.5rem;">84 = 2<sup><input type="number" id="s3-e3" class="exp-input" style="width:48px" placeholder="?" /></sup> · 3<sup>1</sup> · 7<sup>1</sup></span>
        </div>

        <h4 style="margin-top:1rem;">Bước 2 & Bước 3: Chọn các thừa số nguyên tố CHUNG (là 2 và 3) với số mũ NHỎ NHẤT để tính ƯCLN(36, 84):</h4>
        <div class="formula-row">
          <span>ƯCLN(36, 84) = 2<sup>2</sup> · 3<sup>1</sup> = </span>
          <input type="number" id="s3-gcd3684" class="exp-input" placeholder="?" />
        </div>

        <div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin-top:0.85rem;">
          <button class="btn btn-primary" onclick="Stage3.checkSub0()">✔ Kiểm tra thí nghiệm</button>
          <button class="btn btn-accent btn-sm" onclick="App.toggleModal('casio-modal')">🧮 Mở máy tính Casio kiểm tra GCD(36,84)</button>
        </div>
        <div class="feedback-box" id="s3-fb-0"></div>
      </div>
    `;
  },

  checkSub0() {
    const e1 = parseInt(document.getElementById('s3-e1').value, 10);
    const e2 = parseInt(document.getElementById('s3-e2').value, 10);
    const e3 = parseInt(document.getElementById('s3-e3').value, 10);
    const g = parseInt(document.getElementById('s3-gcd3684').value, 10);
    const fb = document.getElementById('s3-fb-0');

    if (e1 === 2 && e2 === 2 && e3 === 2 && g === 12) {
      Sound.success();
      App.awardPoints('s3_0', 60, 3, Math.max(1, App.state.stageStars[3]));
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🧪 <strong>Thí nghiệm thành công (+60 điểm)!</strong><br/>
        • Ta có <code>36 = 2² · 3²</code> và <code>84 = 2² · 3 · 7</code>.<br/>
        • Thừa số nguyên tố chung là <code>2</code> và <code>3</code>; số mũ nhỏ nhất của 2 là 2, của 3 là 1.<br/>
        • Vậy <strong>ƯCLN(36, 84) = 2² · 3 = 12</strong>. Từ đó ƯC(36, 84) = Ư(12) = {1; 2; 3; 4; 6; 12}.
        <div style="margin-top:0.75rem;">
          <button class="btn btn-success btn-sm" onclick="Stage3.render(1)">Tiếp tục Chặng 3.2 ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Kiểm tra lại nhé: 36 = 4 · 9 = 2² · 3²; còn 84 = 4 · 3 · 7 = 2² · 3¹ · 7¹. Khi đó ƯCLN(36, 84) = 2² · 3 = 12!`;
    }
  },

  renderSub1() {
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🎭 Chặng 3.2: Vận dụng 2 & Thử thách nhỏ (SGK tr. 46–47) + Năng lực số 5.2TC1b</h3>
        <p>
          Em có thể tự tính hoặc sử dụng công cụ <strong>🧮 Máy tính GCD</strong> ở thanh công cụ phía trên để kiểm tra nhanh ƯCLN!
        </p>
      </div>

      <div class="step-card">
        <h4>Bài 1 (Vận dụng 2 - SGK tr. 46):</h4>
        <p style="font-size:0.9rem; color:var(--text-muted);">
          Một đại đội bộ binh có ba trung đội: trung đội I có <strong>24 chiến sĩ</strong>, trung đội II có <strong>28 chiến sĩ</strong>, trung đội III có <strong>36 chiến sĩ</strong>. Trong cuộc diễu binh, cả ba trung đội phải xếp thành các hàng dọc đều nhau mà không có chiến sĩ nào bị lẻ hàng. Hỏi có thể xếp được <strong>nhiều nhất</strong> bao nhiêu hàng dọc?
        </p>
        <div class="formula-row">
          <span>Số hàng dọc nhiều nhất = ƯCLN(24, 28, 36) = </span>
          <input type="number" id="s3-vd2" class="exp-input" placeholder="?" />
          <span>hàng.</span>
        </div>

        <h4 style="margin-top:1.1rem;">Bài 2 (Thử thách nhỏ - SGK tr. 47):</h4>
        <p style="font-size:0.9rem; color:var(--text-muted);">
          Bốn tổ của lớp 6A đóng góp tiền cho hội chợ từ thiện lần lượt là <strong>56, 28, 42, 98</strong> (nghìn đồng). Mỗi học sinh đều đóng một số tiền như nhau (là một số tự nhiên nghìn đồng lớn hơn 5 và nhỏ hơn 10). Biết <strong>ƯCLN(56, 28, 42, 98) = 14</strong>:
        </p>
        <div class="formula-row">
          <span>a) Giá tiền mỗi vé (mức đóng của 1 HS) là:</span>
          <input type="number" id="s3-tt-price" class="exp-input" placeholder="?" />
          <span>nghìn đồng.</span>
        </div>
        <div class="formula-row">
          <span>b) Tổng số học sinh lớp 6A tham gia là:</span>
          <input type="number" id="s3-tt-students" class="exp-input" placeholder="?" />
          <span>học sinh.</span>
        </div>

        <div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin-top:0.85rem;">
          <button class="btn btn-primary" onclick="Stage3.checkSub1()">✔ Kiểm tra đáp án</button>
          <button class="btn btn-accent btn-sm" onclick="App.toggleModal('casio-modal')">🧮 Mở máy tính Casio GCD</button>
        </div>
        <div class="feedback-box" id="s3-fb-1"></div>
      </div>
    `;
  },

  checkSub1() {
    const vd2 = parseInt(document.getElementById('s3-vd2').value, 10);
    const price = parseInt(document.getElementById('s3-tt-price').value, 10);
    const students = parseInt(document.getElementById('s3-tt-students').value, 10);
    const fb = document.getElementById('s3-fb-1');

    if (vd2 === 4 && ((price === 7 && students === 32) || (price === 14 && students === 16))) {
      Sound.success();
      App.awardPoints('s3_1', 60, 3, Math.max(2, App.state.stageStars[3]));
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🌟 <strong>Xuất sắc (+60 điểm)!</strong><br/>
        • <strong>Vận dụng 2:</strong> ƯCLN(24, 28, 36) = <strong>4 hàng dọc</strong>.<br/>
        • <strong>Thử thách nhỏ:</strong> ƯCLN(56, 28, 42, 98) = 14. Với mức vé <strong>7 nghìn đồng</strong>, tổng số HS tham gia là (56 + 28 + 42 + 98) : 7 = 224 : 7 = <strong>32 học sinh</strong>!
        <div style="margin-top:0.75rem;">
          <button class="btn btn-success btn-sm" onclick="Stage3.render(2)">Tiếp tục Chặng 3.3: Phân số tối giản ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Gợi ý: ƯCLN(24, 28, 36) = 4. Ở Thử thách nhỏ, ước của 14 lớn hơn 5 (và nhỏ hơn 10) là <strong>7</strong> (nghìn đồng). Khi đó tổng số học sinh là (56 + 28 + 42 + 98) : 7 = 224 : 7 = <strong>32</strong> học sinh!`;
    }
  },

  renderSub2() {
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🛡️ Chặng 3.3: Rút gọn về phân số tối giản (Luyện tập 3 - SGK tr. 48)</h3>
        <p>
          • Phân số <code>a/b</code> gọi là <strong>phân số tối giản</strong> nếu <code>ƯCLN(a, b) = 1</code> (khi đó a và b là hai số nguyên tố cùng nhau).<br/>
          • Để rút gọn phân số <code>a/b</code> về tối giản, ta <strong>chia cả tử và mẫu cho ƯCLN(a, b)</strong>.
        </p>
      </div>

      <div class="step-card">
        <h4>Câu a) Rút gọn phân số <code>90 / 27</code> về phân số tối giản:</h4>
        <div class="formula-row">
          <span>ƯCLN(90, 27) = </span>
          <input type="number" id="s3-g1" class="exp-input" placeholder="?" />
          <span>⇒ &nbsp; 90/27 = </span>
          <input type="number" id="s3-n1" class="exp-input" placeholder="Tử" />
          <span>/</span>
          <input type="number" id="s3-d1" class="exp-input" placeholder="Mẫu" />
        </div>

        <h4 style="margin-top:1.1rem;">Câu b) Rút gọn phân số <code>50 / 125</code> về phân số tối giản:</h4>
        <div class="formula-row">
          <span>ƯCLN(50, 125) = </span>
          <input type="number" id="s3-g2" class="exp-input" placeholder="?" />
          <span>⇒ &nbsp; 50/125 = </span>
          <input type="number" id="s3-n2" class="exp-input" placeholder="Tử" />
          <span>/</span>
          <input type="number" id="s3-d2" class="exp-input" placeholder="Mẫu" />
        </div>

        <button class="btn btn-primary" style="margin-top:0.85rem;" onclick="Stage3.checkSub2()">✔ Hoàn thành Ải 3</button>
        <div class="feedback-box" id="s3-fb-2"></div>
      </div>
    `;
  },

  checkSub2() {
    const g1 = parseInt(document.getElementById('s3-g1').value, 10);
    const n1 = parseInt(document.getElementById('s3-n1').value, 10);
    const d1 = parseInt(document.getElementById('s3-d1').value, 10);
    const g2 = parseInt(document.getElementById('s3-g2').value, 10);
    const n2 = parseInt(document.getElementById('s3-n2').value, 10);
    const d2 = parseInt(document.getElementById('s3-d2').value, 10);
    const fb = document.getElementById('s3-fb-2');

    if (g1 === 9 && n1 === 10 && d1 === 3 && g2 === 25 && n2 === 2 && d2 === 5) {
      Sound.fanfare();
      App.awardPoints('s3_2', 80, 3, 3);
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🎉 <strong>Chính xác tuyệt đối (+80 điểm & Đạt 3 ⭐ Ải 3)!</strong><br/>
        • a) <code>ƯCLN(90, 27) = 9</code> ⇒ <code>90/27 = (90 : 9)/(27 : 9) = 10/3</code>.<br/>
        • b) <code>ƯCLN(50, 125) = 25</code> ⇒ <code>50/125 = (50 : 25)/(125 : 25) = 2/5</code>.
        <div style="margin-top:0.85rem;">
          <button class="btn btn-success" onclick="App.openStage(4)">Qua Ải 4: Đấu Trường Tốc Độ (2.30 – 2.35) ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Kiểm tra lại nhé: ƯCLN(90, 27) = 9 (chia cả tử và mẫu cho 9 được 10/3). Còn ƯCLN(50, 125) = 25 (chia cả tử và mẫu cho 25 được 2/5)!`;
    }
  }
};

/* ==========================================================================
   ẢI 4: HOẠT ĐỘNG LUYỆN TẬP - ĐẤU TRƯỜNG TỐC ĐỘ 2.30 ĐẾN 2.35 (SGK tr. 48)
   Gồm 6 câu hỏi bám sát toàn bộ 6 bài tập SGK trang 48
   ========================================================================== */
const Stage4 = {
  qIndex: 0,
  combo: 0,
  questions: [
    {
      code: 'Bài 2.30 (SGK tr. 48)',
      prompt: 'Tìm tập hợp ƯC(30, 45) và ƯC(42, 70):',
      options: [
        'ƯC(30, 45) = {1; 3; 5; 15} và ƯC(42, 70) = {1; 2; 7; 14}',
        'ƯC(30, 45) = {1; 5; 9; 15} và ƯC(42, 70) = {1; 2; 7; 21}',
        'ƯC(30, 45) = {1; 2; 3; 5} và ƯC(42, 70) = {1; 2; 14; 35}',
        'ƯC(30, 45) = {3; 5; 15} và ƯC(42, 70) = {2; 7; 14}'
      ],
      correct: 0,
      explain: 'Ta có ƯCLN(30, 45) = 15 ⇒ ƯC(30, 45) = Ư(15) = {1; 3; 5; 15}. Tương tự ƯCLN(42, 70) = 14 ⇒ ƯC(42, 70) = Ư(14) = {1; 2; 7; 14}.'
    },
    {
      code: 'Bài 2.31 (SGK tr. 48)',
      prompt: 'Tìm ƯCLN(40, 70) và ƯCLN(55, 77):',
      options: [
        'ƯCLN(40, 70) = 5 và ƯCLN(55, 77) = 7',
        'ƯCLN(40, 70) = 10 và ƯCLN(55, 77) = 11',
        'ƯCLN(40, 70) = 20 và ƯCLN(55, 77) = 11',
        'ƯCLN(40, 70) = 10 và ƯCLN(55, 77) = 5'
      ],
      correct: 1,
      explain: '40 = 2³·5, 70 = 2·5·7 ⇒ ƯCLN(40, 70) = 2·5 = 10. Và 55 = 5·11, 77 = 7·11 ⇒ ƯCLN(55, 77) = 11.'
    },
    {
      code: 'Bài 2.32 (SGK tr. 48)',
      prompt: 'Tìm ƯCLN của: a) 2²·5 và 2·3·5;  b) 2⁴·3; 2²·3²·5 và 2⁴·11:',
      options: [
        'a) 20 và b) 12',
        'a) 10 và b) 4',
        'a) 10 và b) 8',
        'a) 5 và b) 4'
      ],
      correct: 1,
      explain: 'a) Thừa số chung là 2 và 5 với mũ nhỏ nhất là 1 ⇒ 2¹·5¹ = 10. b) Thừa số nguyên tố chung duy nhất của cả 3 số là 2 với số mũ nhỏ nhất là 2 ⇒ 2² = 4.'
    },
    {
      code: 'Bài 2.33 (SGK tr. 48)',
      prompt: 'Cho a = 72 = 2³·3² và b = 96 = 2⁵·3. Tìm ƯCLN(72, 96) và ƯC(72, 96):',
      options: [
        'ƯCLN(72, 96) = 12; ƯC(72, 96) = {1; 2; 3; 4; 6; 12}',
        'ƯCLN(72, 96) = 24; ƯC(72, 96) = {1; 2; 3; 4; 6; 8; 12; 24}',
        'ƯCLN(72, 96) = 36; ƯC(72, 96) = {1; 2; 3; 4; 6; 9; 12; 18; 36}',
        'ƯCLN(72, 96) = 48; ƯC(72, 96) = {1; 2; 3; 4; 6; 8; 12; 16; 24; 48}'
      ],
      correct: 1,
      explain: 'ƯCLN(72, 96) = 2³·3¹ = 8·3 = 24. Suy ra ƯC(72, 96) = Ư(24) = {1; 2; 3; 4; 6; 8; 12; 24}.'
    },
    {
      code: 'Bài 2.34 (SGK tr. 48)',
      prompt: 'Trong hai phân số 50/85 và 23/81, phân số nào đã tối giản? Rút gọn phân số chưa tối giản:',
      options: [
        '23/81 đã tối giản; còn 50/85 rút gọn cho 5 được 10/17',
        '50/85 đã tối giản; còn 23/81 rút gọn được 1/3',
        'Cả hai phân số đều đã tối giản',
        '23/81 đã tối giản; còn 50/85 rút gọn được 5/17'
      ],
      correct: 0,
      explain: 'ƯCLN(23, 81) = 1 nên 23/81 là phân số tối giản. Còn ƯCLN(50, 85) = 5 nên 50/85 = (50:5)/(85:5) = 10/17.'
    },
    {
      code: 'Bài 2.35 (SGK tr. 48)',
      prompt: 'Cặp số nào dưới đây là HAI HỢP SỐ nhưng lại NGUYÊN TỐ CÙNG NHAU (có ƯCLN bằng 1)?',
      options: [
        '7 và 9 (7 là số nguyên tố)',
        '8 và 10 (cùng chia hết cho 2)',
        '8 và 9 (hoặc 15 và 16)',
        '9 và 15 (cùng chia hết cho 3)'
      ],
      correct: 2,
      explain: '8 = 2³ (hợp số) và 9 = 3² (hợp số), nhưng ƯCLN(8, 9) = 1 nên 8 và 9 là hai hợp số nguyên tố cùng nhau (tương tự 15 và 16)!'
    }
  ],

  render(idx = 0) {
    this.qIndex = idx;
    document.getElementById('stage-sub-pills').innerHTML = this.questions.map((q, i) => `
      <span class="sub-pill ${i === idx ? 'active' : ''} ${App.state.awardedKeys['s4_' + i] ? 'done' : ''}"
            onclick="Stage4.render(${i})">${q.code.split(' ')[0]} ${q.code.split(' ')[1]}</span>
    `).join('');

    const q = this.questions[idx];
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>⚡ ${q.code} — Chuỗi Combo hiện tại: 🔥 ${this.combo}</h3>
        <p style="font-size:1.05rem; font-weight:700; color:#fff; margin-top:0.3rem;">${q.prompt}</p>
      </div>

      <div class="options-grid" id="s4-options">
        ${q.options.map((opt, oIdx) => `
          <button class="option-btn" onclick="Stage4.answer(${oIdx}, this)">
            <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
          </button>
        `).join('')}
      </div>

      <div class="feedback-box" id="s4-fb"></div>
    `;
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai11', 4);
  },

  answer(choiceIdx, btnEl) {
    const q = this.questions[this.qIndex];
    const fb = document.getElementById('s4-fb');
    document.querySelectorAll('#s4-options .option-btn').forEach(b => b.classList.remove('correct', 'wrong'));

    if (choiceIdx === q.correct) {
      Sound.success();
      this.combo++;
      btnEl.classList.add('correct');

      const completedCount = this.questions.filter((_, i) => i === this.qIndex || App.state.awardedKeys['s4_' + i]).length;
      const stars = completedCount >= 6 ? 3 : completedCount >= 4 ? 2 : 1;
      App.awardPoints('s4_' + this.qIndex, 40, 4, stars);

      const isLast = this.qIndex === this.questions.length - 1;
      if (completedCount >= 6) Sound.fanfare();

      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        ✅ <strong>Chính xác (+40 điểm • Combo 🔥${this.combo})!</strong><br/>
        <em>Giải thích:</em> ${q.explain}
        <div style="margin-top:0.8rem;">
          ${!isLast
            ? `<button class="btn btn-primary btn-sm" onclick="Stage4.render(${this.qIndex + 1})">Câu tiếp theo (${this.qIndex + 2}/6) ▶</button>`
            : `<button class="btn btn-success" onclick="App.openStage(5)">Qua Ải 5: Giải Mã Cỗ Máy Euclid Cổ Đại ▶</button>`
          }
        </div>
      `;
    } else {
      Sound.error();
      this.combo = 0;
      btnEl.classList.add('wrong');
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Chưa chính xác! Hãy đọc kỹ lại đề hoặc mở <strong>🧮 Máy tính GCD</strong> để kiểm tra nhé!`;
    }
  }
};

/* ==========================================================================
   ẢI 5: HOẠT ĐỘNG VẬN DỤNG & MỞ RỘNG - THUẬT TOÁN EUCLID (Em có biết - SGK tr. 48)
   Tìm ƯCLN bằng cách chia lấy dư liên tiếp cho đến khi dư bằng 0.
   ========================================================================== */
const Stage5 = {
  render() {
    document.getElementById('stage-sub-pills').innerHTML = `
      <span class="sub-pill active">Em có biết: Thuật toán Euclid (SGK tr. 48)</span>
    `;

    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🏛️ Khám phá "Em có biết?": Thuật toán Euclid tìm ƯCLN (SGK tr. 48)</h3>
        <p>
          Nhà toán học cổ đại <strong>Euclid</strong> đã phát hiện ra cách tìm nhanh <code>ƯCLN(a, b)</code> mà không cần phân tích ra thừa số nguyên tố:<br/>
          <em>“Lấy số lớn chia cho số nhỏ. Nếu phép chia còn dư, ta lại lấy số chia đem chia cho số dư... Cứ tiếp tục như vậy cho đến khi số dư bằng 0 thì <strong>số dư khác 0 cuối cùng</strong> chính là ƯCLN!”</em>
        </p>
      </div>

      <div class="step-card">
        <h4>🔑 Thử thách giải mã Cỗ Máy Euclid: Tìm <code>ƯCLN(135, 105)</code></h4>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.85rem;">
          Hãy điền các số dư còn thiếu vào 3 bánh răng của Cỗ Máy Euclid bên dưới:
        </p>

        <div class="euclid-step">
          <span>⚙️ <strong>Bước 1:</strong> Chia 135 cho 105 được thương là 1, số dư là:</span>
          <div class="formula-row" style="margin:0;">
            <span>135 = 105 · 1 + </span>
            <input type="number" id="s5-r1" class="exp-input" placeholder="Dư?" />
          </div>
        </div>

        <div class="euclid-step">
          <span>⚙️ <strong>Bước 2:</strong> Lấy 105 chia cho số dư vừa tìm được (30), được thương là 3, số dư mới là:</span>
          <div class="formula-row" style="margin:0;">
            <span>105 = 30 · 3 + </span>
            <input type="number" id="s5-r2" class="exp-input" placeholder="Dư?" />
          </div>
        </div>

        <div class="euclid-step">
          <span>⚙️ <strong>Bước 3:</strong> Lấy 30 chia cho 15 được thương là 2, số dư bằng <strong>0</strong> (Dừng!). Vậy <strong>ƯCLN(135, 105)</strong> bằng:</span>
          <div class="formula-row" style="margin:0;">
            <span>ƯCLN(135, 105) = </span>
            <input type="number" id="s5-ans" class="exp-input" placeholder="?" />
          </div>
        </div>

        <button class="btn btn-primary" style="margin-top:0.85rem;" onclick="Stage5.check()">
          🔓 Mở khóa Mật Mã Euclid & Nhận Bằng Vinh Danh
        </button>

        <div class="feedback-box" id="s5-fb"></div>
      </div>

      <!-- Công cụ tự thử Thuật toán Euclid với 2 số bất kỳ -->
      <div class="step-card">
        <h4>⚡ Máy Trình Chiếu Từng Bước Thuật Toán Euclid (Thử số bất kỳ)</h4>
        <div class="formula-row">
          <span>Số thứ nhất a =</span>
          <input type="number" id="euclid-a" class="exp-input" style="width:90px" value="126" />
          <span>Số thứ hai b =</span>
          <input type="number" id="euclid-b" class="exp-input" style="width:90px" value="70" />
          <button class="btn btn-outline btn-sm" onclick="Stage5.runCustomEuclid()">▶ Chạy từng bước Euclid</button>
        </div>
        <div id="euclid-custom-steps" style="margin-top:0.75rem; font-size:0.92rem;"></div>
      </div>
    `;

    this.runCustomEuclid();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai11', 5);
  },

  check() {
    const r1 = parseInt(document.getElementById('s5-r1').value, 10);
    const r2 = parseInt(document.getElementById('s5-r2').value, 10);
    const ans = parseInt(document.getElementById('s5-ans').value, 10);
    const fb = document.getElementById('s5-fb');

    if (r1 === 30 && r2 === 15 && ans === 15) {
      Sound.fanfare();
      App.awardPoints('s5_done', 120, 5, 3);
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🏆 <strong>CHÚC MỪNG! EM ĐÃ GIẢI MÃ THÀNH CÔNG CỖ MÁY EUCLID (+120 điểm & 3 ⭐)!</strong><br/>
        • 135 = 105 · 1 + <strong>30</strong><br/>
        • 105 = 30 · 3 + <strong>15</strong><br/>
        • 30 = 15 · 2 + 0 ⇒ Số dư khác 0 cuối cùng là <strong>15</strong> nên <code>ƯCLN(135, 105) = 15</code>!
        <div style="margin-top:0.9rem;">
          <button class="btn btn-accent" onclick="App.showMap()">👑 Về Bản Đồ Xem Bảng Vinh Danh</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Kiểm tra lại phép trừ nhé: 135 - 105 = 30 (dư bước 1 là 30). Tiếp theo 105 - 30·3 = 105 - 90 = 15 (dư bước 2 là 15). Vậy ƯCLN(135, 105) = 15!`;
    }
  },

  runCustomEuclid() {
    let a = parseInt(document.getElementById('euclid-a').value, 10);
    let b = parseInt(document.getElementById('euclid-b').value, 10);
    const out = document.getElementById('euclid-custom-steps');
    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
      out.innerHTML = `<span style="color:#fca5a5;">Vui lòng nhập hai số tự nhiên dương!</span>`;
      return;
    }
    if (a < b) { const t = a; a = b; b = t; }
    const origA = a, origB = b;
    let stepsHtml = '';
    let stepNum = 1;
    while (b !== 0) {
      const q = Math.floor(a / b);
      const r = a % b;
      stepsHtml += `<div style="padding:0.35rem 0; border-bottom:1px dashed rgba(255,255,255,0.1);">
        Bước ${stepNum}: <code>${a} = ${b} · ${q} + <strong style="color:#fbbf24;">${r}</strong></code>
        ${r === 0 ? ` → Dư bằng 0 (Dừng!)` : ` → Chia tiếp ${b} cho ${r}`}
      </div>`;
      a = b;
      b = r;
      stepNum++;
    }
    stepsHtml += `<div style="margin-top:0.5rem; color:#6ee7b7; font-weight:800;">
      ⇒ Kết luận: ƯCLN(${origA}, ${origB}) = ${a}
    </div>`;
    out.innerHTML = stepsHtml;
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());
