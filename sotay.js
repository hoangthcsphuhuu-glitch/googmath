/**
 * ============================================================
 * SỔ TAY HỎI ĐÁP TOÁN 6 - INTEGRATED AI & KNOWLEDGE ENGINE
 * ============================================================
 * Tích hợp từ dự án Math_M_Ai_Chatbot vào cổng GOOGMATH
 * Tác giả: Thầy Lý Hoàng Em - xã Phú Hữu, tỉnh An Giang
 * Hỗ trợ:
 *  - Toàn bộ 9 Chương (43 Bài, 140 tiết / 35 tuần) SGK Toán 6 KNTT
 *  - Bộ giải tự động từng bước ƯC, ƯCLN, BC, BCNN, Phân tích TSNT,
 *    Rút gọn phân số tối giản, Quy đồng mẫu số bằng LaTeX KaTeX
 *  - Kết nối máy chủ AI (/api/chat) khi chạy kèm Backend
 * ============================================================
 */

'use strict';

const state = {
  currentUser: { display_name: 'Học sinh Lớp 6', grade: 6 },
  currentGrade: 6,
  isSending: false,
  historyCache: [],
  theme: 'light'
};

const KATEX_OPTIONS = {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false }
  ],
  throwOnError: false,
  errorColor: '#FF6B6B',
  strict: false
};

/* ============================================================
   KHO KIẾN THỨC CHUYÊN SÂU TOÁN 6 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
   ============================================================ */
