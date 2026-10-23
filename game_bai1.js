/* ==========================================================================
   TRÒ CHƠI BÀI 1: TẬP HỢP (SGK TOÁN 6 TRANG 5 - 8)
   Thiết kế bám sát KHBD Tuần 01 (Tiết 1) - GV: Lý Hoàng Em
   ========================================================================== */

window.Stage1_1 = createInteractiveStage({
  globalName: 'Stage1_1',
  lessonKey: 'bai1',
  stageId: 1,
  nextStageId: 2,
  storyTitle: '🌹 Trò chơi 1: Khám Phá Tập Hợp Quanh Ta (Khởi động & Hình 1.1, 1.2, 1.3 - SGK tr. 5–6)',
  storyDesc: 'Quan sát các hình ảnh gần gũi trong đời sống (bông hồng trong lọ, 3 chú cá vàng trong bình) và vòng tròn tập hợp M ở Hình 1.3 để nhận biết Tập hợp và các Phần tử của nó!',
  steps: [
    {
      pill: '1.1. Hình 1.1 & 1.2',
      title: 'Khởi động (SGK tr. 5): Quan sát Hình 1.1 (các bông hồng trong lọ hoa) và Hình 1.2 (ba con cá vàng trong bình). Mỗi nhóm đối tượng như vậy trong Toán học được gọi là gì?',
      visualHtml: `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap:0.75rem; margin:0.65rem 0;">
          <div style="background:rgba(236,72,153,0.14); border:1px solid rgba(236,72,153,0.4); border-radius:12px; padding:0.8rem; text-align:center;">
            <div style="font-size:1.6rem;">🌹 🌹 🌹 🌹 🌹</div>
            <div style="font-weight:700; color:#fbcfe8;">Hình 1.1: Các bông hồng trong lọ</div>
          </div>
          <div style="background:rgba(245,158,11,0.14); border:1px solid rgba(245,158,11,0.4); border-radius:12px; padding:0.8rem; text-align:center;">
            <div style="font-size:1.6rem;">🐠 🐠 🐠</div>
            <div style="font-weight:700; color:#fde68a;">Hình 1.2: Ba con cá vàng trong bình</div>
          </div>
        </div>
      `,
      options: [
        'Mỗi nhóm đối tượng nhất định đó được gọi là một Tập hợp, và mỗi đối tượng trong đó gọi là một Phần tử của tập hợp',
        'Chỉ những con số mới tạo thành tập hợp, còn bông hoa và cá vàng không phải là tập hợp',
        'Mỗi bông hoa gọi là một tập hợp'
      ],
      ans: 0,
      pts: 50,
      explain: 'Một tập hợp (gọi tắt là tập) bao gồm những đối tượng nhất định. Các đối tượng ấy được gọi là những phần tử của tập hợp.'
    },
    {
      pill: '1.2. Hình 1.3 (Tập M)',
      title: 'Hoạt động 1 (Hình 1.3 - SGK tr. 6): Trong vòng tròn tập hợp M có các số 4, 1, 9, 8 (số 7 nằm ngoài vòng tròn). Hãy bấm chọn TẤT CẢ các phần tử của tập hợp M rồi chọn kết luận đúng:',
      chips: ['1', '4', '7', '8', '9'],
      requiredChips: ['1', '4', '8', '9'],
      options: [
        'Tập hợp M gồm các phần tử 1; 4; 8; 9 và số 7 KHÔNG phải là phần tử của tập hợp M',
        'Số 7 cũng là phần tử của tập hợp M',
        'Tập hợp M chỉ có 3 phần tử'
      ],
      ans: 0,
      pts: 50,
      explain: 'Với tập M = {4; 1; 9; 8}, các phần tử của M là 1, 4, 8, 9; còn số 7 nằm ngoài nên không là phần tử của M!'
    }
  ]
});

