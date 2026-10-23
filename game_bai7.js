/* ==========================================================================
   TRÒ CHƠI BÀI 7: THỨ TỰ THỰC HIỆN CÁC PHÉP TÍNH, LUYỆN TẬP CHUNG & ÔN TẬP CHƯƠNG I
   Thiết kế bám sát KHBD Tuần 03 & Tuần 04 (Tiết 12, 13, 14, 15, 16 - SGK tr. 25 - 28)
   GV: Lý Hoàng Em
   ========================================================================== */

window.Stage7_1 = createInteractiveStage({
  globalName: 'Stage7_1',
  lessonKey: 'bai7',
  stageId: 1,
  nextStageId: 2,
  storyTitle: '⚖️ Trò chơi 1: Trọng Tài Phân Xử 5 + 3 × 2 & Quy Tắc Thứ Tự (Tiết 12 - SGK tr. 25)',
  storyDesc: 'Phân xử cuộc tranh luận giữa bạn Tròn và bạn Vuông khi tính 5 + 3 × 2 và nắm vững quy tắc thứ tự thực hiện các phép tính!',
  steps: [
    {
      pill: '1.1. Tình huống 5 + 3 × 2',
      title: 'Mở đầu (SGK tr. 25): Khi tính giá trị biểu thức 5 + 3 × 2, bạn Tròn thực hiện phép cộng trước rồi nhân sau nên ra kết quả 16; còn bạn Vuông thực hiện phép nhân trước rồi cộng sau nên ra kết quả 11. Em hãy làm trọng tài phân xử xem bạn nào tính ĐÚNG?',
      visualHtml: `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem; margin:0.65rem 0;">
          <div style="background:rgba(249,115,22,0.14); border:1px solid rgba(249,115,22,0.4); border-radius:12px; padding:0.8rem;">
            <strong style="color:#fdba74;">🟠 Cách của Bạn Tròn:</strong><br/>
            <code>5 + 3 × 2 = 8 × 2 = 16</code>
          </div>
          <div style="background:rgba(59,130,246,0.14); border:1px solid rgba(59,130,246,0.4); border-radius:12px; padding:0.8rem;">
            <strong style="color:#93c5fd;">🟦 Cách của Bạn Vuông:</strong><br/>
            <code>5 + 3 × 2 = 5 + 6 = 11</code>
          </div>
        </div>
      `,
      options: [
        'Bạn Vuông tính ĐÚNG (kết quả bằng 11) vì phải thực hiện phép nhân 3 × 2 = 6 trước rồi mới cộng với 5',
        'Bạn Tròn tính ĐÚNG (kết quả bằng 16)',
        'Cả hai bạn đều đúng'
      ],
      ans: 0,
      pts: 50,
      explain: 'Trong biểu thức không có dấu ngoặc có cả phép cộng và phép nhân, ta phải thực hiện Nhân chia trước, Cộng trừ sau: 5 + 3 × 2 = 5 + 6 = 11!'
    },
    {
      pill: '1.2. Quy tắc thứ tự ưu tiên',
      title: 'Mục 1 (SGK tr. 25): Thứ tự thực hiện các phép tính đối với biểu thức KHÔNG có dấu ngoặc và biểu thức CÓ dấu ngoặc là gì?',
      options: [
        'Không ngoặc: Lũy thừa ➔ Nhân và chia ➔ Cộng và trừ.   Có ngoặc: Ngoặc tròn ( ) ➔ Ngoặc vuông [ ] ➔ Ngoặc nhọn { }',
        'Không ngoặc: Cộng và trừ ➔ Nhân và chia ➔ Lũy thừa',
        'Có ngoặc: Ngoặc nhọn { } ➔ Ngoặc vuông [ ] ➔ Ngoặc tròn ( )'
      ],
      ans: 0,
      pts: 50,
      explain: 'Quy tắc chuẩn: Lũy thừa ➔ Nhân và chia ➔ Cộng và trừ; đối với biểu thức có dấu ngoặc thì tính từ trong ra ngoài: ( ) ➔ [ ] ➔ { }.'
    }
  ]
});

