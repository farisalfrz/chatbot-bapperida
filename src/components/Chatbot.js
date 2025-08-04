import React, { useState } from "react";
import faqData from "../data/faq.json";
import logoBapperida from "../assets/logo-bapperida2.png";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const API_URL = "https://openrouter.ai/api/v1/chat/completions";
  const API_KEY = `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`;

  const SYSTEM_PROMPT = `
    Kamu adalah Chatbot resmi Bapperida Kota Bandung (Bappelitbang).
⚠️ Penting:
    - "Bapperida" di sini SELALU mengacu ke Badan Perencanaan Pembangunan, Penelitian dan Pengembangan Daerah Kota Bandung ATAU Badan Perencanaan Pembangunan Riset dan Inovasi Daerah Kota Bandung.
    - Abaikan semua referensi atau organisasi lain yang memiliki singkatan sama.
    - Jika pertanyaan di luar topik Bapperida Kota Bandung, jawab dengan:
    "Maaf, saya hanya dapat menjawab pertanyaan terkait Bapperida Kota Bandung."
    - Gunakan bahasa Indonesia yang formal dan jelas.
    `;

  // Fungsi cek FAQ
  const checkFAQ = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    const match = faqData.find(faq =>
      lowerInput.includes(faq.question)
    );
    return match ? match.answer : null;
  };

  // Fungsi kirim pesan manual
  const sendMessage = async () => {
    if (!input.trim()) return;
    handleUserInput(input);
  };

  // Fungsi handle input user atau klik FAQ
  const handleUserInput = async (userText) => {
    const userMessage = { sender: "user", text: userText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // 1️⃣ Cek FAQ dulu
    const faqAnswer = checkFAQ(userText);
    if (faqAnswer) {
      setMessages(prev => [...prev, { sender: "bot", text: faqAnswer }]);
      return;
    }

    // 2️⃣ Kalau tidak ada di FAQ → kirim ke OpenRouter
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userText }
          ]
        })
      });

      const data = await response.json();
      console.log("API Response:", data);

      let botText = "Maaf, saya tidak mengerti.";
      if (data.choices && data.choices.length > 0) {
        botText = data.choices[0].message.content;
      }

      // Filter agar tetap fokus ke Bapperida Kota Bandung
      const forbiddenTerms = ["provinsi", "kabupaten", "nasional", "organisasi lain"];
      if (forbiddenTerms.some(term => botText.toLowerCase().includes(term))) {
        botText = "Maaf, saya hanya dapat menjawab pertanyaan terkait Bapperida Kota Bandung.";
      }

      setMessages(prev => [...prev, { sender: "bot", text: botText }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Terjadi kesalahan. Silakan coba lagi nanti." }
      ]);
    }
  };

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#FFFFFF",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        backgroundColor: "#F2F2F2",
        width: "400px",
        borderRadius: "15px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: "#0072BC",
          color: "#FFFFFF",
          textAlign: "center",
          padding: "15px"
        }}>
          <img src={logoBapperida} alt="Logo Bapperida" style={{ height: "60px", marginBottom: "10px" }} />
          <h3 style={{ margin: 0 }}>Chatbot Bapperida Kota Bandung</h3>
        </div>

        {/* FAQ */}
        <div style={{ padding: "10px", backgroundColor: "#FFFFFF" }}>
          <b style={{ color: "#333333" }}>Pertanyaan Umum:</b>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            marginTop: "5px"
          }}>
            {faqData.map((faq, index) => (
              <button
                key={index}
                style={{
                  backgroundColor: "#F2F2F2",
                  border: "1px solid #ccc",
                  borderRadius: "20px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#FFD700"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#F2F2F2"}
                onClick={() => handleUserInput(faq.question)}
              >
                {faq.short}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div style={{
          flex: 1,
          padding: "10px",
          overflowY: "scroll",
          backgroundColor: "#FFFFFF"
        }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
              }}
            >
              <div style={{
                backgroundColor: msg.sender === "user" ? "#0072BC" : "#4CAF50",
                color: "#FFFFFF",
                padding: "8px 12px",
                borderRadius: "15px",
                maxWidth: "70%",
                fontSize: "14px"
              }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{
          display: "flex",
          padding: "10px",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #ccc"
        }}>
          <input
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px"
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pertanyaan..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            style={{
              backgroundColor: "#0072BC",
              color: "#FFFFFF",
              border: "none",
              padding: "8px 15px",
              marginLeft: "5px",
              borderRadius: "20px",
              cursor: "pointer"
            }}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;