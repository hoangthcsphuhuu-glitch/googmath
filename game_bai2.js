/* ==========================================================================
   TRÒ CHƠI BÀI 2: CÁCH GHI SỐ TỰ NHIÊN (SGK TOÁN 6 TRANG 9 - 12)
   Thiết kế bám sát KHBD Tuần 01 (Tiết 2, 3) - GV: Lý Hoàng Em
   ========================================================================== */

window.Stage2_1 = createInteractiveStage({
  globalName: 'Stage2_1',
  lessonKey: 'bai2',
  stageId: 1,
  nextStageId: 2,
  storyTitle: '🏛️ Trò chơi 1: Hệ Thập Phân & Ghép Số Từ 0; 1; 2 (Mục 1a - SGK tr. 9)',
  storyDesc: 'Tìm hiểu quy ước viết số tự nhiên trong hệ thập phân, cách tách lớp 3 chữ số (Bảng 1) và lập các số có 3 chữ số khác nhau từ {0; 1; 2}!',
  steps: [
    {
      pill: '1.1. Tách lớp & Hàng',
      title: 'Bảng 1 (SGK tr. 9): Với số tự nhiên lớn 221 707 263 598, người ta viết tách riêng từng lớp (mỗi lớp 3 chữ số từ phải sang trái). Thứ tự các lớp từ phải sang trái là gì?',
      options: [
        'Lớp đơn vị (598) ➔ Lớp nghìn (263) ➔ Lớp triệu (707) ➔ Lớp tỉ (221)',
        'Lớp tỉ ➔ Lớp triệu ➔ Lớp nghìn ➔ Lớp đơn vị',
        'Mỗi lớp gồm 4 chữ số'
      ],
      ans: 0,
      pts: 50,
      explain: 'Để dễ đọc, với các số có từ 4 chữ số trở lên, ta viết tách riêng từng lớp, mỗi lớp 3 chữ số kể từ phải sang trái: Đơn vị, Nghìn, Triệu, Tỉ.'
    },
    {
      pill: '1.2. Câu hỏi ? (SGK tr. 9)',
      title: 'Câu hỏi ? (SGK tr. 9): Dùng cả ba chữ số 0; 1; 2, hãy bấm chọn TẤT CẢ các số tự nhiên có 3 chữ số khác nhau viết được:',
      chips: ['012', '102', '120', '201', '210'],
      requiredChips: ['102', '120', '201', '210'],
      options: [
        'Viết được 4 số là: 102; 120; 201; 210 (vì chữ số đầu tiên bên trái phải khác 0)',
        'Viết được 6 số kể cả 012 và 021',
        'Chỉ viết được 2 số là 120 và 210'
      ],
      ans: 0,
      pts: 50,
      explain: 'Theo quy ước, chữ số đầu tiên từ trái sang phải (hàng trăm) phải khác 0, nên ta lập được 4 số: 102; 120; 201; 210.'
    }
  ]
});

