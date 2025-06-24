import React, { useState } from "react";
import { BsChatDots, BsX } from "react-icons/bs";

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessages = [...messages, { text: chatInput, sender: "user" }];
    setMessages(newMessages);
    setChatInput("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { text: data.reply, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "⚡ Response timed out, try again!", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="position-fixed bottom-0 end-0 mb-4 me-4" style={{ zIndex: 1050 }}>
        <button
          className="btn btn-primary rounded-circle shadow"
          style={{ width: "60px", height: "60px" }}
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? <BsX size={30} /> : <BsChatDots size={30} />}
        </button>
      </div>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div
          className="position-fixed bottom-0 end-0 mb-5 me-4 card shadow-lg"
          style={{
            width: "350px",
            height: "450px",
            backgroundColor: "white",
            zIndex: 1051,
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Chatbot Header */}
          <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
            <h6 className="m-0">Agri Bot 🌱🤖</h6>
            <button className="btn btn-sm btn-light" onClick={() => setIsChatOpen(false)}>
              <BsX size={20} />
            </button>
          </div>

          {/* Chatbot Messages */}
          <div
            className="card-body flex-grow-1"
            style={{ overflowY: "auto", background: "#f8f9fa", padding: "10px" }}
          >
            {messages.length === 0 ? (
              <p className="text-muted text-center">Start a conversation...</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex mb-2 ${
                    msg.sender === "user" ? "justify-content-end" : "justify-content-start"
                  }`}
                >
                  <span
                    className={`badge p-2 ${
                      msg.sender === "user" ? "bg-primary text-white" : "bg-success text-white"
                    }`}
                    style={{
                      maxWidth: "80%",
                      whiteSpace: "pre-line",
                      textAlign: "left",
                      lineHeight: "1.4",
                      padding: "8px 12px",
                      borderRadius: "10px",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))
            )}
            {loading && (
              <p className="text-muted small text-center">Bot is thinking... 🤔</p>
            )}
          </div>

          {/* Chat Input */}
          <div className="card-footer p-2">
            <form className="input-group" onSubmit={handleChatSubmit}>
              <input
                type="text"
                className="form-control"
                placeholder="Ask something..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={loading}
              />
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
