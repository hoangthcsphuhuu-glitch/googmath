/* ==========================================================================
   TRÒ CHƠI BÀI 3: THỨ TỰ TRONG TẬP HỢP CÁC SỐ TỰ NHIÊN (SGK TOÁN 6 TRANG 13 - 14)
   Thiết kế bám sát KHBD Tuần 01 (Tiết 4) - GV: Lý Hoàng Em
   ========================================================================== */

window.Stage3_1 = createInteractiveStage({
  globalName: 'Stage3_1',
  lessonKey: 'bai3',
  stageId: 1,
  nextStageId: 2,
  storyTitle: '📏 Trò chơi 1: Xếp Hàng Văn Minh & Tia Số Gốc O (Mở đầu & HĐ1, HĐ2, HĐ3 - SGK tr. 13)',
  storyDesc: 'Khám phá cách biểu diễn các số tự nhiên trên tia số nằm ngang gốc O, vị trí điểm nằm trước (bên trái), số liền trước và số liền sau!',
  steps: [
    {
      pill: '1.1. Tia số nằm ngang',
      title: 'HĐ1 & HĐ2 (SGK tr. 13): Trên tia số nằm ngang gốc O (điểm 0), nếu số tự nhiên a nhỏ hơn số tự nhiên b (a < b) thì vị trí điểm a so với điểm b như thế nào?',
      visualHtml: `
        <div style="padding:0.85rem; background:rgba(15,23,42,0.65); border-radius:12px; text-align:center; font-family:monospace; font-size:1.1rem; color:#38bdf8; margin:0.6rem 0;">
          O(0) ─── 1 ─── 2 ─── 3 ─── 4 ─── 5 ─── 6 ─── 7 ─── 8 ───▶
        </div>
      `,
      options: [
        'Điểm a nằm bên trái (nằm trước) điểm b trên tia số nằm ngang',
        'Điểm a nằm bên phải (nằm sau) điểm b',
        'Hai điểm a và b trùng nhau'
      ],
      ans: 0,
      pts: 50,
      explain: 'Trên tia số nằm ngang, nếu a < b (hoặc b > a) thì điểm a nằm bên trái (nằm trước) điểm b.'
    },
    {
      pill: '1.2. Số liền trước & liền sau',
      title: 'Mục 1 (SGK tr. 13): Khẳng định nào sau đây là ĐÚNG khi nói về số liền trước và số liền sau trong tập hợp số tự nhiên ℕ?',
      options: [
        'Mỗi số tự nhiên có đúng một số liền sau; số 0 là số tự nhiên nhỏ nhất và KHÔNG có số tự nhiên liền trước',
        'Số 0 có số tự nhiên liền trước là 1',
        'Có một số tự nhiên lớn nhất không có số liền sau'
      ],
      ans: 0,
      pts: 50,
      explain: 'Số 0 là số tự nhiên nhỏ nhất nên không có số tự nhiên liền trước. Mọi số tự nhiên đều có đúng một số liền sau.'
    }
  ]
});