window.Stage1_2 = createInteractiveStage({
  globalName: 'Stage1_2',
  lessonKey: 'bai1',
  stageId: 2,
  nextStageId: 3,
  storyTitle: '🏹 Trò chơi 2: Bắn Cung Kí Hiệu ∈, ∉ & Tập Hợp ℕ, ℕ* (SGK tr. 6–7)',
  storyDesc: 'Sử dụng chính xác kí hiệu ∈ (thuộc), ∉ (không thuộc) và phân biệt tập hợp các số tự nhiên ℕ với tập hợp các số tự nhiên khác 0 là ℕ*!',
  steps: [
    {
      pill: '2.1. Kí hiệu ∈ và ∉',
      title: 'Ví dụ & Luyện tập 1 (SGK tr. 6): Cho tập hợp B gồm các bạn tổ trưởng trong lớp (An là tổ trưởng tổ 1, Bình không phải là tổ trưởng) và tập hợp M = {4; 1; 9; 8}. Cách viết kí hiệu nào sau đây là ĐÚNG?',
      options: [
        '4 ∈ M;  1 ∈ M;  7 ∉ M;  An ∈ B và Bình ∉ B',
        '4 ∉ M;  7 ∈ M;  An ∉ B và Bình ∈ B',
        '4 ∈ M;  7 ∈ M;  An ∈ B'
      ],
      ans: 0,
      pts: 50,
      explain: 'x là phần tử của A thì viết x ∈ A (x thuộc A); y không là phần tử của A thì viết y ∉ A (y không thuộc A).'
    },
    {
      pill: '2.2. Tập hợp ℕ và ℕ*',
      title: 'Mục Chú ý & Luyện tập 2 (SGK tr. 7): Tập hợp các số tự nhiên ℕ = {0; 1; 2; 3; ...} và ℕ* = {1; 2; 3; ...}. Khi viết tập hợp A các số tự nhiên nhỏ hơn 5 (thuộc ℕ) và tập hợp B các số tự nhiên khác 0 nhỏ hơn 5 (thuộc ℕ*), ta được:',
      options: [
        'A = {0; 1; 2; 3; 4}  và  B = {1; 2; 3; 4}',
        'A = {1; 2; 3; 4; 5}  và  B = {0; 1; 2; 3; 4}',
        'A = {0; 1; 2; 3; 4; 5}  và  B = {1; 2; 3; 4; 5}'
      ],
      ans: 0,
      pts: 50,
      explain: 'Tập hợp ℕ có chứa số 0 nên A = {0; 1; 2; 3; 4}. Tập hợp ℕ* gồm các số tự nhiên khác 0 nên B = {1; 2; 3; 4}.'
    }
  ]
});