window.Stage2_2 = createInteractiveStage({
  globalName: 'Stage2_2',
  lessonKey: 'bai2',
  stageId: 2,
  nextStageId: 3,
  storyTitle: '💵 Trò chơi 2: Giá Trị Chữ Số & Giúp Bác Hoa Trả Tiền (Mục 1b - SGK tr. 10)',
  storyDesc: 'Biểu diễn mỗi số tự nhiên thành tổng giá trị các chữ số của nó (HĐ1, HĐ2, Luyện tập) và giải bài toán Vận dụng bác Hoa trả tiền 492 nghìn đồng!',
  steps: [
    {
      pill: '2.1. Luyện tập (SGK tr. 10)',
      title: 'HĐ1, HĐ2 & Luyện tập (SGK tr. 10): Biểu diễn số 34 604 thành tổng giá trị các chữ số của nó, ta được:',
      options: [
        '34 604 = (3 × 10 000) + (4 × 1 000) + (6 × 100) + 4',
        '34 604 = (3 × 1 000) + (4 × 100) + (6 × 10) + 4',
        '34 604 = 3 + 4 + 6 + 0 + 4'
      ],
      ans: 0,
      pts: 50,
      explain: 'Trong số 34 604: chữ số 3 ở hàng chục nghìn, 4 ở hàng nghìn, 6 ở hàng trăm, 0 ở hàng chục và 4 ở hàng đơn vị.'
    },
    {
      pill: '2.2. Vận dụng (Bác Hoa)',
      title: 'Vận dụng (SGK tr. 10): Bác Hoa đi chợ mua đồ hết 492 nghìn đồng. Bác chỉ mang theo các loại tiền mệnh giá 100 nghìn đồng, 10 nghìn đồng và 1 nghìn đồng. Để trả vừa đủ tiền mà không cần trả lại, bác Hoa cần đưa mỗi loại bao nhiêu tờ?',
      visualHtml: `
        <div style="padding:0.75rem; background:rgba(16,185,129,0.14); border:1px solid rgba(16,185,129,0.4); border-radius:12px; margin:0.6rem 0;">
          💵 <strong>Phân tích 492:</strong> <code>492 = (4 × 100) + (9 × 10) + 2</code>
        </div>
      `,
      options: [
        '4 tờ 100 nghìn đồng, 9 tờ 10 nghìn đồng và 2 tờ 1 nghìn đồng',
        '4 tờ 100 nghìn đồng, 2 tờ 10 nghìn đồng và 9 tờ 1 nghìn đồng',
        '5 tờ 100 nghìn đồng'
      ],
      ans: 0,
      pts: 50,
      explain: 'Vì 492 = (4 × 100) + (9 × 10) + 2 nên bác Hoa cần đưa 4 tờ 100 nghìn đồng, 9 tờ 10 nghìn đồng và 2 tờ 1 nghìn đồng!'
    }
  ]
});

window.Stage2_3 = createInteractiveStage({
  globalName: 'Stage2_3',
  lessonKey: 'bai2',
  stageId: 3,
  nextStageId: 4,
  storyTitle: '🕰️ Trò chơi 3: Đồng Hồ Số La Mã & Thử Thách 7 Que Tính (Mục 2 - SGK tr. 11)',
  storyDesc: 'Đọc và viết các số La Mã không quá 30 từ 5 thành phần I (1), V (5), X (10), IV (4), IX (9) và giải Thử thách nhỏ xếp 7 que tính!',
  steps: [
    {
      pill: '3.1. Câu hỏi ? (SGK tr. 11)',
      title: 'Câu hỏi ? (SGK tr. 11): a) Viết các số 14 và 27 bằng số La Mã; b) Đọc các số La Mã XVI và XXII:',
      options: [
        'a) 14 viết là XIV; 27 viết là XXVII.   b) XVI là 16 (mười sáu); XXII là 22 (hai mươi hai)',
        'a) 14 viết là XIIII; 27 viết là XXVII.   b) XVI là 14; XXII là 20',
        'a) 14 viết là XVI; 27 viết là XXVII'
      ],
      ans: 0,
      pts: 50,
      explain: '14 = 10 + 4 = XIV; 27 = 20 + 7 = XXVII; XVI = 10 + 6 = 16; XXII = 20 + 2 = 22.'
    },
    {
      pill: '3.2. Thử thách 7 que tính',
      title: 'Thử thách nhỏ (SGK tr. 11): Sử dụng ĐÚNG 7 que tính (biết I tốn 1 que, V tốn 2 que, X tốn 2 que), hãy bấm chọn TẤT CẢ 5 số La Mã (không quá 30) có thể xếp được:',
      chips: ['XVIII (18)', 'XXIII (23)', 'XXIV (24)', 'XXVI (26)', 'XXIX (29)', 'XV (15)'],
      requiredChips: ['XVIII (18)', 'XXIII (23)', 'XXIV (24)', 'XXVI (26)', 'XXIX (29)'],
      options: [
        'Xếp được 5 số La Mã không quá 30 là: XVIII (18), XXIII (23), XXIV (24), XXVI (26) và XXIX (29)',
        'Chỉ xếp được XVIII (18) và XXIII (23)',
        'Xếp được XV (15) vì XV tốn 7 que tính'
      ],
      ans: 0,
      pts: 60,
      explain: 'Đếm số que tính: X (2 que), V (2 que), I (1 que) ➔ XVIII (2+2+3=7), XXIII (2+2+3=7), XXIV (2+2+1+2=7), XXVI (2+2+2+1=7), XXIX (2+2+1+2=7)!'
    }
  ]
});

