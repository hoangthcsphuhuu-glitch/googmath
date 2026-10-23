/* ==========================================================================
   TRÒ CHƠI BÀI 6: LŨY THỪA VỚI SỐ MŨ TỰ NHIÊN (SGK TOÁN 6 TRANG 22 - 24)
   Thiết kế bám sát KHBD Tuần 03 (Tiết 10, 11) - GV: Lý Hoàng Em
   ========================================================================== */

window.Stage6_1 = createInteractiveStage({
  globalName: 'Stage6_1',
  lessonKey: 'bai6',
  stageId: 1,
  nextStageId: 2,
  storyTitle: '♟️ Trò chơi 1: Truyền Thuyết Bàn Cờ Vua Ấn Độ (Mở đầu & Vận dụng - SGK tr. 22–23)',
  storyDesc: 'Khám phá truyền thuyết số hạt thóc trên 64 ô bàn cờ vua (ô thứ nhất 1 hạt, ô thứ hai 2 hạt, ô thứ ba 4 hạt... cứ ô sau gấp đôi ô trước) để hiểu định nghĩa Lũy thừa!',
  steps: [
    {
      pill: '1.1. HĐ1 (Ô cờ thứ 8)',
      title: 'Mở đầu & HĐ1 (SGK tr. 22): Để tìm số hạt thóc ở ô thứ 8 của bàn cờ vua, ta phải thực hiện phép nhân có bao nhiêu thừa số 2? Và kết quả bằng bao nhiêu hạt thóc?',
      visualHtml: `
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:0.45rem; max-width:440px; margin:0.65rem auto; text-align:center;">
          <div style="background:rgba(255,255,255,0.1); padding:0.45rem; border-radius:8px;">Ô 1: <strong>1</strong></div>
          <div style="background:rgba(245,158,11,0.2); padding:0.45rem; border-radius:8px;">Ô 2: <strong>2¹=2</strong></div>
          <div style="background:rgba(255,255,255,0.1); padding:0.45rem; border-radius:8px;">Ô 3: <strong>2²=4</strong></div>
          <div style="background:rgba(245,158,11,0.2); padding:0.45rem; border-radius:8px;">Ô 4: <strong>2³=8</strong></div>
          <div style="background:rgba(245,158,11,0.2); padding:0.45rem; border-radius:8px;">Ô 5: <strong>2⁴=16</strong></div>
          <div style="background:rgba(255,255,255,0.1); padding:0.45rem; border-radius:8px;">Ô 6: <strong>2⁵=32</strong></div>
          <div style="background:rgba(245,158,11,0.2); padding:0.45rem; border-radius:8px;">Ô 7: <strong>2⁶=64</strong></div>
          <div style="background:rgba(236,72,153,0.3); padding:0.45rem; border-radius:8px;">Ô 8: <strong>2⁷=?</strong></div>
        </div>
      `,
      options: [
        'Tích của 7 thừa số 2:  2⁷ = 2 · 2 · 2 · 2 · 2 · 2 · 2 = 128 (hạt thóc)',
        'Tích của 8 thừa số 2:  2⁸ = 256 (hạt thóc)',
        '2 × 7 = 14 (hạt thóc)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Ô thứ 1 có 1 hạt, ô thứ 2 có 2¹ hạt, ..., ô thứ 7 có 2⁶ = 64 hạt và ô thứ 8 có 2⁷ = 128 hạt thóc!'
    },
    {
      pill: '1.2. Cơ số & Số mũ',
      title: 'Mục 1 (SGK tr. 22): Trong lũy thừa aⁿ = a · a · ... · a (n thừa số a, n ∈ ℕ*), đâu là cơ số và đâu là số mũ?',
      options: [
        'a là cơ số (thừa số được lặp lại), n là số mũ (số lần lặp lại thừa số a)',
        'n là cơ số, a là số mũ',
        'aⁿ bằng a nhân với n'
      ],
      ans: 0,
      pts: 50,
      explain: 'Trong aⁿ, a gọi là cơ số và n gọi là số mũ. Lưu ý tuyệt đối không nhầm aⁿ với a · n!'
    }
  ]
});

window.Stage6_2 = createInteractiveStage({
  globalName: 'Stage6_2',
  lessonKey: 'bai6',
  stageId: 2,
  nextStageId: 3,
  storyTitle: '📐 Trò chơi 2: Bảng Số Chính Phương & Tổng Các Lũy Thừa Của 10 (Luyện tập 1 & Vận dụng - SGK tr. 23)',
  storyDesc: 'Lập bảng bình phương của các số tự nhiên từ 1 đến 10 (các số chính phương) và biểu diễn số tự nhiên dưới dạng tổng các lũy thừa của 10!',
  steps: [
    {
      pill: '2.1. Luyện tập 1 (Số chính phương)',
      title: 'Luyện tập 1 (SGK tr. 23): Trong các số dưới đây, hãy bấm chọn TẤT CẢ các số chính phương (bình phương của các số từ 1 đến 10):',
      chips: ['1', '4', '9', '16', '25', '36', '49', '64', '81', '100', '50'],
      requiredChips: ['1', '4', '9', '16', '25', '36', '49', '64', '81', '100'],
      options: [
        '10 số chính phương đầu tiên từ 1² đến 10² là: 1; 4; 9; 16; 25; 36; 49; 64; 81; 100',
        'Số 50 cũng là số chính phương vì 25 × 2 = 50',
        'Chỉ có các số chẵn mới là số chính phương'
      ],
      ans: 0,
      pts: 50,
      explain: '1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49, 8²=64, 9²=81, 10²=100.'
    },
    {
      pill: '2.2. Vận dụng (Lũy thừa của 10)',
      title: 'Vận dụng (SGK tr. 23): Viết các số 23 197 và 203 184 thành tổng giá trị các chữ số của nó bằng cách dùng các lũy thừa của 10:',
      options: [
        'a) 23 197 = 2·10⁴ + 3·10³ + 1·10² + 9·10 + 7;   b) 203 184 = 2·10⁵ + 3·10³ + 1·10² + 8·10 + 4',
        'a) 23 197 = 2·10⁵ + 3·10⁴ + 1·10³ + 9·10² + 7',
        'b) 203 184 = 2·10⁴ + 3·10³ + 1·10² + 8·10 + 4'
      ],
      ans: 0,
      pts: 50,
      explain: 'Vì 10 000 = 10⁴ và 100 000 = 10⁵ (số mũ của 10 đúng bằng số chữ số 0 đứng sau chữ số 1)!'
    }
  ]
});

window.Stage6_3 = createInteractiveStage({
  globalName: 'Stage6_3',
  lessonKey: 'bai6',
  stageId: 3,
  nextStageId: 4,
  storyTitle: '⚛️ Trò chơi 3: Lò Phản Ứng Nhân & Chia Hai Lũy Thừa Cùng Cơ Số (Mục 2 - SGK tr. 23–24)',
  storyDesc: 'Vận dụng công thức aᵐ · aⁿ = aᵐ⁺ⁿ, aᵐ : aⁿ = aᵐ⁻ⁿ và quy ước a⁰ = 1 (a ≠ 0) để giải Luyện tập 2 và Luyện tập 3!',
  steps: [
    {
      pill: '3.1. Luyện tập 2 (Nhân cùng cơ số)',
      title: 'Luyện tập 2 (SGK tr. 23): Viết kết quả các phép tính sau dưới dạng một lũy thừa: a) 5³ · 5⁷;  b) 2⁴ · 2⁵ · 2⁹;  c) 10² · 10⁴ · 10⁶ · 10⁸.',
      options: [
        'a) 5³⁺⁷ = 5¹⁰;   b) 2⁴⁺⁵⁺⁹ = 2¹⁸;   c) 10²⁺⁴⁺⁶⁺⁸ = 10²⁰',
        'a) 5²¹;   b) 2¹⁸;   c) 10²⁰',
        'a) 25¹⁰;   b) 2¹⁸;   c) 10¹⁶'
      ],
      ans: 0,
      pts: 50,
      explain: 'Khi nhân nhiều lũy thừa cùng cơ số, ta giữ nguyên cơ số và cộng các số mũ lại với nhau!'
    },
    {
      pill: '3.2. Luyện tập 3 (Chia cùng cơ số)',
      title: 'Luyện tập 3 (SGK tr. 24): Viết kết quả mỗi phép tính sau dưới dạng một lũy thừa: a) 7⁶ : 7⁴;  b) 1 091¹⁰⁰ : 1 091¹⁰⁰.',
      options: [
        'a) 7⁶⁻⁴ = 7²;   b) 1 091¹⁰⁰⁻¹⁰⁰ = 1 091⁰ = 1 (theo quy ước a⁰ = 1 với a ≠ 0)',
        'a) 7²;   b) 1 091⁰ = 0',
        'a) 1²;   b) 1 091¹'
      ],
      ans: 0,
      pts: 50,
      explain: 'Nhớ quy ước cực kỳ quan trọng: a⁰ = 1 (với a ≠ 0), nên 1 091¹⁰⁰ : 1 091¹⁰⁰ = 1 091⁰ = 1!'
    }
  ]
});

window.Stage6_4 = createInteractiveStage({
  globalName: 'Stage6_4',
  lessonKey: 'bai6',
  stageId: 4,
  nextStageId: 5,
  storyTitle: '⚡ Trò chơi 4: Đấu Trường Số Mũ & Quy Luật Tổng Số Lẻ (Bài 1.36 – 1.43 SGK tr. 24)',
  storyDesc: 'Chinh phục chuỗi bài tập từ 1.36 đến 1.43 (SGK tr. 24) và khám phá quy luật tổng các số lẻ liên tiếp bằng một số chính phương!',
  steps: [
    {
      pill: '4.1. Bài 1.41 & 1.42',
      title: 'Bài 1.41 & 1.42 (SGK tr. 24): a) Biết 2¹⁰ = 1 024, hãy tính nhanh 2⁹ và 2¹¹;  b) Viết gọn 5⁷ · 5³ và 5⁸ : 5⁴ dưới dạng một lũy thừa.',
      options: [
        'a) 2⁹ = 1 024 : 2 = 512 và 2¹¹ = 1 024 · 2 = 2 048;   b) 5⁷ · 5³ = 5¹⁰ và 5⁸ : 5⁴ = 5⁴',
        'a) 2⁹ = 512 và 2¹¹ = 1 026;   b) 5¹⁰ và 5²',
        'a) 2⁹ = 1 022 và 2¹¹ = 2 048;   b) 5²¹ và 5⁴'
      ],
      ans: 0,
      pts: 50,
      explain: 'Vì 2⁹ = 2¹⁰ : 2¹ = 1 024 : 2 = 512; và 2¹¹ = 2¹⁰ · 2¹ = 1 024 · 2 = 2 048!'
    },
    {
      pill: '4.2. Bài 1.43 (Tổng số lẻ)',
      title: 'Bài 1.43 (SGK tr. 24): Ta có 1 + 3 = 4 = 2²; 1 + 3 + 5 = 9 = 3². Không tính tổng, hãy viết các tổng sau dưới dạng bình phương của một số tự nhiên: a) 1 + 3 + 5 + 7;  b) 1 + 3 + 5 + 7 + 9.',
      options: [
        'a) 1 + 3 + 5 + 7 = 16 = 4² (tổng 4 số lẻ đầu tiên);   b) 1 + 3 + 5 + 7 + 9 = 25 = 5² (tổng 5 số lẻ đầu tiên)',
        'a) 7²;   b) 9²',
        'a) 3²;   b) 4²'
      ],
      ans: 0,
      pts: 50,
      explain: 'Tổng của n số tự nhiên lẻ đầu tiên bắt đầu từ 1 luôn bằng n²: 4 số lẻ đầu tiên có tổng bằng 4² = 16; 5 số lẻ đầu tiên có tổng bằng 5² = 25!'
    }
  ]
});

window.Stage6_5 = createInteractiveStage({
  globalName: 'Stage6_5',
  lessonKey: 'bai6',
  stageId: 5,
  nextStageId: null,
  storyTitle: '☀️ Trò chơi 5: Phòng Thí Nghiệm Vũ Trụ & Sinh Học (Bài 1.44 & 1.45 SGK tr. 24)',
  storyDesc: 'Ứng dụng phép nhân và phép chia lũy thừa của 10 vào bài toán Thiên văn học (Mặt Trời) và Sinh học (tế bào hồng cầu)!',
  steps: [
    {
      pill: '5.1. Bài 1.44 (Bức xạ Mặt Trời)',
      title: 'Bài 1.44 (SGK tr. 24): Trái Đất có khối lượng khoảng 60 · 10²⁰ tấn. Mỗi giây Mặt Trời tiêu thụ 6 · 10⁶ tấn khí hydrogen. Hỏi Mặt Trời cần bao nhiêu giây để tiêu thụ một lượng khí hydrogen có khối lượng bằng khối lượng Trái Đất?',
      options: [
        '(60 · 10²⁰) : (6 · 10⁶) = (60 : 6) · (10²⁰ : 10⁶) = 10 · 10¹⁴ = 10¹⁵ (giây)',
        '10¹⁴ (giây)',
        '10²⁶ (giây)'
      ],
      ans: 0,
      pts: 50,
      explain: 'Lấy (60 · 10²⁰) chia cho (6 · 10⁶): 60 : 6 = 10 = 10¹, và 10²⁰ : 10⁶ = 10¹⁴. Nhân lại: 10¹ · 10¹⁴ = 10¹⁵ (giây)!'
    },
    {
      pill: '5.2. Bài 1.45 (Tế bào hồng cầu)',
      title: 'Bài 1.45 (SGK tr. 24): Theo các nhà khoa học, mỗi giây cơ thể con người trung bình tạo ra khoảng 25 · 10⁵ tế bào hồng cầu. Hãy tính xem trong mỗi giờ (3 600 giây), bao nhiêu tế bào hồng cầu được tạo ra?',
      options: [
        '25 · 10⁵ · 3 600 = 25 · 36 · 10⁷ = 900 · 10⁷ = 9 · 10⁹ (tế bào hồng cầu)',
        '9 · 10⁸ (tế bào hồng cầu)',
        '25 · 10⁸ (tế bào hồng cầu)'
      ],
      ans: 0,
      pts: 60,
      explain: '1 giờ = 3 600 giây = 36 · 10² giây. Số tế bào hồng cầu tạo ra là: 25 · 10⁵ · 36 · 10² = 900 · 10⁷ = 9 · 10² · 10⁷ = 9 · 10⁹ (tế bào)!'
    }
  ]
});

createChapter1App({
  lessonKey: 'bai6',
  shortTitle: 'Bài 6',
  certHeader: 'BÀI 6: LŨY THỪA VỚI SỐ MŨ TỰ NHIÊN',
  storageKey: 'toan6_bai6_game_state',
  nextLessonHref: 'bai7.html',
  nextLessonLabel: '🧮 Tiếp tục chinh phục Bài 7 (Thứ tự thực hiện các phép tính)',
  ranks: [
    '♟️ ĐẠI KIỆN TƯỚNG LŨY THỪA TOÁN 6',
    '🏅 CHUYÊN GIA SỐ MŨ & SỐ CHÍNH PHƯƠNG',
    '🌟 NHÀ THÁM HIỂM TOÁN HỌC KHỐI 6'
  ],
  quests: [
    {
      id: 1,
      tag: 'Hoạt động Khởi động & Định nghĩa (Tiết 10 - SGK tr. 22)',
      title: 'Trò chơi 1: Truyền Thuyết Bàn Cờ Vua Ấn Độ',
      icon: '♟️',
      color: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      musicTrack: 'stage1',
      desc: 'Tính số hạt thóc ở ô thứ 7 (2⁶ = 64) và ô thứ 8 (2⁷ = 128) trên bàn cờ vua và phân biệt cơ số, số mũ.'
    },
    {
      id: 2,
      tag: 'Hình thành kiến thức: Mục 1 (Tiết 10 - SGK tr. 23)',
      title: 'Trò chơi 2: Bảng Số Chính Phương & Lũy Thừa Của 10',
      icon: '📐',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      musicTrack: 'stage2',
      desc: 'Lập bảng bình phương từ 1² đến 10² (Luyện tập 1) và viết các số 23 197, 203 184 thành tổng các lũy thừa của 10.'
    },
    {
      id: 3,
      tag: 'Hình thành kiến thức: Mục 2 (Đầu Tiết 11 - SGK tr. 23–24)',
      title: 'Trò chơi 3: Lò Phản Ứng Nhân & Chia Cùng Cơ Số',
      icon: '⚛️',
      color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      musicTrack: 'stage3',
      desc: 'Áp dụng công thức aᵐ · aⁿ = aᵐ⁺ⁿ, aᵐ : aⁿ = aᵐ⁻ⁿ và quy ước a⁰ = 1 vào Luyện tập 2 và Luyện tập 3.'
    },
    {
      id: 4,
      tag: 'Hoạt động Luyện tập (Tiết 11 - Bài 1.36 đến 1.43 SGK tr. 24)',
      title: 'Trò chơi 4: Đấu Trường Số Mũ & Tổng Số Lẻ',
      icon: '⚡',
      color: 'linear-gradient(135deg, #f59e0b, #ea580c)',
      musicTrack: 'stage4',
      desc: 'Tính nhanh 2⁹, 2¹¹ từ 2¹⁰ = 1 024 (Bài 1.41) và khám phá quy luật tổng các số lẻ bằng bình phương (Bài 1.43).'
    },
    {
      id: 5,
      tag: 'Hoạt động Vận dụng (Tiết 11 - Bài 1.44 & 1.45 SGK tr. 24)',
      title: 'Trò chơi 5: Phòng Thí Nghiệm Vũ Trụ & Sinh Học',
      icon: '☀️',
      color: 'linear-gradient(135deg, #6366f1, #a855f7)',
      musicTrack: 'stage5',
      desc: 'Tính thời gian Mặt Trời tiêu thụ hydrogen (10¹⁵ giây - Bài 1.44) và số tế bào hồng cầu tạo ra trong 1 giờ (9·10⁹ - Bài 1.45).'
    }
  ],
  stages: {
    1: window.Stage6_1,
    2: window.Stage6_2,
    3: window.Stage6_3,
    4: window.Stage6_4,
    5: window.Stage6_5
  }
});
