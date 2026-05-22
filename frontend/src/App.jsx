import { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  // =========================
  // MAIN STATES
  // =========================

  const [file, setFile] = useState(null);

  const [summary, setSummary] = useState("");

  const [loading, setLoading] = useState(false);

  const [charts, setCharts] = useState([]);

  // =========================
  // AI CHAT STATES
  // =========================

  const [showChat, setShowChat] = useState(false);

  const [chatInput, setChatInput] = useState("");

  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hello 👋 Ask me anything about technology, coding, AI, data analytics, or uploaded documents.",
    },
  ]);

  const chatRef = useRef(null);

  const API_BASE = "https://insightiq-boi2.onrender.com";
  // =========================
  // CLOSE CHAT ON OUTSIDE CLICK
  // =========================

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target)
      ) {
        setShowChat(false);
      }
    }

    if (showChat) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [showChat]);

  // =========================
  // SCROLL FUNCTION
  // =========================

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // =========================
  // FILE UPLOAD
  // =========================

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(
      `${API_BASE}/upload`,
       formData
      );

      setSummary(response.data.summary);

      if (response.data.charts) {
        setCharts(
           response.data.charts.map(
            (chart) =>
              `https://insightiq-boi2.onrender.com/${chart}`
          )
        );
      } else {
        setCharts([]);
      }

      scrollToSection("analytics");
    } catch (error) {
      console.error(error);

      setSummary(
        "AI analysis is temporarily unavailable. Please try again later."
      );

      setCharts([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // AI CHAT
  // =========================

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const updatedMessages = [
      ...chatMessages,
      {
        sender: "user",
        text: chatInput,
      },
    ];

    setChatMessages(updatedMessages);

    const currentMessage = chatInput;

    setChatInput("");

    try {
      const response = await axios.post(
        `${API_BASE}/ai-chat`,
        {
          message: currentMessage,
        }
      );

      const cleanedResponse = response.data.reply
        .replace(/#/g, "")
        .replace(/\*/g, "")
        .replace(/```/g, "");

      setChatMessages([
        ...updatedMessages,
        {
          sender: "ai",
          text: cleanedResponse,
        },
      ]);
    } catch (error) {
      console.error(error);

      setChatMessages([
        ...updatedMessages,
        {
          sender: "ai",
          text: "AI service is temporarily unavailable.",
        },
      ]);
    }
  };

  return (
    <div
      style={{
        zoom: "0.75",
        background:
          "linear-gradient(to bottom, #050816, #081122, #0b1020)",
        minHeight: "100vh",
        color: "white",
        fontFamily:
          "'Inter', 'Segoe UI', Arial, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}

      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          background: "rgba(5,8,22,0.82)",
          backdropFilter: "blur(18px)",
          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1500px",
            margin: "auto",
            padding: "26px 52px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "46px",
              fontWeight: "900",
              letterSpacing: "-1px",
              background:
                "linear-gradient(to right, #c084fc, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}
          >
            InsightIQ
          </h1>

          <div
            style={{
              display: "flex",
              gap: "34px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => scrollToSection("home")}
              style={navBtn}
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection("features")}
              style={navBtn}
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("analytics")}
              style={navBtn}
            >
              Analytics
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              style={navBtn}
            >
              AI Chat
            </button>

            <button
              onClick={() => scrollToSection("footer")}
              style={navBtn}
            >
              About
            </button>

            <button
              onClick={() => scrollToSection("upload")}
              style={{
                padding: "18px 34px",
                borderRadius: "999px",
                border: "none",
                background:
                  "linear-gradient(to right, #9333ea, #3b82f6)",
                color: "white",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "19px",
                boxShadow:
                  "0 0 30px rgba(147,51,234,0.4)",
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      <section
        id="home"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "180px 8% 120px",
          gap: "90px",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT */}

        <div
          style={{
            flex: 1,
            minWidth: "420px",
          }}
        >
          <p
            style={{
              color: "#8b93ff",
              letterSpacing: "5px",
              marginBottom: "26px",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            DOCUMENT INTELLIGENCE PLATFORM
          </p>

          <h1
            style={{
              fontSize: "clamp(48px, 6vw, 96px)",
              lineHeight: "1.05",
              marginBottom: "34px",
              fontWeight: "900",
              letterSpacing: "-3px",
            }}
          >
            Smarter Files.
            <br />
            Faster Insights.
          </h1>

          <p
            style={{
              fontSize: "clamp(18px, 2vw, 30px)",
              color: "#c5c7d0",
              lineHeight: "1.9",
              maxWidth: "760px",
            }}
          >
            Upload PDFs, TXT files, and Excel datasets
            to generate intelligent summaries, charts,
            analytics, AI insights, and smart responses
            in seconds.
          </p>

          <div
            style={{
              marginTop: "54px",
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => scrollToSection("upload")}
              style={primaryBtn}
            >
              Explore Platform
            </button>

            <button
              onClick={() => scrollToSection("features")}
              style={secondaryBtn}
            >
              Learn More
            </button>
          </div>

          {/* STATS */}

          <div
            style={{
              marginTop: "70px",
              display: "flex",
              gap: "26px",
              flexWrap: "wrap",
            }}
          >
            <div style={statCard}>
              <h2 style={statNumber}>3+</h2>
              <p style={statText}>File Formats</p>
            </div>

            <div style={statCard}>
              <h2 style={statNumber}>AI</h2>
              <p style={statText}>Powered Insights</p>
            </div>

            <div style={statCard}>
              <h2 style={statNumber}>24/7</h2>
              <p style={statText}>Smart Assistant</p>
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL */}

        <div
          style={{
            position: "relative",
            width: "520px",
            height: "520px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at top left, #a855f7, #1e293b 65%)",
              boxShadow:
                "0 0 140px rgba(168,85,247,0.7), 0 0 180px rgba(59,130,246,0.35)",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px",
              height: "300px",
              borderRadius: "36px",
              background:
                "rgba(255,255,255,0.08)",
              backdropFilter: "blur(22px)",
              border:
                "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "120px",
              fontWeight: "900",
            }}
          >
            IQ
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* FEATURES */}
      {/* ========================= */}

      <section
        id="features"
        style={{
          padding: "120px 6%",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "70px",
          }}
        >
          <p
            style={{
              color: "#8b93ff",
              fontSize: "20px",
              fontWeight: "700",
              letterSpacing: "4px",
            }}
          >
            CORE FEATURES
          </p>

          <h1
            style={{
              fontSize: "clamp(40px, 5vw, 72px)",
              marginTop: "20px",
              marginBottom: "0",
            }}
          >
            Powerful AI Workflow
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "34px",
          }}
        >
          <div style={featureCard}>
            <div style={iconBox}>🧠</div>

            <h2 style={featureTitle}>
              AI Summarization
            </h2>

            <p style={featureText}>
              Generate intelligent summaries from
              uploaded reports, datasets, and large
              documents instantly.
            </p>

            <button
              onClick={() => scrollToSection("upload")}
              style={cardBtn}
            >
              Try Now →
            </button>
          </div>

          <div style={featureCard}>
            <div style={iconBox}>📊</div>

            <h2 style={featureTitle}>
              Excel Analytics
            </h2>

            <p style={featureText}>
              Upload spreadsheets and automatically
              generate visual charts, insights, and
              data summaries.
            </p>

            <button
              onClick={() => scrollToSection("upload")}
              style={cardBtn}
            >
              Analyze Data →
            </button>
          </div>

          <div style={featureCard}>
            <div style={iconBox}>🤖</div>

            <h2 style={featureTitle}>
              AI Chat Assistant
            </h2>

            <p style={featureText}>
              Ask questions, explore ideas, and interact
              with a multi-model AI assistant directly
              inside the platform.
            </p>

            <button
              onClick={() => setShowChat(true)}
              style={cardBtn}
            >
              Open Chat →
            </button>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* UPLOAD */}
      {/* ========================= */}

      <section
        id="upload"
        style={{
          padding: "120px 6%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1150px",
            background:
              "linear-gradient(to bottom right, #0b1020, #111827)",
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: "36px",
            padding: "90px",
            textAlign: "center",
            boxShadow:
              "0 0 70px rgba(124,131,255,0.12)",
          }}
        >
          <p
            style={{
              color: "#8b93ff",
              letterSpacing: "5px",
              marginBottom: "20px",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            UPLOAD DOCUMENT
          </p>

          <h1
            style={{
              fontSize: "clamp(42px, 5vw, 78px)",
              marginBottom: "24px",
              lineHeight: "1.1",
            }}
          >
            Analyze Your File
          </h1>

          <p
            style={{
              color: "#c5c7d0",
              fontSize: "28px",
              marginBottom: "52px",
              lineHeight: "1.8",
            }}
          >
            Supports PDF, TXT, XLSX, and XLS analytics
          </p>

          <div
            style={{
              background: "#111827",
              borderRadius: "26px",
              padding: "50px",
              border:
                "2px dashed rgba(255,255,255,0.15)",
            }}
          >
            <input
              type="file"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
              style={{
                marginBottom: "36px",
                fontSize: "22px",
                color: "white",
              }}
            />

            <div>
              <button
                onClick={handleUpload}
                style={{
                  padding: "24px 52px",
                  borderRadius: "999px",
                  border: "none",
                  background:
                    "linear-gradient(to right, #9333ea, #3b82f6)",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "24px",
                  cursor: "pointer",
                  boxShadow:
                    "0 0 40px rgba(147,51,234,0.45)",
                }}
              >
                {loading
                  ? "Analyzing..."
                  : "Generate Insights"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* ANALYTICS */}
      {/* ========================= */}

      <section
        id="analytics"
        style={{
          padding: "60px 6%",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(to bottom right, #0b1020, #111827)",
            borderRadius: "36px",
            padding: "70px",
            border:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "36px",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(38px, 5vw, 68px)",
                margin: 0,
              }}
            >
              AI Analysis
            </h1>

            <div
              style={{
                background:
                  "rgba(147,51,234,0.18)",
                border:
                  "1px solid rgba(147,51,234,0.3)",
                padding: "16px 26px",
                borderRadius: "999px",
                fontSize: "18px",
                color: "#d8b4fe",
                fontWeight: "700",
              }}
            >
              Smart Document Intelligence
            </div>
          </div>

          <div
            style={{
              background: "#111827",
              padding: "52px",
              borderRadius: "28px",
              fontSize: "25px",
              lineHeight: "2",
              color: "#d1d5db",
              whiteSpace: "pre-wrap",
              minHeight: "340px",
              border:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {summary
              ? summary
              : "Upload a document to generate intelligent summaries, analytics, charts, and AI-powered insights."}
          </div>

          {/* ========================= */}
          {/* CHARTS */}
          {/* ========================= */}

          {charts.length > 0 && (
            <div
              style={{
                marginTop: "52px",
              }}
            >
              <h2
                style={{
                  fontSize: "42px",
                  marginBottom: "30px",
                }}
              >
                Generated Charts
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(360px, 1fr))",
                  gap: "30px",
                }}
              >
                {charts.map((chart, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#111827",
                      padding: "26px",
                      borderRadius: "28px",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      boxShadow:
                        "0 0 30px rgba(0,0,0,0.25)",
                    }}
                  >
                    <img
                      src={chart}
                      alt="Excel Chart"
                      style={{
                        width: "100%",
                        borderRadius: "18px",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================= */}
      {/* FLOATING AI CHAT */}
      {/* ========================= */}

      <div
        ref={chatRef}
        style={{
          position: "fixed",
          bottom: "34px",
          right: "34px",
          zIndex: 1000,
        }}
      >
        {showChat && (
          <div
            style={{
              width: "560px",
              height: "780px",
              background:
                "linear-gradient(to bottom, #0b1020, #111827)",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderRadius: "36px",
              overflow: "hidden",
              marginBottom: "24px",
              boxShadow:
                "0 0 80px rgba(124,131,255,0.25)",
              display: "flex",
              flexDirection: "column",
              backdropFilter: "blur(22px)",
            }}
          >
            {/* HEADER */}

            <div
              style={{
                padding: "34px",
                borderBottom:
                  "1px solid rgba(255,255,255,0.08)",
                background: "#111827",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(24px, 3vw, 42px)",
                  fontWeight: "900",
                }}
              >
                AI Assistant
              </h2>

              <p
                style={{
                  color: "#9ca3af",
                  marginTop: "14px",
                  fontSize: "20px",
                  lineHeight: "1.9",
                }}
              >
                Multi-model AI assistant powered by
                Gemini, OpenRouter, and Groq.
              </p>
            </div>

            {/* CHAT BODY */}

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                background: "#050816",
              }}
            >
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf:
                      msg.sender === "user"
                        ? "flex-end"
                        : "flex-start",

                    maxWidth: "92%",
                    padding: "26px",
                    borderRadius: "28px",

                    background:
                      msg.sender === "user"
                        ? "linear-gradient(to right, #9333ea, #3b82f6)"
                        : "#1f2937",

                    color: "white",
                    lineHeight: "2",
                    fontSize: "22px",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* INPUT */}

            <div
              style={{
                padding: "22px",
                borderTop:
                  "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                gap: "16px",
                background: "#111827",
              }}
            >
              <input
                type="text"
                placeholder="Ask anything..."
                value={chatInput}
                onChange={(e) =>
                  setChatInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                style={{
                  flex: 1,
                  padding: "22px",
                  borderRadius: "22px",
                  border: "none",
                  outline: "none",
                  background: "#1f2937",
                  color: "white",
                  fontSize: "22px",
                }}
              />

              <button
                onClick={sendMessage}
                style={{
                  padding: "20px 28px",
                  borderRadius: "20px",
                  border: "none",
                  background:
                    "linear-gradient(to right, #9333ea, #3b82f6)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* FLOAT BUTTON */}

        <button
          onClick={() => setShowChat(!showChat)}
          style={{
            width: "94px",
            height: "94px",
            borderRadius: "50%",
            border: "none",
            background:
              "linear-gradient(to right, #9333ea, #3b82f6)",
            color: "white",
            fontSize: "38px",
            cursor: "pointer",
            boxShadow:
              "0 0 46px rgba(147,51,234,0.7)",
            fontWeight: "900",
          }}
        >
          ✦
        </button>
      </div>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}

      <footer
        id="footer"
        style={{
          marginTop: "140px",
          padding: "100px 6%",
          borderTop:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "70px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(32px, 4vw, 56px)",
                marginBottom: "24px",
              }}
            >
              InsightIQ
            </h1>

            <p
              style={{
                color: "#9ca3af",
                maxWidth: "700px",
                lineHeight: "2",
                fontSize: "24px",
              }}
            >
              Intelligent document analytics platform
              for AI summaries, charts, smart insights,
              data visualization, and conversational AI
              assistance.
            </p>
          </div>

          <div>
            <h2
              style={{
                marginBottom: "24px",
                fontSize: "36px",
              }}
            >
              Contact Info
            </h2>

            <p style={footerText}>
              Email: support@insightiq.ai
            </p>

            <p style={footerText}>
              Help Desk: 24/7 AI Support
            </p>

            <p style={footerText}>
              Location: India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// =========================
// STYLES
// =========================

const navBtn = {
  background: "transparent",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: "600",
};

const primaryBtn = {
  padding: "24px 44px",
  borderRadius: "999px",
  border: "none",
  background: "white",
  color: "black",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "21px",
};

const secondaryBtn = {
  padding: "24px 44px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "transparent",
  color: "white",
  cursor: "pointer",
  fontSize: "21px",
};

const statCard = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "26px 34px",
  minWidth: "180px",
};

const statNumber = {
  fontSize: "42px",
  margin: 0,
  marginBottom: "10px",
};

const statText = {
  fontSize: "18px",
  color: "#b0b0b0",
  margin: 0,
};

const featureCard = {
  background:
    "linear-gradient(to bottom right, #0b1020, #111827)",
  padding: "50px",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  minHeight: "320px",
  boxShadow: "0 0 40px rgba(0,0,0,0.2)",
};

const iconBox = {
  width: "78px",
  height: "78px",
  borderRadius: "22px",
  background:
    "linear-gradient(to right, #9333ea, #3b82f6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "36px",
  marginBottom: "28px",
};

const featureTitle = {
  fontSize: "clamp(26px, 3vw, 44px)",
  marginBottom: "24px",
  marginTop: 0,
};

const featureText = {
  color: "#b0b0b0",
  fontSize: "clamp(16px, 1.5vw, 24px)",,
  lineHeight: "2",
  marginBottom: "34px",
};

const cardBtn = {
  padding: "18px 32px",
  borderRadius: "999px",
  border: "none",
  background:
    "linear-gradient(to right, #9333ea, #3b82f6)",
  color: "white",
  cursor: "pointer",
  fontSize: "19px",
  fontWeight: "700",
};

const footerText = {
  color: "#9ca3af",
  marginBottom: "18px",
  fontSize: "24px",
  lineHeight: "1.8",
};

export default App;