window.Stage3_2 = createInteractiveStage({
  globalName: 'Stage3_2',
  lessonKey: 'bai3',
  stageId: 2,
  nextStageId: 3,
  storyTitle: '🔍 Trò chơi 2: So Sánh Số Lớn & Tính Chất Bắc Cầu (Luyện tập & Vận dụng - SGK tr. 14)',
  storyDesc: 'So sánh hai số tự nhiên nhiều chữ số m = 12 036 001 và n = 12 035 987, và vận dụng tính chất bắc cầu (a < b và b < c ⇒ a < c)!',
  steps: [
    {
      pill: '2.1. Luyện tập (SGK tr. 14)',
      title: 'Luyện tập (SGK tr. 14): a) So sánh m = 12 036 001 và n = 12 035 987. b) Trên tia số nằm ngang, điểm nào nằm trước?',
      options: [
        'a) m > n (vì ở hàng nghìn có 6 > 5).   b) Vì n < m nên điểm n nằm trước (bên trái) điểm m',
        'a) m < n (vì 001 < 987).   b) Điểm m nằm trước điểm n',
        'a) m = n vì cả hai số đều có 8 chữ số'
      ],
      ans: 0,
      pts: 50,
      explain: 'Hai số có cùng 8 chữ số; so sánh từ trái sang phải đến hàng nghìn có 6 > 5 nên m > n, suy ra điểm n nằm trước điểm m.'
    },
    {
      pill: '2.2. Vận dụng (Bắc cầu)',
      title: 'Vận dụng (SGK tr. 14): Theo dõi kết quả bán hàng trong ngày của một cửa hàng, người ta nhận thấy: Số tiền thu được vào buổi tối ít hơn vào buổi chiều, và số tiền thu được vào buổi chiều ít hơn vào buổi sáng. Hỏi buổi sáng hay buổi tối cửa hàng thu được nhiều tiền hơn?',
      options: [
        'Theo tính chất bắc cầu: Buổi tối < Buổi chiều < Buổi sáng ⇒ Buổi sáng thu được nhiều tiền hơn buổi tối',
        'Buổi tối thu được nhiều tiền hơn buổi sáng',
        'Chưa đủ thông tin để so sánh buổi sáng và buổi tối'
      ],
      ans: 0,
      pts: 50,
      explain: 'Tính chất bắc cầu: Nếu a < b và b < c thì a < c. Vì Tiền tối < Tiền chiều < Tiền sáng nên Buổi sáng thu được nhiều tiền hơn buổi tối!'
    }
  ]
});

window.Stage3_3 = createInteractiveStage({
  globalName: 'Stage3_3',
  lessonKey: 'bai3',
  stageId: 3,
  nextStageId: 4,
  storyTitle: '🚪 Trò chơi 3: Cổng Kí Hiệu ≤, ≥ & Bài Tập 1.15 (Mục 2 - SGK tr. 14)',
  storyDesc: 'Sử dụng thành thạo các kí hiệu ≤ (nhỏ hơn hoặc bằng) và ≥ (lớn hơn hoặc bằng) để liệt kê các phần tử của tập hợp!',
  steps: [
    {
      pill: '3.1. Câu hỏi ? (SGK tr. 14)',
      title: 'Câu hỏi ? (SGK tr. 14): Trong các số 3; 5; 8; 9, hãy bấm chọn các số thuộc tập hợp A = {x ∈ ℕ | x ≥ 5}, rồi chọn kết luận đúng cho cả A và B = {x ∈ ℕ | x ≤ 5}:',
      chips: ['3', '5', '8', '9'],
      requiredChips: ['5', '8', '9'],
      options: [
        'Các số thuộc A là: 5; 8; 9.   Các số thuộc B = {x ∈ ℕ | x ≤ 5} là: 3; 5',
        'Các số thuộc A chỉ có 8; 9 (không lấy số 5)',
        'Các số thuộc B chỉ có số 3'
      ],
      ans: 0,
      pts: 50,
      explain: 'x ≥ 5 gồm các số lớn hơn 5 hoặc bằng 5 nên lấy cả 5, 8, 9. Tương tự x ≤ 5 lấy cả 3 và 5.'
    },
    {
      pill: '3.2. Bài 1.15 (SGK tr. 14)',
      title: 'Bài 1.15 (SGK tr. 14): Bằng cách liệt kê các phần tử, hãy viết các tập hợp sau: a) M = {x ∈ ℕ | 10 ≤ x < 15}; b) K = {x ∈ ℕ* | x ≤ 3}; c) L = {x ∈ ℕ | x ≤ 3}.',
      options: [
        'a) M = {10; 11; 12; 13; 14};   b) K = {1; 2; 3};   c) L = {0; 1; 2; 3}',
        'a) M = {10; 11; 12; 13; 14; 15};   b) K = {0; 1; 2; 3};   c) L = {1; 2; 3}',
        'a) M = {11; 12; 13; 14};   b) K = {1; 2};   c) L = {0; 1; 2}'
      ],
      ans: 0,
      pts: 50,
      explain: 'Chú ý: K lấy x ∈ ℕ* (khác 0) nên K = {1; 2; 3}, còn L lấy x ∈ ℕ nên có thêm số 0: L = {0; 1; 2; 3}!'
    }
  ]
});

