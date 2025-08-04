import React, { useState } from "react";
import faqData from "../data/faq.json";
import logoBapperida from "../assets/logo-bapperida2.png";

function Chatbot() {
  const [messages, setMessages] = useState([]);

  // Fungsi kirim FAQ ke chat
  const handleFAQClick = (faq) => {
    const userMessage = { sender: "user", text: faq.short };
    const botMessage = { sender: "bot", text: faq.answer };
    setMessages(prev => [...prev, userMessage, botMessage]);
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
          <img src={logoBapperida} alt="Logo Bapperida" style={{ height: "40px", marginBottom: "10px" }} />
          <h3 style={{ margin: 0 }}>Chatbot Bapperida Kota Bandung</h3>
        </div>

        {/* FAQ Buttons */}
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
                onClick={() => handleFAQClick(faq)}
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
      </div>
    </div>
  );
}

export default Chatbot;
