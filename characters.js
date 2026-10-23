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
      .replace(/(\d+)\s*¹⁰/g, '$1 mũ 10')
      .replace(/(\d+)\s*⁸/g, '$1 mũ 8')
      .replace(/(\d+)\s*⁷/g, '$1 mũ 7')
      .replace(/(\d+)\s*⁶/g, '$1 mũ 6')
      .replace(/(\d+)\s*⁵/g, '$1 mũ 5')
      .replace(/(\d+)\s*⁴/g, '$1 mũ 4')
      .replace(/(\d+)\s*³/g, '$1 mũ 3')
      .replace(/(\d+)\s*²/g, '$1 mũ 2')
      .replace(/(\d+)\s*¹/g, '$1 mũ 1')
      .replace(/⋮/g, ' chia hết cho ')
      .replace(/∈/g, ' thuộc ')
      .replace(/ℕ/g, ' tập hợp số tự nhiên ')
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

  /* Kịch bản hội thoại của Pi, Vuông, Tròn cho Bài 10, Bài 11 và Bài 12 */
  dialogues: {
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
    VoiceNarrator.speak(`Xin chào! Mình là ${c.name}, ${c.role}. Chúng mình cùng chinh phục thử thách Toán 6 nhé!`, id);
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
    return `
      <div class="companion-picker">
        <div class="companion-picker-title">🌟 Chọn Nhân Vật Đồng Hành Cùng Em (Bấm để nghe giọng chào Tiếng Việt):</div>
        <div class="companion-grid">
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
        <span class="mascot-dialogue-title">💬 Góc Thảo Luận Cùng Pi (π) • Vuông (🟦) • Tròn (🟠)</span>
        <div style="display:flex; gap:0.45rem; align-items:center; flex-wrap:wrap;">
          <button type="button" class="tts-btn tts-sm" onclick="VoiceNarrator.readDialogue('${lessonKey}', ${stageId})">
            🔊 Đọc hội thoại 3 nhân vật
          </button>
          <button type="button" class="btn btn-accent btn-sm" onclick="Mascots.toggleHint('${safeHint}')">
            💡 Hỏi gợi ý từ ${companion.shortName}
          </button>
        </div>
      </div>

      <div class="mascot-chat-list">
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

window.addEventListener('DOMContentLoaded', () => {
  VoiceNarrator.init();
});
