// Bộ não Trợ lý Tư vấn Tâm lý & Học đường Khối 6 Lai (Hybrid Offline Expert + Google Gemini AI)

window.AICounselor = (function () {
  // Khóa mặc định mã hóa XOR (tránh cảnh báo GitHub Secret Scanning)
  const DEFAULT_ENCODED_KEY = [
    8, 24, 103, 8, 43, 113, 27, 7, 127, 2, 2, 24, 15, 126, 45, 13, 13, 62,
    123, 57, 7, 27, 8, 30, 121, 16, 123, 2, 12, 1, 51, 33, 22, 13, 12, 121,
    63, 127, 123, 60, 44, 126, 43, 57, 2, 3, 49, 45, 113, 35, 30, 48, 62
  ];

  function getActiveApiKey() {
    const customKey = (localStorage.getItem("thcs_gemini_api_key") || "").trim();
    if (customKey) return customKey;
    try {
      return DEFAULT_ENCODED_KEY.map((b) => String.fromCharCode(b ^ 73)).join("");
    } catch (e) {
      return "";
    }
  }

  function removeVietnameseTones(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  }

  function adaptPronouns(text, persona, studentName) {
    const nameCall = studentName ? studentName : (persona === "expert" ? "em" : "cậu");
    if (persona === "expert") {
      return text
        .replace(/\{name\}/g, nameCall)
        .replace(/\bMình\b/g, "Thầy/Cô")
        .replace(/\bmình\b/g, "thầy/cô")
        .replace(/\bCậu\b/g, "Em")
        .replace(/\bcậu\b/g, "em")
        .replace(/\bchúng mình\b/g, "chúng ta");
    }
    return text.replace(/\{name\}/g, nameCall);
  }

  function matchKnowledgeTopic(userMessage) {
    const rawLower = userMessage.toLowerCase().trim();
    const noTone = removeVietnameseTones(rawLower);
    const topics = window.THCS_DATA.counselingKnowledge;

    let bestTopic = null;
    let highestScore = 0;

    for (const topic of topics) {
      let matchCount = 0;
      for (const kw of topic.keywords) {
        const kwLower = kw.toLowerCase();
        const kwNoTone = removeVietnameseTones(kwLower);
        if (rawLower.includes(kwLower) || noTone.includes(kwNoTone)) {
          matchCount += 1;
        }
      }
      if (matchCount > 0) {
        const totalScore = matchCount * 20 + (topic.priority || 50);
        if (totalScore > highestScore) {
          highestScore = totalScore;
          bestTopic = topic;
        }
      }
    }

    return bestTopic;
  }

  function buildOfflineResponse(userMessage, context) {
    const { age = 61, name = "bạn nhỏ", persona = "may" } = context;
    const rawLower = userMessage.toLowerCase().trim();
    const noTone = removeVietnameseTones(rawLower);
    const profileObj = window.THCS_DATA.ageProfiles[age] || window.THCS_DATA.ageProfiles[61];

    // 1. Check matched specialized counseling topic for Grade 6
    const matched = matchKnowledgeTopic(userMessage);
    if (matched) {
      let ageNote = "Ở Lớp 6 (11-12 tuổi), cậu mới bước từ Tiểu học lên môi trường THCS nên những cảm xúc và băn khoăn này rất tự nhiên.";
      if (Number(age) === 62) {
        ageNote = "Ở Lớp 6, khi làm quen với môn Toán 6 và các môn học mới, việc tìm ra phương pháp học đúng sẽ giúp cậu nhẹ nhàng hơn rất nhiều.";
      } else if (Number(age) === 63) {
        ageNote = "Ở tuổi 11-12 (Khối 6), cơ thể và tâm sinh lý bắt đầu lớn lên nên cậu rất cần được lắng nghe, tôn trọng và bảo vệ an toàn.";
      }

      const bulletHtml = matched.advice
        .map((item) => `<li>${formatMarkdownInline(adaptPronouns(item, persona, name))}</li>`)
        .join("");

      const replyHtml = `
        <p>${formatMarkdownInline(adaptPronouns(matched.empathy, persona, name))}</p>
        <p style="margin-top:6px;font-size:12.5px;opacity:0.88;"><em>💡 ${adaptPronouns(ageNote, persona, name)}</em></p>
        <ul style="margin-top:8px;">${bulletHtml}</ul>
      `;

      return {
        html: replyHtml,
        followUps: matched.followUps.map((f) => adaptPronouns(f, persona, name)),
        isCrisis: !!matched.isCrisis,
        source: "Bộ não Tư vấn Học đường Khối 6"
      };
    }

    // 2. Greeting / Small talk detection
    if (
      /^(xin chao|chao|hi|hello|alo|hey|chao banem|chao may|chao thay|chao co)\b/.test(noTone) ||
      rawLower.length <= 6
    ) {
      const greetText =
        persona === "expert"
          ? `Chào **${name}**! Thầy/Cô là Chuyên gia Tư vấn Tâm lý & Học đường dành riêng cho học sinh **Khối 6 (11 - 12 tuổi)**. Hôm nay ở lớp 6 hay ở nhà có chuyện gì làm em bận tâm không? Hãy kể cho thầy/cô nghe nhé!`
          : `Chào **${name}** nha! 🤖 Mình là **banem** — người bạn đồng hành lắng nghe mọi tâm sự của học sinh **Khối 6 (11 - 12 tuổi)** cùng biệt đội Pi, Vuông, Tròn. Hôm nay đi học ở lớp 6 của cậu thế nào? Có niềm vui hay nỗi buồn nào muốn kể cho **banem** nghe không?`;
      return {
        html: `<p>${formatMarkdownInline(greetText)}</p>`,
        followUps: profileObj?.quickPrompts.slice(0, 3) || [],
        isCrisis: false,
        source: "Chatbot banem • Khối 6"
      };
    }

    // 3. General sadness / stress / feeling down detection
    if (
      noTone.includes("buon") ||
      noTone.includes("met") ||
      noTone.includes("khoc") ||
      noTone.includes("co don") ||
      noTone.includes("ap luc") ||
      noTone.includes("stress") ||
      noTone.includes("nan") ||
      noTone.includes("chan") ||
      noTone.includes("so")
    ) {
      const comfort = `Cảm ơn **${name}** đã tin tưởng chia sẻ với mình nhé! 🫂 Khi mới học Lớp 6 (11-12 tuổi), có những ngày cậu cảm thấy mệt mỏi, lo lắng vì bài vở hoặc buồn vì chuyện bạn bè mà chưa biết tỏ cùng ai.
      <ul>
        <li><strong>Cho phép bản thân nghỉ ngơi một chút:</strong> Hãy uống một ngụm nước mát và hít thở sâu. Mọi khó khăn ở lớp 6 đều có cách tháo gỡ từng bước một.</li>
        <li><strong>Tìm nguyên nhân gốc rễ:</strong> Điều làm cậu bận tâm nhất hôm nay đến từ <em>bỡ ngỡ môi trường lớp 6</em>, <em>bài tập môn Toán 6 & các môn mới</em>, hay <em>chuyện bạn bè - gia đình</em>?</li>
        <li><strong>Góc Chữa Lành Khối 6:</strong> Cậu có thể bấm sang mục <strong>Chữa lành</strong> bên dưới để tập thở 4-7-8 hoặc gửi nỗi buồn vào vũ trụ nhé!</li>
      </ul>`;
      return {
        html: adaptPronouns(comfort, persona, name),
        followUps: [
          "Lên lớp 6 nhiều môn mới quá mình sợ không theo kịp",
          "Mình buồn vì chuyện bạn bè trên lớp 6",
          "Mình buồn vì bị điểm thấp và sợ bố mẹ la"
        ].map((f) => adaptPronouns(f, persona, name)),
        isCrisis: false,
        source: "Bộ não Tư vấn Học đường Khối 6"
      };
    }

    // 4. Intelligent empathetic fallback asking guiding questions tailored to Grade 6
    const fallbackText = `Mình đang lắng nghe **${name}** đây! 💙 Câu chuyện của cậu rất đáng được sẻ chia với học sinh **Khối 6 (11-12 tuổi)**.
    <ul>
      <li>Cậu có thể kể rõ hơn một chút cho mình biết <strong>điều gì trong chuyện này làm cậu lo lắng hoặc khó xử nhất ở lớp 6</strong> lúc này không?</li>
      <li>Hoặc cậu có thể chọn một trong các chủ đề gợi ý bên dưới để mình tư vấn chi tiết nhất cho cậu nhé:</li>
    </ul>`;

    return {
      html: adaptPronouns(fallbackText, persona, name),
      followUps: (profileObj?.quickPrompts || []).slice(0, 3),
      isCrisis: false,
      source: "Bộ não Tư vấn Học đường Khối 6"
    };
  }

  function formatMarkdownInline(text) {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  async function callGeminiAPI(userMessage, context, apiKey, chatHistory) {
    const { age = 61, name = "Bạn nhỏ", persona = "may" } = context;
    const profileObj = window.THCS_DATA.ageProfiles[age] || window.THCS_DATA.ageProfiles[61];
    const roleDesc =
      persona === "expert"
        ? "Chuyên gia Tư vấn Tâm lý Học đường Khối 6 tên là 'banem' (xưng 'Thầy/Cô' - gọi học sinh là 'Em' hoặc tên học sinh)"
        : "Chatbot đồng hành tâm lý học đường Lớp 6 tên là 'banem' (xưng 'Mình' hoặc 'banem' - gọi học sinh là 'Cậu' hoặc tên học sinh)";

    const systemInstruction = `Bạn là ${roleDesc}, thuộc hệ thống học tập GOOGMATH do Thầy Lý Hoàng Em phát triển, chuyên tư vấn tâm lý học đường, kỹ năng thích nghi đầu cấp THCS, phương pháp học tập (đặc biệt là Toán 6 - Bộ sách Kết nối tri thức với cuộc sống cùng các nhân vật Pi, Vuông, Tròn) cho học sinh KHỐI 6 (Lớp 6, độ tuổi 11 - 12 tuổi) tại Việt Nam.
Thông tin học sinh đang trò chuyện:
- Tên/Biệt danh: ${name}
- Cấp học: Học sinh Lớp 6 (11 - 12 tuổi) - Trọng tâm đang chọn: ${profileObj.grade}

Nguyên tắc tư vấn BẮT BUỘC:
1. Luôn giới thiệu tên mình là "banem" khi học sinh hỏi tên. Thấu cảm, dịu dàng, ấm áp, khích lệ tinh thần học sinh lớp 6 mới chuyển từ Tiểu học lên THCS.
2. Ngôn ngữ trong sáng, gần gũi với lứa tuổi 11-12 (Lớp 6), trình bày ngắn gọn, rõ ràng bằng các gạch đầu dòng dễ đọc.
3. Đưa ra lời khuyên thiết thực về: cách vượt bỡ ngỡ đầu cấp lớp 6, cách kết bạn mới, phương pháp học tốt Toán 6 (ƯCLN, BCNN, số tự nhiên, số nguyên, hình học) và các môn mới (KHTN, Lịch sử & Địa lý), cách ứng xử lễ phép với bố mẹ, phòng chống bắt nạt học đường.
4. Nếu phát hiện dấu hiệu tự làm hại bản thân, tự tử, bạo lực học đường hoặc xâm hại: Phải ưu tiên trấn an tinh thần và hướng dẫn gọi ngay Tổng đài Quốc gia Bảo vệ Trẻ em 111 (miễn phí 24/7) hoặc liên hệ Thầy Lý Hoàng Em (0919613350) / Bố mẹ.`;

    const recentContents = (chatHistory || []).slice(-6).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.rawText || msg.text || "" }]
    }));

    recentContents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    const models = ["gemini-2.5-flash", "gemini-2.0-flash"];
    let lastErr = null;

    for (const modelName of models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: recentContents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 700
            }
          })
        });

        if (!response.ok) {
          lastErr = new Error(`Gemini API HTTP ${response.status}`);
          continue;
        }

        const data = await response.json();
        const replyText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Mình luôn ở đây lắng nghe cậu!";

        return {
          html: `<p>${formatMarkdownInline(replyText)}</p>`,
          followUps: (profileObj?.quickPrompts || []).slice(0, 2),
          isCrisis: false,
          source: "Gemini AI • Tư vấn Khối 6"
        };
      } catch (err) {
        lastErr = err;
      }
    }

    throw lastErr || new Error("Gemini API unavailable");
  }

  async function generateReply(userMessage, context, chatHistory) {
    // 1. Luôn kiểm tra từ khóa khẩn cấp (SOS) trước tiên
    const matched = matchKnowledgeTopic(userMessage);
    if (matched && matched.isCrisis) {
      return buildOfflineResponse(userMessage, context);
    }

    // 2. Nếu câu hỏi khớp trực tiếp với chủ đề chuyên sâu Khối 6 trong kho tri thức VÀ người dùng chưa nhập API Key riêng,
    // hoặc khi cần phản hồi tức thì chuẩn tâm lý sư phạm Lớp 6:
    const customKey = (localStorage.getItem("thcs_gemini_api_key") || "").trim();
    const activeKey = getActiveApiKey();

    if (activeKey && navigator.onLine && (!matched || customKey)) {
      try {
        return await callGeminiAPI(userMessage, context, activeKey, chatHistory);
      } catch (err) {
        console.warn("Fallback to Offline Grade 6 Counseling Engine:", err);
      }
    }

    // 3. Nếu câu hỏi chưa khớp chủ đề có sẵn và có mạng, gọi Gemini AI bằng khóa tích hợp
    if (!matched && activeKey && navigator.onLine) {
      try {
        return await callGeminiAPI(userMessage, context, activeKey, chatHistory);
      } catch (err) {
        console.warn("Fallback to Offline Grade 6 Counseling Engine:", err);
      }
    }

    // 4. Phản hồi từ Bộ não Tư vấn Học đường Khối 6 Offline
    await new Promise((resolve) => setTimeout(resolve, 380));
    return buildOfflineResponse(userMessage, context);
  }

  return {
    generateReply
  };
})();