window.Stage2_4 = createInteractiveStage({
  globalName: 'Stage2_4',
  lessonKey: 'bai2',
  stageId: 4,
  nextStageId: 5,
  storyTitle: '⚡ Trò chơi 4: Đấu Trường Bài Tập 1.6 – 1.9 (SGK tr. 12)',
  storyDesc: 'Xác định giá trị chữ số theo vị trí (Bài 1.6, 1.7) và đọc viết số La Mã (Bài 1.8, 1.9)!',
  steps: [
    {
      pill: 'Bài 1.6 & 1.7',
      title: 'Bài 1.6 & 1.7 (SGK tr. 12): Cho biết giá trị của chữ số 7 trong các số: 27 501; 106 712; 7 110 385; 2 915 404 267 và hàng của chữ số 4 trong biểu thức (4 × 100) + (5 × 10) + 8:',
      options: [
        'Giá trị chữ số 7 lần lượt là: 7 000; 700; 7 000 000; 7. Chữ số 4 trong (4 × 100) đứng ở hàng trăm (giá trị 400)',
        'Giá trị chữ số 7 trong mọi số đều bằng 7',
        'Chữ số 4 trong (4 × 100) đứng ở hàng nghìn'
      ],
      ans: 0,
      pts: 50,
      explain: 'Giá trị của mỗi chữ số phụ thuộc vào vị trí (hàng) của nó trong số tự nhiên đó.'
    },
    {
      pill: 'Bài 1.8 & 1.9',
      title: 'Bài 1.8 & 1.9 (SGK tr. 12): Đọc các số La Mã XIV, XVI, XXIII và viết các số 18, 25 bằng số La Mã:',
      options: [
        'Bài 1.8: XIV = 14, XVI = 16, XXIII = 23.   Bài 1.9: 18 viết là XVIII; 25 viết là XXV',
        'Bài 1.8: XIV = 16, XVI = 14, XXIII = 23.   Bài 1.9: 18 viết là IIXX; 25 viết là XXV',
        'Bài 1.8: XIV = 14, XVI = 16, XXIII = 32'
      ],
      ans: 0,
      pts: 50,
      explain: '18 = 10 + 5 + 3 = XVIII; 25 = 20 + 5 = XXV.'
    }
  ]
});

window.Stage2_5 = createInteractiveStage({
  globalName: 'Stage2_5',
  lessonKey: 'bai2',
  stageId: 5,
  nextStageId: null,
  storyTitle: '🍬 Trò chơi 5: Mật Mã Số Xen Kẽ & 9 990 Cái Kẹo (Bài 1.10 – 1.12 SGK tr. 12)',
  storyDesc: 'Giải trọn vẹn các bài toán vận dụng Bài 1.10, 1.11 và 1.12 (SGK tr. 12)!',
  steps: [
    {
      pill: 'Bài 1.10 & 1.11',
      title: 'Bài 1.10 & 1.11 (SGK tr. 12): a) Viết số tự nhiên có 6 chữ số gồm ba chữ số 0 và ba chữ số 9 nằm xen kẽ nhau; b) Dùng ba chữ số 0, 3, 5 viết số tự nhiên có 3 chữ số khác nhau mà chữ số 5 có giá trị bằng 50:',
      options: [
        'Bài 1.10: Số cần tìm là 909 090 (vì chữ số đầu tiên phải khác 0).   Bài 1.11: Số cần tìm là 350',
        'Bài 1.10: Số 090 909.   Bài 1.11: Số 053',
        'Bài 1.10: Số 999 000.   Bài 1.11: Số 530'
      ],
      ans: 0,
      pts: 50,
      explain: 'Ở Bài 1.11: chữ số 5 có giá trị 50 nên đứng ở hàng chục, chữ số hàng trăm khác 0 nên là 3, hàng đơn vị là 0 ➔ số 350!'
    },
    {
      pill: 'Bài 1.12 (Mua kẹo)',
      title: 'Bài 1.12 (SGK tr. 12): Trong một cửa hàng bánh kẹo, người ta đóng gói kẹo thành các loại: mỗi gói có 10 cái kẹo; mỗi hộp có 10 gói (100 cái); mỗi thùng có 10 hộp (1 000 cái). Một người mua 9 thùng, 9 hộp và 9 gói kẹo. Hỏi người đó đã mua tất cả bao nhiêu cái kẹo?',
      options: [
        '(9 × 1 000) + (9 × 100) + (9 × 10) = 9 990 (cái kẹo)',
        '999 (cái kẹo)',
        '9 099 (cái kẹo)'
      ],
      ans: 0,
      pts: 60,
      explain: '9 thùng có 9 × 1 000 = 9 000 cái; 9 hộp có 9 × 100 = 900 cái; 9 gói có 9 × 10 = 90 cái. Tổng cộng: 9 990 cái kẹo!'
    }
  ]
});

