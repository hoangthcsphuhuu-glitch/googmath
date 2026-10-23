/* ==========================================================================
   TRÒ CHƠI BÀI 5: PHÉP NHÂN VÀ PHÉP CHIA SỐ TỰ NHIÊN & LUYỆN TẬP CHUNG (SGK TR. 17 - 21)
   Thiết kế bám sát KHBD Tuần 02 & Tuần 03 (Tiết 7, 8, 9) - GV: Lý Hoàng Em
   ========================================================================== */

window.Stage5_1 = createInteractiveStage({
  globalName: 'Stage5_1',
  lessonKey: 'bai5',
  stageId: 1,
  nextStageId: 2,
  storyTitle: '🌾 Trò chơi 1: Đi Mua Gạo Giúp Mẹ (Mở đầu & Vận dụng 3 - SGK tr. 17, 19)',
  storyDesc: 'Giải bài toán mở đầu: Mẹ mua một túi 10 kg gạo ngon loại 20 nghìn đồng/kg và trả tiền bằng các tờ 50 nghìn đồng!',
  steps: [
    {
      pill: '1.1. Tính tiền 10 kg gạo',
      title: 'Bài toán mở đầu (SGK tr. 17): Mẹ mua một túi 10 kg gạo ngon loại 20 nghìn đồng mỗi ki-lô-gam. Hỏi số tiền mua 10 kg gạo là bao nhiêu?',
      options: [
        '10 × 20 = 200 (nghìn đồng) = 200 000 đồng',
        '10 + 20 = 30 (nghìn đồng)',
        '150 (nghìn đồng)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Số tiền mua 10 kg gạo là phép nhân: 10 × 20 = 200 (nghìn đồng).'
    },
    {
      pill: '1.2. Vận dụng 3 (Số tờ 50k)',
      title: 'Vận dụng 3 (SGK tr. 19): Để trả đủ 200 nghìn đồng tiền gạo, mẹ phải đưa cho cô bán hàng bao nhiêu tờ tiền mệnh giá 50 nghìn đồng?',
      options: [
        '200 : 50 = 4 (tờ 50 nghìn đồng)',
        '3 (tờ 50 nghìn đồng)',
        '5 (tờ 50 nghìn đồng)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Số tờ 50 nghìn đồng cần đưa là phép chia hết: 200 : 50 = 4 (tờ)!'
    }
  ]
});

window.Stage5_2 = createInteractiveStage({
  globalName: 'Stage5_2',
  lessonKey: 'bai5',
  stageId: 2,
  nextStageId: 3,
  storyTitle: '💡 Trò chơi 2: Bộ Ba Tích Vàng & Thay Đèn LED Trường Học (Mục 1 - SGK tr. 17–18)',
  storyDesc: 'Làm chủ phép đặt tính nhân, 3 cặp tích vàng (2·5=10, 4·25=100, 8·125=1000) và giải Luyện tập 1, 2, Vận dụng 1, 2!',
  steps: [
    {
      pill: '2.1. Luyện tập 1 & VD 1',
      title: 'Luyện tập 1 & Vận dụng 1 (SGK tr. 17): a) Tính 834 · 57 và 603 · 295; b) Giá tiền in một trang giấy khổ A4 là 350 đồng, bác Thiệp in một tập tài liệu khổ A4 dày 250 trang thì hết bao nhiêu tiền?',
      options: [
        'a) 834 · 57 = 47 538;  603 · 295 = 177 885.   b) Tiền in của bác Thiệp là: 350 · 250 = 87 500 (đồng)',
        'a) 834 · 57 = 47 538;  603 · 295 = 177 885.   b) 77 500 (đồng)',
        'a) 834 · 57 = 46 538;  603 · 295 = 167 885.   b) 87 500 (đồng)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Đặt tính nhân chuẩn xác: 834 · 57 = 47 538; 603 · 295 = 177 885 và 350 · 250 = 87 500 (đồng).'
    },
    {
      pill: '2.2. Luyện tập 2 & VD 2 (Đèn LED)',
      title: 'Luyện tập 2 & Vận dụng 2 (SGK tr. 18): a) Tính nhẩm 125 · 8 001 · 8; b) Một trường học lên kế hoạch thay tất cả bóng đèn sợi đốt bằng bóng đèn LED cho 32 phòng học, mỗi phòng 8 bóng. Nếu mỗi bóng đèn LED có giá 96 000 đồng thì nhà trường phải trả bao nhiêu tiền?',
      options: [
        'a) (125 · 8) · 8 001 = 1 000 · 8 001 = 8 001 000.   b) Số bóng LED là 32 · 8 = 256 bóng; số tiền phải trả là 256 · 96 000 = 24 576 000 (đồng)',
        'a) 8 001 000.   b) 24 000 000 (đồng)',
        'a) 800 100.   b) 24 576 000 (đồng)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Nhóm tích vàng (125 · 8) = 1 000. Ở Vận dụng 2: tổng số bóng là 32 · 8 = 256 bóng, nhân với 96 000đ được 24 576 000 đồng!'
    }
  ]
});

window.Stage5_3 = createInteractiveStage({
  globalName: 'Stage5_3',
  lessonKey: 'bai5',
  stageId: 3,
  nextStageId: 4,
  storyTitle: '🚌 Trò chơi 3: Phép Chia Có Dư – Điều Phối Xe & Ghế Băng Hội Trường (Mục 2 & Bài 1.29, 1.30)',
  storyDesc: 'Nắm vững công thức a = b · q + r (0 ≤ r < b), giải Luyện tập 3 và các bài toán thực tế phải cộng thêm 1 chuyến xe / 1 ghế băng khi phép chia có dư!',
  steps: [
    {
      pill: '3.1. Luyện tập 3 (SGK tr. 19)',
      title: 'Luyện tập 3 (SGK tr. 19): Đặt tính rồi tính thương và số dư (nếu có) của: a) 945 : 45;  b) 3 121 : 51.',
      options: [
        'a) 945 : 45 = 21 (phép chia hết, dư 0);   b) 3 121 : 51 = 61 (dư 10)',
        'a) 945 : 45 = 21;   b) 3 121 : 51 = 60 (dư 61)',
        'a) 945 : 45 = 22;   b) 3 121 : 51 = 61 (dư 1)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Số dư r luôn phải nhỏ hơn số chia b (0 ≤ r < b). Ta có 3 121 = 51 · 61 + 10 nên thương là 61 và dư 10.'
    },
    {
      pill: '3.2. Bài 1.29 & 1.30 (SGK tr. 19)',
      title: 'Bài 1.29 & 1.30 (SGK tr. 19): a) Một hội trường có các ghế băng 5 chỗ ngồi. Phải có ít nhất bao nhiêu ghế băng để đủ chỗ cho 997 người ngồi? b) Cần ít nhất bao nhiêu chuyến xe 45 chỗ để chở hết 1 290 cổ động viên?',
      options: [
        'a) Vì 997 : 5 = 199 (dư 2) nên cần ít nhất 199 + 1 = 200 ghế băng;   b) Vì 1 290 : 45 = 28 (dư 30) nên cần ít nhất 28 + 1 = 29 chuyến xe',
        'a) Cần 199 ghế băng;   b) Cần 28 chuyến xe',
        'a) Cần 201 ghế băng;   b) Cần 30 chuyến xe'
      ],
      ans: 0,
      pts: 60,
      explain: 'Khi còn dư người (dư 2 người ở câu a, dư 30 người ở câu b), ta bắt buộc phải bố trí thêm 1 ghế băng / 1 chuyến xe nữa!'
    }
  ]
});

window.Stage5_4 = createInteractiveStage({
  globalName: 'Stage5_4',
  lessonKey: 'bai5',
  stageId: 4,
  nextStageId: 5,
  storyTitle: '⚡ Trò chơi 4: Đấu Trường Tính Nhẩm Phân Phối & Tìm x (Bài 1.24 – 1.27 SGK tr. 19)',
  storyDesc: 'Vận dụng tính chất phân phối của phép nhân đối với phép cộng để tính nhẩm siêu tốc và tìm số tự nhiên x!',
  steps: [
    {
      pill: '4.1. Bài 1.24 & 1.25 (Tính nhẩm)',
      title: 'Bài 1.24 & 1.25 (SGK tr. 19): Tính nhẩm: a) 125 · 101;  b) 21 · 49;  c) 25 · 11 · 4.',
      options: [
        'a) 125 · (100 + 1) = 12 625;   b) 21 · (50 - 1) = 1 029;   c) (25 · 4) · 11 = 100 · 11 = 1 100',
        'a) 12 501;   b) 1 029;   c) 1 100',
        'a) 12 625;   b) 1 050;   c) 1 100'
      ],
      ans: 0,
      pts: 50,
      explain: 'Tách 101 = 100 + 1 và 49 = 50 - 1 rồi dùng tính chất phân phối giúp tính nhẩm cực nhanh!'
    },
    {
      pill: '4.2. Bài 1.26, 1.27 & Tìm x',
      title: 'KHBD Tiết 8 (SGK tr. 19): a) Bài 1.27: Tìm thương và số dư của 1 092 : 91 và 2 059 : 17; b) Tìm số tự nhiên x biết x : 15 = 8 (dư 5).',
      options: [
        'a) 1 092 : 91 = 12 (dư 0);  2 059 : 17 = 121 (dư 2).   b) x = 15 · 8 + 5 = 125',
        'a) 1 092 : 91 = 12;  2 059 : 17 = 120 (dư 19).   b) x = 120',
        'a) 1 092 : 91 = 11;  2 059 : 17 = 121 (dư 2).   b) x = 125'
      ],
      ans: 0,
      pts: 50,
      explain: 'Áp dụng công thức số bị chia a = b · q + r: x = 15 · 8 + 5 = 120 + 5 = 125.'
    }
  ]
});

window.Stage5_5 = createInteractiveStage({
  globalName: 'Stage5_5',
  lessonKey: 'bai5',
  stageId: 5,
  nextStageId: null,
  storyTitle: '🔌 Trò chơi 5: Tiết 9 Luyện Tập Chung & Hóa Đơn Tiền Điện Bậc Thang (Bài 1.31 – 1.35 SGK tr. 21)',
  storyDesc: 'Giải trọn vẹn các bài tập trong Tiết 9 Luyện tập chung (SGK tr. 21), đặc biệt là bài toán tính tiền điện sinh hoạt bậc thang Bài 1.35!',
  steps: [
    {
      pill: '5.1. Bài 1.31 – 1.34 (SGK tr. 21)',
      title: 'Bài 1.33 & 1.34 (SGK tr. 21): a) Chữ số nào nằm ở bất kì vị trí nào trong số tự nhiên cũng có giá trị bằng 0? b) Một xe ô tô chở 30 bao gạo (50 kg/bao) và 40 bao ngô (60 kg/bao). Tổng khối lượng gạo và ngô xe chở là bao nhiêu?',
      options: [
        'a) Chữ số 0.   b) Tổng khối lượng là: 30 · 50 + 40 · 60 = 1 500 + 2 400 = 3 900 (kg)',
        'a) Chữ số 1.   b) Tổng khối lượng là 3 900 (kg)',
        'a) Chữ số 0.   b) Tổng khối lượng là 3 500 (kg)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Chữ số 0 ở bất kì hàng nào cũng có giá trị bằng 0. Khối lượng gạo và ngô là 30·50 + 40·60 = 3 900 kg.'
    },
    {
      pill: '5.2. Bài 1.35 (Tiền điện bậc thang)',
      title: 'Bài 1.35 (SGK tr. 21 - NLS 5.1TC1b): Tháng vừa qua nhà ông Khánh dùng hết 115 số điện (kWh). Biết giá điện Bậc 1 (cho 50 số đầu, từ 0–50) là 1 678 đồng/kWh; Bậc 2 (cho 50 số tiếp theo, từ 51–100) là 1 734 đồng/kWh; Bậc 3 (cho các số từ 101–200) là 2 014 đồng/kWh. Hãy tính số tiền điện ông Khánh phải trả:',
      visualHtml: `
        <div style="padding:0.75rem; background:rgba(15,23,42,0.65); border-radius:10px; font-size:0.9rem; margin:0.6rem 0;">
          ⚡ <strong>Tách 115 kWh theo 3 bậc:</strong> <code>115 = 50 (Bậc 1) + 50 (Bậc 2) + 15 (Bậc 3)</code><br/>
          🧮 <strong>Biểu thức:</strong> <code>50 · 1 678 + 50 · 1 734 + 15 · 2 014</code>
        </div>
      `,
      options: [
        '50 · 1 678 + 50 · 1 734 + 15 · 2 014 = 83 900 + 86 700 + 30 210 = 200 810 (đồng)',
        '115 · 2 014 = 231 610 (đồng)',
        '115 · 1 678 = 192 970 (đồng)'
      ],
      ans: 0,
      pts: 60,
      explain: 'Tính theo bậc thang: 50 số bậc 1 (83 900đ) + 50 số bậc 2 (86 700đ) + 15 số bậc 3 (30 210đ) = 200 810 đồng!'
    }
  ]
});

createChapter1App({
  lessonKey: 'bai5',
  shortTitle: 'Bài 5',
  certHeader: 'BÀI 5: PHÉP NHÂN, PHÉP CHIA & LUYỆN TẬP CHUNG',
  storageKey: 'toan6_bai5_game_state',
  nextLessonHref: 'bai6.html',
  nextLessonLabel: '♟️ Tiếp tục chinh phục Bài 6 (Lũy thừa với số mũ tự nhiên)',
  ranks: [
    '✖️ ĐẠI KIỆN TƯỚNG PHÉP NHÂN & PHÉP CHIA TOÁN 6',
    '🏅 CHUYÊN GIA ĐIỀU PHỐI & TÍNH NHẨM',
    '🌟 NHÀ THÁM HIỂM TOÁN HỌC KHỐI 6'
  ],
  quests: [
    {
      id: 1,
      tag: 'Hoạt động Khởi động & Vận dụng 3 (Tiết 7, 8 - SGK tr. 17, 19)',
      title: 'Trò chơi 1: Đi Mua Gạo Giúp Mẹ',
      icon: '🌾',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      musicTrack: 'stage1',
      desc: 'Tính tiền mua 10 kg gạo giá 20 nghìn đồng/kg và số tờ 50 nghìn đồng mẹ cần đưa cho cô bán hàng.'
    },
    {
      id: 2,
      tag: 'Hình thành kiến thức: Mục 1 (Tiết 7 - SGK tr. 17–18)',
      title: 'Trò chơi 2: Bộ Ba Tích Vàng & Thay Đèn LED Trường Học',
      icon: '💡',
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      musicTrack: 'stage2',
      desc: 'Giải Luyện tập 1, Vận dụng 1, Luyện tập 2 (125·8001·8) và Vận dụng 2 tính chi phí thay 256 bóng đèn LED.'
    },
    {
      id: 3,
      tag: 'Hình thành kiến thức: Mục 2 & Bài 1.29, 1.30 (Tiết 8 - SGK tr. 18–19)',
      title: 'Trò chơi 3: Phép Chia Có Dư – Điều Phối Xe & Ghế Băng',
      icon: '🚌',
      color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      musicTrack: 'stage3',
      desc: 'Tìm thương và số dư trong Luyện tập 3, xếp ghế băng 5 chỗ cho 997 người (Bài 1.29) và thuê xe 45 chỗ cho 1 290 CĐV (Bài 1.30).'
    },
    {
      id: 4,
      tag: 'Hoạt động Luyện tập (Tiết 8 - Bài 1.24 đến 1.27 SGK tr. 19)',
      title: 'Trò chơi 4: Đấu Trường Tính Nhẩm Phân Phối & Tìm x',
      icon: '⚡',
      color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      musicTrack: 'stage4',
      desc: 'Tính nhẩm 125·101, 21·49 bằng tính chất phân phối và tìm số bị chia x trong phép chia có dư.'
    },
    {
      id: 5,
      tag: 'Tiết 9: Luyện Tập Chung & NLS 5.1TC1b (Bài 1.31 – 1.35 SGK tr. 21)',
      title: 'Trò chơi 5: Hóa Đơn Tiền Điện Bậc Thang Nhà Ông Khánh',
      icon: '🔌',
      color: 'linear-gradient(135deg, #ec4899, #be185d)',
      musicTrack: 'stage5',
      desc: 'Giải Bài 1.31–1.34 và lập biểu thức tính tiền điện sinh hoạt 3 bậc thang cho 115 kWh trong Bài 1.35 (200 810 đồng).'
    }
  ],
  stages: {
    1: window.Stage5_1,
    2: window.Stage5_2,
    3: window.Stage5_3,
    4: window.Stage5_4,
    5: window.Stage5_5
  }
});