window.Stage3_4 = createInteractiveStage({
  globalName: 'Stage3_4',
  lessonKey: 'bai3',
  stageId: 4,
  nextStageId: 5,
  storyTitle: '⚡ Trò chơi 4: Đấu Trường Số Liền Trước – Liền Sau (Bài 1.13 & 1.14 SGK tr. 14)',
  storyDesc: 'Hoàn thành Bài 1.13 và Bài 1.14 trong SGK Toán 6 trang 14!',
  steps: [
    {
      pill: 'Bài 1.13 (SGK tr. 14)',
      title: 'Bài 1.13: Viết thêm các số liền trước và số liền sau của hai số 3 532 và 3 529 để được 6 số tự nhiên rồi sắp xếp sáu số đó theo thứ tự từ bé đến lớn:',
      options: [
        '3 528;  3 529;  3 530;  3 531;  3 532;  3 533',
        '3 533;  3 532;  3 531;  3 530;  3 529;  3 528',
        '3 527;  3 529;  3 530;  3 531;  3 532;  3 534'
      ],
      ans: 0,
      pts: 50,
      explain: 'Của 3 532 là 3 531 và 3 533; của 3 529 là 3 528 và 3 530. Xếp từ bé đến lớn được dãy 6 số liên tiếp từ 3 528 đến 3 533!'
    },
    {
      pill: 'Bài 1.14 (SGK tr. 14)',
      title: 'Bài 1.14: Cho ba điểm a, b, c trên tia số nằm ngang biết điểm a làm mốc nhỏ nhất và điểm b nằm giữa hai điểm a và c. Khẳng định nào đúng?',
      options: [
        'a < b < c (Ví dụ: a = 2, b = 5, c = 8)',
        'a < c < b',
        'b < a < c'
      ],
      ans: 0,
      pts: 50,
      explain: 'Vì a nhỏ nhất và b nằm giữa a và c nên trên tia số nằm ngang thứ tự từ trái sang phải là a, b, c ⇒ a < b < c.'
    }
  ]
});

window.Stage3_5 = createInteractiveStage({
  globalName: 'Stage3_5',
  lessonKey: 'bai3',
  stageId: 5,
  nextStageId: null,
  storyTitle: '🔐 Trò chơi 5: Đo Chiều Cao Ba Bạn & Mật Khẩu An Toàn Số (Bài 1.16 & NLS 4.2TC1a)',
  storyDesc: 'Giải Bài 1.16 (SGK tr. 14) về chiều cao của An, Bắc, Cường và thực hành kỹ năng đặt mật khẩu an toàn (NLS 4.2TC1a)!',
  steps: [
    {
      pill: 'Bài 1.16 (SGK tr. 14)',
      title: 'Bài 1.16: Ba bạn An, Bắc, Cường dựng cố định một cây sào thẳng đứng rồi đánh dấu chiều cao của các bạn lên đó bởi ba điểm A, B, C (từ dưới lên trên). Cường nói rằng điểm A ứng với chiều cao của An, B ứng với Bắc và C ứng với Cường. Biết rằng An cao 150 cm, Bắc cao 153 cm, Cường cao 148 cm. Theo em bạn Cường nói thế có đúng không?',
      options: [
        'Bạn Cường nói CHƯA ĐÚNG! Vì 148 < 150 < 153 nên từ dưới lên trên phải là: điểm A (Cường 148cm), điểm B (An 150cm), điểm C (Bắc 153cm)',
        'Bạn Cường nói đúng vì xếp theo thứ tự chữ cái A, B, C',
        'Điểm A là Bắc, điểm B là An, điểm C là Cường'
      ],
      ans: 0,
      pts: 50,
      explain: 'Vì 148 < 150 < 153 nên thứ tự chiều cao từ thấp đến cao là Cường, An, Bắc. Do đó từ dưới lên phải là A (Cường), B (An), C (Bắc)!'
    },
    {
      pill: 'An toàn số (NLS 4.2TC1a)',
      title: 'Thực hành Năng lực số 4.2TC1a (KHBD Tiết 4): Khi đặt mật khẩu bằng dãy số tự nhiên cho tài khoản học tập trực tuyến, nguyên tắc nào sau đây giúp bảo vệ tài khoản an toàn nhất?',
      options: [
        'Không dùng các dãy số tự nhiên liên tiếp theo thứ tự tăng/giảm (như 123456 hay 654321) vì kẻ xấu rất dễ đoán ra',
        'Nên đặt là 123456 hoặc 012345 cho dễ nhớ',
        'Đặt toàn chữ số 111111'
      ],
      ans: 0,
      pts: 60,
      explain: 'Tránh dùng các dãy số tự nhiên liên tiếp dễ đoán như 123456 hay 654321 giúp bảo vệ an toàn cho tài khoản học tập của em!'
    }
  ]
});

