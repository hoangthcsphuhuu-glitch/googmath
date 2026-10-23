/* ==========================================================================
   HỆ THỐNG ĐỌC CÂU DẪN TIẾNG VIỆT (VOICE NARRATOR) & NHÂN VẬT ĐỒNG HÀNH
   SGK TOÁN 6: PI (π) • VUÔNG (🟦) • TRÒN (🟠)
   Hỗ trợ: Bài 10 (Số nguyên tố), Bài 11 (ƯC & ƯCLN), Bài 12 (BC & BCNN)
   ========================================================================== */

// Đảm bảo trình duyệt không gửi Referer khi tải luồng âm thanh Google TTS Tiếng Việt (tránh lỗi 404)
(function ensureNoReferrerMeta() {
  try {
    if (typeof document !== 'undefined' && document.head && !document.querySelector('meta[name="referrer"]')) {
      const meta = document.createElement('meta');
      meta.name = 'referrer';
      meta.content = 'no-referrer';
      document.head.appendChild(meta);
    }
  } catch (e) {}
})();

const VoiceNarrator = {
  enabled: localStorage.getItem('googmath_voice_enabled') !== 'false',
  isSpeaking: false,
  currentAudio: null,
  audioQueue: [],
  lastIntroSignature: '',
  lastFeedbackSignature: '',
  observer: null,

  init() {
    this.updateUI();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    this.setupStageObserver();
  },

  toggle() {
    if (this.isSpeaking) {
      this.stop();
      return;
    }
    this.enabled = !this.enabled;
    localStorage.setItem('googmath_voice_enabled', String(this.enabled));
    this.updateUI();
    if (this.enabled) {
      this.speak('Đã bật chế độ đọc câu dẫn Tiếng Việt cho trò chơi!');
    }
  },

  updateUI() {
    const pill = document.getElementById('voice-pill');
    const lbl = document.getElementById('voice-label');
    if (!pill || !lbl) return;

    pill.classList.toggle('muted', !this.enabled && !this.isSpeaking);
    pill.classList.toggle('speaking', this.isSpeaking);

    if (this.isSpeaking) {
      lbl.textContent = '🔊 Đang đọc Tiếng Việt... (Bấm dừng)';
    } else {
      lbl.textContent = this.enabled ? '🗣️ Đọc câu dẫn: Bật' : '🔇 Đọc câu dẫn: Tắt';
    }
  },

  stop() {
    this.audioQueue = [];
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.src = '';
        this.currentAudio = null;
      } catch (e) {}
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    this.isSpeaking = false;
    this.updateUI();
  },

  /* Chuyển đổi ký hiệu Toán học Lớp 6 sang lời đọc Tiếng Việt chuẩn tự nhiên */
  normalizeMathForSpeech(rawText) {
    if (!rawText) return '';
    let s = String(rawText)
      .replace(/<[^>]+>/g, ' ')
      .replace(/[🪚💎🧪⚡🏛️🛒🐸⚙️☄️🔮🌟🎉🌊🎭🛡️🔑🏆✅❌⚠️⚖️🍽️🥤👑🚀📖💚💬🔊💡🔥🟦🟠🧙‍♂️🌸🎬🌳👯]/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, ' và ');

    // Thay thế các ký hiệu tập hợp, Số nguyên tố và ƯCLN / BCNN
    s = s
      .replace(/ƯCLN\s*\(\s*([^)]+)\s*\)/gi, (_, args) => `Ước chung lớn nhất của ${args.replace(/,/g, ' và ')}`)
      .replace(/BCNN\s*\(\s*([^)]+)\s*\)/gi, (_, args) => `Bội chung nhỏ nhất của ${args.replace(/,/g, ' và ')}`)
      .replace(/ƯC\s*\(\s*([^)]+)\s*\)/gi, (_, args) => `tập hợp ước chung của ${args.replace(/,/g, ' và ')}`)
      .replace(/BC\s*\(\s*([^)]+)\s*\)/gi, (_, args) => `tập hợp bội chung của ${args.replace(/,/g, ' và ')}`)
      .replace(/Ư\s*\(\s*(\d+)\s*\)/g, 'tập hợp các ước của $1')
      .replace(/B\s*\(\s*(\d+)\s*\)/g, 'tập hợp các bội của $1')
      .replace(/GCD\s*\(\s*([^)]+)\s*\)/gi, (_, args) => `Ước chung lớn nhất của ${args.replace(/,/g, ' và ')}`)
      .replace(/LCM\s*\(\s*([^)]+)\s*\)/gi, (_, args) => `Bội chung nhỏ nhất của ${args.replace(/,/g, ' và ')}`)
      .replace(/FACT\s*\(\s*([^)]+)\s*\)/gi, 'phân tích thừa số nguyên tố của $1')
      .replace(/\bƯCLN\b/g, 'Ước chung lớn nhất')
      .replace(/\bBCNN\b/g, 'Bội chung nhỏ nhất')
      .replace(/\bƯC\b/g, 'Ước chung')
      .replace(/\bBC\b/g, 'Bội chung')
      .replace(/\bSNT\b/g, 'số nguyên tố')
      .replace(/\bTSNT\b/g, 'thừa số nguyên tố');

    // Lũy thừa & phép toán
    s = s
      .replace(/(\d+)\s*¹⁰⁰/g, '$1 mũ 100')
      .replace(/(\d+)\s*²⁰/g, '$1 mũ 20')
      .replace(/(\d+)\s*¹⁸/g, '$1 mũ 18')
      .replace(/(\d+)\s*¹⁵/g, '$1 mũ 15')
      .replace(/(\d+)\s*¹⁴/g, '$1 mũ 14')
      .replace(/(\d+)\s*¹¹/g, '$1 mũ 11')
      .replace(/(\d+)\s*¹⁰/g, '$1 mũ 10')
      .replace(/(\d+)\s*⁹/g, '$1 mũ 9')
      .replace(/(\d+)\s*⁸/g, '$1 mũ 8')
      .replace(/(\d+)\s*⁷/g, '$1 mũ 7')
      .replace(/(\d+)\s*⁶/g, '$1 mũ 6')
      .replace(/(\d+)\s*⁵/g, '$1 mũ 5')
      .replace(/(\d+)\s*⁴/g, '$1 mũ 4')
      .replace(/(\d+)\s*³/g, '$1 mũ 3')
      .replace(/(\d+)\s*²/g, '$1 mũ 2')
      .replace(/(\d+)\s*¹/g, '$1 mũ 1')
      .replace(/(\d+)\s*⁰/g, '$1 mũ 0')
      .replace(/⋮/g, ' chia hết cho ')
      .replace(/∤/g, ' không chia hết cho ')
      .replace(/∈/g, ' thuộc ')
      .replace(/∉/g, ' không thuộc ')
      .replace(/ℕ\*/g, ' tập hợp N sao ')
      .replace(/ℕ/g, ' tập hợp số tự nhiên N ')
      .replace(/≠/g, ' khác ')
      .replace(/≥/g, ' lớn hơn hoặc bằng ')
      .replace(/≤/g, ' nhỏ hơn hoặc bằng ')
      .replace(/⇒|→|➔/g, ', suy ra ')
      .replace(/·|×/g, ' nhân ')
      .replace(/÷/g, ' chia ')
      .replace(/\b(\d+)\s*\/\s*(\d+)\b/g, '$1 phần $2')
      .replace(/\{([^}]+)\}/g, (_, inner) => `gồm các số ${inner.replace(/;/g, ',')}`)
      .replace(/\bdm\b/g, 'đề-xi-mét')
      .replace(/\bcm\b/g, 'xăng-ti-mét')
      .replace(/\bSGK\b/gi, 'sách giáo khoa')
      .replace(/\btr\.\s*(\d+)/gi, 'trang $1')
      .replace(/\bHĐ\s*(\d+)/g, 'Hoạt động $1')
      .replace(/\bHS\b/g, 'học sinh')
      .replace(/\bEuclid\b/gi, 'Ơ-clít')
      .replace(/\bEratosthenes\b/gi, 'Ê-ra-tô-xten')
      .replace(/π/g, 'Pi')
      .replace(/\s+/g, ' ')
      .trim();

    return s;
  },

  /* Chỉ chọn giọng đọc thực sự là Tiếng Việt (lang bắt đầu bằng 'vi'), tuyệt đối không lấy giọng Tiếng Anh */
  getNativeVietnameseVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    return (
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith('vi') && /hoaimy|google|natural/i.test(v.name)) ||
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith('vi')) ||
      voices.find(v => /vietnamese|tiếng việt|hoaimy|namminh/i.test(v.name)) ||
      null
    );
  },

  splitIntoChunks(text, maxLen = 140) {
    const sentences = text.split(/(?<=[.!?…;:])\s+/);
    const chunks = [];
    let current = '';

    for (const sen of sentences) {
      if ((current + ' ' + sen).trim().length <= maxLen) {
        current = (current + ' ' + sen).trim();
      } else {
        if (current) chunks.push(current);
        if (sen.length <= maxLen) {
          current = sen;
        } else {
          const words = sen.split(' ');
          current = '';
          for (const w of words) {
            if ((current + ' ' + w).trim().length <= maxLen) {
              current = (current + ' ' + w).trim();
            } else {
              if (current) chunks.push(current);
              current = w;
            }
          }
        }
      }
    }
    if (current) chunks.push(current);
    return chunks.filter(Boolean);
  },

  speak(rawText, role = 'narrator') {
    const cleanText = this.normalizeMathForSpeech(rawText);
    if (!cleanText) return;

    this.stop();

    // Hiệu ứng chuông báo bắt đầu đọc dịu nhẹ
    if (typeof Sound !== 'undefined' && Sound.playTone) {
      Sound.playTone(587.33, 0.06, 'sine', 0);
      Sound.playTone(880.0, 0.08, 'sine', 0.05);
    }

    const viVoice = this.getNativeVietnameseVoice();

    // 1. Nếu thiết bị có sẵn giọng Tiếng Việt bản địa (Microsoft HoaiMy / NamMinh / Google Tiếng Việt)
    if (viVoice && 'speechSynthesis' in window) {
      this.speakWithNativeViVoice(cleanText, viVoice, role);
      return;
    }

    // 2. Luôn phát giọng đọc Tiếng Việt chuẩn qua Google Vietnamese TTS (không dùng giọng Tiếng Anh)
    this.speakWithVietnameseCloudTTS(cleanText, role);
  },

  speakWithNativeViVoice(cleanText, viVoice, role) {
    const chunks = this.splitIntoChunks(cleanText, 200);
    if (chunks.length === 0) return;

    this.isSpeaking = true;
    this.updateUI();

    let idx = 0;
    const speakNext = () => {
      if (!this.isSpeaking || idx >= chunks.length) {
        this.isSpeaking = false;
        this.updateUI();
        return;
      }

      const utter = new SpeechSynthesisUtterance(chunks[idx]);
      utter.voice = viVoice;
      utter.lang = 'vi-VN';

      if (role === 'tron') {
        utter.pitch = 1.16;
        utter.rate = 1.04;
      } else if (role === 'vuong') {
        utter.pitch = 1.02;
        utter.rate = 1.0;
      } else if (role === 'pi') {
        utter.pitch = 0.94;
        utter.rate = 0.98;
      } else {
        utter.pitch = 1.04;
        utter.rate = 1.02;
      }

      utter.onend = () => {
        idx++;
        speakNext();
      };
      utter.onerror = () => {
        // Nếu voice nội bộ lỗi, chuyển ngay sang Cloud TTS Tiếng Việt
        this.speakWithVietnameseCloudTTS(chunks.slice(idx).join(' '), role);
      };

      window.speechSynthesis.speak(utter);
    };

    speakNext();
  },

  speakWithVietnameseCloudTTS(cleanText, role) {
    const chunks = this.splitIntoChunks(cleanText, 135);
    if (chunks.length === 0) return;

    this.isSpeaking = true;
    this.updateUI();
    this.audioQueue = chunks.slice();

    const playNextAudio = () => {
      if (!this.isSpeaking || this.audioQueue.length === 0) {
        this.isSpeaking = false;
        this.currentAudio = null;
        this.updateUI();
        return;
      }

      const seg = this.audioQueue.shift();
      const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=vi&client=gtx&q=${encodeURIComponent(seg)}`;
      const audio = new Audio(url);
      audio.playbackRate = role === 'tron' ? 1.08 : role === 'pi' ? 0.98 : 1.04;
      this.currentAudio = audio;

      audio.onended = () => {
        playNextAudio();
      };

      audio.onerror = () => {
        // Thử tiếp đoạn tiếp theo hoặc kết thúc (tuyệt đối không gọi giọng Tiếng Anh)
        if (this.audioQueue.length > 0) {
          playNextAudio();
        } else {
          this.isSpeaking = false;
          this.currentAudio = null;
          this.updateUI();
        }
      };

      audio.play().catch(() => {
        this.isSpeaking = false;
        this.currentAudio = null;
        this.updateUI();
      });
    };

    playNextAudio();
  },

  /* Đọc toàn bộ cuộc hội thoại Tiếng Việt của 3 nhân vật Vuông, Tròn, Pi */
  readDialogue(lessonKey, stageId) {
    const key = `${lessonKey}_${stageId}`;
    const d = Mascots.dialogues[key];
    if (!d) return;
    const fullText = `Bạn Vuông nói: ${d.vuong}. Bạn Tròn tiếp lời: ${d.tron}. Anh Pi kết luận: ${d.pi}`;
    this.speak(fullText, 'narrator');
  },

  /* Tự động gắn nút 🔊 Đọc câu dẫn Tiếng Việt & đọc lời dẫn khi vào ải/chặng mới */
  enhanceStageDOM(autoSpeakIfNew = true) {
    const stageBody = document.getElementById('stage-body');
    if (!stageBody) return;

    // 1. Gắn nút "🔊 Đọc câu dẫn" cho mọi .story-box
    const storyBoxes = stageBody.querySelectorAll('.story-box');
    storyBoxes.forEach((box) => {
      if (box.dataset.voiceEnhanced === '1') return;
      box.dataset.voiceEnhanced = '1';

      const h3 = box.querySelector('h3');
      const fullStoryText = box.innerText || box.textContent || '';

      if (h3) {
        const headerRow = document.createElement('div');
        headerRow.className = 'story-header-row';
        h3.parentNode.insertBefore(headerRow, h3);
        headerRow.appendChild(h3);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tts-btn';
        btn.innerHTML = '🔊 Đọc câu dẫn';
        btn.title = 'Nghe đọc câu dẫn hoạt động này bằng Tiếng Việt';
        btn.onclick = (e) => {
          e.stopPropagation();
          this.speak(fullStoryText, 'narrator');
        };
        headerRow.appendChild(btn);
      }

      // Tự động đọc câu dẫn ngay khi chuyển sang ải / chặng / câu hỏi mới
      const sig = fullStoryText.trim().slice(0, 140);
      if (autoSpeakIfNew && this.enabled && sig && sig !== this.lastIntroSignature) {
        this.lastIntroSignature = sig;
        this.speak(fullStoryText, 'narrator');
      }
    });

    // 2. Gắn nút "🔊 Nghe yêu cầu" cho từng .step-card h4
    const stepHeaders = stageBody.querySelectorAll('.step-card h4');
    stepHeaders.forEach((h4) => {
      if (h4.dataset.voiceEnhanced === '1') return;
      h4.dataset.voiceEnhanced = '1';

      const row = document.createElement('div');
      row.className = 'step-header-row';
      h4.parentNode.insertBefore(row, h4);
      row.appendChild(h4);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tts-btn tts-sm';
      btn.innerHTML = '🔊 Nghe yêu cầu';
      btn.onclick = (e) => {
        e.stopPropagation();
        let textToRead = h4.innerText || h4.textContent || '';
        const nextP = row.nextElementSibling;
        if (nextP && nextP.tagName === 'P') {
          textToRead += '. ' + (nextP.innerText || nextP.textContent || '');
        }
        this.speak(textToRead, 'narrator');
      };
      row.appendChild(btn);
    });

    // 3. Kiểm tra nếu có .feedback-box.show mới xuất hiện
    const shownFeedbacks = stageBody.querySelectorAll('.feedback-box.show');
    shownFeedbacks.forEach((fb) => {
      if (!fb.querySelector('.tts-feedback-btn')) {
        const rawFb = fb.innerText || fb.textContent || '';
        const btnWrap = document.createElement('div');
        btnWrap.style.marginTop = '0.55rem';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tts-btn tts-sm tts-feedback-btn';
        btn.innerHTML = '🔊 Nghe giải thích kết quả';
        btn.onclick = (e) => {
          e.stopPropagation();
          this.speak(rawFb, 'feedback');
        };
        btnWrap.appendChild(btn);
        fb.appendChild(btnWrap);

        const fbSig = rawFb.trim().slice(0, 120);
        if (this.enabled && fbSig && fbSig !== this.lastFeedbackSignature) {
          this.lastFeedbackSignature = fbSig;
          this.speak(rawFb, 'feedback');
        }
      }
    });
  },

  /* Tự động gắn nút nghe giới thiệu trên các thẻ Bản đồ chặng (#quest-grid) */
  enhanceMapDOM() {
    const questGrid = document.getElementById('quest-grid');
    if (!questGrid) return;
    questGrid.querySelectorAll('.quest-card').forEach((card) => {
      if (card.dataset.voiceEnhanced === '1') return;
      card.dataset.voiceEnhanced = '1';
      const title = card.querySelector('.quest-title')?.innerText || '';
      const desc = card.querySelector('.quest-desc')?.innerText || '';
      const top = card.querySelector('.quest-top');
      if (top && (title || desc)) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tts-btn tts-sm';
        btn.innerHTML = '🔊 Nghe';
        btn.title = 'Nghe giới thiệu màn chơi này bằng Tiếng Việt';
        btn.onclick = (e) => {
          e.stopPropagation();
          this.speak(`${title}. ${desc}`, 'narrator');
        };
        top.appendChild(btn);
      }
    });
  },

  setupStageObserver() {
    const stageBody = document.getElementById('stage-body');
    const questGrid = document.getElementById('quest-grid');

    if (stageBody) {
      const obs = new MutationObserver(() => {
        this.enhanceStageDOM(true);
      });
      obs.observe(stageBody, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    if (questGrid) {
      const mapObs = new MutationObserver(() => {
        this.enhanceMapDOM();
      });
      mapObs.observe(questGrid, { childList: true });
      this.enhanceMapDOM();
    }
  }
};

const Mascots = {
  selectedId: localStorage.getItem('toan6_mascot_id') || 'pi',

  info: {
    pi: {
      id: 'pi',
      name: 'Anh Pi Thông Thái',
      shortName: 'Pi (π)',
      role: 'Chuyên gia giải thích định nghĩa & mẹo toán học',
      color: '#a855f7',
      svg: `
        <svg viewBox="0 0 100 100" class="char-avatar-svg">
          <defs>
            <linearGradient id="piGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#a855f7"/>
              <stop offset="100%" stop-color="#6366f1"/>
            </linearGradient>
          </defs>
          <circle cx="50" cy="54" r="38" fill="url(#piGrad)" stroke="#fbbf24" stroke-width="3"/>
          <polygon points="50,8 16,22 50,34 84,22" fill="#1e1b4b" stroke="#fbbf24" stroke-width="2"/>
          <line x1="76" y1="25" x2="82" y2="38" stroke="#fbbf24" stroke-width="2.5"/>
          <circle cx="82" cy="40" r="3.5" fill="#fbbf24"/>
          <text x="50" y="54" text-anchor="middle" fill="#fde68a" font-size="26" font-weight="900" font-family="Georgia, serif">π</text>
          <circle cx="38" cy="64" r="6" fill="#fff" stroke="#1e1b4b" stroke-width="2"/>
          <circle cx="62" cy="64" r="6" fill="#fff" stroke="#1e1b4b" stroke-width="2"/>
          <line x1="44" y1="64" x2="56" y2="64" stroke="#1e1b4b" stroke-width="2"/>
          <circle cx="38" cy="64" r="2.5" fill="#1e1b4b"/>
          <circle cx="62" cy="64" r="2.5" fill="#1e1b4b"/>
          <path d="M 40 76 Q 50 84 60 76" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `
    },
    vuong: {
      id: 'vuong',
      name: 'Bạn Vuông Logic',
      shortName: 'Vuông 🟦',
      role: 'Cẩn thận, suy luận từng bước chuẩn xác',
      color: '#3b82f6',
      svg: `
        <svg viewBox="0 0 100 100" class="char-avatar-svg">
          <defs>
            <linearGradient id="vuongGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="100%" stop-color="#2563eb"/>
            </linearGradient>
          </defs>
          <rect x="16" y="18" width="68" height="68" rx="14" fill="url(#vuongGrad)" stroke="#93c5fd" stroke-width="3"/>
          <rect x="26" y="38" width="18" height="14" rx="4" fill="#fff" stroke="#0f172a" stroke-width="2.2"/>
          <rect x="56" y="38" width="18" height="14" rx="4" fill="#fff" stroke="#0f172a" stroke-width="2.2"/>
          <line x1="44" y1="45" x2="56" y2="45" stroke="#0f172a" stroke-width="2.2"/>
          <circle cx="35" cy="45" r="3" fill="#0f172a"/>
          <circle cx="65" cy="45" r="3" fill="#0f172a"/>
          <circle cx="26" cy="60" r="4" fill="#f472b6" opacity="0.7"/>
          <circle cx="74" cy="60" r="4" fill="#f472b6" opacity="0.7"/>
          <path d="M 38 66 Q 50 76 62 66" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>
        </svg>
      `
    },
    tron: {
      id: 'tron',
      name: 'Bạn Tròn Năng Động',
      shortName: 'Tròn 🟠',
      role: 'Nhanh trí, sáng tạo, thích mẹo tính nhẩm',
      color: '#f97316',
      svg: `
        <svg viewBox="0 0 100 100" class="char-avatar-svg">
          <defs>
            <linearGradient id="tronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fb923c"/>
              <stop offset="100%" stop-color="#ea580c"/>
            </linearGradient>
          </defs>
          <circle cx="50" cy="54" r="36" fill="url(#tronGrad)" stroke="#fed7aa" stroke-width="3"/>
          <polygon points="50,18 34,10 38,24" fill="#f43f5e"/>
          <polygon points="50,18 66,10 62,24" fill="#f43f5e"/>
          <circle cx="50" cy="18" r="4.5" fill="#fde047"/>
          <circle cx="36" cy="48" r="6.5" fill="#0f172a"/>
          <circle cx="64" cy="48" r="6.5" fill="#0f172a"/>
          <circle cx="34" cy="46" r="2.2" fill="#fff"/>
          <circle cx="62" cy="46" r="2.2" fill="#fff"/>
          <circle cx="25" cy="58" r="4.5" fill="#fda4af" opacity="0.8"/>
          <circle cx="75" cy="58" r="4.5" fill="#fda4af" opacity="0.8"/>
          <path d="M 37 64 Q 50 77 63 64" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>
        </svg>
      `
    }
  },

  /* Kịch bản hội thoại của Pi, Vuông, Tròn cho trọn bộ Bài 1 đến Bài 12 */
  dialogues: {
    bai1_1: {
      tron: 'Trong lọ hoa có các bông hồng, trong bình cá có 3 chú cá vàng, còn Hình 1.3 có vòng tròn chứa các số 4, 1, 9, 8! Tất cả đều gọi là Tập hợp hả anh Pi?',
      pi: 'Đúng rồi Tròn ơi! Một tập hợp bao gồm những đối tượng nhất định, và mỗi đối tượng đó được gọi là một phần tử của tập hợp!',
      vuong: 'Vậy với tập hợp M = {4; 1; 9; 8} ở Hình 1.3, các số 4, 1, 9, 8 là phần tử của M, còn số 7 nằm ngoài vòng tròn nên không phải là phần tử của M!',
      hint: 'Mẹo của Anh Pi: Tập hợp M gồm 4 phần tử là {1; 4; 8; 9}. Số 7 không thuộc tập hợp M!'
    },
    bai1_2: {
      vuong: 'Khi muốn viết ngắn gọn x là phần tử của tập hợp A hoặc y không là phần tử của tập hợp A, mình dùng kí hiệu gì vậy anh Pi?',
      pi: 'Ta viết x ∈ A (đọc là x thuộc A) và y ∉ A (đọc là y không thuộc A)! Rất ngắn gọn và chuẩn xác!',
      tron: 'Còn tập hợp các số tự nhiên kí hiệu là ℕ = {0; 1; 2; 3; ...}, tập hợp các số tự nhiên khác 0 kí hiệu là ℕ* = {1; 2; 3; ...}!',
      hint: 'Mẹo của Bạn Tròn: Điểm khác nhau duy nhất giữa ℕ và ℕ* là số 0: 0 ∈ ℕ nhưng 0 ∉ ℕ*!'
    },
    bai1_3: {
      tron: 'Khi liệt kê các chữ cái trong từ NHA TRANG, bạn Nam viết L = {N; H; A; T; R; A; N; G}. Sao cô giáo lại bảo bạn Nam viết chưa đúng nhỉ?',
      vuong: 'Vì quy tắc liệt kê các phần tử của tập hợp là: Mỗi phần tử chỉ được viết MỘT LẦN thôi! Chữ N và chữ A xuất hiện nhiều lần nhưng chỉ được viết 1 lần!',
      pi: 'Chuẩn xác! Vậy tập hợp đúng phải là L = {N; H; A; T; R; G}. Ngoài cách liệt kê, ta còn có Cách 2 là nêu dấu hiệu đặc trưng cho các phần tử!',
      hint: 'Mẹo của Bạn Vuông: Luyện tập 2: A = {0; 1; 2; 3; 4}, B = {1; 2; 3; 4}. Luyện tập 3: M = {7; 8; 9} hoặc M = {x ∈ ℕ | 6 < x < 10}!'
    },
    bai1_4: {
      vuong: 'Ở Bài 1.3b trang 7, tập hợp D gồm các tháng (dương lịch) có 30 ngày trong một năm. Mình dùng quy tắc nắm bàn tay để đếm nhé!',
      tron: 'Tháng Tư, Tháng Sáu, Tháng Chín và Tháng Mười một! Đúng 4 tháng có 30 ngày luôn!',
      pi: 'Còn ở Bài 1.3c, các chữ cái trong cụm từ ĐIỆN BIÊN PHỦ (nhớ không lặp lại chữ Đ, I, Ê, N, B, P, H, U) tạo thành tập hợp M gồm 8 phần tử!',
      hint: 'Mẹo của Anh Pi: Bài 1.2: Trong các số 3, 5, 6, 0, 7 thì các số chia hết cho 3 thuộc U là: 3, 6 và 0!'
    },
    bai1_5: {
      tron: 'Ở Bài 1.5 trang 8, tập hợp S gồm 8 hành tinh của Hệ Mặt Trời! Mình thích khám phá vũ trụ lắm!',
      vuong: 'Theo thứ tự từ gần Mặt Trời ra xa là: Thuỷ tinh, Kim tinh, Trái Đất, Hoả tinh, Mộc tinh, Thổ tinh, Thiên Vương tinh và Hải Vương tinh!',
      pi: 'Còn Bài 1.4: Tập hợp A = {0; 1; 2; 3; 4; 5; 6; 7; 8; 9} viết bằng cách nêu dấu hiệu đặc trưng chính là A = {x ∈ ℕ | x < 10}!',
      hint: 'Mẹo của Bạn Vuông: Hệ Mặt Trời có 8 hành tinh và Trái Đất là hành tinh thứ 3 tính từ Mặt Trời!'
    },

    bai2_1: {
      tron: 'Trong hệ thập phân, chỉ từ 10 chữ số 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 mà mình có thể viết được mọi số tự nhiên lớn đến hàng tỉ luôn!',
      vuong: 'Và cứ 10 đơn vị ở một hàng thì bằng 1 đơn vị ở hàng liền trước nó! Khi viết số có từ 4 chữ số trở lên, mình tách thành từng lớp 3 chữ số từ phải sang trái cho dễ đọc.',
      pi: 'Ở câu hỏi ? trang 9, khi lập các số có 3 chữ số khác nhau từ {0; 1; 2}, các em nhớ chữ số hàng trăm phải khác 0 nhé!',
      hint: 'Mẹo của Anh Pi: Từ ba chữ số 0, 1, 2 ta lập được 4 số tự nhiên có 3 chữ số khác nhau là: 102, 120, 201 và 210!'
    },
    bai2_2: {
      vuong: 'Ở bài Vận dụng trang 10, bác Hoa mua đồ hết 492 nghìn đồng. Bác chỉ mang các tờ tiền 100 nghìn, 10 nghìn và 1 nghìn đồng.',
      tron: 'Ta tách 492 = (4 × 100) + (9 × 10) + 2! Vậy bác Hoa chỉ cần đưa 4 tờ 100 nghìn, 9 tờ 10 nghìn và 2 tờ 1 nghìn đồng là vừa khít!',
      pi: 'Đó chính là ứng dụng tuyệt vời của việc biểu diễn một số tự nhiên thành tổng giá trị các chữ số của nó theo từng hàng!',
      hint: 'Mẹo của Bạn Tròn: Luyện tập tr. 10: 34 604 = (3 × 10 000) + (4 × 1 000) + (6 × 100) + 4!'
    },
    bai2_3: {
      tron: 'Trên mặt đồng hồ cổ có các kí hiệu I, V, X... Đó là chữ số La Mã đúng không anh Pi?',
      pi: 'Đúng rồi! Để viết các số La Mã không quá 30, ta dùng 5 thành phần cơ bản: I (1), V (5), X (10) và hai cụm đặc biệt IV (4), IX (9). Không có số La Mã nào biểu diễn số 0!',
      vuong: 'Ở Thử thách nhỏ trang 11, dùng đúng 7 que tính, mình ghép được các số La Mã không quá 30 là: XVIII (18), XXIII (23), XXIV (24), XXVI (26) và XXIX (29)!',
      hint: 'Mẹo của Bạn Vuông: 14 viết là XIV; 27 viết là XXVII; XVI là 16; XXII là 22!'
    },
    bai2_4: {
      vuong: 'Ở Bài 1.6 trang 12, cùng là chữ số 7 nhưng ở mỗi số khác nhau thì giá trị của chữ số 7 lại khác nhau hoàn toàn!',
      tron: 'Trong 27 501 thì chữ số 7 trị giá 7 000; trong 106 712 thì trị giá 700; trong 7 110 385 thì trị giá 7 000 000; còn trong 2 915 404 267 thì trị giá là 7!',
      pi: 'Đó gọi là nguyên tắc giá trị theo vị trí của hệ thập phân đấy các em!',
      hint: 'Mẹo của Anh Pi: Bài 1.8: XIV = 14, XVI = 16, XXIII = 23. Bài 1.9: 18 = XVIII, 25 = XXV!'
    },
    bai2_5: {
      tron: 'Bài 1.10 trang 12 đố tụi mình viết số tự nhiên có 6 chữ số gồm ba chữ số 0 và ba chữ số 9 nằm xen kẽ nhau!',
      vuong: 'Vì chữ số đầu tiên bên trái (hàng trăm nghìn) phải khác 0 nên bắt buộc phải bắt đầu bằng chữ số 9! Xen kẽ nhau sẽ là: 909 090!',
      pi: 'Còn ở Bài 1.12, mua 9 hộp kẹo lớn (1000 cái/hộp), 9 hộp vừa (100 cái/hộp) và 9 hộp nhỏ (10 cái/hộp) thì tổng số kẹo là 9 × 1000 + 9 × 100 + 9 × 10 = 9 990 cái kẹo!',
      hint: 'Mẹo của Bạn Vuông: Bài 1.11: Dùng {0, 3, 5} viết số có 3 chữ số khác nhau mà chữ số 5 có giá trị 50 (ở hàng chục), hàng trăm khác 0 ⇒ số 350!'
    },

    bai3_1: {
      tron: 'Khi xếp hàng mua vé xem phim, người đến trước đứng trước, người đến sau đứng sau. Nhìn giống hệt các vạch số trên tia số nằm ngang!',
      vuong: 'Trên tia số nằm ngang gốc O, nếu số a nhỏ hơn số b (a < b) thì điểm a sẽ nằm bên trái (nằm trước) điểm b!',
      pi: 'Và các em nhớ nhé: Số 0 là số tự nhiên nhỏ nhất nên số 0 không có số tự nhiên liền trước! Mọi số tự nhiên đều có đúng một số liền sau.',
      hint: 'Mẹo của Anh Pi: Số liền trước của a (với a > 0) là a - 1; số liền sau của a là a + 1!'
    },
    bai3_2: {
      vuong: 'Khi so sánh hai số tự nhiên có nhiều chữ số như m = 12 036 001 và n = 12 035 987 ở Luyện tập trang 14, mình so sánh thế nào cho nhanh nhỉ?',
      pi: 'Vì hai số có cùng 8 chữ số, ta so sánh từng cặp chữ số ở cùng một hàng từ trái sang phải. Hàng nghìn của m là 6 lớn hơn hàng nghìn của n là 5, nên m > n!',
      tron: 'Còn ở bài Vận dụng: Tiền bán hàng buổi tối < buổi chiều, mà buổi chiều < buổi sáng. Nhờ tính chất bắc cầu, mình biết ngay buổi sáng thu nhiều tiền hơn buổi tối!',
      hint: 'Mẹo của Bạn Tròn: Vì n < m nên trên tia số nằm ngang, điểm n nằm trước (bên trái) điểm m!'
    },
    bai3_3: {
      tron: 'Kí hiệu a ≤ b đọc là "a nhỏ hơn hoặc bằng b", nghĩa là lấy cả trường hợp a = b nữa đúng không Vuông?',
      vuong: 'Đúng rồi! Ví dụ trong các số {3; 5; 8; 9}, tập hợp A = {x ∈ ℕ | x ≥ 5} sẽ lấy cả số 5, số 8 và số 9!',
      pi: 'Còn tập hợp B = {x ∈ ℕ | x ≤ 5} sẽ lấy các số 3 và 5. Khi làm Bài 1.15, các em nhớ để ý kỹ dấu < và dấu ≤ nhé!',
      hint: 'Mẹo của Bạn Vuông: Bài 1.15: a) M = {10; 11; 12; 13; 14}; b) K = {1; 2; 3} (vì x ∈ ℕ*); c) L = {0; 1; 2; 3} (vì x ∈ ℕ)!'
    },
    bai3_4: {
      vuong: 'Ở Bài 1.13 trang 14, tìm số liền trước và số liền sau của 3 532 và 3 529, rồi sắp xếp cả 6 số theo thứ tự từ bé đến lớn!',
      tron: 'Của 3 532 là 3 531 và 3 533; của 3 529 là 3 528 và 3 530. Khi xếp từ bé đến lớn, mình được dãy 6 số tự nhiên liên tiếp từ 3 528 đến 3 533 luôn!',
      pi: 'Còn ở Bài 1.14, trên tia số điểm a làm mốc nhỏ nhất, điểm b nằm giữa a và c nên thứ tự đúng là a < b < c!',
      hint: 'Mẹo của Anh Pi: Dãy 6 số từ bé đến lớn ở Bài 1.13 là: 3 528; 3 529; 3 530; 3 531; 3 532; 3 533!'
    },
    bai3_5: {
      tron: 'Ở Bài 1.16 trang 14, chiều cao của An là 150 cm, Bắc là 153 cm, Cường là 148 cm. Ba bạn đánh dấu chiều cao lên cột tường là A, B, C từ dưới lên!',
      vuong: 'Vì 148 < 150 < 153 nên từ thấp đến cao phải là: Cường (điểm A), An (điểm B), Bắc (điểm C). Vậy bạn Cường nói A là An, B là Bắc, C là Cường là sai rồi!',
      pi: 'Và ở phần Năng lực số 4.2TC1a, khi đặt mật khẩu tài khoản học tập, các em tuyệt đối tránh dùng dãy số tự nhiên liên tiếp như 123456 hay 654321 vì rất dễ bị đoán ra nhé!',
      hint: 'Mẹo của Bạn Vuông: Từ dưới lên trên: A là Cường (148 cm), B là An (150 cm), C là Bắc (153 cm)!'
    },

    bai4_1: {
      tron: 'Mai đi chợ mua cà tím hết 18 nghìn đồng, cà chua hết 21 nghìn đồng và rau cải hết 30 nghìn đồng. Mai đưa tờ 100 nghìn đồng thì cô bán hàng trả lại bao nhiêu nhỉ?',
      vuong: 'Đầu tiên mình dùng phép cộng tính tổng tiền mua rau củ: 18 + 21 + 30 = 69 nghìn đồng. Sau đó dùng phép trừ: 100 - 69 = 31 nghìn đồng!',
      pi: 'Bài toán đi chợ của Mai cho thấy phép cộng và phép trừ số tự nhiên gắn bó mật thiết với nhau trong cuộc sống hằng ngày!',
      hint: 'Mẹo của Bạn Tròn: Tổng tiền mua là 69 000 đồng, tiền thừa nhận lại là 100 000 - 69 000 = 31 000 đồng!'
    },
    bai4_2: {
      vuong: 'Khi tính tổng 117 + 68 + 23 ở Luyện tập 1 trang 16, nếu mình cộng từ trái sang phải thì hơi lẻ. Có cách nào tính nhẩm nhanh hơn không anh Pi?',
      pi: 'Ta áp dụng tính chất giao hoán và kết hợp để nhóm các số hạng có chữ số tận cùng cộng lại tròn chục, tròn trăm: (117 + 23) + 68 = 140 + 68 = 208!',
      tron: 'Hay quá! Ở Bài 1.22a cũng vậy: 285 + 470 + 115 + 230 = (285 + 115) + (470 + 230) = 400 + 700 = 1 100!',
      hint: 'Mẹo của Anh Pi: Vận dụng 1 (tr. 15): Diện tích lúa Thu Đông ĐBSCL là 713 200 + 14 500 = 727 700 (ha). Bài 1.22b: (571 + 129) + (216 + 124) = 700 + 340 = 1 040!'
    },
    bai4_3: {
      tron: 'Anh Pi ơi, trong tập hợp các số tự nhiên ℕ, có phải lúc nào phép trừ a - b cũng thực hiện được không ạ?',
      pi: 'Không đâu nhé! Trong tập hợp số tự nhiên ℕ, phép trừ a - b chỉ thực hiện được khi số bị trừ lớn hơn hoặc bằng số trừ (a ≥ b)!',
      vuong: 'Và nhờ mối quan hệ a - b = c ⇔ a = b + c, tụi mình dễ dàng tìm được thành phần chưa biết x trong Bài 1.19!',
      hint: 'Mẹo của Bạn Vuông: Luyện tập 2: 865 279 - 45 027 = 820 252. Bài 1.19: a) x = 362 - 7 = 355; b) x = 25 - 15 = 10; c) x = 4 + 56 = 60!'
    },
    bai4_4: {
      vuong: 'Ở Bài 1.18 trang 16, cổng trường có ghi phép toán bí ẩn: ? + 2 895 = 2 895 + 6 789. Tìm số ở dấu hỏi chấm mà không cần đặt tính cộng!',
      tron: 'Nhờ tính chất giao hoán a + b = b + a, mình nhìn thấy ngay dấu "?" chính là số 6 789 mà không tốn một giây đặt tính nào!',
      pi: 'Rất thông minh! Còn ở Bài 1.17, các em hãy đặt tính thẳng hàng các chữ số cùng hàng để tính tổng và hiệu thật chính xác nhé!',
      hint: 'Mẹo của Anh Pi: Bài 1.17: a) 3 548 + 19 256 = 22 804; b) 129 107 - 34 693 = 94 414!'
    },
    bai4_5: {
      tron: 'Ở Bài 1.21 trang 16, sân bay Tân Sơn Nhất dự kiến có tổng công suất 3 nhà ga là 22 851 200 lượt khách/năm. Nhà ga T1 và T2 tiếp nhận 6 526 300 và 3 514 500 lượt khách.',
      vuong: 'Vậy số lượt hành khách nhà ga T3 tiếp nhận mỗi năm là: 22 851 200 - (6 526 300 + 3 514 500) = 22 851 200 - 10 040 800 = 12 810 400 lượt khách!',
      pi: 'Các em có thể bấm nút "🧮 Máy tính Cộng & Trừ" ở góc trên để kiểm tra lại các con số thống kê lớn này theo đúng chuẩn Năng lực số 5.1TC1a nhé!',
      hint: 'Mẹo của Bạn Vuông: Bài 1.20: Dân số Việt Nam năm 2020 là 96 462 106 + 876 473 = 97 338 579 (người)!'
    },

    bai5_1: {
      tron: 'Mẹ mua một túi 10 kg gạo ngon giá 20 nghìn đồng mỗi ki-lô-gam. Mẹ đưa tiền bằng các tờ mệnh giá 50 nghìn đồng thì cần đưa mấy tờ nhỉ?',
      vuong: 'Tiền mua 10 kg gạo là phép nhân: 10 × 20 = 200 nghìn đồng. Số tờ 50 nghìn đồng cần đưa là phép chia: 200 : 50 = 4 tờ!',
      pi: 'Đó chính là sự kết hợp nhịp nhàng giữa phép nhân và phép chia số tự nhiên trong đời sống!',
      hint: 'Mẹo của Bạn Tròn: Tiền gạo = 200 nghìn đồng; số tờ 50 nghìn đồng cần đưa là 200 : 50 = 4 tờ!'
    },
    bai5_2: {
      vuong: 'Anh Pi ơi, khi tính nhẩm phép nhân nhiều thừa số như 125 · 8 001 · 8 ở Luyện tập 2 trang 18, có cặp số vàng nào giúp tính siêu tốc không ạ?',
      pi: 'Có 3 cặp tích vàng mà mọi học sinh lớp 6 đều nên thuộc lòng: 2 · 5 = 10; 4 · 25 = 100; và 8 · 125 = 1 000! Ghép (125 · 8) · 8 001 = 1 000 · 8 001 = 8 001 000 ngay!',
      tron: 'Còn ở Vận dụng 2: Thay bóng đèn LED cho 32 phòng học (mỗi phòng 8 bóng, mỗi bóng 96 000đ) hết 32 · 8 · 96 000 = 24 576 000 đồng!',
      hint: 'Mẹo của Anh Pi: Luyện tập 1: 834 · 57 = 47 538; 603 · 295 = 177 885. Vận dụng 1: 350 · 250 = 87 500 đồng!'
    },
    bai5_3: {
      tron: 'Ở Bài 1.29 trang 19, hội trường có ghế băng 5 chỗ ngồi mà cần xếp chỗ cho 997 người. Ta chia 997 : 5 = 199 dư 2 người. Vậy trả lời 199 ghế có đủ không Vuông?',
      vuong: 'Không đủ đâu! 199 ghế mới xếp được 995 người, còn dư 2 người vẫn phải cần thêm 1 chiếc ghế băng nữa! Vậy phải cần ít nhất 199 + 1 = 200 ghế băng!',
      pi: 'Rất thực tế! Tương tự ở Bài 1.30, chở 1 290 cổ động viên bằng xe 45 chỗ: vì 1 290 : 45 = 28 dư 30 người nên cần ít nhất 28 + 1 = 29 chuyến xe!',
      hint: 'Mẹo của Bạn Vuông: Luyện tập 3: 945 : 45 = 21 (dư 0); 3 121 : 51 = 61 (dư 10). Ví dụ 4: 487 : 45 = 10 dư 37 ⇒ cần 11 xe!'
    },
    bai5_4: {
      vuong: 'Ở Bài 1.25 trang 19, làm sao để tính nhẩm 125 · 101 và 21 · 49 bằng tính chất phân phối của phép nhân đối với phép cộng/trừ nhỉ?',
      tron: 'Mình tách 101 = 100 + 1 nên 125 · 101 = 125 · (100 + 1) = 12 500 + 125 = 12 625! Còn 49 = 50 - 1 nên 21 · 49 = 21 · (50 - 1) = 1 050 - 21 = 1 029!',
      pi: 'Và với bài tìm x dạng phép chia có dư: x : 15 = 8 (dư 5), ta áp dụng công thức a = b · q + r ⇒ x = 15 · 8 + 5 = 125!',
      hint: 'Mẹo của Anh Pi: Bài 1.26: Số HS trường nhận nhiều nhất là 50 · 11 · 4 = 2 200 học sinh. Bài 1.27: 1 092 : 91 = 12; 2 059 : 17 = 121 dư 2!'
    },
    bai5_5: {
      tron: 'Trong Tiết 9 Luyện tập chung trang 21, Bài 1.35 tính tiền điện bậc thang cho nhà ông Khánh dùng 115 kWh (số điện) trong tháng!',
      vuong: '115 số điện được chia vào 3 bậc: Bậc 1 (50 số đầu giá 1 678đ), Bậc 2 (50 số tiếp theo giá 1 734đ) và Bậc 3 còn lại 115 - 50 - 50 = 15 số điện giá 2 014đ!',
      pi: 'Tổng số tiền điện ông Khánh phải trả là: 50 · 1 678 + 50 · 1 734 + 15 · 2 014 = 83 900 + 86 700 + 30 210 = 200 810 đồng! Qua bài toán này, các em nhớ tắt các thiết bị điện khi không sử dụng để tiết kiệm điện nhé!',
      hint: 'Mẹo của Bạn Vuông: Bài 1.34: Tổng khối lượng gạo và ngô xe chở là 30 · 50 + 40 · 60 = 1 500 + 2 400 = 3 900 (kg)!'
    },

    bai6_1: {
      tron: 'Theo truyền thuyết Ấn Độ về bàn cờ vua 64 ô ở trang 22: Ô thứ nhất đặt 1 hạt thóc, ô thứ hai đặt 2 hạt, ô thứ ba đặt 4 hạt... cứ ô sau gấp đôi ô trước!',
      vuong: 'Vậy ở ô thứ 7 sẽ có 2⁶ = 64 hạt thóc, ở ô thứ 8 là tích của 7 thừa số 2: 2⁷ = 128 hạt thóc! Đến ô thứ 64 là 2⁶³ hạt thóc, nhiều đến mức phủ kín cả bề mặt Trái Đất!',
      pi: 'Để viết gọn tích của n thừa số bằng nhau (mỗi thừa số bằng a), người ta dùng kí hiệu lũy thừa aⁿ, trong đó a là cơ số và n là số mũ!',
      hint: 'Mẹo của Anh Pi: Ô thứ k trên bàn cờ vua có 2^(k-1) hạt thóc: Ô thứ 7 có 2⁶ = 64 hạt, ô thứ 8 có 2⁷ = 128 hạt!'
    },
    bai6_2: {
      vuong: 'Anh Pi ơi, a² còn gọi là a bình phương, a³ gọi là a lập phương. Vậy "số chính phương" là số như thế nào ạ?',
      pi: 'Số chính phương là số bằng bình phương của một số tự nhiên! Ví dụ 10 số chính phương đầu tiên từ 1² đến 10² là: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100!',
      tron: 'Và tụi mình còn dùng lũy thừa của 10 để viết cấu tạo số nữa: 23 197 = 2·10⁴ + 3·10³ + 1·10² + 9·10¹ + 7!',
      hint: 'Mẹo của Bạn Tròn: Lưu ý không bao giờ nhầm aⁿ với a · n nhé (ví dụ 2³ = 2·2·2 = 8 chứ không phải 2·3 = 6)!'
    },
    bai6_3: {
      tron: 'Khi nhân hai lũy thừa cùng cơ số aᵐ · aⁿ thì mình làm thế nào với số mũ nhỉ Vuông?',
      vuong: 'Nhân cùng cơ số thì GIỮ NGUYÊN CƠ SỐ và CỘNG HAI SỐ MŨ: aᵐ · aⁿ = aᵐ⁺ⁿ! Còn chia cùng cơ số thì TRỪ SỐ MŨ: aᵐ : aⁿ = aᵐ⁻ⁿ!',
      pi: 'Và các em nhớ hai quy ước vàng: a¹ = a và a⁰ = 1 (với a ≠ 0). Nhờ đó ở Luyện tập 3b, phép chia 1 091¹⁰⁰ : 1 091¹⁰⁰ = 1 091⁰ = 1 ngay lập tức!',
      hint: 'Mẹo của Bạn Vuông: LT2: 5³ · 5⁷ = 5¹⁰; 2⁴ · 2⁵ · 2⁹ = 2¹⁸; 10² · 10⁴ · 10⁶ · 10⁸ = 10²⁰. LT3a: 7⁶ : 7⁴ = 7²!'
    },
    bai6_4: {
      vuong: 'Ở Bài 1.43 trang 24 có một quy luật cực kỳ đẹp của các số lẻ liên tiếp bắt đầu từ 1: 1 + 3 = 4 = 2²; 1 + 3 + 5 = 9 = 3²!',
      tron: 'Ồ! Vậy tổng của 4 số lẻ đầu tiên là 1 + 3 + 5 + 7 = 16 = 4², và tổng của 5 số lẻ đầu tiên là 1 + 3 + 5 + 7 + 9 = 25 = 5²!',
      pi: 'Còn ở Bài 1.41, biết 2¹⁰ = 1 024 thì ta suy ra ngay 2⁹ = 1 024 : 2 = 512 và 2¹¹ = 1 024 · 2 = 2 048!',
      hint: 'Mẹo của Anh Pi: Bài 1.42: a) 5⁷ · 5³ = 5¹⁰; b) 5⁸ : 5⁴ = 5⁴!'
    },
    bai6_5: {
      tron: 'Ở Bài 1.44 và 1.45 trang 24, lũy thừa giúp các nhà khoa học viết những con số khổng lồ trong Thiên văn học và Sinh học thật gọn gàng!',
      vuong: 'Bài 1.44: Mặt Trời cần thời gian là (60 · 10²⁰) : (6 · 10⁶) = 10 · 10¹⁴ = 10¹⁵ giây! Còn Bài 1.45: Trong 1 giờ (3 600 giây), tủy xương tạo ra 25 · 10⁵ · 3 600 = 9 · 10⁹ tế bào hồng cầu!',
      pi: 'Đó chính là lý do lũy thừa của 10 được dùng trong kí hiệu khoa học trên toàn thế giới!',
      hint: 'Mẹo của Bạn Vuông: 1 giờ = 3 600 giây = 36 · 10² giây ⇒ 25 · 10⁵ · 36 · 10² = 900 · 10⁷ = 9 · 10⁹ tế bào!'
    },

    bai7_1: {
      tron: 'Huhu, ở biểu thức mở đầu 5 + 3 × 2 trang 25, mình lấy 5 + 3 = 8 rồi nhân 2 ra 16, thế mà máy tính Casio lại báo kết quả là 11!',
      vuong: 'Vì đối với biểu thức không có dấu ngoặc, mình phải thực hiện theo đúng thứ tự ưu tiên: Lũy thừa ➔ Nhân và chia ➔ Cộng và trừ! Phải tính 3 × 2 = 6 trước, rồi mới lấy 5 + 6 = 11!',
      pi: 'Còn nếu biểu thức có dấu ngoặc thì ta thực hiện theo thứ tự: Ngoặc tròn ( ) ➔ Ngoặc vuông [ ] ➔ Ngoặc nhọn { }!',
      hint: 'Mẹo của Anh Pi: Trong biểu thức 5 + 3 × 2, bạn Vuông tính ra 11 là ĐÚNG!'
    },
    bai7_2: {
      vuong: 'Ở Bài 1.46c trang 26, biểu thức có đủ cả 3 tầng ngoặc: {2³ + [1 + (3 - 1)²]} : 13. Mình bóc từng lớp từ trong ra ngoài nhé!',
      tron: 'Trong ngoặc tròn: (3 - 1)² = 2² = 4. Trong ngoặc vuông: [1 + 4] = 5. Trong ngoặc nhọn: {8 + 5} = 13. Cuối cùng 13 : 13 = 1! Đẹp mê ly!',
      pi: 'Và ở câu 1.46b: 14 + 2 · 8² = 14 + 2 · 64 = 14 + 128 = 142. Tuyệt đối không được lấy 14 + 2 = 16 trước đâu nhé!',
      hint: 'Mẹo của Bạn Tròn: LT1 (tr. 26): a) 25·2³ - 3² + 125 = 200 - 9 + 125 = 316; b) 2·3² + 5·(2 + 3) = 18 + 25 = 43!'
    },
    bai7_3: {
      tron: 'Ở Tiết 13 trang 26, Bài 1.49 tính tổng chi phí bác Cường lát sàn gỗ cho căn hộ 105 m² (trừ bếp và nhà vệ sinh 30 m²)!',
      vuong: 'Diện tích cần lát gỗ là 105 - 30 = 75 m². Trong đó 18 m² lát gỗ loại 1 (350 nghìn/m²), phần còn lại 75 - 18 = 57 m² lát gỗ loại 2 (170 nghìn/m²), cộng thêm công thợ 30 nghìn/m² cho cả 75 m²!',
      pi: 'Biểu thức tổng hợp là: 350·18 + 170·[(105 - 30) - 18] + 30·(105 - 30) = 6 300 + 9 690 + 2 250 = 18 240 (nghìn đồng)!',
      hint: 'Mẹo của Bạn Vuông: LT2: S = 2a² + a, khi a = 3 thì S = 21 cm². Bài 1.47: 1 + 2(25 + 9) - 4³ = 1 + 68 - 64 = 5. Bài 1.48: (1 264 + 164·4) : 12 = 160 chiếc ti vi!'
    },
    bai7_4: {
      vuong: 'Ở Tiết 14 Luyện tập chung trang 27, Bài 1.50b và 1.50c là một cặp bài cực hay để phân biệt khi có ngoặc và không có ngoặc ở phép chia - nhân liền nhau!',
      pi: 'Đúng thế! Ở câu 1.50b: 2·3² + 24 : 6 · 2, vì phép chia và phép nhân ngang hàng nên ta phải tính TỪ TRÁI SANG PHẢI: 24 : 6 = 4, rồi 4 · 2 = 8 ⇒ 18 + 8 = 26!',
      tron: 'Còn ở câu 1.50c: 2·3² - 24 : (6 · 2) vì có ngoặc tròn (6 · 2) = 12 nên 24 : 12 = 2 ⇒ 18 - 2 = 16!',
      hint: 'Mẹo của Anh Pi: Bài 1.52: Diện tích toàn phần hình hộp chữ nhật S = 2(a+b)c + 2ab = 2·(5+4)·3 + 2·5·4 = 54 + 40 = 94 (cm²)!'
    },
    bai7_5: {
      tron: 'Tiết 15-16 Ôn tập cuối Chương I trang 28 có Bài 1.59 về rạp chiếu phim có 18 hàng ghế, mỗi hàng 18 ghế (tổng 18 × 18 = 324 ghế), giá vé 50 000 đồng!',
      vuong: 'Tối thứ Bảy bán hết vé thu được 324 × 50 000 = 16 200 000 đồng. Tối Chủ nhật còn 41 vé chưa bán nên thu được (324 - 41) × 50 000 = 14 150 000 đồng!',
      pi: 'Còn tối thứ Hai thu được 10 550 000 đồng, tức là đã bán 10 550 000 : 50 000 = 211 vé ⇒ số vé không bán được là 324 - 211 = 113 vé! Hoàn thành màn này là các em đã chinh phục trọn vẹn Chương I Toán 6 rồi đấy!',
      hint: 'Mẹo của Bạn Vuông: Bài 1.57: 21 · [(1 245 + 987) : 2³ - 15 · 12] + 21 = 21 · 99 + 21 = 2 100. Bài 1.58: 320 : 45 = 7 dư 5 ⇒ cần thuê 8 xe!'
    },

    bai8_1: {
      tron: 'Lớp 6A được thưởng 50 cái bút rời và thêm 4 hộp bút nữa, mà tụi mình chưa biết mỗi hộp có bao nhiêu cái bút thì làm sao biết có chia đều cho 4 tổ được không nhỉ?',
      vuong: 'Cậu nhìn nhé: 4 hộp bút có số bút mỗi hộp bằng nhau nên tổng số bút trong 4 hộp chắc chắn chia hết cho 4 tổ rồi! Chỉ cần xét xem 50 cái bút rời có chia hết cho 4 không thôi!',
      pi: 'Suy luận quá sắc bén! Vì 50 chia 4 được 12 dư 2 (50 không chia hết cho 4), nên dù mỗi hộp có bao nhiêu bút thì tổng số bút của lớp 6A cũng KHÔNG thể chia đều cho 4 tổ!',
      hint: 'Mẹo của Anh Pi: Hãy thử chọn số bút trong mỗi hộp bất kỳ trên bàn thí nghiệm (ví dụ 6, 10 hoặc 12 bút) rồi bấm Kiểm tra chia cho 4 tổ, em sẽ thấy luôn dư 2 cái bút!'
    },
    bai8_2: {
      vuong: 'Anh Pi ơi, làm thế nào để tìm đầy đủ tập hợp các ước của một số tự nhiên a lớn hơn 1 mà không bị sót ạ?',
      pi: 'Ta lần lượt chia a cho các số tự nhiên từ 1 đến a, phép chia nào hết thì số chia đó là ước của a! Còn muốn tìm bội của b, ta nhân b lần lượt với 0, 1, 2, 3...',
      tron: 'Còn ở Thử thách nhỏ trang 31: Tìm ba ước khác nhau của 12 có tổng bằng 12, mình nhẩm ra 2 + 4 + 6 = 12 ngay!',
      hint: 'Mẹo của Bạn Tròn: Ư(20) = {1; 2; 4; 5; 10; 20}. Các bội nhỏ hơn 50 của 4 là: 0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48. Ba ước của 12 có tổng bằng 12 là 2, 4, 6!'
    },
    bai8_3: {
      tron: 'Mình vừa xem một video trên mạng bảo rằng: Nếu hai số đều không chia hết cho 4 thì tổng của chúng cũng không chia hết cho 4. Điều đó có đúng không Vuông?',
      vuong: 'Sai rồi Tròn ơi! Ví dụ 3 không chia hết cho 4 và 5 cũng không chia hết cho 4, nhưng 3 + 5 = 8 lại chia hết cho 4 đấy! Mình phải kiểm chứng kỹ thông tin trên mạng nhé!',
      pi: 'Đúng vậy! Tính chất 2 chỉ khẳng định khi trong hai số có MỘT số chia hết cho m và MỘT số KHÔNG chia hết cho m thì tổng của chúng mới không chia hết cho m!',
      hint: 'Mẹo của Bạn Vuông: (21 + x) ⋮ 7 vì 21 ⋮ 7 nên cần x ⋮ 7 ⇒ chọn x ∈ {14; 28}. Còn để (20 + 45 + x) ∤ 5 thì cần x ∤ 5 ⇒ chọn x ∈ {39; 54}!'
    },
    bai8_4: {
      vuong: 'Ở Bài 2.1 trang 33, mình nhận thấy số 17 chỉ có đúng hai ước là 1 và 17 thôi!',
      tron: 'Còn ở Bài 2.3a, tìm các bội của 7 nhỏ hơn 70, mình nhớ phải bắt đầu nhân từ số 0 nhé: 0, 7, 14, 21, 28, 35, 42, 49, 56, 63!',
      pi: 'Rất cẩn thận! Các em hãy luôn nhớ số 0 là bội của mọi số tự nhiên khác 0, và số 1 là ước của mọi số tự nhiên!',
      hint: 'Mẹo của Anh Pi: Ư(30) = {1; 2; 3; 5; 6; 10; 15; 30}; Ư(35) = {1; 5; 7; 35}. Các ước của 50 lớn hơn 5 là: {10; 25; 50}!'
    },
    bai8_5: {
      tron: 'Ở Bài 2.8 trang 33, đội thể thao có 45 vận động viên, huấn luyện viên muốn chia thành các nhóm đều nhau từ 3 đến 10 người mỗi nhóm!',
      vuong: 'Vì 45 phải chia hết cho số người trong mỗi nhóm, nên số người mỗi nhóm phải là ước của 45 và nằm từ 3 đến 10!',
      pi: 'Mà Ư(45) = {1; 3; 5; 9; 15; 45}, vậy huấn luyện viên có thể chia mỗi nhóm có 3, 5 hoặc 9 vận động viên!',
      hint: 'Mẹo của Bạn Vuông: Bài 2.7: 40 HS chia đều được thành 4 nhóm, 5 nhóm, 8 nhóm, 10 nhóm (không chia được 6 nhóm vì 40 ∤ 6). Bài 2.9a: x = 24; Bài 2.9b: x ∈ {22; 45}!'
    },

    bai9_1: {
      vuong: 'Lạ thật! Phép chia 71 001 cho 9 là một số có tới 5 chữ số, sao bạn Tròn vừa nhìn đề đã biết ngay phép chia hết không dư nhỉ?',
      tron: 'Hihi, bí mật của mình là cộng tất cả các chữ số lại: 7 + 1 + 0 + 0 + 1 = 9! Vì 9 chia hết cho 9 nên 71 001 chia hết cho 9 luôn!',
      pi: 'Đó chính là sức mạnh của Dấu hiệu chia hết trong Bài 9! Nhờ các dấu hiệu này, ta không cần đặt tính chia mà vẫn biết ngay một số có chia hết cho 2, 5, 9, 3 hay không!',
      hint: 'Mẹo của Bạn Tròn: Tổng các chữ số của 71 001 là 7 + 1 + 0 + 0 + 1 = 9 ⋮ 9 nên số dư của phép chia 71 001 cho 9 bằng 0!'
    },
    bai9_2: {
      tron: 'Muốn biết một số có chia hết cho 2 hoặc cho 5 hay không, mình chỉ cần nhìn vào chữ số tận cùng thôi đúng không anh Pi?',
      pi: 'Chính xác! Tận cùng là 0, 2, 4, 6, 8 thì chia hết cho 2. Tận cùng là 0 hoặc 5 thì chia hết cho 5. Và đặc biệt: Tận cùng là 0 thì chia hết cho CẢ 2 VÀ 5!',
      vuong: 'Áp dụng vào Luyện tập 1: 1 954 tận cùng là 4 (chia hết cho 2), còn 1 975 tận cùng là 5 (không chia hết cho 2), nên tổng (1 954 + 1 975) không chia hết cho 2!',
      hint: 'Mẹo của Anh Pi: LT1: 1a) (1954 + 1975) ∤ 2; 1b) (2020 - 938) ⋮ 2; 2a) (1945 + 2020) ⋮ 5; 2b) (1954 - 1930) ∤ 5!'
    },
    bai9_3: {
      vuong: 'Ở bài Vận dụng trang 36, mảnh đất dài 108 m, bác nông dân muốn trồng dừa hai đầu đất và cách đều nhau 9 m. Sao nhiều bạn tính ra 12 cây lại bị thiếu nhỉ?',
      pi: 'Vì trồng ở CẢ HAI ĐẦU đoạn đường nên số cây dừa phải bằng số khoảng cách cộng thêm 1: 108 : 9 + 1 = 12 + 1 = 13 cây dừa!',
      tron: 'Còn ở Mê cung đường đi đến Siêu thị trang 36, tụi mình đi qua các ô chia hết cho 3 hoặc chia hết cho 2 theo lộ trình: 21 → 15 → 2020 → 72 → 123 → 136 → 1245!',
      hint: 'Mẹo của Bạn Vuông: LT2: Để 12* ⋮ 9 thì (1+2+*) = (3+*) ⋮ 9 ⇒ * = 6. LT3: Để 12*5 ⋮ 3 thì (8+*) ⋮ 3 ⇒ * ∈ {1; 4; 7}!'
    },
    bai9_4: {
      tron: 'Ở Bài 2.14 trang 37, số 345* có dấu sao ở hàng đơn vị. Mình vừa phải xét chữ số tận cùng (cho 2 và 5), vừa phải xét tổng các chữ số (cho 3 và 9)!',
      vuong: 'Tổng các chữ số hiện tại là 3 + 4 + 5 + * = 12 + *. Vì 12 đã chia hết cho 3 nên để chia hết cho 3 thì * ∈ {0; 3; 6; 9}; còn để chia hết cho 9 thì * = 6!',
      pi: 'Lưu ý: Những số chia hết cho 9 thì chắc chắn chia hết cho 3, nhưng số chia hết cho 3 thì chưa chắc đã chia hết cho 9 (ví dụ số 123 chia hết cho 3 nhưng không chia hết cho 9)!',
      hint: 'Mẹo của Anh Pi: Bài 2.12: 290 có 2+9+0 = 11 ∤ 9 nên không chia đều được 9 nhóm. Bài 2.13: 162 có 1+6+2 = 9 ⋮ 9 nên chia đều đủ 9 học sinh mỗi đội!'
    },
    bai9_5: {
      vuong: 'Ở Bài 2.16 trang 37, dùng ba trong bốn thẻ chữ số 2, 0, 4, 5 để ghép thành các số có 3 chữ số khác nhau chia hết cho cả 2 và 3!',
      tron: 'Muốn chia hết cho 3 thì tổng 3 chữ số phải chia hết cho 3! Trong 4 thẻ {2, 0, 4, 5}, chỉ có bộ {2, 0, 4} (tổng bằng 6) và bộ {0, 4, 5} (tổng bằng 9) là chia hết cho 3 thôi!',
      pi: 'Sau đó chọn chữ số tận cùng là số chẵn (0, 2, 4) và chữ số hàng trăm khác 0, ta ghép được 8 số: 204, 240, 402, 420, 405, 450, 504 và 540!',
      hint: 'Mẹo của Bạn Tròn: Bài 2.15 (thẻ 3, 0, 4): a) Chia hết cho 2 là 304, 340, 430; b) Chia hết cho 5 là 340, 430. Mục Em có biết: abc = 99a + 9b + (a + b + c)!'
    },

    bai10_1: {
      tron: 'Mai có 11 bông hoa hồng mà muốn cắm đều vào các lọ nhỏ, mỗi lọ nhiều hơn 1 bông, sao cắm mãi vẫn bị lẻ vậy Vuông?',
      vuong: 'Vì số 11 chỉ có đúng hai ước là 1 và 11 thôi! Nhưng khi bớt 1 bông còn 10 bông, 10 có tới 4 ước là 1, 2, 5, 10 nên cắm đều vào 2 lọ hoặc 5 lọ vừa khít!',
      pi: 'Chính xác! Số tự nhiên lớn hơn 1 chỉ có hai ước là 1 và chính nó như số 11 được gọi là Số nguyên tố. Còn số có nhiều hơn hai ước như số 10 gọi là Hợp số!',
      hint: 'Mẹo của Anh Pi: Em hãy thử bấm chọn cắm vào 2 lọ hoặc 5 lọ trên bàn cắm hoa nhé. Với 11 bông sẽ luôn bị lẻ, còn 10 bông thì chia đều được!'
    },
    bai10_2: {
      vuong: 'Anh Pi ơi, vậy hai số đặc biệt là số 0 và số 1 có phải là số nguyên tố hay hợp số không ạ?',
      pi: 'Không đâu nhé! Số 0 và số 1 KHÔNG là số nguyên tố và cũng KHÔNG là hợp số. Và số 2 là số nguyên tố nhỏ nhất, đồng thời là số nguyên tố chẵn duy nhất!',
      tron: 'Còn ở Mê cung đường đi đến Rạp chiếu phim, tụi mình chỉ được bước lên các ô mang số nguyên tố thôi!',
      hint: 'Mẹo của Bạn Tròn: Các số nguyên tố từ 2 đến 11 là: 2, 3, 5, 7, 11. Đường đi đến rạp chiếu phim là: 7 → 19 → 13 → 11 → 23 → 29 → 31 → 41 → 17 → 2!'
    },
    bai10_3: {
      tron: 'Bạn Việt viết 60 = 3 · 4 · 5 mà thầy bảo chưa phải là phân tích ra thừa số nguyên tố, vì sao thế Vuông?',
      vuong: 'Vì số 4 vẫn là hợp số (4 = 2²)! Phải phân tích đến khi tất cả các thừa số đều là số nguyên tố: 60 = 2² · 3 · 5 mới đúng!',
      pi: 'Và các em nhớ nhận xét rất đẹp này nhé: Dù em phân tích bằng Sơ đồ cây hay Sơ đồ cột dọc thì cuối cùng cũng cho ra CÙNG MỘT KẾT QUẢ duy nhất!',
      hint: 'Mẹo của Bạn Vuông: 18 = 2 · 3²; 30 = 2 · 3 · 5; ở Luyện tập 3: 36 = 2² · 3² và 105 = 3 · 5 · 7!'
    },
    bai10_4: {
      vuong: 'Ở Bài 2.24 trang 42, Đội tiêu binh danh dự ở Quảng trường Ba Đình có 33 chiến sĩ. Làm sao biết có mấy cách xếp hàng đều nhau?',
      tron: 'Số hàng phải là ước của 33! Mà 33 = 3 · 11 nên các ước của 33 là 1, 3, 11 và 33!',
      pi: 'Tuyệt vời! Như vậy có 4 cách xếp hàng đều nhau: 1 hàng 33 chiến sĩ, 3 hàng 11 chiến sĩ, 11 hàng 3 chiến sĩ hoặc 33 hàng 1 chiến sĩ!',
      hint: 'Mẹo của Anh Pi: 70 = 2 · 5 · 7; 115 = 5 · 23; 120 = 2³ · 3 · 5; 102 = 2 · 3 · 17; A = 4⁴ · 9⁵ = (2²)⁴ · (3²)⁵ = 2⁸ · 3¹⁰!'
    },
    bai10_5: {
      tron: 'Anh Pi ơi, ở Bài 2.29 trang 43 có nhắc đến "Cặp số nguyên tố sinh đôi", nghe thú vị quá!',
      pi: 'Hai số nguyên tố được gọi là sinh đôi nếu chúng hơn kém nhau đúng 2 đơn vị, ví dụ như cặp (3; 5) hoặc (5; 7) đấy!',
      vuong: 'Và khi tra cứu bảng số nguyên tố trên màn hình, tụi mình nhớ giữ khoảng cách mắt an toàn 50 cm và ngồi thẳng lưng để bảo vệ thị lực nhé!',
      hint: 'Mẹo của Bạn Vuông: 5 cặp số nguyên tố sinh đôi nhỏ hơn 40 là: (3; 5), (5; 7), (11; 13), (17; 19) và (29; 31)!'
    },

    bai11_1: {
      vuong: 'Bác thợ mộc có tấm gỗ 18 dm và 30 dm. Nếu mình chọn lưỡi cưa 4 dm thì tấm 18 dm sẽ bị thừa mất 2 dm gỗ!',
      tron: 'Vậy độ dài đoạn gỗ cắt ra phải vừa là ước của 18, vừa là ước của 30 đúng không Vuông?',
      pi: 'Đúng rồi! Những số vừa là ước của 18 vừa là ước của 30 gọi là Ước chung của 18 và 30. Các em hãy thử máy cưa để tìm ước chung lớn nhất nhé!',
      hint: 'Mẹo của Anh Pi: Hãy thử bấm vào các lưỡi cưa 1 dm, 2 dm, 3 dm và 6 dm xem lưỡi cưa nào lớn nhất cắt vừa khít cả hai thanh gỗ nhé!'
    },
    bai11_2: {
      vuong: 'Mình đã liệt kê được Ư(24) = {1; 2; 3; 4; 6; 8; 12; 24} và Ư(28) = {1; 2; 4; 7; 14; 28} rồi!',
      tron: 'Ồ! Thế thì mình chỉ cần nhặt những viên ngọc xuất hiện ở CẢ HAI tập hợp là tìm được ƯC(24, 28) ngay!',
      pi: 'Và các em nhớ nhận xét đặc biệt nhé: Nếu a chia hết cho b (a ⋮ b) thì ƯCLN(a, b) chính bằng số nhỏ hơn là b đấy!',
      hint: 'Mẹo của Bạn Tròn: Ở Chặng 2.1, các số có mặt ở cả hai rương là 1, 2, 4. Ở Chặng 2.3, ƯCLN(40, 36) = 4 nhóm (mỗi nhóm 10 nam, 9 nữ)!'
    },
    bai11_3: {
      vuong: 'Nếu hai số lớn như 36 và 84 mà liệt kê hết các ước thì lâu quá! Có cách nào nhanh hơn không anh Pi?',
      pi: 'Có chứ! Ta dùng 3 bước phân tích ra thừa số nguyên tố: Chọn các thừa số nguyên tố CHUNG, mỗi thừa số lấy với số mũ NHỎ NHẤT!',
      tron: 'Còn khi rút gọn phân số về tối giản, mình chỉ cần chia cả tử và mẫu cho ƯCLN của chúng thôi!',
      hint: 'Mẹo của Bạn Vuông: 36 = 2²·3², 84 = 2²·3·7 ⇒ ƯCLN(36, 84) = 2²·3 = 12. Em cũng có thể mở "🧮 Máy tính GCD" để kiểm tra nhanh!'
    },
    bai11_4: {
      tron: 'Chào mừng cậu đến với Đấu Trường Tốc Độ! Có 6 thử thách từ Bài 2.30 đến 2.35 trang 48 đấy!',
      vuong: 'Đặc biệt ở Bài 2.35, hai hợp số nguyên tố cùng nhau nghĩa là cả hai đều là hợp số nhưng có ƯCLN bằng 1 (ví dụ 8 và 9).',
      pi: 'Hãy giữ chuỗi Combo thật cao để đạt trọn vẹn 3 ngôi sao ở ải Luyện tập này nhé!',
      hint: 'Mẹo của Anh Pi: Muốn tìm nhanh ƯC(a, b), ta chỉ cần tìm ƯCLN(a, b) trước, rồi liệt kê các ước của ƯCLN đó!'
    },
    bai11_5: {
      vuong: 'Anh Pi ơi, ở mục "Em có biết?" trang 48 có nhắc đến Thuật toán Euclid cổ đại để tìm ƯCLN!',
      tron: 'Mình thích cách này lắm! Cứ lấy số lớn chia cho số nhỏ lấy số dư, lặp lại đến khi dư bằng 0 thì số dư khác 0 cuối cùng chính là ƯCLN!',
      pi: 'Chuẩn xác! Hãy điền các số dư vào Cỗ Máy Euclid để tìm ƯCLN(135, 105) và nhận Bằng Kiện Tướng nhé!',
      hint: 'Mẹo của Bạn Vuông: 135 chia 105 dư 30; tiếp theo lấy 105 chia 30 được 3 dư 15; lấy 30 chia 15 dư 0 ⇒ ƯCLN(135, 105) = 15!'
    },

    bai12_1: {
      tron: 'Mai muốn mua đĩa giấy (4 cái/gói) và cốc giấy (6 cái/gói) sao cho số đĩa bằng số cốc để bày bàn tiệc!',
      vuong: 'Vì mỗi gói đĩa có 4 cái nên tổng số đĩa phải là bội của 4. Còn tổng số cốc phải là bội của 6!',
      pi: 'Vậy số đĩa và số cốc bằng nhau ít nhất chính là Bội chung nhỏ nhất của 4 và 6! Hãy bấm nút +/- trên kệ siêu thị để tìm nhé!',
      hint: 'Mẹo của Bạn Tròn: Mua 3 gói đĩa được 3 × 4 = 12 cái đĩa; mua 2 gói cốc được 2 × 6 = 12 cái cốc!'
    },
    bai12_2: {
      vuong: 'Chú Ếch Xanh nhảy mỗi bước 6 ô (0, 6, 12, 18, 24, 30, 36), còn Ếch Vàng nhảy mỗi bước 9 ô (0, 9, 18, 27, 36).',
      tron: 'Những lá sen nào có mặt cả hai chú ếch chính là các phần tử thuộc tập hợp Bội chung BC(6, 9) đấy!',
      pi: 'Lưu ý nhé: Bội chung nhỏ nhất (BCNN) là số NHỎ NHẤT KHÁC 0 trong tập hợp các bội chung. Và nếu a ⋮ b thì BCNN(a, b) = a (số lớn hơn)!',
      hint: 'Mẹo của Anh Pi: Hai chú ếch cùng đáp xuống các lá sen 0, 18, 36. Số nhỏ nhất khác 0 là 18 ⇒ BCNN(6, 9) = 18. Còn BCNN(36, 9) = 36!'
    },
    bai12_3: {
      vuong: 'Trong nhà máy, Máy A cứ 6 tháng bảo dưỡng 1 lần, Máy B cứ 9 tháng bảo dưỡng 1 lần.',
      tron: 'Vậy số tháng để hai máy lại cùng bảo dưỡng trong một tháng phải là bội chung nhỏ nhất của 6 và 9!',
      pi: 'Còn ở Luyện tập 1b: Tìm BCNN(8, 9, 72), các em hãy để ý xem số lớn nhất là 72 có chia hết cho cả 8 và 9 không nhé!',
      hint: 'Mẹo của Bạn Vuông: BCNN(6, 8) = 24; vì 72 ⋮ 8 và 72 ⋮ 9 nên BCNN(8, 9, 72) = 72; còn hai máy A, B sẽ cùng bảo dưỡng sau BCNN(6, 9) = 18 tháng!'
    },
    bai12_4: {
      tron: 'Ở Bài 2.36 trang 53, sau khi tìm được BCNN, làm sao để tìm nhanh tất cả các bội chung nhỏ hơn 200 nhỉ?',
      pi: 'Rất đơn giản! Tất cả các bội chung của các số đã cho đều là BỘI CỦA BCNN! Em chỉ cần nhân BCNN lần lượt với 0, 1, 2, 3... sao cho nhỏ hơn 200!',
      vuong: 'Đừng quên số 0 cũng là một bội chung nhỏ hơn 200 nhé!',
      hint: 'Mẹo của Anh Pi: 2.36a) BCNN(5, 7) = 35 ⇒ nhân 0, 1, 2, 3, 4, 5 được {0; 35; 70; 105; 140; 175}. 2.36b) BCNN(3, 4, 10) = 60 ⇒ {0; 60; 120; 180}.'
    },
    bai12_5: {
      vuong: 'Anh Pi ơi, giữa cách tìm ƯCLN và BCNN bằng phân tích thừa số nguyên tố có điểm gì khác nhau ạ?',
      pi: 'Câu hỏi rất hay của Vuông! Tìm ƯCLN thì chọn thừa số CHUNG với mũ NHỎ NHẤT. Còn tìm BCNN thì chọn thừa số CHUNG VÀ RIÊNG với mũ LỚN NHẤT!',
      tron: 'Nhờ tìm được BCNN của các mẫu số mà tụi mình quy đồng mẫu các phân số cực kỳ gọn luôn!',
      hint: 'Mẹo của Bạn Tròn: 8 = 2³, 12 = 2²·3 ⇒ BCNN(8, 12) = 2³·3 = 24. Quy đồng: 1/8 = 3/24 và 5/12 = 10/24!'
    }
  },

  selectCompanion(id) {
    if (typeof Sound !== 'undefined') Sound.click();
    this.selectedId = id;
    localStorage.setItem('toan6_mascot_id', id);
    document.querySelectorAll('.companion-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.mascot === id);
    });
    this.updateHUDCompanion();
    const c = this.getSelected();
    const labelEl = document.getElementById('companion-selected-label');
    if (labelEl) {
      labelEl.innerHTML = `🌟 Nhân vật đồng hành: <strong>${c.name}</strong> (${c.role})`;
    }
    const gridEl = document.getElementById('companion-picker-grid');
    if (gridEl) {
      gridEl.classList.remove('open');
    }
    VoiceNarrator.speak(`Xin chào! Mình là ${c.name}, ${c.role}. Chúng mình cùng chinh phục thử thách Toán 6 nhé!`, id);
  },

  togglePicker() {
    if (typeof Sound !== 'undefined') Sound.click();
    const gridEl = document.getElementById('companion-picker-grid');
    if (gridEl) {
      gridEl.classList.toggle('open');
    }
  },

  getSelected() {
    return this.info[this.selectedId] || this.info.pi;
  },

  updateHUDCompanion() {
    const hudPlayer = document.getElementById('hud-player');
    if (!hudPlayer) return;
    const c = this.getSelected();
    const currentText = hudPlayer.textContent.replace(/^.*?\s/, '');
    const badgeIcon = c.id === 'pi' ? '🧙‍♂️ π' : c.id === 'vuong' ? '🟦 Vuông' : '🟠 Tròn';
    hudPlayer.innerHTML = `<span style="color:#fde68a;">[${badgeIcon}]</span> ${currentText}`;
  },

  renderPickerHTML() {
    const cur = this.getSelected();
    return `
      <div class="companion-picker">
        <button type="button" class="companion-toggle-btn" onclick="Mascots.togglePicker()" title="Nháy chuột để chọn hoặc đổi nhân vật đồng hành">
          <span id="companion-selected-label">🌟 Nhân vật đồng hành: <strong>${cur.name}</strong> (${cur.role})</span>
          <span style="font-size:0.78rem; color:#93c5fd;">Nháy để đổi ▾</span>
        </button>
        <div class="companion-grid" id="companion-picker-grid">
          ${Object.values(this.info).map(c => `
            <div class="companion-card ${this.selectedId === c.id ? 'selected' : ''}"
                 data-mascot="${c.id}"
                 onclick="Mascots.selectCompanion('${c.id}')">
              ${c.svg}
              <div class="companion-name">${c.name}</div>
              <div class="companion-role">${c.role}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  toggleDialogue() {
    if (typeof Sound !== 'undefined') Sound.click();
    const chatList = document.getElementById('mascot-chat-list');
    const arrow = document.getElementById('mascot-dialogue-arrow');
    if (chatList) {
      const isOpen = chatList.classList.toggle('open');
      if (arrow) arrow.textContent = isOpen ? '▴ Thu gọn' : '▾ Xem hội thoại';
    }
  },

  injectDialogue(lessonKey, stageId) {
    const key = `${lessonKey}_${stageId}`;
    const d = this.dialogues[key];
    const stageBody = document.getElementById('stage-body');
    if (!d || !stageBody) return;

    const existing = document.getElementById('mascot-dialogue-container');
    if (existing) existing.remove();

    const companion = this.getSelected();
    const wrapper = document.createElement('div');
    wrapper.id = 'mascot-dialogue-container';
    wrapper.className = 'mascot-dialogue-box';

    const safeVuong = d.vuong.replace(/'/g, "\\'");
    const safeTron = d.tron.replace(/'/g, "\\'");
    const safePi = d.pi.replace(/'/g, "\\'");
    const safeHint = d.hint.replace(/'/g, "\\'");

    wrapper.innerHTML = `
      <div class="mascot-dialogue-header">
        <button type="button" class="mascot-dialogue-toggle" onclick="Mascots.toggleDialogue()" title="Nháy chuột để hiện hoặc thu gọn cuộc trò chuyện">
          <span>💬 Góc Thảo Luận: Pi (π) • Vuông (🟦) • Tròn (🟠)</span>
          <span id="mascot-dialogue-arrow" style="font-size:0.76rem; color:#fde68a; background:rgba(255,255,255,0.08); padding:0.15rem 0.55rem; border-radius:999px;">▾ Xem hội thoại</span>
        </button>
        <div style="display:flex; gap:0.4rem; align-items:center; flex-wrap:wrap;">
          <button type="button" class="tts-btn tts-sm" onclick="VoiceNarrator.readDialogue('${lessonKey}', ${stageId})">
            🔊 Nghe hội thoại
          </button>
          <button type="button" class="btn btn-accent btn-sm" onclick="Mascots.toggleHint('${safeHint}')">
            💡 Gợi ý (${companion.shortName})
          </button>
        </div>
      </div>

      <div class="mascot-chat-list" id="mascot-chat-list">
        <div class="mascot-chat-item char-vuong">
          <div class="mascot-chat-avatar">${this.info.vuong.svg}</div>
          <div class="mascot-chat-content">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:0.4rem;">
              <span class="mascot-speaker-badge">🟦 Bạn Vuông:</span>
              <button type="button" class="tts-btn tts-sm" onclick="VoiceNarrator.speak('Bạn Vuông nói: ${safeVuong}', 'vuong')">🔊 Nghe</button>
            </div>
            <div>“${d.vuong}”</div>
          </div>
        </div>

        <div class="mascot-chat-item char-tron">
          <div class="mascot-chat-avatar">${this.info.tron.svg}</div>
          <div class="mascot-chat-content">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:0.4rem;">
              <span class="mascot-speaker-badge">🟠 Bạn Tròn:</span>
              <button type="button" class="tts-btn tts-sm" onclick="VoiceNarrator.speak('Bạn Tròn nói: ${safeTron}', 'tron')">🔊 Nghe</button>
            </div>
            <div>“${d.tron}”</div>
          </div>
        </div>

        <div class="mascot-chat-item char-pi">
          <div class="mascot-chat-avatar">${this.info.pi.svg}</div>
          <div class="mascot-chat-content">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:0.4rem;">
              <span class="mascot-speaker-badge">🧙‍♂️ Anh Pi (π):</span>
              <button type="button" class="tts-btn tts-sm" onclick="VoiceNarrator.speak('Anh Pi nói: ${safePi}', 'pi')">🔊 Nghe</button>
            </div>
            <div>“${d.pi}”</div>
          </div>
        </div>
      </div>

      <div class="mascot-hint-banner" id="mascot-stage-hint">
        <div style="width:40px; height:40px; flex-shrink:0;">${companion.svg}</div>
        <div style="flex:1;"><strong>Gợi ý từ ${companion.name}:</strong> ${d.hint}</div>
        <button type="button" class="tts-btn tts-sm" onclick="VoiceNarrator.speak('${safeHint}', '${companion.id}')">🔊 Đọc gợi ý</button>
      </div>
    `;

    stageBody.prepend(wrapper);
    VoiceNarrator.enhanceStageDOM(true);
  },

  toggleHint(hintText) {
    if (typeof Sound !== 'undefined') Sound.pop ? Sound.pop() : Sound.click();
    const el = document.getElementById('mascot-stage-hint');
    if (el) {
      const isShowing = el.classList.toggle('show');
      if (isShowing && hintText && VoiceNarrator.enabled) {
        VoiceNarrator.speak(hintText, this.selectedId);
      }
    }
  }
};

/* Tự động đồng bộ Thanh điều hướng gọn nhẹ (Nháy chuột mới hiện danh sách 12 bài học) */
function syncGoogmathNavBar() {
  const nav = document.querySelector('.lesson-switcher, .googmath-top-nav');
  if (!nav) return;

  const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const ch1Items = [
    { href: 'bai1.html', label: '📘 Bài 1: Tập hợp' },
    { href: 'bai2.html', label: '🏛️ Bài 2: Ghi số tự nhiên' },
    { href: 'bai3.html', label: '📏 Bài 3: Thứ tự trong ℕ' },
    { href: 'bai4.html', label: '➕ Bài 4: Cộng & Trừ' },
    { href: 'bai5.html', label: '✖️ Bài 5: Nhân & Chia' },
    { href: 'bai6.html', label: '♟️ Bài 6: Lũy thừa' },
    { href: 'bai7.html', label: '🧮 Bài 7: Thứ tự phép tính' }
  ];

  const ch2Items = [
    { href: 'bai8.html', label: '⚖️ Bài 8: Quan hệ chia hết' },
    { href: 'bai9.html', label: '🔍 Bài 9: Dấu hiệu chia hết' },
    { href: 'bai10.html', label: '🌸 Bài 10: Số nguyên tố' },
    { href: 'index.html', label: '👑 Bài 11: Ước chung & ƯCLN' },
    { href: 'bai12.html', label: '🚀 Bài 12: Bội chung & BCNN' }
  ];

  const aiItems = [
    { href: 'sotay.html', label: '📖 Sổ Tay Hỏi Đáp Toán 6' },
    { href: 'tuvan.html', label: '💚 Tư Vấn Học Đường Khối 6' }
  ];

  const allItems = [...ch1Items, ...ch2Items, ...aiItems];
  const activeItem = allItems.find(
    it => currentFile === it.href.toLowerCase() || (currentFile === '' && it.href === 'index.html')
  ) || ch2Items[3];

  const renderLinks = (list) => list.map(it => {
    const isActive = currentFile === it.href.toLowerCase() || (currentFile === '' && it.href === 'index.html');
    return `<a href="${it.href}" class="lesson-tab${isActive ? ' active' : ''}" style="justify-content:flex-start;">${it.label}</a>`;
  }).join('');

  nav.innerHTML = `
    <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
      <a href="index.html" class="nav-brand-mini" title="Về Trang Chủ GoogMath">
        🌐 GOOGMATH • TOÁN 6
      </a>
      <div class="nav-dropdown-wrapper" id="nav-lesson-dropdown">
        <button type="button" class="nav-dropdown-btn" onclick="toggleGoogmathMenu(event)" title="Nháy chuột để mở hoặc thu gọn danh sách 12 bài học">
          <span>📚 ${activeItem.label}</span>
          <span id="nav-dropdown-caret">▾ Chọn bài</span>
        </button>
        <div class="nav-dropdown-panel" id="nav-dropdown-panel">
          <div class="nav-chapter-group">
            <div class="nav-chapter-title">📘 Chương I: Tập hợp các số tự nhiên (Bài 1 – Bài 7)</div>
            <div class="nav-chapter-grid">${renderLinks(ch1Items)}</div>
          </div>
          <div class="nav-chapter-group">
            <div class="nav-chapter-title" style="color:#f472b6;">⚖️ Chương II: Tính chia hết trong ℕ (Bài 8 – Bài 12)</div>
            <div class="nav-chapter-grid">${renderLinks(ch2Items)}</div>
          </div>
          <div class="nav-chapter-group">
            <div class="nav-chapter-title" style="color:#34d399;">🤖 Trợ Lý AI &amp; Tư Vấn Học Đường</div>
            <div class="nav-chapter-grid">${renderLinks(aiItems)}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-compact-actions">
      <a href="sotay.html" class="lesson-tab${currentFile === 'sotay.html' ? ' active' : ''}">📖 Sổ Tay</a>
      <a href="tuvan.html" class="lesson-tab${currentFile === 'tuvan.html' ? ' active' : ''}">💚 Tư Vấn</a>
    </div>
  `;
}

function toggleGoogmathMenu(e) {
  if (e) e.stopPropagation();
  const panel = document.getElementById('nav-dropdown-panel');
  const caret = document.getElementById('nav-dropdown-caret');
  if (!panel) return;
  const isOpen = panel.classList.toggle('open');
  if (caret) caret.textContent = isOpen ? '▴ Thu gọn' : '▾ Chọn bài';
}

function toggleHudToolsMenu(e) {
  if (e) e.stopPropagation();
  const panel = document.getElementById('hud-dropdown-panel');
  const caret = document.getElementById('hud-dropdown-caret');
  if (!panel) return;
  const isOpen = panel.classList.toggle('open');
  if (caret) caret.textContent = isOpen ? '▴' : '▾';
}

/* Thu gọn thanh HUD (Âm thanh, Nhạc nền, Đọc câu dẫn, Máy tính) vào 1 nút bấm duy nhất */
function simplifyHudBar() {
  const hudBar = document.querySelector('.hud-bar');
  if (!hudBar || document.getElementById('hud-tools-wrapper')) return;

  const hudStats = hudBar.querySelector('.hud-stats');
  const hudActions = hudBar.querySelector('.hud-actions');
  if (!hudStats && !hudActions) return;

  const voicePill = document.getElementById('voice-pill');
  const bgmPill = document.getElementById('bgm-pill');

  const wrapper = document.createElement('div');
  wrapper.className = 'hud-dropdown-wrapper';
  wrapper.id = 'hud-tools-wrapper';

  wrapper.innerHTML = `
    <button type="button" class="hud-dropdown-btn" onclick="toggleHudToolsMenu(event)" title="Nháy chuột để mở cài đặt Âm thanh, Nhạc nền & Công cụ">
      <span>⚙️ Công cụ &amp; Âm thanh</span>
      <span id="hud-dropdown-caret">▾</span>
    </button>
    <div class="hud-dropdown-panel" id="hud-dropdown-panel" onclick="event.stopPropagation()"></div>
  `;

  const panel = wrapper.querySelector('#hud-dropdown-panel');

  if (voicePill) panel.appendChild(voicePill);
  if (bgmPill) panel.appendChild(bgmPill);

  if (hudActions) {
    Array.from(hudActions.children).forEach(child => {
      // Giữ lại các nút công cụ (Máy tính, Sổ tay, Âm thanh) trong menu thu gọn
      panel.appendChild(child);
    });
    hudActions.innerHTML = '';
    hudActions.appendChild(wrapper);
  } else if (hudStats) {
    hudStats.appendChild(wrapper);
  }

  // Thu gọn các nút chuyển bài phụ trên màn hình Chào mừng & Bản đồ ở tất cả các bài (Bài 1 -> Bài 12)
  const welcomeScreen = document.getElementById('screen-welcome');
  if (welcomeScreen) {
    welcomeScreen.querySelectorAll('a.btn').forEach(a => a.remove());
  }
  const mapHeader = document.querySelector('#screen-map .map-header');
  if (mapHeader) {
    mapHeader.querySelectorAll('a.btn').forEach(a => a.remove());
  }
}

/* Tự động đóng các menu khi nháy chuột ra ngoài */
document.addEventListener('click', (e) => {
  const navPanel = document.getElementById('nav-dropdown-panel');
  const navWrapper = document.getElementById('nav-lesson-dropdown');
  if (navPanel && navPanel.classList.contains('open') && navWrapper && !navWrapper.contains(e.target)) {
    navPanel.classList.remove('open');
    const caret = document.getElementById('nav-dropdown-caret');
    if (caret) caret.textContent = '▾ Chọn bài';
  }

  const hudPanel = document.getElementById('hud-dropdown-panel');
  const hudWrapper = document.getElementById('hud-tools-wrapper');
  if (hudPanel && hudPanel.classList.contains('open') && hudWrapper && !hudWrapper.contains(e.target)) {
    hudPanel.classList.remove('open');
    const caret = document.getElementById('hud-dropdown-caret');
    if (caret) caret.textContent = '▾';
  }
});

window.addEventListener('DOMContentLoaded', () => {
  syncGoogmathNavBar();
  simplifyHudBar();
  VoiceNarrator.init();
});