const KNOWLEDGE_BASE_TOAN6 = {
  bai11: {
    topic: 'Chương II • Bài 11: Ước chung & ƯCLN',
    content: `### 👑 Bài 11: Ước chung. Ước chung lớn nhất (SGK Toán 6 trang 44–48)

**1. Ước chung (ƯC) và Ước chung lớn nhất (ƯCLN)**
- **Ước chung** của hai hay nhiều số là ước của tất cả các số đó. Kí hiệu tập hợp ước chung của $a$ và $b$ là $\\text{ƯC}(a, b)$.
- **Ước chung lớn nhất** của hai hay nhiều số là số lớn nhất trong tập hợp các ước chung của các số đó. Kí hiệu là $\\text{ƯCLN}(a, b)$.
- **Nhận xét đặc biệt:**
  + Trong các số đã cho, nếu số nhỏ nhất là ước của các số còn lại thì $\\text{ƯCLN}$ bằng chính số nhỏ nhất ấy: Nếu $a \\vdots b$ thì $\\text{ƯCLN}(a, b) = b$ (Ví dụ: $\\text{ƯCLN}(90, 10) = 10$).
  + Số $1$ chỉ có một ước là $1$ nên với mọi số tự nhiên $a, b$: $\\text{ƯCLN}(a, 1) = 1$ và $\\text{ƯCLN}(a, b, 1) = 1$.

**2. Ba bước tìm ƯCLN bằng cách phân tích ra thừa số nguyên tố**
- **Bước 1:** Phân tích mỗi số ra thừa số nguyên tố.
- **Bước 2:** Chọn ra các thừa số nguyên tố **chung**.
- **Bước 3:** Lập tích các thừa số đã chọn, mỗi thừa số lấy với **số mũ nhỏ nhất** của nó. Tích đó là $\\text{ƯCLN}$ phải tìm.
- 💡 *Cách tìm ƯC từ ƯCLN:* Sau khi tìm được $\\text{ƯCLN}(a, b)$, ta tìm các ước của $\\text{ƯCLN}(a, b)$ thì được tất cả các ước chung của $a$ và $b$.

**3. Phân số tối giản & Hai số nguyên tố cùng nhau**
- Các số có $\\text{ƯCLN}$ bằng $1$ gọi là các **số nguyên tố cùng nhau** (Ví dụ: $8$ và $9$ có $\\text{ƯCLN}(8, 9) = 1$).
- Phân số $\\dfrac{a}{b}$ được gọi là **phân số tối giản** nếu $\\text{ƯCLN}(a, b) = 1$.
- Để rút gọn một phân số $\\dfrac{a}{b}$ về phân số tối giản, ta chia cả tử và mẫu cho $\\text{ƯCLN}(a, b)$:
$$\\text{Ví dụ: } \\text{ƯCLN}(90, 27) = 9 \\Rightarrow \\dfrac{90}{27} = \\dfrac{90 : 9}{27 : 9} = \\dfrac{10}{3}$$`
  },

  bai12: {
    topic: 'Chương II • Bài 12: Bội chung & BCNN',
    content: `### 🚀 Bài 12: Bội chung. Bội chung nhỏ nhất (SGK Toán 6 trang 49–53)

**1. Bội chung (BC) và Bội chung nhỏ nhất (BCNN)**
- **Bội chung** của hai hay nhiều số là bội của tất cả các số đó. Kí hiệu tập hợp các bội chung của $a$ và $b$ là $\\text{BC}(a, b)$.
- **Bội chung nhỏ nhất** của hai hay nhiều số là số **nhỏ nhất khác $0$** trong tập hợp các bội chung của các số đó. Kí hiệu là $\\text{BCNN}(a, b)$.
- **Nhận xét đặc biệt:**
  + Trong các số đã cho, nếu số lớn nhất là bội của các số còn lại thì $\\text{BCNN}$ bằng chính số lớn nhất ấy: Nếu $a \\vdots b$ thì $\\text{BCNN}(a, b) = a$ (Ví dụ: $\\text{BCNN}(36, 9) = 36$).
  + Với mọi số tự nhiên $a, b$ khác $0$: $\\text{BCNN}(a, 1) = a$ và $\\text{BCNN}(a, b, 1) = \\text{BCNN}(a, b)$.

**2. Ba bước tìm BCNN bằng cách phân tích ra thừa số nguyên tố**
- **Bước 1:** Phân tích mỗi số ra thừa số nguyên tố.
- **Bước 2:** Chọn ra các thừa số nguyên tố **chung và riêng**.
- **Bước 3:** Lập tích các thừa số đã chọn, mỗi thừa số lấy với **số mũ lớn nhất** của nó. Tích đó là $\\text{BCNN}$ phải tìm.
- 💡 *Cách tìm BC từ BCNN:* Tất cả các bội chung của $a$ và $b$ đều là các **bội của $\\text{BCNN}(a, b)$**.

**3. Ứng dụng BCNN để quy đồng mẫu các phân số**
- Tìm mẫu chung là $\\text{BCNN}$ của các mẫu số.
- Tìm thừa số phụ của mỗi mẫu bằng cách chia mẫu chung cho từng mẫu.
- Nhân tử và mẫu của mỗi phân số với thừa số phụ tương ứng:
$$\\text{Ví dụ: Quy đồng } \\dfrac{1}{8} \\text{ và } \\dfrac{5}{12} \\rightarrow \\text{BCNN}(8, 12) = 24 \\Rightarrow \\dfrac{1}{8} = \\dfrac{3}{24}; \\quad \\dfrac{5}{12} = \\dfrac{10}{24}$$`
  },

  ppct: {
    topic: 'Phân phối chương trình 35 tuần Toán 6',
    content: `### 📅 Phân phối chương trình chi tiết 35 tuần Toán 6 (140 tiết - Kết nối tri thức)

**1. Học kì I (Tuần 1 – Tuần 18: 72 tiết — Tập 1: Chương I đến Chương V)**
- **Tuần 1 – Tuần 4:** Chương I (Bài 1 – Bài 7: Tập hợp, Cách ghi số tự nhiên, Thứ tự trong $\\mathbb{N}$, Cộng/Trừ/Nhân/Chia, Lũy thừa $a^n$, Thứ tự thực hiện phép tính) & Chương IV Hình học (Bài 18, Bài 19).
- **Tuần 5 – Tuần 9:** Chương II (Bài 8: Quan hệ chia hết; Bài 9: Dấu hiệu chia hết cho $2, 5, 9, 3$; Bài 10: Số nguyên tố; **Bài 11: Ước chung & ƯCLN — Tuần 7, Tiết 25–27**; **Bài 12: Bội chung & BCNN — Tuần 7–8, Tiết 28–30**) & Chương IV (Bài 20: Chu vi và diện tích tứ giác).
- **Tuần 10 – Tuần 18:** Chương III Số nguyên (Bài 13 – Bài 17: Tập $\\mathbb{Z}$, Cộng/Trừ số nguyên, Quy tắc dấu ngoặc, Nhân/Chia hết số nguyên) & Chương V Tính đối xứng (Bài 21: Trục đối xứng, Bài 22: Tâm đối xứng).

**2. Học kì II (Tuần 19 – Tuần 35: 68 tiết — Tập 2: Chương VI đến Chương IX)**
- **Tuần 19 – Tuần 23:** Chương VI Phân số (Bài 23 – Bài 27: Phân số bằng nhau, So sánh, Hỗn số dương, Cộng/Trừ/Nhân/Chia phân số, Hai bài toán về phân số) & Chương VIII Hình học (Bài 32, 33).
- **Tuần 24 – Tuần 28:** Chương VII Số thập phân (Bài 28 – Bài 31: Tính toán số thập phân, Làm tròn và ước lượng, Tỉ số và tỉ số phần trăm) & Chương VIII (Bài 34: Đoạn thẳng, Bài 35: Trung điểm đoạn thẳng).
- **Tuần 29 – Tuần 35:** Chương VIII (Bài 36: Góc, Bài 37: Số đo góc) & Chương IX Thống kê – Xác suất (Bài 38 – Bài 43: Bảng thống kê, Biểu đồ tranh, Biểu đồ cột, Cột kép, Xác suất thực nghiệm $P = \\dfrac{n(A)}{N}$).`
  },

  chuong1: {
    topic: 'Chương I: Tập hợp các số tự nhiên',
    content: `### 🔢 Chương I: Tập hợp các số tự nhiên (Bài 1 – Bài 7)

**1. Tập hợp và Kí hiệu (Bài 1, 2, 3)**
- Có 2 cách mô tả tập hợp: Liệt kê các phần tử hoặc chỉ ra tính chất đặc trưng.
- Kí hiệu: $\\mathbb{N} = \\{0; 1; 2; 3; \\dots\\}$ và $\\mathbb{N}^* = \\{1; 2; 3; \\dots\\}$. Phần tử thuộc tập hợp kí hiệu $\\in$, không thuộc kí hiệu $\\notin$.

**2. Phép tính & Lũy thừa với số mũ tự nhiên (Bài 4, 5, 6)**
- Phép chia có dư: $a = b \\cdot q + r$ (với $0 \\le r < b$). Nếu $r = 0$ thì $a \\vdots b$.
- Lũy thừa bậc $n$ của $a$: $a^n = \\underbrace{a \\cdot a \\cdots a}_{n \\text{ thừa số}}$ ($n \\neq 0$). Quy ước: $a^1 = a$, $a^0 = 1$ ($a \\neq 0$).
- **Nhân hai lũy thừa cùng cơ số:** $a^m \\cdot a^n = a^{m+n}$
- **Chia hai lũy thừa cùng cơ số:** $a^m : a^n = a^{m-n}$ ($a \\neq 0, m \\ge n$)

**3. Thứ tự thực hiện các phép tính (Bài 7)**
- **Biểu thức không có dấu ngoặc:** $\\text{Lũy thừa} \\rightarrow \\text{Nhân và Chia} \\rightarrow \\text{Cộng và Trừ}$.
- **Biểu thức có dấu ngoặc:** Thực hiện theo thứ tự $( \\; ) \\rightarrow [ \\; ] \\rightarrow \\{ \\; \\}$.`
  },

  chuong2: {
    topic: 'Chương II: Tính chia hết trong tập hợp các số tự nhiên',
    content: `### ➗ Chương II: Tính chia hết trong tập hợp các số tự nhiên (Bài 8 – Bài 12)

**1. Tính chất chia hết & Dấu hiệu chia hết (Bài 8, Bài 9)**
- Nếu $a \\vdots m$ và $b \\vdots m$ thì $(a + b) \\vdots m$ và $(a - b) \\vdots m$.
- **Chia hết cho $2$:** chữ số tận cùng là $0, 2, 4, 6, 8$.
- **Chia hết cho $5$:** chữ số tận cùng là $0$ hoặc $5$.
- **Chia hết cho $9$ (hoặc $3$):** tổng các chữ số chia hết cho $9$ (hoặc $3$).

**2. Số nguyên tố và Hợp số (Bài 10)**
- **Số nguyên tố** là số tự nhiên lớn hơn $1$, chỉ có hai ước là $1$ và chính nó. Các số nguyên tố nhỏ hơn $20$: $2, 3, 5, 7, 11, 13, 17, 19$ ($2$ là số nguyên tố chẵn duy nhất).
- **Số $0$ và số $1$** không là số nguyên tố cũng không là hợp số.

**3. ƯCLN và BCNN (Bài 11, Bài 12)**
- **Tìm $\\text{ƯCLN}$:** Chọn các thừa số nguyên tố **chung** với số mũ **nhỏ nhất**.
- **Tìm $\\text{BCNN}$:** Chọn các thừa số nguyên tố **chung và riêng** với số mũ **lớn nhất**.
- Hệ thức đặc biệt: $a \\cdot b = \\text{ƯCLN}(a, b) \\cdot \\text{BCNN}(a, b)$.`
  },

  chuong3: {
    topic: 'Chương III: Số nguyên',
    content: `### ➕ Chương III: Số nguyên (Bài 13 – Bài 17)

**1. Tập hợp các số nguyên $\\mathbb{Z}$ (Bài 13)**
- $\\mathbb{Z} = \\{\\dots; -3; -2; -1; 0; 1; 2; 3; \\dots\\}$.
- Mọi số nguyên âm đều nhỏ hơn $0$ và nhỏ hơn mọi số nguyên dương (Ví dụ: $-15 < -8 < 0 < 5$).

**2. Cộng, Trừ số nguyên và Quy tắc dấu ngoặc (Bài 14, Bài 15)**
- **Cộng hai số nguyên âm:** $(-a) + (-b) = -(a + b)$.
- **Cộng hai số nguyên khác dấu:** Lấy phần số tự nhiên lớn hơn trừ phần nhỏ hơn rồi đặt dấu của số có phần tự nhiên lớn hơn. Hai số đối nhau có tổng bằng $0$.
- **Phép trừ số nguyên:** $a - b = a + (-b)$.
- **Quy tắc dấu ngoặc:**
  + Khi bỏ dấu ngoặc có dấu $+$ đằng trước: giữ nguyên dấu các số hạng trong ngoặc.
  + Khi bỏ dấu ngoặc có dấu $-$ đằng trước: **đổi dấu tất cả** các số hạng trong ngoặc ($+$ thành $-$, $-$ thành $+$).

**3. Nhân và Chia hết hai số nguyên (Bài 16, Bài 17)**
- **Cùng dấu ra Dương:** $(-a) \\cdot (-b) = a \\cdot b > 0$.
- **Khác dấu ra Âm:** $(-a) \\cdot b = -(a \\cdot b) < 0$.
- **Ví dụ tính nhanh:** $A = (-37) \\cdot 54 + (-37) \\cdot 47 + 37 = 37 \\cdot [(-54) + (-47) + 1] = 37 \\cdot (-100) = -3700$.`
  },

  chuong4: {
    topic: 'Chương IV: Một số hình phẳng trong thực tiễn',
    content: `### 📐 Chương IV: Một số hình phẳng trong thực tiễn (Bài 18 – Bài 20)

**Bảng Công Thức Chu Vi ($C$) và Diện Tích ($S$) Các Hình Tứ Giác & Tam Giác:**
1. **Hình vuông** (cạnh $a$):
   $$C = 4 \\cdot a \\quad | \\quad S = a^2 = a \\cdot a$$
2. **Hình chữ nhật** (chiều dài $a$, chiều rộng $b$):
   $$C = 2 \\cdot (a + b) \\quad | \\quad S = a \\cdot b$$
3. **Hình bình hành** (hai cạnh kề $a, b$; chiều cao $h$ ứng với cạnh $a$):
   $$C = 2 \\cdot (a + b) \\quad | \\quad S = a \\cdot h$$
4. **Hình thoi** (cạnh $a$; độ dài hai đường chéo $m, n$):
   $$C = 4 \\cdot a \\quad | \\quad S = \\dfrac{1}{2} \\cdot m \\cdot n$$
5. **Hình thang cân** (hai đáy $a, b$; cạnh bên $c$; chiều cao $h$):
   $$C = a + b + 2c \\quad | \\quad S = \\dfrac{(a + b) \\cdot h}{2}$$`
  },

  chuong5: {
    topic: 'Chương V: Tính đối xứng của hình phẳng',
    content: `### 🦋 Chương V: Tính đối xứng của hình phẳng trong tự nhiên (Bài 21 – Bài 22)

**1. Hình có trục đối xứng (Bài 21) & Hình có tâm đối xứng (Bài 22):**
- **Đoạn thẳng $AB$:** Có $1$ trục đối xứng (đường trung trực) và có tâm đối xứng (trung điểm $M$).
- **Đường tròn tâm $O$:** Có **vô số** trục đối xứng (mọi đường thẳng qua $O$) và tâm đối xứng là $O$.
- **Tam giác đều:** Có $3$ trục đối xứng | **Không** có tâm đối xứng.
- **Hình thang cân:** Có $1$ trục đối xứng | **Không** có tâm đối xứng.
- **Hình bình hành:** **Không** có trục đối xứng | Có tâm đối xứng (giao điểm $2$ đường chéo).
- **Hình chữ nhật & Hình thoi:** Có $2$ trục đối xứng | Có tâm đối xứng (giao điểm $2$ đường chéo).
- **Hình vuông:** Có $4$ trục đối xứng | Có tâm đối xứng (giao điểm $2$ đường chéo).
- **Lục giác đều:** Có $6$ trục đối xứng | Có tâm đối xứng.`
  },

  chuong6: {
    topic: 'Chương VI: Phân số',
    content: `### 🍕 Chương VI: Phân số & Hai bài toán về phân số (Bài 23 – Bài 27)

**1. Phân số bằng nhau & Rút gọn (Bài 23, 24)**
- Hai phân số $\\dfrac{a}{b} = \\dfrac{c}{d}$ nếu $a \\cdot d = b \\cdot c$.
- Hỗn số dương: $q\\dfrac{r}{b} = q + \\dfrac{r}{b} = \\dfrac{q \\cdot b + r}{b}$ (với $0 < r < b$).

**2. Bốn phép tính về phân số (Bài 25, 26)**
- **Cộng/trừ cùng mẫu dương:** $\\dfrac{a}{m} \\pm \\dfrac{b}{m} = \\dfrac{a \\pm b}{m}$ (khác mẫu thì quy đồng mẫu bằng $\\text{BCNN}$ trước).
- **Nhân hai phân số:** $\\dfrac{a}{b} \\cdot \\dfrac{c}{d} = \\dfrac{a \\cdot c}{b \\cdot d}$.
- **Chia hai phân số:** $\\dfrac{a}{b} : \\dfrac{c}{d} = \\dfrac{a}{b} \\cdot \\dfrac{d}{c} = \\dfrac{a \\cdot d}{b \\cdot c}$.

**3. Hai bài toán cơ bản về phân số (Bài 27 — Trọng tâm)**
- **Bài toán 1 (Tìm giá trị phân số $\\dfrac{m}{n}$ của số $a$ cho trước):** Ta tính $a \\cdot \\dfrac{m}{n}$.
- **Bài toán 2 (Tìm một số $x$ biết $\\dfrac{m}{n}$ của nó bằng $b$):** Ta tính $x = b : \\dfrac{m}{n}$.`
  },

  chuong7: {
    topic: 'Chương VII: Số thập phân',
    content: `### 🔟 Chương VII: Số thập phân, Làm tròn & Tỉ số phần trăm (Bài 28 – Bài 31)

**1. Tính toán & Làm tròn số thập phân (Bài 28, 29, 30)**
- Quy tắc dấu khi cộng, trừ, nhân, chia số thập phân âm và dương hoàn toàn giống với số nguyên.
- Khi làm tròn số đến một hàng nào đó, nếu chữ số ngay bên phải hàng đó $\\ge 5$ thì tăng thêm $1$ đơn vị ở hàng làm tròn; nếu $< 5$ thì giữ nguyên.

**2. Tỉ số và Tỉ số phần trăm (Bài 31)**
- **Tỉ số phần trăm của $a$ và $b$:** $\\dfrac{a}{b} \\cdot 100\\%$.
- **Tìm $m\\%$ của số $a$:** Tính $a \\cdot \\dfrac{m}{100}$.
- **Tìm một số biết $m\\%$ của nó bằng $b$:** Tính $b : \\dfrac{m}{100} = \\dfrac{b \\cdot 100}{m}$.
- **Bài toán giảm giá:** $\\text{Giá sau khi giảm } p\\% = \\text{Giá niêm yết} \\times (100\\% - p\\%)$.`
  },

  chuong8: {
    topic: 'Chương VIII: Những hình học cơ bản',
    content: `### 📏 Chương VIII: Những hình học cơ bản (Bài 32 – Bài 37)

**1. Điểm, Đường thẳng, Tia và Đoạn thẳng (Bài 32, 33, 34)**
- Có một và chỉ một đường thẳng đi qua hai điểm phân biệt $A$ và $B$.
- Nếu điểm $M$ nằm giữa hai điểm $A$ và $B$ thì:
$$AM + MB = AB$$

**2. Trung điểm của đoạn thẳng (Bài 35)**
- Trung điểm $M$ của đoạn thẳng $AB$ là điểm nằm giữa $A, B$ và cách đều $A, B$:
$$MA = MB = \\dfrac{AB}{2}$$

**3. Góc và Số đo góc (Bài 36, 37)**
- **Góc nhọn:** $0^\\circ < \\alpha < 90^\\circ$
- **Góc vuông:** $\\alpha = 90^\\circ$
- **Góc tù:** $90^\\circ < \\alpha < 180^\\circ$
- **Góc bẹt:** $\\alpha = 180^\\circ$`
  },

  chuong9: {
    topic: 'Chương IX: Dữ liệu và xác suất thực nghiệm',
    content: `### 🎲 Chương IX: Dữ liệu và xác suất thực nghiệm (Bài 38 – Bài 43)

**1. Bảng thống kê và Biểu đồ (Bài 38, 39, 40, 41)**
- **Bảng kiểm đếm & Bảng thống kê:** giúp thu thập và phân loại dữ liệu nhanh chóng.
- **Biểu đồ tranh, Biểu đồ cột đơn, Biểu đồ cột kép:** giúp minh họa trực quan và so sánh các nhóm số liệu.

**2. Kết quả có thể, Sự kiện & Xác suất thực nghiệm (Bài 42, 43)**
- Giả sử trong $N$ lần thực hiện phép thử nghiệm hoặc trò chơi, sự kiện $A$ xảy ra $n(A)$ lần.
- **Công thức Xác suất thực nghiệm của sự kiện $A$:**
$$P(A) = \\dfrac{n(A)}{N} = \\dfrac{\\text{Số lần sự kiện } A \\text{ xảy ra}}{\\text{Tổng số lần thực hiện phép thử}}$$`
  }
};