createChapter1App({
  lessonKey: 'bai2',
  shortTitle: 'Bài 2',
  certHeader: 'BÀI 2: CÁCH GHI SỐ TỰ NHIÊN (CHƯƠNG I TOÁN 6)',
  storageKey: 'toan6_bai2_game_state',
  nextLessonHref: 'bai3.html',
  nextLessonLabel: '📏 Tiếp tục chinh phục Bài 3 (Thứ tự trong tập hợp số tự nhiên)',
  ranks: [
    '🏛️ ĐẠI KIỆN TƯỚNG HỆ THẬP PHÂN & SỐ LA MÃ',
    '🏅 CHUYÊN GIA CẤU TẠO SỐ TOÁN 6',
    '🌟 NHÀ THÁM HIỂM TOÁN HỌC KHỐI 6'
  ],
  quests: [
    {
      id: 1,
      tag: 'Hoạt động Khởi động & Mục 1a (Tiết 2 - SGK tr. 9)',
      title: 'Trò chơi 1: Hệ Thập Phân & Ghép Số Từ 0; 1; 2',
      icon: '🏛️',
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      musicTrack: 'stage1',
      desc: 'Khám phá cách tách lớp 3 chữ số (Đơn vị, Nghìn, Triệu, Tỉ) và lập các số có 3 chữ số khác nhau từ {0; 1; 2}.'
    },
    {
      id: 2,
      tag: 'Hình thành kiến thức: Mục 1b (Tiết 2 - SGK tr. 10)',
      title: 'Trò chơi 2: Giá Trị Chữ Số & Giúp Bác Hoa Trả Tiền',
      icon: '💵',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      musicTrack: 'stage2',
      desc: 'Biểu diễn số 32 019, 34 604 thành tổng giá trị các chữ số và giúp bác Hoa trả 492 nghìn đồng bằng các tờ 100k, 10k, 1k.'
    },
    {
      id: 3,
      tag: 'Hình thành kiến thức: Mục 2 (Đầu Tiết 3 - SGK tr. 11)',
      title: 'Trò chơi 3: Đồng Hồ Số La Mã & Thử Thách 7 Que Tính',
      icon: '🕰️',
      color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      musicTrack: 'stage3',
      desc: 'Đọc viết số La Mã không quá 30 và giải Thử thách nhỏ xếp 7 que tính thành các số La Mã XVIII, XXIII, XXIV, XXVI, XXIX.'
    },
    {
      id: 4,
      tag: 'Hoạt động Luyện tập (Tiết 3 - Bài 1.6 đến 1.9 SGK tr. 12)',
      title: 'Trò chơi 4: Đấu Trường Bài Tập 1.6 – 1.9',
      icon: '⚡',
      color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      musicTrack: 'stage4',
      desc: 'Xác định giá trị của chữ số 7 trong 4 số lớn (Bài 1.6), hàng của chữ số 4 (Bài 1.7) và đọc viết số La Mã (Bài 1.8, 1.9).'
    },
    {
      id: 5,
      tag: 'Hoạt động Vận dụng (Tiết 3 - Bài 1.10 đến 1.12 SGK tr. 12)',
      title: 'Trò chơi 5: Mật Mã Số Xen Kẽ & 9 990 Cái Kẹo',
      icon: '🍬',
      color: 'linear-gradient(135deg, #ec4899, #be185d)',
      musicTrack: 'stage5',
      desc: 'Tìm số có 6 chữ số xen kẽ 909 090 (Bài 1.10), số 350 (Bài 1.11) và tính tổng số kẹo trong 9 thùng, 9 hộp, 9 gói (Bài 1.12).'
    }
  ],
  stages: {
    1: window.Stage2_1,
    2: window.Stage2_2,
    3: window.Stage2_3,
    4: window.Stage2_4,
    5: window.Stage2_5
  }
});