createChapter1App({
  lessonKey: 'bai3',
  shortTitle: 'Bài 3',
  certHeader: 'BÀI 3: THỨ TỰ TRONG TẬP HỢP SỐ TỰ NHIÊN',
  storageKey: 'toan6_bai3_game_state',
  nextLessonHref: 'bai4.html',
  nextLessonLabel: '➕ Tiếp tục chinh phục Bài 4 (Phép cộng và phép trừ số tự nhiên)',
  ranks: [
    '📏 ĐẠI KIỆN TƯỚNG TIA SỐ & THỨ TỰ TOÁN 6',
    '🏅 CHIẾN BINH SO SÁNH SỐ XUẤT SẮC',
    '🌟 NHÀ THÁM HIỂM TOÁN HỌC KHỐI 6'
  ],
  quests: [
    {
      id: 1,
      tag: 'Hoạt động Khởi động & Mục 1 (SGK tr. 13)',
      title: 'Trò chơi 1: Xếp Hàng Văn Minh & Tia Số Gốc O',
      icon: '📏',
      color: 'linear-gradient(135deg, #06b6d4, #2563eb)',
      musicTrack: 'stage1',
      desc: 'Khám phá tia số nằm ngang gốc O, vị trí điểm nằm trước (bên trái), số liền trước, số liền sau và số tự nhiên nhỏ nhất là 0.'
    },
    {
      id: 2,
      tag: 'Hình thành kiến thức: Luyện tập & Vận dụng (SGK tr. 14)',
      title: 'Trò chơi 2: So Sánh Số Lớn & Tính Chất Bắc Cầu',
      icon: '🔍',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      musicTrack: 'stage2',
      desc: 'So sánh m = 12 036 001 với n = 12 035 987 và vận dụng tính chất bắc cầu để so sánh doanh thu buổi sáng và buổi tối.'
    },
    {
      id: 3,
      tag: 'Hình thành kiến thức: Mục 2 & Bài 1.15 (SGK tr. 14)',
      title: 'Trò chơi 3: Cổng Kí Hiệu ≤, ≥ & Liệt Kê Phần Tử',
      icon: '🚪',
      color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      musicTrack: 'stage3',
      desc: 'Làm chủ kí hiệu ≤ và ≥ qua câu hỏi ? (SGK tr. 14) và liệt kê các phần tử của tập hợp M, K, L trong Bài 1.15.'
    },
    {
      id: 4,
      tag: 'Hoạt động Luyện tập (Bài 1.13 & 1.14 SGK tr. 14)',
      title: 'Trò chơi 4: Đấu Trường Số Liền Trước – Liền Sau',
      icon: '⚡',
      color: 'linear-gradient(135deg, #f59e0b, #ea580c)',
      musicTrack: 'stage4',
      desc: 'Tìm số liền trước, liền sau của 3 532 và 3 529 rồi sắp xếp 6 số từ bé đến lớn (Bài 1.13) và xếp thứ tự điểm trên tia số (Bài 1.14).'
    },
    {
      id: 5,
      tag: 'Hoạt động Vận dụng & NLS 4.2TC1a (Bài 1.16 SGK tr. 14)',
      title: 'Trò chơi 5: Đo Chiều Cao Ba Bạn & Mật Khẩu An Toàn',
      icon: '🔐',
      color: 'linear-gradient(135deg, #ec4899, #be185d)',
      musicTrack: 'stage5',
      desc: 'Kiểm tra lời giải thích của bạn Cường khi đo chiều cao (148cm, 150cm, 153cm) và thảo luận nguyên tắc đặt mật khẩu an toàn.'
    }
  ],
  stages: {
    1: window.Stage3_1,
    2: window.Stage3_2,
    3: window.Stage3_3,
    4: window.Stage3_4,
    5: window.Stage3_5
  }
});