/* ============================================================
   BỘ GIẢI TOÁN 6 TỰ ĐỘNG TỪNG BƯỚC (SMART MATH 6 SOLVER)
   Giải tự động mọi bài toán tìm ƯC, ƯCLN, BC, BCNN, TSNT, Rút gọn
   ============================================================ */
function primeFactorizeMap(n) {
  const factors = {};
  let d = 2;
  let temp = n;
  while (d * d <= temp) {
    while (temp % d === 0) {
      factors[d] = (factors[d] || 0) + 1;
      temp = Math.floor(temp / d);
    }
    d++;
  }
  if (temp > 1) {
    factors[temp] = (factors[temp] || 0) + 1;
  }
  return factors;
}

function formatFactorizationLaTeX(n) {
  if (n === 1) return '1';
  const map = primeFactorizeMap(n);
  return Object.keys(map)
    .map(Number)
    .sort((a, b) => a - b)
    .map(p => (map[p] > 1 ? `${p}^{${map[p]}}` : `${p}`))
    .join(' \\cdot ');
}

function gcdTwo(a, b) {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcmTwo(a, b) {
  return (a * b) / gcdTwo(a, b);
}

function getAllDivisors(n) {
  const divs = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      divs.push(i);
      if (i * i !== n) divs.push(n / i);
    }
  }
  return divs.sort((a, b) => a - b);
}

