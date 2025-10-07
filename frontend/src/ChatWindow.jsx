import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import { UserButton } from "@clerk/clerk-react";
import { useTheme } from "./ThemeContext.jsx";
import { API_BASE_URL } from "./config.js";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    getAllThreads,
    makeAuthenticatedRequest,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
    };

    recognitionRef.current = recognition;
  }, [setPrompt]);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setNewChat(false);
    setPrevChats((prevChats) => [
      ...prevChats,
      {
        role: "user",
        content: prompt,
      },
    ]);
    const currentPrompt = prompt;
    setPrompt("");

    const options = {
      method: "POST",
      body: JSON.stringify({
        message: currentPrompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await makeAuthenticatedRequest(
        `${API_BASE_URL}/chat`,
        options
      );

      if (!response.ok) {
        setReply("Sorry, I couldn't process your request.");
        throw new Error("Failed to get response");
      }

      const res = await response.json();
      setReply(res.reply || "Sorry, I couldn't process your request.");
      getAllThreads();
    } catch (err) {
      console.error("Error getting reply:", err);
      setReply("Sorry, I couldn't process your request.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
  }, [reply, setPrevChats]);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          LuminaAI <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userSection">
          <button className="themeToggle" onClick={toggleTheme}>
            {isDarkMode ? (
              <i className="fa-solid fa-sun"></i>
            ) : (
              <i className="fa-solid fa-moon"></i>
            )}
          </button>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "userAvatar",
                userButtonPopoverCard: "userPopover",
              },
              variables: {
                colorBackground: "#ffffff",
                colorText: "#1a1a1a",
              },
            }}
          />
        </div>
      </div>

      <div className="chatContainer" ref={chatContainerRef}>
        <Chat chatContainerRef={chatContainerRef} />
      </div>

      {!loading && reply && (
        <div className="stop-generating-container">
          <button
            onClick={() => setReply(null)}
            className="stop-generating-button"
          >
            <i className="fa-solid fa-stop"></i> Stop generating
          </button>
        </div>
      )}

      {loading && (
        <div className="loaderAboveInput">
          <ScaleLoader color={isDarkMode ? "#fff" : "#000"} loading={true} />
        </div>
      )}

      <div className="chatInput">
        <div className="inputBox">
          <button
            onClick={handleMicClick}
            className={`mic-button ${isListening ? "listening" : ""}`}
            disabled={loading}
          >
            <i className="fa-solid fa-microphone"></i>
          </button>
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
            disabled={loading}
          />
          <div
            id="submit"
            onClick={getReply}
            className={loading || !prompt.trim() ? "disabled" : ""}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          LuminaAI can make mistakes. Check important info. Your chats are
          private to your account.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