window.Stage1_3 = createInteractiveStage({
  globalName: 'Stage1_3',
  lessonKey: 'bai1',
  stageId: 3,
  nextStageId: 4,
  storyTitle: '📝 Trò chơi 3: Hai Cách Mô Tả Tập Hợp & Bắt Lỗi Chữ Cái NHA TRANG (SGK tr. 6–7)',
  storyDesc: 'Rèn kỹ năng mô tả tập hợp bằng Cách 1 (liệt kê các phần tử, mỗi phần tử chỉ viết 1 lần) và Cách 2 (nêu dấu hiệu đặc trưng)!',
  steps: [
    {
      pill: '3.1. Chữ cái NHA TRANG',
      title: 'Câu hỏi ? (SGK tr. 7): Khi mô tả tập hợp L các chữ cái trong từ NHA TRANG bằng cách liệt kê các phần tử, bạn Nam viết: L = {N; H; A; T; R; A; N; G}. Hãy bấm chọn các chữ cái ĐÚNG (không trùng lặp) của tập L:',
      chips: ['N', 'H', 'A', 'T', 'R', 'G'],
      requiredChips: ['N', 'H', 'A', 'T', 'R', 'G'],
      options: [
        'Bạn Nam viết SAI vì chữ N và chữ A bị viết lặp lại. Viết đúng là: L = {N; H; A; T; R; G}',
        'Bạn Nam viết đúng vì từ NHA TRANG có 8 chữ cái',
        'Phải viết trong dấu ngoặc tròn (N; H; A; T; R; G)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Khi liệt kê các phần tử của tập hợp, mỗi phần tử chỉ được viết MỘT LẦN trong dấu ngoặc nhọn { }!'
    },
    {
      pill: '3.2. Luyện tập 3 (SGK tr. 7)',
      title: 'Luyện tập 3 (SGK tr. 7): Cho tập hợp M = {x ∈ ℕ | x lớn hơn 6 và nhỏ hơn 10}. Hãy chọn câu trả lời đúng cho cả câu a và câu b:',
      options: [
        'a) 5 ∉ M;  9 ∈ M.   b) Cách 1: M = {7; 8; 9};  Cách 2: M = {x ∈ ℕ | 6 < x < 10}',
        'a) 5 ∈ M;  9 ∈ M.   b) Cách 1: M = {6; 7; 8; 9; 10}',
        'a) 5 ∉ M;  9 ∉ M.   b) Cách 1: M = {7; 8}'
      ],
      ans: 0,
      pts: 50,
      explain: 'Các số tự nhiên lớn hơn 6 và nhỏ hơn 10 là 7, 8, 9 nên 5 ∉ M, 9 ∈ M và M = {7; 8; 9}.'
    }
  ]
});

window.Stage1_4 = createInteractiveStage({
  globalName: 'Stage1_4',
  lessonKey: 'bai1',
  stageId: 4,
  nextStageId: 5,
  storyTitle: '⚡ Trò chơi 4: Đấu Trường Bài Tập 1.1 – 1.3 (SGK tr. 7)',
  storyDesc: 'Vận dụng kiến thức về tập hợp để giải trọn vẹn các Bài tập 1.1, 1.2 và 1.3 trong SGK Toán 6 trang 7!',
  steps: [
    {
      pill: 'Bài 1.1 (SGK tr. 7)',
      title: 'Bài 1.1: Cho hai tập hợp A = {a; b; c; x; y} và B = {b; d; y; t; u; v}. Dùng kí hiệu ∈ hoặc ∉ để trả lời: Phần tử nào thuộc A nhưng không thuộc B? Phần tử nào thuộc cả A và B?',
      options: [
        'a ∈ A, a ∉ B;   b ∈ A, b ∈ B;   x ∈ A, x ∉ B;   u ∉ A, u ∈ B',
        'a ∈ A, a ∈ B;   b ∉ A, b ∈ B;   u ∈ A, u ∈ B',
        'x ∉ A, x ∈ B;   u ∈ A, u ∉ B'
      ],
      ans: 0,
      pts: 40,
      explain: 'Đối chiếu từng phần tử trong hai tập hợp A và B: b và y có mặt ở cả hai tập hợp; a, c, x chỉ thuộc A; d, t, u, v chỉ thuộc B.'
    },
    {
      pill: 'Bài 1.2 (SGK tr. 7)',
      title: 'Bài 1.2: Cho tập hợp U = {x ∈ ℕ | x chia hết cho 3}. Trong các số 3; 5; 6; 0; 7, hãy bấm chọn TẤT CẢ các số thuộc tập hợp U:',
      chips: ['3', '5', '6', '0', '7'],
      requiredChips: ['3', '6', '0'],
      options: [
        'Các số thuộc U là: 3; 6; 0 (vì đều chia hết cho 3). Các số không thuộc U là: 5; 7',
        'Các số thuộc U chỉ có 3 và 6 (số 0 không thuộc U)',
        'Các số thuộc U là 3; 5; 6'
      ],
      ans: 0,
      pts: 40,
      explain: 'Số 0 chia hết cho 3 (0 : 3 = 0) nên 0 ∈ U! Vậy các số thuộc U là 3; 6; 0.'
    },
    {
      pill: 'Bài 1.3 (SGK tr. 7)',
      title: 'Bài 1.3: Bằng cách liệt kê các phần tử, hãy viết: a) Tập hợp K các số tự nhiên nhỏ hơn 7; b) Tập hợp D các tháng (dương lịch) có 30 ngày; c) Tập hợp M các chữ cái tiếng Việt trong từ "ĐIỆN BIÊN PHỦ".',
      options: [
        'a) K = {0; 1; 2; 3; 4; 5; 6};  b) D = {Tháng Tư; Tháng Sáu; Tháng Chín; Tháng Mười một};  c) M = {Đ; I; Ê; N; B; P; H; U}',
        'a) K = {1; 2; 3; 4; 5; 6; 7};  b) D = {Tháng Hai; Tháng Tư; Tháng Sáu};  c) M = {Đ; I; Ê; N; B; I; Ê; N; P; H; U}',
        'a) K = {0; 1; 2; 3; 4; 5; 6; 7};  b) D = {Tháng Tư; Tháng Sáu; Tháng Chín}'
      ],
      ans: 0,
      pts: 50,
      explain: 'Nhớ lấy số 0 trong K; 4 tháng dương lịch có 30 ngày là tháng 4, 6, 9, 11; và các chữ cái I, Ê, N trong ĐIỆN BIÊN PHỦ chỉ viết 1 lần!'
    }
  ]
});

window.Stage1_5 = createInteractiveStage({
  globalName: 'Stage1_5',
  lessonKey: 'bai1',
  stageId: 5,
  nextStageId: null,
  storyTitle: '🪐 Trò chơi 5: Khám Phá Hệ Mặt Trời (Bài 1.4, 1.5 SGK tr. 8 & NLS 1.1TC1b)',
  storyDesc: 'Hoàn thành Bài 1.4 và Bài 1.5 (SGK tr. 8) để nhận danh hiệu Đại Kiện Tướng Tập Hợp Toán 6!',
  steps: [
    {
      pill: 'Bài 1.4 (SGK tr. 8)',
      title: 'Bài 1.4: Bằng cách nêu dấu hiệu đặc trưng, hãy viết tập hợp A các số tự nhiên nhỏ hơn 10:',
      options: [
        'A = {x ∈ ℕ | x < 10} (hoặc A = {n | n là số tự nhiên nhỏ hơn 10})',
        'A = {x ∈ ℕ* | x < 10}',
        'A = {x ∈ ℕ | x > 10}'
      ],
      ans: 0,
      pts: 50,
      explain: 'Tập hợp các số tự nhiên nhỏ hơn 10 viết bằng cách nêu dấu hiệu đặc trưng là A = {x ∈ ℕ | x < 10}.'
    },
    {
      pill: 'Bài 1.5 (Hệ Mặt Trời)',
      title: 'Bài 1.5 (SGK tr. 8 - NLS 1.1TC1b): Hệ Mặt Trời gồm có Mặt Trời ở trung tâm và 8 thiên thể quay quanh Mặt Trời gọi là các hành tinh. Hãy chọn tập hợp S gồm 8 hành tinh của Hệ Mặt Trời:',
      visualHtml: `
        <div style="padding:0.75rem; background:rgba(15,23,42,0.65); border-radius:12px; text-align:center; margin:0.6rem 0;">
          ☀️ ➔ ☿ Thuỷ tinh • ♀ Kim tinh • 🌍 Trái Đất • ♂ Hoả tinh • ♃ Mộc tinh • ♄ Thổ tinh • ♅ Thiên Vương tinh • ♆ Hải Vương tinh
        </div>
      `,
      options: [
        'S = {Thuỷ tinh; Kim tinh; Trái Đất; Hoả tinh; Mộc tinh; Thổ tinh; Thiên Vương tinh; Hải Vương tinh}',
        'S = {Mặt Trời; Mặt Trăng; Trái Đất; Hoả tinh; Mộc tinh; Thổ tinh}',
        'S = {Thuỷ tinh; Kim tinh; Trái Đất; Mặt Trăng; Hoả tinh}'
      ],
      ans: 0,
      pts: 60,
      explain: 'Mặt Trời là ngôi sao trung tâm, Mặt Trăng là vệ tinh tự nhiên của Trái Đất. Tập hợp 8 hành tinh của Hệ Mặt Trời là S = {Thuỷ tinh; Kim tinh; Trái Đất; Hoả tinh; Mộc tinh; Thổ tinh; Thiên Vương tinh; Hải Vương tinh}!'
    }
  ]
});

createChapter1App({
  lessonKey: 'bai1',
  shortTitle: 'Bài 1',
  certHeader: 'BÀI 1: TẬP HỢP (CHƯƠNG I TOÁN 6)',
  storageKey: 'toan6_bai1_game_state',
  nextLessonHref: 'bai2.html',
  nextLessonLabel: '🏛️ Tiếp tục chinh phục Bài 2 (Cách ghi số tự nhiên)',
  ranks: [
    '📘 ĐẠI KIỆN TƯỚNG TẬP HỢP TOÁN 6',
    '🏅 CHIẾN BINH TẬP HỢP XUẤT SẮC',
    '🌟 NHÀ THÁM HIỂM TOÁN HỌC KHỐI 6'
  ],
  quests: [
    {
      id: 1,
      tag: 'Hoạt động Khởi động & Hình 1.1 – 1.3 (SGK tr. 5–6)',
      title: 'Trò chơi 1: Khám Phá Tập Hợp Quanh Ta',
      icon: '🌹',
      color: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      musicTrack: 'stage1',
      desc: 'Quan sát Hình 1.1 (lọ hoa hồng), Hình 1.2 (bình cá vàng) và Hình 1.3 (tập hợp M) để nhận biết khái niệm tập hợp và phần tử.'
    },
    {
      id: 2,
      tag: 'Hình thành kiến thức: Mục 1 (SGK tr. 6–7)',
      title: 'Trò chơi 2: Bắn Cung Kí Hiệu ∈, ∉ & Tập Hợp ℕ, ℕ*',
      icon: '🏹',
      color: 'linear-gradient(135deg, #2563eb, #06b6d4)',
      musicTrack: 'stage2',
      desc: 'Làm chủ kí hiệu thuộc (∈), không thuộc (∉), Luyện tập 1, Luyện tập 2 và phân biệt hai tập hợp ℕ và ℕ*.'
    },
    {
      id: 3,
      tag: 'Hình thành kiến thức: Mục 2 (SGK tr. 6–7)',
      title: 'Trò chơi 3: Hai Cách Mô Tả Tập Hợp & Chữ Cái NHA TRANG',
      icon: '📝',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      musicTrack: 'stage3',
      desc: 'Phát hiện lỗi viết lặp phần tử của bạn Nam với từ NHA TRANG (? tr. 7) và giải Luyện tập 3 bằng 2 cách mô tả tập hợp.'
    },
    {
      id: 4,
      tag: 'Hoạt động Luyện tập (Bài 1.1, 1.2, 1.3 SGK tr. 7)',
      title: 'Trò chơi 4: Đấu Trường Bài Tập 1.1 – 1.3',
      icon: '⚡',
      color: 'linear-gradient(135deg, #f59e0b, #ea580c)',
      musicTrack: 'stage4',
      desc: 'Chinh phục Bài 1.1 (tập A, B), Bài 1.2 (tập U các số chia hết cho 3) và Bài 1.3 (các tháng có 30 ngày & chữ cái ĐIỆN BIÊN PHỦ).'
    },
    {
      id: 5,
      tag: 'Hoạt động Vận dụng & NLS 1.1TC1b (Bài 1.4, 1.5 SGK tr. 8)',
      title: 'Trò chơi 5: Khám Phá 8 Hành Tinh Hệ Mặt Trời',
      icon: '🪐',
      color: 'linear-gradient(135deg, #6366f1, #a855f7)',
      musicTrack: 'stage5',
      desc: 'Hoàn thành Bài 1.4 (nêu dấu hiệu đặc trưng) và Bài 1.5 (liệt kê tập hợp S gồm 8 hành tinh của Hệ Mặt Trời).'
    }
  ],
  stages: {
    1: window.Stage1_1,
    2: window.Stage1_2,
    3: window.Stage1_3,
    4: window.Stage1_4,
    5: window.Stage1_5
  }
});