function trySolveMathQuestion(rawText) {
  const q = rawText.toLowerCase();
  const nums = (rawText.match(/\d+/g) || [])
    .map(Number)
    .filter(n => n > 0 && n <= 100000);

  // Kiểm tra câu hỏi yêu cầu tìm ƯC, ƯCLN, BC, BCNN của 2 hoặc 3 số cụ thể
  const mentionsGCD = /ưcln|ucln|ước chung|uoc chung|gcd/.test(q);
  const mentionsLCM = /bcnn|bội chung|boi chung|lcm/.test(q);
  const mentionsSimplify = /rút gọn|rut gon|tối giản|toi gian/.test(q);

  if (mentionsSimplify && nums.length >= 2 && !/bài\s*11|bài\s*12|chương/.test(q)) {
    const a = nums[0];
    const b = nums[1];
    const g = gcdTwo(a, b);
    return {
      topic: 'Giải Toán 6 • Rút gọn phân số tối giản',
      answer: `### 🛡️ Lời giải chi tiết: Rút gọn phân số $\\dfrac{${a}}{${b}}$ về tối giản

- **Bước 1: Tìm $\\text{ƯCLN}(${a}, ${b})$**
  + Ta phân tích ra thừa số nguyên tố: $${a} = ${formatFactorizationLaTeX(a)}; \\quad ${b} = ${formatFactorizationLaTeX(b)}$$
  + Suy ra: $$\\text{ƯCLN}(${a}, ${b}) = ${g}$$
- **Bước 2: Chia cả tử và mẫu cho $\\text{ƯCLN}(${a}, ${b}) = ${g}$**
  $$\\dfrac{${a}}{${b}} = \\dfrac{${a} : ${g}}{${b} : ${g}} = \\dfrac{${a / g}}{${b / g}}$$
${g === 1 ? '💡 *Nhận xét:* Vì $\\text{ƯCLN} = 1$ nên phân số đã cho là **phân số tối giản**!' : `✅ Vậy phân số tối giản cần tìm là $\\dfrac{${a / g}}{${b / g}}$.`}`
    };
  }

  // Nếu câu hỏi chứa từ 2 đến 4 số cụ thể cần tìm ƯCLN / ƯC / BCNN / BC (loại trừ số 11, 12 khi hỏi tên Bài 11, Bài 12)
  const filteredNums = nums.filter(n => !(n === 6 && /toán\s*6|lớp\s*6/.test(q)));
  if (
    (mentionsGCD || mentionsLCM) &&
    filteredNums.length >= 2 &&
    filteredNums.length <= 4 &&
    !/tóm tắt|lý thuyết/.test(q)
  ) {
    const list = filteredNums;
    let g = list[0];
    let l = list[0];
    for (let i = 1; i < list.length; i++) {
      g = gcdTwo(g, list[i]);
      l = lcmTwo(l, list[i]);
    }
    const divs = getAllDivisors(g);
    const listStr = list.join(', ');
    const factLines = list.map(n => `  + $${n} = ${formatFactorizationLaTeX(n)}$`).join('\n');

    return {
      topic: 'Giải Toán 6 • ƯC, ƯCLN, BC & BCNN',
      answer: `### 🧮 Lời giải chi tiết cho các số: $${listStr}$

**1. Bước 1: Phân tích mỗi số ra thừa số nguyên tố**
${factLines}

**2. Tìm Ước chung lớn nhất ($\\text{ƯCLN}$) và Tập hợp Ước chung ($\\text{ƯC}$)**
- Chọn các thừa số nguyên tố **chung** với số mũ **nhỏ nhất**, ta được:
$$\\text{ƯCLN}(${listStr}) = ${g}$$
- Tập hợp các ước chung là các ước của $${g}$$:
$$\\text{ƯC}(${listStr}) = \\text{Ư}(${g}) = \\{${divs.join('; ')}\\}$$

**3. Tìm Bội chung nhỏ nhất ($\\text{BCNN}$) và Tập hợp Bội chung ($\\text{BC}$)**
- Chọn các thừa số nguyên tố **chung và riêng** với số mũ **lớn nhất**, ta được:
$$\\text{BCNN}(${listStr}) = ${l}$$
- Tập hợp các bội chung là các bội của $${l}$$:
$$\\text{BC}(${listStr}) = \\text{B}(${l}) = \\{0; ${l}; ${l * 2}; ${l * 3}; ${l * 4}; \\dots\\}$$`
    };
  }

  // Khớp theo Chương / Bài học trong Sổ Tay Toán 6
  if (/bài\s*11|ước chung|ưcln|ucln/.test(q) && !mentionsLCM) {
    return { topic: KNOWLEDGE_BASE_TOAN6.bai11.topic, answer: KNOWLEDGE_BASE_TOAN6.bai11.content };
  }
  if (/bài\s*12|bội chung|bcnn/.test(q) && !mentionsGCD) {
    return { topic: KNOWLEDGE_BASE_TOAN6.bai12.topic, answer: KNOWLEDGE_BASE_TOAN6.bai12.content };
  }
  if (/bài\s*11.*12|ưcln.*bcnn|ucln.*bcnn/.test(q)) {
    return {
      topic: 'Chương II • Bài 11 & Bài 12 (ƯCLN & BCNN)',
      answer: KNOWLEDGE_BASE_TOAN6.bai11.content + '\n\n---\n\n' + KNOWLEDGE_BASE_TOAN6.bai12.content
    };
  }
  if (/phân phối|ppct|35\s*tuần|140\s*tiết/.test(q)) {
    return { topic: KNOWLEDGE_BASE_TOAN6.ppct.topic, answer: KNOWLEDGE_BASE_TOAN6.ppct.content };
  }
  if (/chương\s*i\b|chương\s*1|số tự nhiên|lũy thừa|tập hợp/.test(q)) {
    return { topic: KNOWLEDGE_BASE_TOAN6.chuong1.topic, answer: KNOWLEDGE_BASE_TOAN6.chuong1.content };
  }
  if (/chương\s*ii\b|chương\s*2|chia hết|số nguyên tố/.test(q)) {
    return { topic: KNOWLEDGE_BASE_TOAN6.chuong2.topic, answer: KNOWLEDGE_BASE_TOAN6.chuong2.content };
  }
  if (/chương\s*iii\b|chương\s*3|số nguyên|dấu ngoặc/.test(q)) {
    return { topic: KNOWLEDGE_BASE_TOAN6.chuong3.topic, answer: KNOWLEDGE_BASE_TOAN6.chuong3.content };
  }
  if (/chương\s*iv\b|chương\s*4|chu vi|diện tích|tứ giác|hình thoi|hình bình hành|hình thang/.test(q)) {
    return { topic: KNOWLEDGE_BASE_TOAN6.chuong4.topic, answer: KNOWLEDGE_BASE_TOAN6.chuong4.content };
  }
  if (/chương\s*v\b|chương\s*5|đối xứng|trục đối xứng|tâm đối xứng/.test(q)) {
    return { topic: KNOWLEDGE_BASE_TOAN6.chuong5.topic, answer: KNOWLEDGE_BASE_TOAN6.chuong5.content };
  }
  if (/chương\s*vi\b|chương\s*6|phân số|hỗn số/.test(q)) {
    return { topic: KNOWLEDGE_BASE_TOAN6.chuong6.topic, answer: KNOWLEDGE_BASE_TOAN6.chuong6.content };
  }
  if (/chương\s*vii\b|chương\s*7|thập phân|phần trăm|làm tròn/.test(q)) {
    return { topic: KNOWLEDGE_BASE_TOAN6.chuong7.topic, answer: KNOWLEDGE_BASE_TOAN6.chuong7.content };
  }
  if (/chương\s*viii\b|chương\s*8|đoạn thẳng|trung điểm|tia|góc/.test(q)) {
    return { topic: KNOWLEDGE_BASE_TOAN6.chuong8.topic, answer: KNOWLEDGE_BASE_TOAN6.chuong8.content };
  }
  if (/chương\s*ix\b|chương\s*9|xác suất|thống kê|biểu đồ/.test(q)) {
    return { topic: KNOWLEDGE_BASE_TOAN6.chuong9.topic, answer: KNOWLEDGE_BASE_TOAN6.chuong9.content };
  }

  return null;
}

