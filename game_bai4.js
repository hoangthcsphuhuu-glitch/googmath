/* ==========================================================================
   TRÒ CHƠI BÀI 4: PHÉP CỘNG VÀ PHÉP TRỪ SỐ TỰ NHIÊN (SGK TOÁN 6 TRANG 15 - 16)
   Thiết kế bám sát KHBD Tuần 02 (Tiết 5, 6) - GV: Lý Hoàng Em
   ========================================================================== */

window.Stage4_1 = createInteractiveStage({
  globalName: 'Stage4_1',
  lessonKey: 'bai4',
  stageId: 1,
  nextStageId: 2,
  storyTitle: '🧺 Trò chơi 1: Giỏ Đi Chợ Của Mai (Mở đầu & Vận dụng 2 - SGK tr. 15–16)',
  storyDesc: 'Cùng bạn Mai đi chợ mua cà tím, cà chua, rau cải và tính số tiền thừa nhận lại khi đưa tờ 100 nghìn đồng!',
  steps: [
    {
      pill: '1.1. Tính tổng tiền rau củ',
      title: 'Bài toán mở đầu (SGK tr. 15): Mai đi chợ mua cà tím hết 18 nghìn đồng, cà chua hết 21 nghìn đồng và rau cải hết 30 nghìn đồng. Tổng số tiền Mai mua ba loại rau củ là bao nhiêu?',
      visualHtml: `
        <div style="display:flex; gap:0.65rem; justify-content:center; flex-wrap:wrap; margin:0.65rem 0;">
          <span class="stat-pill">🍆 Cà tím: 18 000đ</span>
          <span class="stat-pill">🍅 Cà chua: 21 000đ</span>
          <span class="stat-pill">🥬 Rau cải: 30 000đ</span>
        </div>
      `,
      options: [
        '18 + 21 + 30 = 69 (nghìn đồng) = 69 000 đồng',
        '59 (nghìn đồng)',
        '79 (nghìn đồng)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Tổng số tiền mua cà tím, cà chua và rau cải là: 18 + 21 + 30 = 69 (nghìn đồng).'
    },
    {
      pill: '1.2. Vận dụng 2 (Tiền thừa)',
      title: 'Vận dụng 2 (SGK tr. 16): Mai dùng tờ tiền 100 nghìn đồng để thanh toán 69 nghìn đồng tiền rau củ. Hỏi Mai được cô bán hàng trả lại bao nhiêu tiền?',
      options: [
        '100 - 69 = 31 (nghìn đồng) = 31 000 đồng',
        '100 - 69 = 41 (nghìn đồng)',
        '100 - 69 = 29 (nghìn đồng)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Số tiền Mai được trả lại là phép trừ: 100 - 69 = 31 (nghìn đồng) = 31 000 đồng!'
    }
  ]
});

window.Stage4_2 = createInteractiveStage({
  globalName: 'Stage4_2',
  lessonKey: 'bai4',
  stageId: 2,
  nextStageId: 3,
  storyTitle: '🌾 Trò chơi 2: Tính Chất Phép Cộng & Ghép Cặp Tròn Chục, Tròn Trăm (SGK tr. 15–16)',
  storyDesc: 'Vận dụng tính chất giao hoán và kết hợp của phép cộng để giải Vận dụng 1, Luyện tập 1 và Bài 1.22 một cách hợp lí nhất!',
  steps: [
    {
      pill: '2.1. Vận dụng 1 & LT 1',
      title: 'Vận dụng 1 & Luyện tập 1 (SGK tr. 15–16): a) Diện tích lúa Thu Đông năm 2018 của ĐBSCL tăng 14 500 ha so với năm 2017 (713 200 ha), tính diện tích năm 2018; b) Tính một cách hợp lí 117 + 68 + 23:',
      options: [
        'a) 713 200 + 14 500 = 727 700 (ha).   b) (117 + 23) + 68 = 140 + 68 = 208',
        'a) 713 200 - 14 500 = 698 700 (ha).   b) 117 + 68 + 23 = 198',
        'a) 727 700 (ha).   b) (117 + 68) + 23 = 218'
      ],
      ans: 0,
      pts: 50,
      explain: 'Ở Luyện tập 1, ta dùng tính chất giao hoán và kết hợp nhóm (117 + 23) = 140 (tròn chục) rồi cộng 68 được 208!'
    },
    {
      pill: '2.2. Bài 1.22 (Tính nhẩm)',
      title: 'Bài 1.22 (SGK tr. 16): Tính nhẩm bằng cách áp dụng tính chất kết hợp của phép cộng: a) 285 + 470 + 115 + 230; b) 571 + 216 + 129 + 124.',
      options: [
        'a) (285 + 115) + (470 + 230) = 400 + 700 = 1 100;   b) (571 + 129) + (216 + 124) = 700 + 340 = 1 040',
        'a) 1 000;   b) 1 040',
        'a) 1 100;   b) 940'
      ],
      ans: 0,
      pts: 50,
      explain: 'Ghép các cặp số có tổng tròn trăm: 285 + 115 = 400, 470 + 230 = 700; và 571 + 129 = 700, 216 + 124 = 340!'
    }
  ]
});

window.Stage4_3 = createInteractiveStage({
  globalName: 'Stage4_3',
  lessonKey: 'bai4',
  stageId: 3,
  nextStageId: 4,
  storyTitle: '➖ Trò chơi 3: Phép Trừ Số Tự Nhiên & Tìm Thành Phần Chưa Biết (Mục 2 & Bài 1.19 - SGK tr. 16)',
  storyDesc: 'Nắm vững điều kiện thực hiện phép trừ trong ℕ (a ≥ b), giải Luyện tập 2 và tìm số tự nhiên x trong Bài 1.19!',
  steps: [
    {
      pill: '3.1. Điều kiện & LT 2',
      title: 'Mục 2 & Luyện tập 2 (SGK tr. 16): Trong tập hợp số tự nhiên ℕ, phép trừ a - b thực hiện được khi nào? Kết quả của phép tính 865 279 - 45 027 là bao nhiêu?',
      options: [
        'Thực hiện được khi a ≥ b. Kết quả: 865 279 - 45 027 = 820 252',
        'Thực hiện được với mọi a, b ∈ ℕ. Kết quả: 820 252',
        'Thực hiện được khi a < b. Kết quả: 810 252'
      ],
      ans: 0,
      pts: 50,
      explain: 'Trong tập hợp ℕ, phép trừ a - b chỉ thực hiện được nếu số bị trừ lớn hơn hoặc bằng số trừ (a ≥ b). Và 865 279 - 45 027 = 820 252.'
    },
    {
      pill: '3.2. Bài 1.19 (Tìm x)',
      title: 'Bài 1.19 (SGK tr. 16): Tìm số tự nhiên x thỏa mãn: a) 7 + x = 362;  b) 25 - x = 15;  c) x - 56 = 4.',
      options: [
        'a) x = 362 - 7 = 355;   b) x = 25 - 15 = 10;   c) x = 4 + 56 = 60',
        'a) x = 369;   b) x = 10;   c) x = 52',
        'a) x = 355;   b) x = 40;   c) x = 60'
      ],
      ans: 0,
      pts: 50,
      explain: 'Muốn tìm số hạng chưa biết ta lấy tổng trừ số hạng kia (x = 355); tìm số trừ lấy số bị trừ trừ hiệu (x = 10); tìm số bị trừ lấy hiệu cộng số trừ (x = 60).'
    }
  ]
});

window.Stage4_4 = createInteractiveStage({
  globalName: 'Stage4_4',
  lessonKey: 'bai4',
  stageId: 4,
  nextStageId: 5,
  storyTitle: '⚡ Trò chơi 4: Đấu Trường Bài Tập 1.17 & 1.18 (SGK tr. 16)',
  storyDesc: 'Rèn kỹ năng tính toán chính xác và vận dụng nhanh tính chất giao hoán ở cổng trường Bài 1.18!',
  steps: [
    {
      pill: 'Bài 1.17 (SGK tr. 16)',
      title: 'Bài 1.17: Thực hiện các phép tính sau: a) 3 548 + 19 256;  b) 129 107 - 34 693.',
      options: [
        'a) 22 804;   b) 94 414',
        'a) 22 704;   b) 95 414',
        'a) 21 804;   b) 94 514'
      ],
      ans: 0,
      pts: 50,
      explain: 'Đặt tính thẳng cột các chữ số cùng hàng: 3 548 + 19 256 = 22 804 và 129 107 - 34 693 = 94 414.'
    },
    {
      pill: 'Bài 1.18 (Cổng trường)',
      title: 'Bài 1.18 (SGK tr. 16): Thay dấu "?" bằng số thích hợp trong đẳng thức trên cổng trường: ? + 2 895 = 2 895 + 6 789.',
      options: [
        '? = 6 789 (theo tính chất giao hoán của phép cộng a + b = b + a)',
        '? = 2 895',
        '? = 9 684'
      ],
      ans: 0,
      pts: 50,
      explain: 'Nhờ tính chất giao hoán của phép cộng: 6 789 + 2 895 = 2 895 + 6 789 nên dấu "?" chính là số 6 789!'
    }
  ]
});

window.Stage4_5 = createInteractiveStage({
  globalName: 'Stage4_5',
  lessonKey: 'bai4',
  stageId: 5,
  nextStageId: null,
  storyTitle: '✈️ Trò chơi 5: Thống Kê Dân Số & Nhà Ga Sân Bay Tân Sơn Nhất (Bài 1.20, 1.21 & NLS 5.1TC1a)',
  storyDesc: 'Giải các bài toán thực tiễn với số lớn trong Bài 1.20, 1.21 (SGK tr. 16) và kiểm tra kết quả bằng Máy tính cầm tay!',
  steps: [
    {
      pill: 'Bài 1.20 (Dân số VN)',
      title: 'Bài 1.20 (SGK tr. 16): Năm 2019 dân số Việt Nam là 96 462 106 người. Năm 2020 dân số Việt Nam tăng thêm 876 473 người so với năm 2019. Hãy tính dân số Việt Nam năm 2020:',
      options: [
        '96 462 106 + 876 473 = 97 338 579 (người)',
        '96 462 106 - 876 473 = 95 585 633 (người)',
        '97 238 579 (người)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Dân số Việt Nam năm 2020 là: 96 462 106 + 876 473 = 97 338 579 (người).'
    },
    {
      pill: 'Bài 1.21 (Sân bay TSN)',
      title: 'Bài 1.21 (SGK tr. 16): Nhà ga số 1 và nhà ga số 2 của sân bay Tân Sơn Nhất có thể tiếp nhận tương ứng khoảng 6 526 300 và 3 514 500 lượt hành khách mỗi năm. Khi đưa vào sử dụng nhà ga số 3 thì tổng cộng cả ba nhà ga có thể tiếp nhận khoảng 22 851 200 lượt hành khách mỗi năm. Hãy tính số lượt hành khách mà nhà ga số 3 có thể tiếp nhận mỗi năm:',
      options: [
        '22 851 200 - (6 526 300 + 3 514 500) = 22 851 200 - 10 040 800 = 12 810 400 (lượt hành khách)',
        '10 040 800 (lượt hành khách)',
        '16 324 900 (lượt hành khách)'
      ],
      ans: 0,
      pts: 60,
      explain: 'Tổng công suất nhà ga số 1 và số 2 là 6 526 300 + 3 514 500 = 10 040 800. Vậy nhà ga số 3 tiếp nhận: 22 851 200 - 10 040 800 = 12 810 400 (lượt hành khách)!'
    }
  ]
});

createChapter1App({
  lessonKey: 'bai4',
  shortTitle: 'Bài 4',
  certHeader: 'BÀI 4: PHÉP CỘNG & PHÉP TRỪ SỐ TỰ NHIÊN',
  storageKey: 'toan6_bai4_game_state',
  nextLessonHref: 'bai5.html',
  nextLessonLabel: '✖️ Tiếp tục chinh phục Bài 5 (Phép nhân và phép chia số tự nhiên)',
  ranks: [
    '➕ ĐẠI KIỆN TƯỚNG PHÉP CỘNG & PHÉP TRỪ TOÁN 6',
    '🏅 CHUYÊN GIA TÍNH NHẨM HỢP LÍ',
    '🌟 NHÀ THÁM HIỂM TOÁN HỌC KHỐI 6'
  ],
  quests: [
    {
      id: 1,
      tag: 'Hoạt động Khởi động & Vận dụng 2 (SGK tr. 15–16)',
      title: 'Trò chơi 1: Giỏ Đi Chợ Của Mai',
      icon: '🧺',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      musicTrack: 'stage1',
      desc: 'Tính tổng tiền mua cà tím (18k), cà chua (21k), rau cải (30k) và số tiền thừa nhận lại khi đưa tờ 100 nghìn đồng.'
    },
    {
      id: 2,
      tag: 'Hình thành kiến thức: Mục 1 & Bài 1.22 (SGK tr. 15–16)',
      title: 'Trò chơi 2: Ghép Cặp Tròn Chục – Tròn Trăm',
      icon: '🌾',
      color: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
      musicTrack: 'stage2',
      desc: 'Giải Vận dụng 1 (diện tích lúa ĐBSCL), Luyện tập 1 (117 + 68 + 23) và Bài 1.22 bằng tính chất giao hoán, kết hợp.'
    },
    {
      id: 3,
      tag: 'Hình thành kiến thức: Mục 2 & Bài 1.19 (SGK tr. 16)',
      title: 'Trò chơi 3: Phép Trừ & Tìm Thành Phần Chưa Biết',
      icon: '➖',
      color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      musicTrack: 'stage3',
      desc: 'Nắm vững điều kiện a ≥ b của phép trừ trong ℕ, giải Luyện tập 2 và tìm số tự nhiên x trong Bài 1.19.'
    },
    {
      id: 4,
      tag: 'Hoạt động Luyện tập (Bài 1.17 & 1.18 SGK tr. 16)',
      title: 'Trò chơi 4: Đấu Trường Bài Tập 1.17 & 1.18',
      icon: '⚡',
      color: 'linear-gradient(135deg, #f59e0b, #ea580c)',
      musicTrack: 'stage4',
      desc: 'Thực hiện phép cộng trừ số lớn ở Bài 1.17 và giải nhanh đẳng thức trên cổng trường Bài 1.18 (? = 6 789).'
    },
    {
      id: 5,
      tag: 'Hoạt động Vận dụng & NLS 5.1TC1a (Bài 1.20, 1.21 SGK tr. 16)',
      title: 'Trò chơi 5: Thống Kê Dân Số & Nhà Ga T3 Tân Sơn Nhất',
      icon: '✈️',
      color: 'linear-gradient(135deg, #ec4899, #be185d)',
      musicTrack: 'stage5',
      desc: 'Tính dân số Việt Nam năm 2020 (Bài 1.20) và công suất nhà ga số 3 sân bay Tân Sơn Nhất (Bài 1.21: 12 810 400 lượt khách).'
    }
  ],
  stages: {
    1: window.Stage4_1,
    2: window.Stage4_2,
    3: window.Stage4_3,
    4: window.Stage4_4,
    5: window.Stage4_5
  }
});
