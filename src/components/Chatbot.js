import React, { useState, useRef, useEffect } from "react";
import faqData from "../data/faq.json";
import logoBapperida from "../assets/logo-bapperida2.png";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFAQClick = (faq) => {
    const userMessage = { sender: "user", text: faq.short };
    const botMessage = { sender: "bot", text: faq.answer };
    setMessages((prev) => [...prev, userMessage, botMessage]);
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
        height: "600px",
        borderRadius: "15px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        
        {/* Header Tetap */}
        <div style={{
          backgroundColor: "#0072BC",
          color: "#FFFFFF",
          textAlign: "center",
          padding: "15px",
          flexShrink: 0
        }}>
          <img src={logoBapperida} alt="Logo Bapperida" style={{ height: "40px", marginBottom: "10px" }} />
          <h3 style={{ margin: 0 }}>Chatbot Bapperida Kota Bandung</h3>
        </div>

        {/* Chat Scrollable */}
        <div style={{
          flex: 1,
          padding: "10px",
          overflowY: "auto",
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
          <div ref={chatEndRef} />
        </div>

        {/* FAQ Buttons */}
        <div style={{
          padding: "10px",
          backgroundColor: "#F2F2F2",
          flexShrink: 0
        }}>
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
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ccc",
                  borderRadius: "20px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#FFD700"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#FFFFFF"}
                onClick={() => handleFAQClick(faq)}
              >
                {faq.short}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