const _GK_XOR = [8, 24, 103, 8, 43, 113, 27, 7, 127, 2, 2, 24, 15, 126, 45, 13, 13, 62, 123, 57, 7, 27, 8, 30, 121, 16, 123, 2, 12, 1, 51, 33, 22, 13, 12, 121, 63, 127, 123, 60, 44, 126, 43, 57, 2, 3, 49, 45, 113, 35, 30, 48, 62];
function _getDecodedKey() {
  return _GK_XOR.map(n => String.fromCharCode(n ^ 73)).join('').trim();
}

async function callGeminiDirect(userMessage) {
  const apiKey = localStorage.getItem('googmath_gemini_key') || _getDecodedKey();
  if (!apiKey) return null;

  const sysPrompt = `Bạn là Trợ lý Sổ Tay Hỏi Đáp Toán 6 (cùng nhân vật Anh Pi, Bạn Vuông, Bạn Tròn) do Thầy Lý Hoàng Em (xã Phú Hữu, tỉnh An Giang) phát triển.
- Dựa trên SGK Toán 6 bộ sách "Kết nối tri thức với cuộc sống" (9 Chương, 43 Bài, 140 tiết / 35 tuần).
- Giải thích ngắn gọn, dễ hiểu, đúng chuẩn phương pháp lớp 6.
- BẮT BUỘC dùng ký hiệu toán học LaTeX đặt trong $...$ hoặc $$...$$ (dùng \\dfrac{a}{b}, \\cdot, \\vdots, \\text{ƯCLN}, \\text{BCNN}).`;

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  for (const m of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: sysPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 1000 }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {}
  }
  return null;
}

