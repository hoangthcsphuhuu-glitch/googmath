/* ==========================================================================
   HỆ THỐNG NHÂN VẬT ĐỒNG HÀNH SGK TOÁN 6: PI (π) • VUÔNG (🟦) • TRÒN (🟠)
   Gồm: Avatar SVG minh họa, chọn bạn đồng hành, hội thoại tương tác từng ải
   ========================================================================== */

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
          <!-- Vòng hào quang tri thức -->
          <circle cx="50" cy="54" r="38" fill="url(#piGrad)" stroke="#fbbf24" stroke-width="3"/>
          <!-- Mũ cử nhân thông thái -->
          <polygon points="50,8 16,22 50,34 84,22" fill="#1e1b4b" stroke="#fbbf24" stroke-width="2"/>
          <line x1="76" y1="25" x2="82" y2="38" stroke="#fbbf24" stroke-width="2.5"/>
          <circle cx="82" cy="40" r="3.5" fill="#fbbf24"/>
          <!-- Ký hiệu số Pi nổi bật -->
          <text x="50" y="54" text-anchor="middle" fill="#fde68a" font-size="26" font-weight="900" font-family="Georgia, serif">π</text>
          <!-- Đôi mắt kính thông thái -->
          <circle cx="38" cy="64" r="6" fill="#fff" stroke="#1e1b4b" stroke-width="2"/>
          <circle cx="62" cy="64" r="6" fill="#fff" stroke="#1e1b4b" stroke-width="2"/>
          <line x1="44" y1="64" x2="56" y2="64" stroke="#1e1b4b" stroke-width="2"/>
          <circle cx="38" cy="64" r="2.5" fill="#1e1b4b"/>
          <circle cx="62" cy="64" r="2.5" fill="#1e1b4b"/>
          <!-- Nụ cười thân thiện -->
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
          <!-- Thân hình vuông bo góc -->
          <rect x="16" y="18" width="68" height="68" rx="14" fill="url(#vuongGrad)" stroke="#93c5fd" stroke-width="3"/>
          <!-- Đôi mắt sáng & kính cận -->
          <rect x="26" y="38" width="18" height="14" rx="4" fill="#fff" stroke="#0f172a" stroke-width="2.2"/>
          <rect x="56" y="38" width="18" height="14" rx="4" fill="#fff" stroke="#0f172a" stroke-width="2.2"/>
          <line x1="44" y1="45" x2="56" y2="45" stroke="#0f172a" stroke-width="2.2"/>
          <circle cx="35" cy="45" r="3" fill="#0f172a"/>
          <circle cx="65" cy="45" r="3" fill="#0f172a"/>
          <!-- Má hồng & nụ cười -->
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
          <!-- Thân hình tròn -->
          <circle cx="50" cy="54" r="36" fill="url(#tronGrad)" stroke="#fed7aa" stroke-width="3"/>
          <!-- Chiếc nơ xinh xắn trên đỉnh đầu -->
          <polygon points="50,18 34,10 38,24" fill="#f43f5e"/>
          <polygon points="50,18 66,10 62,24" fill="#f43f5e"/>
          <circle cx="50" cy="18" r="4.5" fill="#fde047"/>
          <!-- Đôi mắt to tròn long lanh -->
          <circle cx="36" cy="48" r="6.5" fill="#0f172a"/>
          <circle cx="64" cy="48" r="6.5" fill="#0f172a"/>
          <circle cx="34" cy="46" r="2.2" fill="#fff"/>
          <circle cx="62" cy="46" r="2.2" fill="#fff"/>
          <!-- Má hồng & nụ cười tươi -->
          <circle cx="25" cy="58" r="4.5" fill="#fda4af" opacity="0.8"/>
          <circle cx="75" cy="58" r="4.5" fill="#fda4af" opacity="0.8"/>
          <path d="M 37 64 Q 50 77 63 64" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>
        </svg>
      `
    }
  },

  /* Kịch bản hội thoại của Pi, Vuông, Tròn cho từng ải của Bài 11 và Bài 12 */
  dialogues: {
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
        <div class="companion-picker-title">🌟 Chọn Nhân Vật Đồng Hành Cùng Em (SGK Kết Nối Tri Thức):</div>
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
    wrapper.innerHTML = `
      <div class="mascot-dialogue-header">
        <span class="mascot-dialogue-title">💬 Góc Thảo Luận Cùng Pi (π) • Vuông (🟦) • Tròn (🟠)</span>
        <div style="display:flex; gap:0.45rem; align-items:center;">
          <span style="font-size:0.78rem; color:#fde68a;">Bạn đồng hành của em: <strong>${companion.shortName}</strong></span>
          <button class="btn btn-accent btn-sm" onclick="Mascots.toggleHint()">💡 Hỏi gợi ý từ ${companion.shortName}</button>
        </div>
      </div>

      <div class="mascot-chat-list">
        <div class="mascot-chat-item char-vuong">
          <div class="mascot-chat-avatar">${this.info.vuong.svg}</div>
          <div class="mascot-chat-content">
            <span class="mascot-speaker-badge">🟦 Bạn Vuông:</span>
            <div>“${d.vuong}”</div>
          </div>
        </div>

        <div class="mascot-chat-item char-tron">
          <div class="mascot-chat-avatar">${this.info.tron.svg}</div>
          <div class="mascot-chat-content">
            <span class="mascot-speaker-badge">🟠 Bạn Tròn:</span>
            <div>“${d.tron}”</div>
          </div>
        </div>

        <div class="mascot-chat-item char-pi">
          <div class="mascot-chat-avatar">${this.info.pi.svg}</div>
          <div class="mascot-chat-content">
            <span class="mascot-speaker-badge">🧙‍♂️ Anh Pi (π):</span>
            <div>“${d.pi}”</div>
          </div>
        </div>
      </div>

      <div class="mascot-hint-banner" id="mascot-stage-hint">
        <div style="width:40px; height:40px; flex-shrink:0;">${companion.svg}</div>
        <div><strong>Gợi ý từ ${companion.name}:</strong> ${d.hint}</div>
      </div>
    `;

    stageBody.prepend(wrapper);
  },

  toggleHint() {
    if (typeof Sound !== 'undefined') Sound.pop ? Sound.pop() : Sound.click();
    const el = document.getElementById('mascot-stage-hint');
    if (el) el.classList.toggle('show');
  }
};
