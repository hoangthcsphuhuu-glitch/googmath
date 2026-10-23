/* ==========================================================================
   VƯƠNG QUỐC SỐ NGUYÊN TỐ - TOÁN 6 (BÀI 10: SỐ NGUYÊN TỐ & LUYỆN TẬP CHUNG)
   Thiết kế bám sát KHBD Toán 6 - Tuần 06 (Tiết 21, 22, 23, 24 - SGK tr. 38–43)
   Tích hợp Nhạc nền đa giai điệu (BGM) & Đọc câu dẫn Tiếng Việt (VoiceNarrator)
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
  click() { this.playTone(540, 0.06, 'triangle'); },
  pop() {
    this.playTone(460, 0.06, 'sine', 0);
    this.playTone(690, 0.09, 'sine', 0.05);
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
   Mỗi hoạt động của Bài 10 có một bản nhạc nền riêng biệt!
   ========================================================================== */
const BGM = {
  enabled: true,
  currentTrackId: 'map',
  timer: null,
  step: 0,
  tracks: {
    map: {
      name: 'Khúc Dạo Đầu Nguyên Tố',
      tempo: 255,
      wave: 'triangle',
      notes: [329.63, 392.00, 493.88, 587.33, 493.88, 392.00, 329.63, 293.66],
      bass:  [130.81, 164.81, 196.00, 146.83]
    },
    stage1: {
      name: 'Tiệm Hoa Mùa Xuân (Khởi động)',
      tempo: 220,
      wave: 'sine',
      notes: [523.25, 587.33, 659.25, 783.99, 659.25, 523.25, 440.00, 523.25],
      bass:  [130.81, 196.00, 164.81, 130.81]
    },
    stage2: {
      name: 'Mê Cung Eratosthenes (Hình thành kiến thức 1)',
      tempo: 205,
      wave: 'triangle',
      notes: [440.00, 523.25, 659.25, 587.33, 493.88, 587.33, 659.25, 440.00],
      bass:  [110.00, 164.81, 146.83, 110.00]
    },
    stage3: {
      name: 'Khu Rừng Thừa Số (Sơ đồ cây & Sơ đồ cột)',
      tempo: 225,
      wave: 'sine',
      notes: [392.00, 493.88, 587.33, 783.99, 659.25, 587.33, 493.88, 392.00],
      bass:  [196.00, 146.83, 164.81, 130.81]
    },
    stage4: {
      name: 'Nhịp Bước Quảng Trường (Luyện tập 2.17 – 2.24)',
      tempo: 185,
      wave: 'triangle',
      notes: [523.25, 523.25, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25],
      bass:  [130.81, 196.00, 146.83, 196.00]
    },
    stage5: {
      name: 'Vũ Điệu Nguyên Tố Sinh Đôi (Luyện tập chung Tiết 24)',
      tempo: 200,
      wave: 'sine',
      notes: [587.33, 659.25, 783.99, 987.77, 880.00, 783.99, 659.25, 587.33],
      bass:  [146.83, 220.00, 196.00, 146.83]
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
        this.playNote(noteFreq, tr.tempo / 1000 * 0.85, tr.wave, 0.03);
      }
      if (bassFreq > 0 && idx % 2 === 0) {
        this.playNote(bassFreq, tr.tempo / 1000 * 1.4, 'triangle', 0.024);
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

/* Máy tính cầm tay ảo Casio fx-580VN X - Phân tích thừa số nguyên tố (FACT) */
const CasioFact = {
  expr: '60',
  insert(token) {
    Sound.click();
    if (this.expr === '0') this.expr = '';
    if (this.expr.length < 9) this.expr += token;
    this.render('');
  },
  clear() {
    Sound.click();
    this.expr = '';
    this.render('0');
  },
  backspace() {
    Sound.click();
    this.expr = this.expr.slice(0, -1);
    this.render('');
  },
  quickExample(num) {
    Sound.click();
    this.expr = String(num);
    this.evaluate();
  },
  factorize(n) {
    const factors = [];
    let d = 2;
    let temp = n;
    while (d * d <= temp) {
      let count = 0;
      while (temp % d === 0) {
        count++;
        temp = Math.floor(temp / d);
      }
      if (count > 0) factors.push({ p: d, e: count });
      d++;
    }
    if (temp > 1) factors.push({ p: temp, e: 1 });
    return factors;
  },
  supStr(exp) {
    const map = { '0': '⁰', '1': '', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    if (exp === 1) return '';
    return String(exp).split('').map(c => map[c] || `^${c}`).join('');
  },
  evaluate() {
    Sound.click();
    const n = parseInt(this.expr.trim(), 10);
    if (isNaN(n) || n <= 1) {
      this.render('Nhập số > 1');
      Sound.error();
      return;
    }
    const fac = this.factorize(n);
    const formatted = fac.map(f => `${f.p}${this.supStr(f.e)}`).join(' × ');
    const isPrime = fac.length === 1 && fac[0].e === 1;
    this.render(`${formatted}${isPrime ? ' (SNT)' : ''}`);
    Sound.success();
  },
  render(resText) {
    const eEl = document.getElementById('casio-expr');
    const rEl = document.getElementById('casio-res');
    if (eEl) eEl.textContent = this.expr || '0';
    if (rEl && resText !== undefined) rEl.textContent = resText;
  }
};

/* Danh sách 5 Trò Chơi tương ứng với từng Hoạt động trong KHBD Tuần 06 (Bài 10 & Luyện tập chung) */
const QUESTS_10 = [
  {
    id: 1,
    tag: 'Hoạt động Khởi động (Tiết 21 - SGK tr. 38)',
    title: 'Trò chơi 1: Cửa Hàng Hoa Hồng Của Mai',
    icon: '🌸',
    color: 'linear-gradient(135deg, #ec4899, #db2777)',
    musicTrack: 'stage1',
    desc: 'Giúp bạn Mai cắm 11 bông hoa hồng và 10 bông hoa hồng vào các lọ bằng nhau để khám phá sự khác biệt giữa Số nguyên tố và Hợp số!'
  },
  {
    id: 2,
    tag: 'Hoạt động 1: Số nguyên tố & Hợp số (Tiết 21 - SGK tr. 38–39)',
    title: 'Trò chơi 2: Sàng Eratosthenes & Mê Cung Rạp Chiếu Phim',
    icon: '🎬',
    color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    musicTrack: 'stage2',
    desc: 'Hoàn thành Luyện tập 1, Luyện tập 2, Sàng số nguyên tố Eratosthenes và tìm đường đi qua các ô số nguyên tố đến rạp chiếu phim (Thử thách nhỏ tr. 39).'
  },
  {
    id: 3,
    tag: 'Hoạt động 2: Phân tích ra TSNT (Tiết 22 - SGK tr. 40–41)',
    title: 'Trò chơi 3: Xưởng Sơ Đồ Cây & Tháp Sơ Đồ Cột',
    icon: '🌳',
    color: 'linear-gradient(135deg, #10b981, #059669)',
    musicTrack: 'stage3',
    desc: 'Sửa lỗi phân tích số 60 của bạn Việt, thực hành phân tích 18, 30, 36 và 105 ra thừa số nguyên tố theo Sơ đồ cây và Sơ đồ cột (Luyện tập 3).'
  },
  {
    id: 4,
    tag: 'Hoạt động Luyện tập & Vận dụng (Tiết 23 - SGK tr. 41–42)',
    title: 'Trò chơi 4: Đội Tiêu Binh Ba Đình & Đấu Trường 2.17–2.24',
    icon: '🏛️',
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    musicTrack: 'stage4',
    desc: 'Chinh phục trọn bộ bài tập 2.17 đến 2.24 (SGK tr. 41–42) và bài toán xếp hàng 33 chiến sĩ Đội tiêu binh danh dự ở Quảng trường Ba Đình!'
  },
  {
    id: 5,
    tag: 'Tiết 24: Luyện Tập Chung (SGK tr. 43 • NLS 4.3TC1b)',
    title: 'Trò chơi 5: Mật Mã Số Nguyên Tố Sinh Đôi (2.25–2.29)',
    icon: '👯',
    color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    musicTrack: 'stage5',
    desc: 'Giải trọn vẹn các Bài tập 2.25 đến 2.29 (SGK tr. 43), khám phá các cặp số nguyên tố sinh đôi nhỏ hơn 40 và kỹ năng bảo vệ thị lực!'
  }
];

const App10 = {
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

    // Đồng bộ tên học sinh từ Bài 11 hoặc Bài 12 nếu đã nhập
    let defaultName = '', defaultClass = '';
    try {
      const p11 = JSON.parse(localStorage.getItem('toan6_bai11_game_state') || 'null');
      const p12 = JSON.parse(localStorage.getItem('toan6_bai12_game_state') || 'null');
      if (p11 && p11.playerName) {
        defaultName = p11.playerName;
        defaultClass = p11.playerClass || '';
      } else if (p12 && p12.playerName) {
        defaultName = p12.playerName;
        defaultClass = p12.playerClass || '';
      }
    } catch (e) {}

    const saved10 = localStorage.getItem('toan6_bai10_game_state');
    if (saved10) {
      try {
        const parsed = JSON.parse(saved10);
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
    localStorage.setItem('toan6_bai10_game_state', JSON.stringify(this.state));
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
    if (!confirm('Em có chắc muốn xóa điểm Bài 10 để chơi lại từ đầu không?')) return;
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
    grid.innerHTML = QUESTS_10.map(q => {
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
            <div style="font-size:0.76rem; color:#f9a8d4; margin-bottom:0.75rem;">
              🎵 Nhạc nền: <em>${trName}</em>
            </div>
          </div>
          <div class="quest-footer">
            <span class="star-display" title="${stars}/3 sao">${starStr}</span>
            <button class="btn ${stars === 3 ? 'btn-success' : 'btn-primary'} btn-sm" onclick="App10.openStage(${q.id})">
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
        ? '🌸 ĐẠI KIỆN TƯỚNG SỐ NGUYÊN TỐ TOÁN 6'
        : total >= 9
          ? '🏅 CHIẾN BINH MẬT MÃ NGUYÊN TỐ'
          : '🌟 NHÀ THÁM HIỂM SỐ NGUYÊN TỐ';
      certBox.innerHTML = `
        <div class="cert-card">
          <div style="font-size:2.4rem;">🏆</div>
          <div style="font-size:0.85rem; color:#f472b6; font-weight:700;">BẢNG VINH DANH BÀI 10: SỐ NGUYÊN TỐ & LUYỆN TẬP CHUNG</div>
          <div class="cert-title">${rank}</div>
          <p style="font-size:1.1rem; margin:0.4rem 0;">
            Học sinh: <strong style="color:#fff;">${this.state.playerName}</strong> • Lớp: <strong style="color:#fbbf24;">${this.state.playerClass}</strong>
          </p>
          <p style="color:var(--text-muted); font-size:0.95rem;">
            Tổng điểm Bài 10: <strong style="color:#fbbf24;">${this.state.score} điểm</strong> | Số sao đạt được: <strong style="color:#38bdf8;">${total}/15 ⭐</strong>
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

    const q = QUESTS_10.find(x => x.id === stageId);
    document.getElementById('stage-header-title').textContent = q ? q.title : `Trò chơi ${stageId}`;
    BGM.playTrack(q ? q.musicTrack : 'map');

    if (stageId === 1) Stage10_1.render();
    if (stageId === 2) Stage10_2.render(0);
    if (stageId === 3) Stage10_3.render(0);
    if (stageId === 4) Stage10_4.render(0);
    if (stageId === 5) Stage10_5.render(0);
  }
};

/* ==========================================================================
   TRÒ CHƠI 1 (HOẠT ĐỘNG KHỞI ĐỘNG - TIẾT 21): CỬA HÀNG HOA HỒNG CỦA MAI (SGK tr. 38)
   Cắm 11 bông hoa hồng vs 10 bông hoa hồng vào các lọ bằng nhau (mỗi lọ > 1 bông).
   ========================================================================== */
const Stage10_1 = {
  vaseCount: 2,

  render() {
    document.getElementById('stage-sub-pills').innerHTML = `
      <span class="sub-pill active">Mở đầu: Cắm 11 bông hoa & 10 bông hoa (SGK tr. 38)</span>
    `;

    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🌸 Bài toán mở đầu: Cắm Hoa Hồng Cùng Mai (SGK Toán 6 trang 38)</h3>
        <p>
          Mẹ mua cho Mai một bó hoa có <strong>11 bông hoa hồng</strong>. Mai muốn cắm đều số hoa đó vào các lọ nhỏ sao cho <strong>mỗi lọ có nhiều hơn 1 bông</strong> và có ít nhất 2 lọ, nhưng Mai thấy không thể cắm đều được!<br/>
          Tuy nhiên, nếu bỏ ra 1 bông để cắm riêng, còn lại <strong>10 bông hoa hồng</strong> thì Mai lại cắm đều được vào các lọ. Em hãy bấm chọn số lọ bên dưới để kiểm nghiệm cùng Mai nhé!
        </p>
      </div>

      <div class="wood-workshop">
        <div style="font-weight:700; color:#fbbf24; margin-bottom:0.65rem;">
          Bước 1: Chọn số lọ hoa muốn chia đều (2 lọ, 3 lọ, 4 lọ hoặc 5 lọ):
        </div>
        <div class="saw-selector" id="s10-vase-selector"></div>
        <div id="s10-vase-visualizer" style="margin-top:0.85rem;"></div>
      </div>

      <div class="step-card">
        <h4>Bước 2: Khám phá số ước của 11 và 10 (HĐ1, HĐ2 - SGK tr. 38)</h4>
        <div class="formula-row">
          <span>• Số <strong>11</strong> chỉ chia hết cho 1 và 11 nên số 11 có tất cả:</span>
          <input type="number" id="s10-div11" class="exp-input" placeholder="?" />
          <span>ước (gọi là <strong>Số nguyên tố</strong>).</span>
        </div>
        <div class="formula-row">
          <span>• Số <strong>10</strong> chia hết cho 1, 2, 5 và 10 nên số 10 có tất cả:</span>
          <input type="number" id="s10-div10" class="exp-input" placeholder="?" />
          <span>ước (nhiều hơn 2 ước ⇒ gọi là <strong>Hợp số</strong>).</span>
        </div>

        <button class="btn btn-primary" style="margin-top:0.75rem;" onclick="Stage10_1.checkAnswer()">
          ✔ Kiểm tra kết luận & Mở khóa Bài 10
        </button>
        <div class="feedback-box" id="s10-fb-1"></div>
      </div>
    `;

    this.updateVaseUI();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai10', 1);
  },

  selectVases(k) {
    Sound.pop();
    this.vaseCount = k;
    this.updateVaseUI();
  },

  updateVaseUI() {
    const counts = [2, 3, 4, 5];
    const selBox = document.getElementById('s10-vase-selector');
    if (selBox) {
      selBox.innerHTML = counts.map(k => `
        <button class="saw-btn ${this.vaseCount === k ? 'selected' : ''}" onclick="Stage10_1.selectVases(${k})">
          🏺 Chia vào ${k} lọ hoa
        </button>
      `).join('');
    }

    const k = this.vaseCount;
    const ok11 = 11 % k === 0;
    const ok10 = 10 % k === 0;

    const vis = document.getElementById('s10-vase-visualizer');
    if (vis) {
      vis.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:0.85rem;">
          <div style="background:rgba(239,68,68,0.14); border:1px solid rgba(239,68,68,0.45); border-radius:14px; padding:0.9rem;">
            <div style="font-weight:800; color:#fda4af; margin-bottom:0.35rem;">🌹 Khi có 11 bông hoa chia vào ${k} lọ:</div>
            <div style="font-size:0.9rem;">
              Mỗi lọ được <strong>${Math.floor(11 / k)} bông</strong> và <strong>bị lẻ thừa ${11 % k} bông</strong>!
              (Vì 11 không chia hết cho ${k}).
            </div>
          </div>

          <div style="background:${ok10 ? 'rgba(16,185,129,0.18)' : 'rgba(245,158,11,0.15)'}; border:1px solid ${ok10 ? '#10b981' : '#f59e0b'}; border-radius:14px; padding:0.9rem;">
            <div style="font-weight:800; color:${ok10 ? '#6ee7b7' : '#fde68a'}; margin-bottom:0.35rem;">🌸 Khi có 10 bông hoa chia vào ${k} lọ:</div>
            <div style="font-size:0.9rem;">
              ${ok10
                ? `✔ <strong>Cắm vừa khít!</strong> Mỗi lọ có đúng <strong>${10 / k} bông hoa</strong>, không thừa bông nào!`
                : `✘ Mỗi lọ được ${Math.floor(10 / k)} bông, còn dư ${10 % k} bông (Hãy thử chọn 2 lọ hoặc 5 lọ nhé!).`
              }
            </div>
          </div>
        </div>
      `;
    }
  },

  checkAnswer() {
    const d11 = parseInt(document.getElementById('s10-div11').value, 10);
    const d10 = parseInt(document.getElementById('s10-div10').value, 10);
    const fb = document.getElementById('s10-fb-1');

    if (d11 === 2 && d10 === 4) {
      Sound.fanfare();
      App10.awardPoints('b10_s1', 100, 1, 3);
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🌟 <strong>Chính xác (+100 điểm & 3 ⭐)!</strong><br/>
        • Số <strong>11</strong> chỉ có <strong>2 ước</strong> là 1 và 11 ⇒ <strong>11 là Số nguyên tố</strong>.<br/>
        • Số <strong>10</strong> có <strong>4 ước</strong> là 1; 2; 5; 10 (nhiều hơn 2 ước) ⇒ <strong>10 là Hợp số</strong>!
        <div style="margin-top:0.85rem;">
          <button class="btn btn-success" onclick="App10.openStage(2)">Qua Trò chơi 2: Sàng Eratosthenes & Mê Cung ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Kiểm tra lại nhé: Ư(11) = {1; 11} nên số 11 có <strong>2</strong> ước. Còn Ư(10) = {1; 2; 5; 10} nên số 10 có <strong>4</strong> ước!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 2 (HOẠT ĐỘNG 1 - TIẾT 21): SỐ NGUYÊN TỐ, HỢP SỐ & MÊ CUNG (SGK tr. 38–39)
   - Chặng 2.1: Luyện tập 1 (2 đến 11), số 0 & số 1, Luyện tập 2 (1930 và 23)
   - Chặng 2.2: Thử thách nhỏ - Mê cung đường đi đến Rạp chiếu phim qua các ô SNT
   ========================================================================== */
const Stage10_2 = {
  subIdx: 0,
  selectedPrimes: new Set(),
  selectedPath: [],

  render(subIdx = 0) {
    this.subIdx = subIdx;
    const titles = [
      '2.1. Luyện tập 1 & 2: Phân loại Số nguyên tố',
      '2.2. Thử thách nhỏ: Đường đến Rạp chiếu phim'
    ];
    document.getElementById('stage-sub-pills').innerHTML = titles.map((t, i) => `
      <span class="sub-pill ${i === subIdx ? 'active' : ''} ${App10.state.awardedKeys['b10_s2_' + i] ? 'done' : ''}"
            onclick="Stage10_2.render(${i})">${t}</span>
    `).join('');

    if (subIdx === 0) this.renderSub0();
    if (subIdx === 1) this.renderSub1();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai10', 2);
  },

  renderSub0() {
    this.selectedPrimes = new Set();
    const nums = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🛡️ Chặng 2.1: Định nghĩa Số nguyên tố, Hợp số & Luyện tập 1, 2 (SGK tr. 38–39)</h3>
        <p>
          • <strong>Số nguyên tố</strong> là số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó.<br/>
          • <strong>Hợp số</strong> là số tự nhiên lớn hơn 1, có nhiều hơn hai ước.<br/>
          • <strong>Chú ý:</strong> Số <strong>0</strong> và số <strong>1</strong> không là số nguyên tố và không là hợp số!
        </p>
      </div>

      <div class="step-card">
        <h4>Nhiệm vụ 1 — Luyện tập 1 (SGK tr. 39): Trong các số từ 2 đến 11 dưới đây, hãy bấm chọn TẤT CẢ các SỐ NGUYÊN TỐ:</h4>
        <div class="chip-grid">
          ${nums.map(n => `
            <div class="num-chip" id="pchip-${n}" onclick="Stage10_2.togglePrimeChip(${n})">${n}</div>
          `).join('')}
        </div>

        <h4 style="margin-top:1.1rem;">Nhiệm vụ 2 — Câu hỏi Chú ý & Luyện tập 2 (SGK tr. 39):</h4>
        <div class="formula-row">
          <span>a) Số nguyên tố <strong>chẵn duy nhất</strong> (và nhỏ nhất) là số:</span>
          <input type="number" id="s10-even-prime" class="exp-input" placeholder="?" />
        </div>
        <div class="formula-row">
          <span>b) Số <strong>1 930</strong> tận cùng là 0 nên chia hết cho 2 và 5 (ngoài 1 và 1 930). Vậy 1 930 là:</span>
          <select id="s10-1930" class="exp-input" style="width:160px;">
            <option value="">-- Chọn --</option>
            <option value="hopso">Hợp số</option>
            <option value="snt">Số nguyên tố</option>
          </select>
        </div>
        <div class="formula-row">
          <span>c) Số <strong>23</strong> chỉ có hai ước là 1 và 23. Vậy 23 là:</span>
          <select id="s10-23" class="exp-input" style="width:160px;">
            <option value="">-- Chọn --</option>
            <option value="snt">Số nguyên tố</option>
            <option value="hopso">Hợp số</option>
          </select>
        </div>

        <button class="btn btn-primary" style="margin-top:0.8rem;" onclick="Stage10_2.checkSub0()">✔ Kiểm tra Chặng 2.1</button>
        <div class="feedback-box" id="s10-fb-20"></div>
      </div>
    `;
  },

  togglePrimeChip(n) {
    Sound.pop();
    if (this.selectedPrimes.has(n)) this.selectedPrimes.delete(n);
    else this.selectedPrimes.add(n);
    const el = document.getElementById(`pchip-${n}`);
    if (el) el.classList.toggle('common-active', this.selectedPrimes.has(n));
  },

  checkSub0() {
    const arr = Array.from(this.selectedPrimes).sort((a, b) => a - b);
    const expected = [2, 3, 5, 7, 11];
    const evenP = parseInt(document.getElementById('s10-even-prime').value, 10);
    const v1930 = document.getElementById('s10-1930').value;
    const v23 = document.getElementById('s10-23').value;
    const fb = document.getElementById('s10-fb-20');

    const chipsOk = arr.length === expected.length && arr.every((v, i) => v === expected[i]);
    if (chipsOk && evenP === 2 && v1930 === 'hopso' && v23 === 'snt') {
      Sound.success();
      App10.awardPoints('b10_s2_0', 60, 2, Math.max(2, App10.state.stageStars[2]));
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🎉 <strong>Xuất sắc (+60 điểm)!</strong><br/>
        • Các số nguyên tố từ 2 đến 11 là: <strong>2; 3; 5; 7; 11</strong> (các số còn lại 4; 6; 8; 9; 10 là hợp số).<br/>
        • Số <strong>2</strong> là số nguyên tố chẵn duy nhất. Số <strong>1 930</strong> là hợp số và số <strong>23</strong> là số nguyên tố!
        <div style="margin-top:0.75rem;">
          <button class="btn btn-success btn-sm" onclick="Stage10_2.render(1)">Sang Chặng 2.2: Mê Cung Rạp Chiếu Phim ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Gợi ý: Hãy chọn đúng 5 số nguyên tố là <strong>2, 3, 5, 7, 11</strong>; số nguyên tố chẵn duy nhất là <strong>2</strong>; 1 930 là <strong>Hợp số</strong> và 23 là <strong>Số nguyên tố</strong>!`;
    }
  },

  renderSub1() {
    const mazeCells = [
      { n: 7, isP: true }, { n: 19, isP: true }, { n: 13, isP: true }, { n: 15, isP: false }, { n: 21, isP: false },
      { n: 14, isP: false }, { n: 9, isP: false }, { n: 11, isP: true }, { n: 23, isP: true }, { n: 27, isP: false },
      { n: 25, isP: false }, { n: 33, isP: false }, { n: 35, isP: false }, { n: 29, isP: true }, { n: 31, isP: true },
      { n: 39, isP: false }, { n: 49, isP: false }, { n: 2, isP: true }, { n: 17, isP: true }, { n: 41, isP: true }
    ];
    this.selectedPath = [7];

    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🎬 Chặng 2.2: Thử thách nhỏ — Đường đi đến Rạp Chiếu Phim (SGK tr. 39)</h3>
        <p>
          Từ ô xuất phát mang số <strong>7</strong>, em hãy bấm chọn tất cả các ô là <strong>SỐ NGUYÊN TỐ</strong> trên bản đồ để mở con đường dẫn thẳng tới <strong>Rạp Chiếu Phim (ô số 2)</strong> nhé!
        </p>
      </div>

      <div class="step-card">
        <h4>🗺️ Bấm chọn tất cả 10 ô mang Số Nguyên Tố trong bảng mê cung dưới đây (Ô số 7 đã được chọn sẵn):</h4>
        <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:0.55rem; max-width:440px; margin:0.9rem auto;">
          ${mazeCells.map(c => `
            <div class="num-chip ${c.n === 7 ? 'common-active' : ''}"
                 id="maze-cell-${c.n}"
                 style="width:100%; height:54px;"
                 onclick="Stage10_2.toggleMazeCell(${c.n})">
              ${c.n === 7 ? '🚩 7' : c.n === 2 ? '🎬 2' : c.n}
            </div>
          `).join('')}
        </div>

        <button class="btn btn-primary" onclick="Stage10_2.checkSub1()">✔ Kiểm tra Đường đến Rạp Chiếu Phim</button>
        <div class="feedback-box" id="s10-fb-21"></div>
      </div>
    `;
  },

  toggleMazeCell(n) {
    if (n === 7) return;
    Sound.pop();
    const idx = this.selectedPath.indexOf(n);
    if (idx >= 0) this.selectedPath.splice(idx, 1);
    else this.selectedPath.push(n);
    const el = document.getElementById(`maze-cell-${n}`);
    if (el) el.classList.toggle('common-active', this.selectedPath.includes(n));
  },

  checkSub1() {
    const expectedPrimes = [2, 7, 11, 13, 17, 19, 23, 29, 31, 41];
    const sorted = this.selectedPath.slice().sort((a, b) => a - b);
    const fb = document.getElementById('s10-fb-21');

    const isOk = sorted.length === expectedPrimes.length && sorted.every((v, i) => v === expectedPrimes[i]);
    if (isOk) {
      Sound.fanfare();
      App10.awardPoints('b10_s2_1', 60, 2, 3);
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🎬 <strong>Chúc mừng em đã tìm ra đường đến Rạp Chiếu Phim (+60 điểm & Đạt 3 ⭐ Ải 2)!</strong><br/>
        • Lộ trình qua các ô số nguyên tố là: <strong>7 → 19 → 13 → 11 → 23 → 29 → 31 → 41 → 17 → 2</strong>!
        <div style="margin-top:0.85rem;">
          <button class="btn btn-success" onclick="App10.openStage(3)">Qua Trò chơi 3: Xưởng Sơ Đồ Cây & Sơ Đồ Cột ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Kiểm tra lại nhé! Đừng chọn các hợp số (như 9, 14, 15, 21, 25, 27, 33, 35, 39, 49). Hãy chọn đúng 10 ô số nguyên tố: <strong>7, 19, 13, 11, 23, 29, 31, 41, 17, 2</strong>!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 3 (HOẠT ĐỘNG 2 - TIẾT 22): PHÂN TÍCH MỘT SỐ RA THỪA SỐ NGUYÊN TỐ (SGK tr. 40–41)
   - Chặng 3.1: Sửa lỗi của bạn Việt (60 = 2²·3·5) & Sơ đồ cây (18 = 2·3²)
   - Chặng 3.2: Sơ đồ cột (30 = 2·3·5) & Luyện tập 3 (36 = 2²·3² và 105 = 3·5·7)
   ========================================================================== */
const Stage10_3 = {
  render(subIdx = 0) {
    const titles = [
      '3.1. Phương pháp Sơ đồ cây (SGK tr. 40)',
      '3.2. Phương pháp Sơ đồ cột & Luyện tập 3 (SGK tr. 41)'
    ];
    document.getElementById('stage-sub-pills').innerHTML = titles.map((t, i) => `
      <span class="sub-pill ${i === subIdx ? 'active' : ''} ${App10.state.awardedKeys['b10_s3_' + i] ? 'done' : ''}"
            onclick="Stage10_3.render(${i})">${t}</span>
    `).join('');

    if (subIdx === 0) this.renderSub0();
    if (subIdx === 1) this.renderSub1();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai10', 3);
  },

  renderSub0() {
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🌳 Chặng 3.1: Phân tích một số ra thừa số nguyên tố theo Sơ đồ cây (SGK tr. 40)</h3>
        <p>
          • <strong>Định nghĩa:</strong> Phân tích một số tự nhiên lớn hơn 1 ra thừa số nguyên tố là viết số đó dưới dạng một tích các thừa số nguyên tố.<br/>
          • <strong>Câu hỏi ? (SGK tr. 40):</strong> Bạn Việt phân tích <code>60 = 3 · 4 · 5</code>. Kết quả của Việt chưa đúng vì số <strong>4 là hợp số</strong>!
        </p>
      </div>

      <div class="step-card">
        <h4>Nhiệm vụ 1: Sửa lại kết quả phân tích số 60 của bạn Việt cho đúng (thay 4 = 2²):</h4>
        <div class="formula-row">
          <span>60 = 2<sup><input type="number" id="s10-60-e2" class="exp-input" style="width:52px;" placeholder="?" /></sup> · 3 · 5</span>
        </div>

        <h4 style="margin-top:1.1rem;">Nhiệm vụ 2: Hoàn thành Sơ đồ cây phân tích số <strong>18</strong> (Hình 2.3 - SGK tr. 40):</h4>
        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:0.5rem;">
          Tách <code>18 = 3 · 6</code>, sau đó tách tiếp hợp số <code>6 = 2 · 3</code>. Viết gọn bằng lũy thừa:
        </p>
        <div class="formula-row">
          <span>18 = 2 · 3<sup><input type="number" id="s10-18-e3" class="exp-input" style="width:52px;" placeholder="?" /></sup></span>
        </div>

        <button class="btn btn-primary" style="margin-top:0.8rem;" onclick="Stage10_3.checkSub0()">✔ Kiểm tra Sơ đồ cây</button>
        <div class="feedback-box" id="s10-fb-30"></div>
      </div>
    `;
  },

  checkSub0() {
    const e2 = parseInt(document.getElementById('s10-60-e2').value, 10);
    const e3 = parseInt(document.getElementById('s10-18-e3').value, 10);
    const fb = document.getElementById('s10-fb-30');

    if (e2 === 2 && e3 === 2) {
      Sound.success();
      App10.awardPoints('b10_s3_0', 60, 3, Math.max(2, App10.state.stageStars[3]));
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🌳 <strong>Chính xác (+60 điểm)!</strong><br/>
        • Sửa lại cho bạn Việt: <code>60 = 2² · 3 · 5</code>.<br/>
        • Phân tích số 18 theo sơ đồ cây: <code>18 = 2 · 3²</code>!
        <div style="margin-top:0.75rem;">
          <button class="btn btn-success btn-sm" onclick="Stage10_3.render(1)">Sang Chặng 3.2: Sơ đồ cột & Luyện tập 3 ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Gợi ý: Vì 4 = 2² nên 60 = 2² · 3 · 5 (điền số mũ <strong>2</strong>). Còn 18 = 2 · 3 · 3 = 2 · 3² (điền số mũ <strong>2</strong>)!`;
    }
  },

  renderSub1() {
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🏛️ Chặng 3.2: Phân tích theo Sơ đồ cột & Luyện tập 3 (SGK tr. 41)</h3>
        <p>
          Khi phân tích theo cột dọc, ta chia số đó lần lượt cho các ước nguyên tố từ nhỏ đến lớn (2, 3, 5, 7...) cho đến khi thương bằng 1. Em có thể mở <strong>🧮 Máy tính FACT</strong> để kiểm tra!
        </p>
      </div>

      <div class="step-card">
        <h4>1. Câu hỏi ? (SGK tr. 41): Phân tích số <strong>30</strong> theo sơ đồ cột (30 : 2 = 15; 15 : 3 = 5; 5 : 5 = 1):</h4>
        <div class="formula-row">
          <span>30 = 2 · 3 · </span>
          <input type="number" id="s10-col-30" class="exp-input" placeholder="?" />
        </div>

        <h4 style="margin-top:1.1rem;">2. Luyện tập 3a (SGK tr. 41): Phân tích số <strong>36</strong> ra thừa số nguyên tố:</h4>
        <div class="formula-row">
          <span>36 = 2<sup><input type="number" id="s10-36-a" class="exp-input" style="width:52px;" placeholder="?" /></sup> · 3<sup><input type="number" id="s10-36-b" class="exp-input" style="width:52px;" placeholder="?" /></sup></span>
        </div>

        <h4 style="margin-top:1.1rem;">3. Luyện tập 3b (SGK tr. 41): Phân tích số <strong>105</strong> ra thừa số nguyên tố (105 = 3 · 35):</h4>
        <div class="formula-row">
          <span>105 = 3 · 5 · </span>
          <input type="number" id="s10-105" class="exp-input" placeholder="?" />
        </div>

        <div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin-top:0.85rem;">
          <button class="btn btn-primary" onclick="Stage10_3.checkSub1()">✔ Hoàn thành Trò chơi 3</button>
          <button class="btn btn-accent btn-sm" onclick="App10.toggleModal('casio-modal')">🧮 Mở máy tính Casio FACT</button>
        </div>
        <div class="feedback-box" id="s10-fb-31"></div>
      </div>
    `;
  },

  checkSub1() {
    const c30 = parseInt(document.getElementById('s10-col-30').value, 10);
    const a36 = parseInt(document.getElementById('s10-36-a').value, 10);
    const b36 = parseInt(document.getElementById('s10-36-b').value, 10);
    const c105 = parseInt(document.getElementById('s10-105').value, 10);
    const fb = document.getElementById('s10-fb-31');

    if (c30 === 5 && a36 === 2 && b36 === 2 && c105 === 7) {
      Sound.fanfare();
      App10.awardPoints('b10_s3_1', 60, 3, 3);
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🌟 <strong>Hoàn hảo (+60 điểm & Đạt 3 ⭐ Trò chơi 3)!</strong><br/>
        • <code>30 = 2 · 3 · 5</code><br/>
        • Luyện tập 3: a) <code>36 = 2² · 3²</code>; &nbsp; b) <code>105 = 3 · 5 · 7</code>.<br/>
        • <em>Nhận xét:</em> Dù phân tích bằng sơ đồ cây hay sơ đồ cột cũng đều ra cùng một kết quả!
        <div style="margin-top:0.85rem;">
          <button class="btn btn-success" onclick="App10.openStage(4)">Qua Trò chơi 4: Đội Tiêu Binh Ba Đình (2.17 – 2.24) ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Gợi ý: 30 = 2 · 3 · <strong>5</strong>; 36 = 2<strong>²</strong> · 3<strong>²</strong>; và 105 = 3 · 5 · <strong>7</strong>!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 4 (TIẾT 23 - LUYỆN TẬP BÀI 10): ĐẤU TRƯỜNG 2.17 ĐẾN 2.24 (SGK tr. 41–42)
   Gồm 6 thử thách tương ứng toàn bộ các bài tập 2.17 -> 2.24.
   ========================================================================== */
const Stage10_4 = {
  qIdx: 0,
  questions: [
    {
      code: 'Bài 2.17 (SGK tr. 41)',
      prompt: 'Phân tích các số 70 và 115 ra thừa số nguyên tố:',
      options: [
        '70 = 2 · 5 · 7  và  115 = 5 · 23',
        '70 = 7 · 10  và  115 = 5 · 23',
        '70 = 2² · 5 · 7  và  115 = 3 · 23',
        '70 = 2 · 35  và  115 = 5 · 21'
      ],
      correct: 0,
      explain: '70 = 2 · 5 · 7 (2, 5, 7 đều là số nguyên tố) và 115 = 5 · 23 (5 và 23 đều là số nguyên tố).'
    },
    {
      code: 'Bài 2.18 (SGK tr. 41)',
      prompt: 'Bạn Nam viết: 120 = 2 · 3 · 4 · 5 và 102 = 2 · 51. Vì sao bạn Nam viết chưa đúng và sửa lại thế nào?',
      options: [
        'Vì 4 và 51 là hợp số (51 = 3·17). Sửa lại: 120 = 2³ · 3 · 5 và 102 = 2 · 3 · 17',
        'Vì bạn Nam nhân sai kết quả. Sửa lại: 120 = 2² · 3 · 5 và 102 = 2 · 53',
        'Bạn Nam đã viết hoàn toàn đúng vì 51 là số nguyên tố',
        'Chỉ có 120 sai, còn 102 = 2 · 51 là đúng'
      ],
      correct: 0,
      explain: 'Số 4 = 2² là hợp số và 51 chia hết cho 3 (51 = 3 · 17) nên cũng là hợp số. Kết quả đúng: 120 = 2³ · 3 · 5 và 102 = 2 · 3 · 17.'
    },
    {
      code: 'Bài 2.19 & 2.20 (SGK tr. 41–42)',
      prompt: 'Trong các số 89; 97; 125; 541; 2 013; 2 018, nhóm nào chỉ gồm các SỐ NGUYÊN TỐ?',
      options: [
        '125; 2 013; 2 018',
        '89; 97; 541',
        '89; 97; 2 013',
        '97; 125; 541'
      ],
      correct: 1,
      explain: '125 ⋮ 5, 2 013 ⋮ 3 (tổng chữ số = 6), 2 018 ⋮ 2 nên là hợp số. Ba số nguyên tố là 89, 97 và 541!'
    },
    {
      code: 'Bài 2.21 & 2.22 (SGK tr. 42)',
      prompt: 'Phân tích biểu thức A = 4⁴ · 9⁵ và hai số 210, 630 ra thừa số nguyên tố:',
      options: [
        'A = 2⁸ · 3¹⁰;  210 = 2 · 3 · 5 · 7;  630 = 2 · 3² · 5 · 7',
        'A = 2⁶ · 3⁷;   210 = 2 · 3 · 35;     630 = 2 · 9 · 5 · 7',
        'A = 2⁸ · 3¹⁰;  210 = 2² · 3 · 5 · 7; 630 = 2 · 3³ · 5 · 7',
        'A = 4⁴ · 3¹⁰;  210 = 2 · 3 · 5 · 7;  630 = 6 · 3 · 5 · 7'
      ],
      correct: 0,
      explain: 'Ta có A = (2²)⁴ · (3²)⁵ = 2⁸ · 3¹⁰. Và 210 = 2 · 3 · 5 · 7; 630 = 3 · 210 = 2 · 3² · 5 · 7.'
    },
    {
      code: 'Bài 2.23 (SGK tr. 42)',
      prompt: 'Một lớp có 30 học sinh. Cô giáo muốn chia lớp thành các nhóm (mỗi nhóm có nhiều hơn 1 người) để thực hiện dự án học tập. Số người trong một nhóm có thể là:',
      options: [
        '2; 3; 5; 6; 10; 15 hoặc 30 người',
        'Chỉ có thể là 2; 3 hoặc 5 người',
        '1; 2; 4; 6; 10 hoặc 15 người',
        '3; 6; 9; 12; 15 hoặc 30 người'
      ],
      correct: 0,
      explain: 'Số người mỗi nhóm phải là ước của 30 và lớn hơn 1. Vì 30 = 2 · 3 · 5 nên các ước lớn hơn 1 của 30 là: 2; 3; 5; 6; 10; 15; 30.'
    },
    {
      code: 'Bài 2.24 (SGK tr. 42) — Đội tiêu binh Quảng trường Ba Đình',
      prompt: 'Trong nghi lễ thượng cờ ở Quảng trường Ba Đình, đội tiêu binh danh dự có 33 chiến sĩ. Có bao nhiêu cách xếp 33 chiến sĩ thành các hàng đều nhau?',
      options: [
        '2 cách (3 hàng 11 người hoặc 11 hàng 3 người)',
        '4 cách: 1 hàng (33 người); 3 hàng (11 người); 11 hàng (3 người); hoặc 33 hàng (1 người)',
        '3 cách (1 hàng, 3 hàng hoặc 11 hàng)',
        '1 cách duy nhất vì 33 là số lẻ'
      ],
      correct: 1,
      explain: 'Vì 33 = 3 · 11 nên các ước của 33 là 1; 3; 11; 33. Do đó có 4 cách xếp hàng đều nhau tương ứng với 1 hàng, 3 hàng, 11 hàng hoặc 33 hàng!'
    }
  ],

  render(idx = 0) {
    this.qIdx = idx;
    document.getElementById('stage-sub-pills').innerHTML = this.questions.map((q, i) => `
      <span class="sub-pill ${i === idx ? 'active' : ''} ${App10.state.awardedKeys['b10_s4_' + i] ? 'done' : ''}"
            onclick="Stage10_4.render(${i})">${q.code.split('(')[0].trim()}</span>
    `).join('');

    const q = this.questions[idx];
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>🏛️ ${q.code} — Câu ${idx + 1} / ${this.questions.length}</h3>
        <p style="font-size:1.05rem; font-weight:700; color:#fff; margin-top:0.3rem;">${q.prompt}</p>
      </div>

      <div class="options-grid" id="s10-4-opts">
        ${q.options.map((opt, oIdx) => `
          <button class="option-btn" onclick="Stage10_4.answer(${oIdx}, this)">
            <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
          </button>
        `).join('')}
      </div>

      <div class="feedback-box" id="s10-fb-4"></div>
    `;
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai10', 4);
  },

  answer(choice, btnEl) {
    const q = this.questions[this.qIdx];
    const fb = document.getElementById('s10-fb-4');
    document.querySelectorAll('#s10-4-opts .option-btn').forEach(b => b.classList.remove('correct', 'wrong'));

    if (choice === q.correct) {
      btnEl.classList.add('correct');
      const doneCount = this.questions.filter((_, i) => i === this.qIdx || App10.state.awardedKeys['b10_s4_' + i]).length;
      const stars = doneCount >= 6 ? 3 : doneCount >= 3 ? 2 : 1;
      App10.awardPoints('b10_s4_' + this.qIdx, 40, 4, stars);

      const isLast = this.qIdx === this.questions.length - 1;
      if (doneCount >= 6) Sound.fanfare();
      else Sound.success();

      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        ✅ <strong>Chính xác (+40 điểm)!</strong><br/>
        <em>Giải thích:</em> ${q.explain}
        <div style="margin-top:0.8rem;">
          ${!isLast
            ? `<button class="btn btn-primary btn-sm" onclick="Stage10_4.render(${this.qIdx + 1})">Bài tiếp theo (${this.qIdx + 2}/6) ▶</button>`
            : `<button class="btn btn-success" onclick="App10.openStage(5)">Qua Trò chơi 5: Luyện Tập Chung & Số Nguyên Tố Sinh Đôi ▶</button>`
          }
        </div>
      `;
    } else {
      Sound.error();
      btnEl.classList.add('wrong');
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Chưa đúng rồi! Em hãy đọc kỹ lại gợi ý của Pi, Vuông, Tròn hoặc mở <strong>🧮 Máy tính FACT</strong> để kiểm tra nhé!`;
    }
  }
};

/* ==========================================================================
   TRÒ CHƠI 5 (TIẾT 24: LUYỆN TẬP CHUNG - SGK tr. 43): MẬT MÃ SỐ NGUYÊN TỐ SINH ĐÔI
   - Chặng 5.1: Bài 2.25, Bài 2.26 (4²·6³ và 9²·15²), Bài 2.27 (dấu hiệu chia hết)
   - Chặng 5.2: Bài 2.28 (chia 40 HS) & Bài 2.29 (5 cặp số nguyên tố sinh đôi < 40) + NLS 4.3TC1b
   ========================================================================== */
const Stage10_5 = {
  selectedTwins: new Set(),

  render(subIdx = 0) {
    const titles = [
      '5.1. Bài 2.25, 2.26 & 2.27 (SGK tr. 43)',
      '5.2. Bài 2.28 & 2.29: Cặp Số Nguyên Tố Sinh Đôi'
    ];
    document.getElementById('stage-sub-pills').innerHTML = titles.map((t, i) => `
      <span class="sub-pill ${i === subIdx ? 'active' : ''} ${App10.state.awardedKeys['b10_s5_' + i] ? 'done' : ''}"
            onclick="Stage10_5.render(${i})">${t}</span>
    `).join('');

    if (subIdx === 0) this.renderSub0();
    if (subIdx === 1) this.renderSub1();
    if (typeof Mascots !== 'undefined') Mascots.injectDialogue('bai10', 5);
  },

  renderSub0() {
    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>⚡ Chặng 5.1: Luyện tập chung (Tiết 24 — Bài 2.25, 2.26, 2.27 SGK tr. 43)</h3>
        <p>
          Ôn tập tổng hợp kiến thức về dấu hiệu chia hết, tính chất chia hết của một tổng và phân tích biểu thức lũy thừa ra thừa số nguyên tố!
        </p>
      </div>

      <div class="step-card">
        <h4>1. Bài 2.25 (SGK tr. 43): Từ các chữ số <code>5; 0; 1; 3</code>, lập được bao nhiêu số tự nhiên có 3 chữ số khác nhau chia hết cho 5? Và bao nhiêu số chia hết cho 3?</h4>
        <div class="formula-row">
          <span>a) Chia hết cho 5 (gồm 510, 150, 310, 130, 350, 530, 105, 305, 315, 135): có tất cả</span>
          <input type="number" id="s10-225a" class="exp-input" placeholder="?" />
          <span>số.</span>
        </div>
        <div class="formula-row">
          <span>b) Chia hết cho 3 (tổng 3 chữ số bằng 6 hoặc 9): có tất cả</span>
          <input type="number" id="s10-225b" class="exp-input" placeholder="?" />
          <span>số.</span>
        </div>

        <h4 style="margin-top:1.1rem;">2. Bài 2.26 (SGK tr. 43): Phân tích A = 4² · 6³ và B = 9² · 15² ra thừa số nguyên tố:</h4>
        <div class="formula-row">
          <span>a) A = 4² · 6³ = 2<sup><input type="number" id="s10-226a" class="exp-input" style="width:52px;" placeholder="?" /></sup> · 3³</span>
          <span style="margin-left:1.5rem;">b) B = 9² · 15² = 3<sup><input type="number" id="s10-226b" class="exp-input" style="width:52px;" placeholder="?" /></sup> · 5²</span>
        </div>

        <h4 style="margin-top:1.1rem;">3. Bài 2.27b (SGK tr. 43): Tìm x ∈ ℕ, x ≤ 22 sao cho <code>(18 + 90 + x) ⋮ 9</code>. Tập hợp các giá trị của x là:</h4>
        <p style="font-size:0.9rem; color:#6ee7b7; font-weight:700;">
          ✔ Vì 18 ⋮ 9 và 90 ⋮ 9 nên x ⋮ 9 (với x ≤ 22) ⇒ <code>x ∈ {0; 9; 18}</code> (và câu a: <code>x ∈ {0; 4; 8; 12; 16; 20}</code>).
        </p>

        <button class="btn btn-primary" style="margin-top:0.8rem;" onclick="Stage10_5.checkSub0()">✔ Kiểm tra Chặng 5.1</button>
        <div class="feedback-box" id="s10-fb-50"></div>
      </div>
    `;
  },

  checkSub0() {
    const c5 = parseInt(document.getElementById('s10-225a').value, 10);
    const c3 = parseInt(document.getElementById('s10-225b').value, 10);
    const ea = parseInt(document.getElementById('s10-226a').value, 10);
    const eb = parseInt(document.getElementById('s10-226b').value, 10);
    const fb = document.getElementById('s10-fb-50');

    if (c5 === 10 && c3 === 10 && ea === 7 && eb === 6) {
      Sound.success();
      App10.awardPoints('b10_s5_0', 60, 5, Math.max(2, App10.state.stageStars[5]));
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🌟 <strong>Chính xác (+60 điểm)!</strong><br/>
        • Bài 2.25: Lập được <strong>10 số</strong> chia hết cho 5 và <strong>10 số</strong> chia hết cho 3.<br/>
        • Bài 2.26: <code>A = (2²)² · (2·3)³ = 2⁴ · 2³ · 3³ = 2⁷ · 3³</code>; &nbsp; <code>B = (3²)² · (3·5)² = 3⁴ · 3² · 5² = 3⁶ · 5²</code>!
        <div style="margin-top:0.75rem;">
          <button class="btn btn-success btn-sm" onclick="Stage10_5.render(1)">Sang Chặng 5.2: Mật Mã Số Nguyên Tố Sinh Đôi ▶</button>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Gợi ý: Bài 2.25 cả câu a và b đều có <strong>10</strong> số. Bài 2.26: A = 2⁴ · 2³ · 3³ = 2<strong>⁷</strong> · 3³ (điền 7); B = 3⁴ · 3² · 5² = 3<strong>⁶</strong> · 5² (điền 6)!`;
    }
  },

  renderSub1() {
    this.selectedTwins = new Set();
    const pairs = [
      { id: '3-5', label: '(3 ; 5)', valid: true },
      { id: '5-7', label: '(5 ; 7)', valid: true },
      { id: '7-9', label: '(7 ; 9)', valid: false },
      { id: '11-13', label: '(11 ; 13)', valid: true },
      { id: '15-17', label: '(15 ; 17)', valid: false },
      { id: '17-19', label: '(17 ; 19)', valid: true },
      { id: '21-23', label: '(21 ; 23)', valid: false },
      { id: '29-31', label: '(29 ; 31)', valid: true }
    ];

    const body = document.getElementById('stage-body');
    body.innerHTML = `
      <div class="story-box">
        <h3>👯 Chặng 5.2: Bài 2.28 & Bài 2.29 — Cặp Số Nguyên Tố Sinh Đôi (SGK tr. 43)</h3>
        <p>
          • <strong>Định nghĩa (Bài 2.29):</strong> Hai số nguyên tố được gọi là <strong>sinh đôi</strong> nếu chúng hơn kém nhau <strong>2 đơn vị</strong>.<br/>
          • <strong>Góc Sức khỏe số (NLS 4.3TC1b):</strong> Khi quan sát màn hình tìm số nguyên tố, em nhớ ngồi thẳng lưng và giữ khoảng cách mắt an toàn 50 cm nhé!
        </p>
      </div>

      <div class="step-card">
        <h4>Nhiệm vụ 1 — Bài 2.28 (SGK tr. 43):</h4>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.5rem;">
          Lớp 6B có <strong>40 học sinh</strong>. Cô giáo muốn chia lớp thành các nhóm để thực hiện các dự án học tập, biết rằng mỗi nhóm có <strong>nhiều hơn 3 người</strong>. Vì Ư(40) = {1; 2; 4; 5; 8; 10; 20; 40}, vậy số người nhỏ nhất có thể trong mỗi nhóm (lớn hơn 3) là bao nhiêu?
        </p>
        <div class="formula-row">
          <span>Số người ít nhất trong 1 nhóm (lớn hơn 3) là:</span>
          <input type="number" id="s10-228" class="exp-input" placeholder="?" />
          <span>người (các phương án có thể: 4; 5; 8; 10; 20 hoặc 40 người).</span>
        </div>

        <h4 style="margin-top:1.1rem;">Nhiệm vụ 2 — Bài 2.29 (SGK tr. 43): Bấm chọn TẤT CẢ 5 cặp số nguyên tố sinh đôi nhỏ hơn 40 dưới đây:</h4>
        <div class="chip-grid">
          ${pairs.map(p => `
            <div class="num-chip" id="twin-${p.id}" style="width:auto; padding:0 0.9rem; border-radius:12px;" onclick="Stage10_5.toggleTwin('${p.id}')">
              👯 ${p.label}
            </div>
          `).join('')}
        </div>

        <button class="btn btn-primary" style="margin-top:0.85rem;" onclick="Stage10_5.checkSub1()">
          👑 Giải mã Số Nguyên Tố Sinh Đôi & Nhận Bằng Vinh Danh
        </button>
        <div class="feedback-box" id="s10-fb-51"></div>
      </div>
    `;
  },

  toggleTwin(id) {
    Sound.pop();
    if (this.selectedTwins.has(id)) this.selectedTwins.delete(id);
    else this.selectedTwins.add(id);
    const el = document.getElementById(`twin-${id}`);
    if (el) el.classList.toggle('common-active', this.selectedTwins.has(id));
  },

  checkSub1() {
    const v228 = parseInt(document.getElementById('s10-228').value, 10);
    const expected = ['11-13', '17-19', '29-31', '3-5', '5-7'];
    const chosen = Array.from(this.selectedTwins).sort();
    const fb = document.getElementById('s10-fb-51');

    const twinsOk = chosen.length === expected.length && chosen.every((v, i) => v === expected[i]);
    if (v228 === 4 && twinsOk) {
      Sound.fanfare();
      App10.awardPoints('b10_s5_1', 80, 5, 3);
      fb.className = 'feedback-box show ok';
      fb.innerHTML = `
        🏆 <strong>CHÚC MỪNG EM ĐÃ HOÀN THÀNH XUẤT SẮC BÀI 10 & TIẾT LUYỆN TẬP CHUNG (+80 điểm & 3 ⭐)!</strong><br/>
        • <strong>Bài 2.28:</strong> Mỗi nhóm có thể có <strong>4; 5; 8; 10; 20 hoặc 40 người</strong>.<br/>
        • <strong>Bài 2.29:</strong> Năm cặp số nguyên tố sinh đôi nhỏ hơn 40 là: <strong>(3; 5), (5; 7), (11; 13), (17; 19) và (29; 31)</strong>!
        <div style="margin-top:0.9rem; display:flex; gap:0.6rem; flex-wrap:wrap;">
          <button class="btn btn-accent" onclick="App10.showMap()">🌸 Về Bản Đồ Xem Bảng Vinh Danh Bài 10</button>
          <a href="index.html" class="btn btn-success" style="text-decoration:none;">👑 Sang Chơi Tiếp Bài 11 (ƯCLN) ▶</a>
        </div>
      `;
    } else {
      Sound.error();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `❌ Kiểm tra lại nhé:<br/>
        • Bài 2.28: Ước của 40 lớn hơn 3 nhỏ nhất là <strong>4</strong>.<br/>
        • Bài 2.29: Lưu ý 9, 15, 21 là hợp số nên không chọn (7; 9), (15; 17), (21; 23). Hãy chọn đúng 5 cặp: <strong>(3; 5), (5; 7), (11; 13), (17; 19), (29; 31)</strong>!`;
    }
  }
};

window.addEventListener('DOMContentLoaded', () => App10.init());