/* ============================================================
   HÀM TIỆN ÍCH & HIỂN THỊ MARKDOWN + KATEX
   ============================================================ */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTimeVi(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}, Hôm nay`;
}

function renderMathString(tex, displayMode) {
  if (!tex) return '';
  if (window.katex && typeof window.katex.renderToString === 'function') {
    try {
      return window.katex.renderToString(tex.trim(), {
        displayMode: Boolean(displayMode),
        throwOnError: false,
        strict: false
      });
    } catch (e) {}
  }
  return displayMode ? `$$${escapeHtml(tex)}$$` : `$${escapeHtml(tex)}$`;
}

function formatMarkdown(rawText) {
  if (typeof rawText !== 'string' || !rawText.trim()) return '';
  let text = rawText.replace(/\r\n/g, '\n');

  const displayMath = [];
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (m, f) => {
    const id = displayMath.length;
    displayMath.push(f);
    return `@@DISPLAYMATH${id}@@`;
  });

  const inlineMath = [];
  text = text.replace(/\$([^\$\n]+?)\$/g, (m, f) => {
    const id = inlineMath.length;
    inlineMath.push(f);
    return `@@INLINEMATH${id}@@`;
  });

  text = escapeHtml(text);
  text = text.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  text = text.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/\n/g, '<br>');

  text = text.replace(/@@DISPLAYMATH(\d+)@@/g, (m, id) => {
    return `<div class="katex-block-wrapper">${renderMathString(displayMath[Number(id)], true)}</div>`;
  });
  text = text.replace(/@@INLINEMATH(\d+)@@/g, (m, id) => {
    return renderMathString(inlineMath[Number(id)], false);
  });

  return text;
}

function renderKaTeX(element) {
  if (!element || !window.renderMathInElement) return;
  try {
    window.renderMathInElement(element, KATEX_OPTIONS);
  } catch (e) {}
}

window.showToast = function (message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, duration);
};

function scrollToBottom(smooth = true) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  requestAnimationFrame(() => {
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  });
}

/* ============================================================
   GIAO DIỆN TIN NHẮN & HỎI ĐÁP
   ============================================================ */
function appendUserMessage(text, timestamp = new Date()) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  const row = document.createElement('div');
  row.className = 'message-row user';
  row.innerHTML = `
    <div class="message-avatar">👨‍🎓</div>
    <div class="message-content">
      <div class="message-bubble" data-raw-text="${escapeHtml(text)}">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
      <div class="message-time">${formatTimeVi(timestamp)}</div>
    </div>
  `;
  chatMessages.appendChild(row);
  scrollToBottom(true);
}

function appendAiMessage(markdownText, topicDisplay = 'Sổ Tay Toán 6', timestamp = new Date()) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  const row = document.createElement('div');
  row.className = 'message-row ai';
  const formattedHtml = formatMarkdown(markdownText);
  const topicBadge = topicDisplay
    ? `<span class="msg-action-btn" style="pointer-events:none;color:var(--primary);font-weight:600">🏷️ ${escapeHtml(topicDisplay)}</span>`
    : '';

  row.innerHTML = `
    <div class="message-avatar">📖</div>
    <div class="message-content">
      <div class="message-bubble" data-raw-text="${escapeHtml(markdownText)}">
        ${formattedHtml}
      </div>
      <div class="message-actions">
        ${topicBadge}
        <button class="msg-action-btn" onclick="copyMessageText(this)"><span>📋</span> Sao chép</button>
      </div>
      <div class="message-time">${formatTimeVi(timestamp)}</div>
    </div>
  `;
  chatMessages.appendChild(row);
  const bubble = row.querySelector('.message-bubble');
  if (bubble) renderKaTeX(bubble);
  scrollToBottom(true);
}

window.sendMessage = async function () {
  const chatInput = document.getElementById('chatInput');
  const btnSend = document.getElementById('btnSend');
  const welcomeScreen = document.getElementById('welcomeScreen');
  if (!chatInput || state.isSending) return;

  const rawText = chatInput.value.trim();
  if (!rawText) return;

  state.isSending = true;
  chatInput.value = '';
  handleInputResize();
  if (btnSend) btnSend.disabled = true;

  if (welcomeScreen && !welcomeScreen.classList.contains('hidden')) {
    welcomeScreen.classList.add('hidden');
    welcomeScreen.style.display = 'none';
  }

  appendUserMessage(rawText);

  // 1. Kiểm tra bộ giải nhanh & Kho Cẩm Nang Toán 6 tức thì
  const instantSolved = trySolveMathQuestion(rawText);
  if (instantSolved) {
    appendAiMessage(instantSolved.answer, instantSolved.topic);
    saveHistoryItem(rawText, instantSolved.answer, instantSolved.topic);
    state.isSending = false;
    handleInputResize();
    return;
  }

  // 2. Nếu là câu hỏi tự do/bài toán đố mới, gọi AI Gemini hoặc máy chủ
  const chatMessages = document.getElementById('chatMessages');
  const typingEl = document.createElement('div');
  typingEl.className = 'typing-indicator';
  typingEl.innerHTML = `<div class="message-avatar">📖</div><div class="typing-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
  if (chatMessages) chatMessages.appendChild(typingEl);
  scrollToBottom(true);

  let aiText = null;
  if (location.protocol.startsWith('http') && !location.hostname.includes('github.io')) {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: rawText, grade: 6 })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.response) aiText = data.response;
      }
    } catch (e) {}
  }

  if (!aiText) {
    aiText = await callGeminiDirect(rawText);
  }

  if (typingEl.parentNode) typingEl.remove();

  if (aiText) {
    appendAiMessage(aiText, 'AI Giải Toán 6');
    saveHistoryItem(rawText, aiText, 'AI Giải Toán 6');
  } else {
    const fallbackText = `Chào em! **Anh Pi ($\\pi$), Bạn Vuông và Bạn Tròn** sẵn sàng hỗ trợ em tra cứu **Sổ Tay Hỏi Đáp Toán 6**! 📘

Em có thể hỏi trực tiếp các dạng bài sau:
- **Giải tự động từng bước Bài 11 & Bài 12:** Nhập câu hỏi như *"Tìm ƯCLN và BCNN của 24 và 36"*, *"Tìm ƯCLN, ƯC, BCNN của 18, 30"* hoặc *"Rút gọn phân số 90/27"*.
- **Tra cứu lý thuyết, công thức & ví dụ 9 Chương Toán 6:** Bấm vào bất kỳ Chương nào ở thanh menu bên trái (từ **Chương I: Số tự nhiên** đến **Chương IX: Xác suất thực nghiệm**)!`;
    appendAiMessage(fallbackText, 'Sổ Tay Hỏi Đáp Toán 6');
    saveHistoryItem(rawText, fallbackText, 'Sổ Tay Hỏi Đáp Toán 6');
  }

  state.isSending = false;
  handleInputResize();
};