window.Stage7_2 = createInteractiveStage({
  globalName: 'Stage7_2',
  lessonKey: 'bai7',
  stageId: 2,
  nextStageId: 3,
  storyTitle: '🔓 Trò chơi 2: Phá Giải Mê Cung 3 Tầng Dấu Ngoặc (Tiết 12: Luyện tập 1, Vận dụng & Bài 1.46 - SGK tr. 26)',
  storyDesc: 'Thực hành tính giá trị các biểu thức số có lũy thừa và 3 tầng dấu ngoặc ( ), [ ], { } trong SGK trang 26!',
  steps: [
    {
      pill: '2.1. Luyện tập 1 & Vận dụng',
      title: 'Luyện tập 1 & Vận dụng (SGK tr. 26): a) Tính 25 · 2³ - 3² + 125 và 2 · 3² + 5 · (2 + 3);  b) Một người đi xe đạp trong 5 giờ (3 giờ đầu đi 14 km/h, 2 giờ sau đi 9 km/h), tính tổng quãng đường đi được:',
      options: [
        'a) 25·8 - 9 + 125 = 316  và  2·9 + 5·5 = 43.   b) Tổng quãng đường: 14 · 3 + 9 · 2 = 42 + 18 = 60 (km)',
        'a) 316 và 45.   b) 60 (km)',
        'a) 216 và 43.   b) 50 (km)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Tính lũy thừa trước: 2³ = 8, 3² = 9 ➔ 25·8 - 9 + 125 = 200 - 9 + 125 = 316. Quãng đường 5 giờ là 14·3 + 9·2 = 60 km.'
    },
    {
      pill: '2.2. Bài 1.46 (SGK tr. 26)',
      title: 'Bài 1.46 (SGK tr. 26): Tính giá trị của các biểu thức: a) 235 + 78 - 142;  b) 14 + 2 · 8²;  c) {2³ + [1 + (3 - 1)²]} : 13.',
      options: [
        'a) 313 - 142 = 171;   b) 14 + 2 · 64 = 14 + 128 = 142;   c) {8 + [1 + 4]} : 13 = 13 : 13 = 1',
        'a) 171;   b) (14 + 2) · 64 = 1 024;   c) 1',
        'a) 171;   b) 142;   c) 13'
      ],
      ans: 0,
      pts: 50,
      explain: 'Ở câu b: phải tính 8² = 64 rồi nhân 2 được 128, sau đó mới cộng 14 ra 142. Ở câu c: bóc ngoặc (3-1)²=4 ➔ [1+4]=5 ➔ {8+5}=13 ➔ 13:13 = 1!'
    }
  ]
});

window.Stage7_3 = createInteractiveStage({
  globalName: 'Stage7_3',
  lessonKey: 'bai7',
  stageId: 3,
  nextStageId: 4,
  storyTitle: '🏠 Trò chơi 3: Biểu Thức Chứa Chữ & Lát Sàn Gỗ Nhà Bác Cường (Tiết 13 - SGK tr. 26)',
  storyDesc: 'Tính giá trị biểu thức chứa chữ (Luyện tập 2, Bài 1.47) và lập biểu thức giải Bài 1.48, Bài 1.49 (chi phí lát sàn gỗ căn hộ 105 m²)!',
  steps: [
    {
      pill: '3.1. LT 2 & Bài 1.47, 1.48',
      title: 'Tiết 13 (SGK tr. 26): a) Bài 1.47: Tính giá trị của biểu thức 1 + 2(a + b) - 4³ khi a = 25, b = 9;  b) Bài 1.48: Trong 8 tháng đầu năm cửa hàng bán được 1 264 chiếc ti vi, 4 tháng cuối năm trung bình mỗi tháng bán 164 chiếc. Tính số ti vi trung bình mỗi tháng trong cả năm bán được:',
      options: [
        'a) 1 + 2·(25 + 9) - 64 = 1 + 68 - 64 = 5.   b) (1 264 + 164 · 4) : 12 = 1 920 : 12 = 160 (chiếc ti vi)',
        'a) 5.   b) 150 (chiếc ti vi)',
        'a) 15.   b) 160 (chiếc ti vi)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Ở Bài 1.47: thay a=25, b=9 được 1 + 2·34 - 64 = 5. Ở Bài 1.48: tổng số ti vi cả năm là 1264 + 656 = 1920, chia cho 12 tháng được 160 chiếc/tháng.'
    },
    {
      pill: '3.2. Bài 1.49 (Lát sàn gỗ)',
      title: 'Bài 1.49 (SGK tr. 26 - NLS 5.1TC2a): Căn hộ nhà bác Cường rộng 105 m². Trừ bếp và nhà vệ sinh rộng 30 m², toàn bộ diện tích sàn còn lại (75 m²) được lát gỗ như sau: 18 m² được lát bằng gỗ loại 1 (giá 350 nghìn đồng/m²); phần còn lại (57 m²) dùng gỗ loại 2 (giá 170 nghìn đồng/m²). Công lát là 30 nghìn đồng/m² cho toàn bộ 75 m² sàn gỗ. Tổng chi phí bác Cường cần trả là:',
      visualHtml: `
        <div style="padding:0.75rem; background:rgba(15,23,42,0.65); border-radius:10px; font-size:0.9rem; margin:0.6rem 0;">
          🪵 <strong>Biểu thức tổng chi phí (nghìn đồng):</strong><br/>
          <code>350 · 18 + 170 · [(105 - 30) - 18] + 30 · (105 - 30)</code>
        </div>
      `,
      options: [
        '6 300 + 170 · 57 + 30 · 75 = 6 300 + 9 690 + 2 250 = 18 240 (nghìn đồng) = 18 240 000 đồng',
        '16 240 (nghìn đồng)',
        '18 500 (nghìn đồng)'
      ],
      ans: 0,
      pts: 60,
      explain: 'Tiền gỗ loại 1: 6 300 nghìn; tiền gỗ loại 2: 9 690 nghìn; tiền công thợ: 2 250 nghìn. Tổng cộng: 18 240 nghìn đồng!'
    }
  ]
});

window.Stage7_4 = createInteractiveStage({
  globalName: 'Stage7_4',
  lessonKey: 'bai7',
  stageId: 4,
  nextStageId: 5,
  storyTitle: '📦 Trò chơi 4: Tiết 14 Luyện Tập Chung – Bẫy Phép Chia Nhân Liền Nhau (SGK tr. 27)',
  storyDesc: 'Giải trọn vẹn các Bài tập 1.50, 1.51, 1.52 (diện tích toàn phần hình hộp chữ nhật) và 1.53 trong Tiết 14 Luyện tập chung (SGK tr. 27)!',
  steps: [
    {
      pill: '4.1. Bài 1.50 (Chia - Nhân)',
      title: 'Bài 1.50 (SGK tr. 27 - NLS 6.2TC1b): Tính giá trị của các biểu thức sau và chú ý sự khác nhau giữa câu b và câu c: a) 36 - 18 : 6;  b) 2 · 3² + 24 : 6 · 2;  c) 2 · 3² - 24 : (6 · 2).',
      options: [
        'a) 36 - 3 = 33;   b) 18 + 4 · 2 = 18 + 8 = 26 (tính 24 : 6 · 2 từ trái sang phải);   c) 18 - 24 : 12 = 18 - 2 = 16',
        'a) 33;   b) 18 + 24 : 12 = 20;   c) 16',
        'a) 3;   b) 26;   c) 16'
      ],
      ans: 0,
      pts: 50,
      explain: 'Ở câu b không có ngoặc nên cụm 24 : 6 · 2 phải thực hiện từ trái sang phải: 24 : 6 = 4 rồi 4 · 2 = 8 ➔ 18 + 8 = 26!'
    },
    {
      pill: '4.2. Bài 1.52 & 1.53 (SGK tr. 27)',
      title: 'Bài 1.52 & 1.53 (SGK tr. 27): a) Tính diện tích toàn phần của hình hộp chữ nhật S = 2(a + b)c + 2ab khi a = 5 cm, b = 4 cm, c = 3 cm;  b) Tính 9 · (8² - 15) và 75 : 3 + 6 · 9²:',
      options: [
        'a) S = 2·(5 + 4)·3 + 2·5·4 = 54 + 40 = 94 (cm²).   b) 9 · 49 = 441  và  25 + 6 · 81 = 511',
        'a) S = 54 (cm²).   b) 441 và 511',
        'a) S = 94 (cm²).   b) 441 và 486'
      ],
      ans: 0,
      pts: 50,
      explain: 'Diện tích toàn phần bằng diện tích xung quanh 2(a+b)c = 54 cm² cộng diện tích 2 đáy 2ab = 40 cm², bằng 94 cm²!'
    }
  ]
});

window.Stage7_5 = createInteractiveStage({
  globalName: 'Stage7_5',
  lessonKey: 'bai7',
  stageId: 5,
  nextStageId: null,
  storyTitle: '🎬 Trò chơi 5: Tiết 15–16 Bài Tập Cuối Chương I & Rạp Chiếu Phim 324 Ghế (SGK tr. 28)',
  storyDesc: 'Tổng hợp toàn bộ kiến thức Chương I qua các Bài tập 1.54 đến 1.59 (SGK tr. 28) và chinh phục bài toán doanh thu Rạp chiếu phim!',
  steps: [
    {
      pill: '5.1. Bài 1.57 & 1.58 (SGK tr. 28)',
      title: 'Bài 1.57 & 1.58 (SGK tr. 28): a) Tính giá trị biểu thức 21 · [(1 245 + 987) : 2³ - 15 · 12] + 21;  b) Trường có 320 học sinh đi tham quan, hỏi cần thuê ít nhất bao nhiêu xe ô tô loại 45 chỗ ngồi?',
      options: [
        'a) 21 · [2 232 : 8 - 180] + 21 = 21 · 99 + 21 = 2 100.   b) Vì 320 : 45 = 7 (dư 5) nên cần thuê ít nhất 7 + 1 = 8 xe',
        'a) 2 100.   b) Cần thuê 7 xe',
        'a) 2 079.   b) Cần thuê 8 xe'
      ],
      ans: 0,
      pts: 50,
      explain: 'Ở Bài 1.57: 21 · 99 + 21 · 1 = 21 · (99 + 1) = 21 · 100 = 2 100. Ở Bài 1.58: dư 5 học sinh nên cần thuê 7 + 1 = 8 xe!'
    },
    {
      pill: '5.2. Bài 1.59 (Rạp chiếu phim)',
      title: 'Bài 1.59 (SGK tr. 28): Một phòng chiếu phim có 18 hàng ghế, mỗi hàng có 18 ghế (tổng 18 × 18 = 324 ghế). Giá một vé xem phim là 50 000 đồng. a) Tối thứ Bảy tất cả các vé đều được bán hết thì thu được bao nhiêu tiền? b) Tối Chủ nhật còn 41 vé không bán được thì thu được bao nhiêu tiền? c) Tối thứ Hai số tiền bán vé thu được là 10 550 000 đồng, hỏi có bao nhiêu vé không bán được?',
      options: [
        'a) 324 · 50 000 = 16 200 000 đồng;   b) (324 - 41) · 50 000 = 14 150 000 đồng;   c) Đã bán 10 550 000 : 50 000 = 211 vé ➔ còn 324 - 211 = 113 vé không bán được',
        'a) 16 200 000 đồng;   b) 14 150 000 đồng;   c) 211 vé không bán được',
        'a) 15 200 000 đồng;   b) 14 150 000 đồng;   c) 113 vé không bán được'
      ],
      ans: 0,
      pts: 60,
      explain: 'Tổng số ghế là 18 · 18 = 324 ghế. Tối thứ Hai bán được 211 vé nên số vé không bán được là 324 - 211 = 113 vé!'
    }
  ]
});

createChapter1App({
  lessonKey: 'bai7',
  shortTitle: 'Bài 7 & Ôn tập Chương I',
  certHeader: 'BÀI 7: THỨ TỰ PHÉP TÍNH & TỔNG KẾT CHƯƠNG I',
  storageKey: 'toan6_bai7_game_state',
  nextLessonHref: 'bai8.html',
  nextLessonLabel: '⚖️ Bước sang Chương II - Bài 8 (Quan hệ chia hết và tính chất)',
  ranks: [
    '👑 ĐẠI KIỆN TƯỚNG CHƯƠNG I: SỐ TỰ NHIÊN TOÁN 6',
    '🏅 CHUYÊN GIA BIỂU THỨC & DẤU NGOẶC',
    '🌟 NHÀ THÁM HIỂM TOÁN HỌC KHỐI 6'
  ],
  quests: [
    {
      id: 1,
      tag: 'Tiết 12: Mở đầu & Quy tắc thứ tự (SGK tr. 25)',
      title: 'Trò chơi 1: Trọng Tài Phân Xử 5 + 3 × 2',
      icon: '⚖️',
      color: 'linear-gradient(135deg, #ef4444, #f59e0b)',
      musicTrack: 'stage1',
      desc: 'Phân xử cách tính của bạn Tròn (16) và bạn Vuông (11) và nắm vững thứ tự ưu tiên phép tính.'
    },
    {
      id: 2,
      tag: 'Tiết 12: Luyện tập 1, Vận dụng & Bài 1.46 (SGK tr. 26)',
      title: 'Trò chơi 2: Phá Giải Mê Cung 3 Tầng Dấu Ngoặc',
      icon: '🔓',
      color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      musicTrack: 'stage2',
      desc: 'Bóc tách các tầng dấu ngoặc ( ) ➔ [ ] ➔ { } trong Luyện tập 1, Vận dụng và Bài 1.46.'
    },
    {
      id: 3,
      tag: 'Tiết 13: Biểu thức chứa chữ & Bài 1.47 – 1.49 (SGK tr. 26)',
      title: 'Trò chơi 3: Kiến Trúc Sư Lát Sàn Gỗ Nhà Bác Cường',
      icon: '🏠',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      musicTrack: 'stage3',
      desc: 'Tính giá trị biểu thức chứa chữ (LT2, Bài 1.47), Bài 1.48 và lập biểu thức tính chi phí lát sàn gỗ căn hộ 105 m² (Bài 1.49).'
    },
    {
      id: 4,
      tag: 'Tiết 14: Luyện Tập Chung (Bài 1.50 – 1.53 SGK tr. 27)',
      title: 'Trò chơi 4: Thử Thách Bẫy Phép Chia – Nhân Liền Nhau',
      icon: '📦',
      color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      musicTrack: 'stage4',
      desc: 'Phân biệt 24 : 6 · 2 với 24 : (6 · 2) ở Bài 1.50 và tính diện tích toàn phần hình hộp chữ nhật ở Bài 1.52 (94 cm²).'
    },
    {
      id: 5,
      tag: 'Tiết 15–16: Bài Tập Cuối Chương I (Bài 1.54 – 1.59 SGK tr. 28)',
      title: 'Trò chơi 5: Tổng Kết Chương I & Rạp Chiếu Phim 324 Ghế',
      icon: '🎬',
      color: 'linear-gradient(135deg, #ec4899, #be185d)',
      musicTrack: 'stage5',
      desc: 'Giải Bài 1.57 (2 100), Bài 1.58 (thuê 8 xe) và tính doanh thu vé xem phim 3 ngày cuối tuần ở Bài 1.59.'
    }
  ],
  stages: {
    1: window.Stage7_1,
    2: window.Stage7_2,
    3: window.Stage7_3,
    4: window.Stage7_4,
    5: window.Stage7_5
  }
});