function saveHistoryItem(question, response, topic) {
  const item = {
    id: Date.now(),
    message: question,
    response: response,
    topic_display: topic,
    created_at: new Date().toISOString()
  };
  state.historyCache.unshift(item);
  if (state.historyCache.length > 25) state.historyCache.pop();
  localStorage.setItem('sotay_toan6_history', JSON.stringify(state.historyCache));
  renderHistorySidebar();
}

function renderHistorySidebar() {
  const container = document.getElementById('chatHistory');
  if (!container) return;
  if (!state.historyCache.length) {
    container.innerHTML = `<div style="padding:14px 12px;text-align:center;color:var(--text-muted);font-size:0.8rem;">Chưa có câu hỏi nào</div>`;
    return;
  }
  container.innerHTML = state.historyCache.map(m => `
    <div class="history-item" onclick="loadHistoryItem(${m.id})" title="${escapeHtml(m.message)}">
      <span class="history-icon">📖</span>
      <span class="history-text">${escapeHtml(m.message)}</span>
    </div>
  `).join('');
}

window.loadHistoryItem = function (id) {
  const msg = state.historyCache.find(m => m.id === id);
  if (!msg) return;
  const welcomeScreen = document.getElementById('welcomeScreen');
  if (welcomeScreen) {
    welcomeScreen.classList.add('hidden');
    welcomeScreen.style.display = 'none';
  }
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  chatMessages.querySelectorAll('.message-row').forEach(r => r.remove());
  appendUserMessage(msg.message, msg.created_at);
  appendAiMessage(msg.response, msg.topic_display, msg.created_at);
  if (window.innerWidth <= 992) closeSidebar();
};

window.askTopic = function (topicName) {
  if (window.innerWidth <= 992) closeSidebar();
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.value = topicName;
    handleInputResize();
    sendMessage();
  }
};

window.sendSuggested = function (btn) {
  const span = btn.querySelector('span:last-child') || btn;
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.value = span.textContent.trim();
    handleInputResize();
    sendMessage();
  }
};

window.copyMessageText = function (btn) {
  const row = btn.closest('.message-row');
  const bubble = row ? row.querySelector('.message-bubble') : null;
  if (!bubble) return;
  const txt = bubble.innerText || bubble.textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(txt).then(() => showToast('Đã sao chép nội dung!', 'success'));
  }
};

function handleInputResize() {
  const chatInput = document.getElementById('chatInput');
  const btnSend = document.getElementById('btnSend');
  if (!chatInput) return;
  chatInput.style.height = 'auto';
  chatInput.style.height = `${Math.min(Math.max(chatInput.scrollHeight, 24), 120)}px`;
  if (btnSend) btnSend.disabled = chatInput.value.trim().length === 0 || state.isSending;
}

window.toggleSidebar = function () {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar || !overlay) return;
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
};

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

window.startNewChat = function () {
  const chatMessages = document.getElementById('chatMessages');
  const welcomeScreen = document.getElementById('welcomeScreen');
  if (chatMessages) chatMessages.querySelectorAll('.message-row').forEach(r => r.remove());
  if (welcomeScreen) {
    welcomeScreen.classList.remove('hidden');
    welcomeScreen.style.display = '';
  }
  if (window.innerWidth <= 992) closeSidebar();
};

window.toggleTheme = function () {
  const html = document.documentElement;
  const next = (html.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('toan_hoc_vui_theme', next);
};

window.handleLogout = function () {
  const overlay = document.getElementById('authOverlay');
  if (overlay) overlay.classList.remove('hidden');
};

window.handleQuickJoin = function (e) {
  if (e) e.preventDefault();
  const input = document.getElementById('studentFullname');
  const name = input && input.value.trim() ? input.value.trim() : 'Học sinh Lớp 6';
  localStorage.setItem('toan_hoc_vui_student_name', name);
  const profileName = document.getElementById('profileName');
  if (profileName) profileName.textContent = name;
  const overlay = document.getElementById('authOverlay');
  if (overlay) overlay.classList.add('hidden');
  showToast(`Chào ${name}! Cùng tra cứu Sổ Tay Hỏi Đáp Toán 6 nhé!`, 'success');
};

document.addEventListener('DOMContentLoaded', () => {
  // Đồng bộ tên học sinh từ Game Bài 11 / Bài 12
  let studentName = localStorage.getItem('toan_hoc_vui_student_name') || '';
  if (!studentName) {
    try {
      const s11 = JSON.parse(localStorage.getItem('toan6_bai11_game_state') || '{}');
      const s12 = JSON.parse(localStorage.getItem('toan6_bai12_game_state') || '{}');
      studentName = s11.playerName || s12.playerName || 'Học sinh Lớp 6';
    } catch (e) {
      studentName = 'Học sinh Lớp 6';
    }
  }
  const profileName = document.getElementById('profileName');
  if (profileName) profileName.textContent = studentName;

  try {
    const savedHist = JSON.parse(localStorage.getItem('sotay_toan6_history') || '[]');
    if (Array.isArray(savedHist)) state.historyCache = savedHist;
  } catch (e) {}
  renderHistorySidebar();

  const savedTheme = localStorage.getItem('toan_hoc_vui_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('input', handleInputResize);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});
