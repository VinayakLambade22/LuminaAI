import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useTheme } from "./ThemeContext.jsx";

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
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef(null);
  const { user } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();

  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await makeAuthenticatedRequest(
        "http://localhost:8080/api/chat",
        options
      );

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const res = await response.json();
      setReply(res.reply);
      getAllThreads();
    } catch (err) {
      console.error("Error getting reply:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [reply, loading]);

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]);

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
        <Chat />
      </div>

      {loading && (
        <div className="loaderAboveInput">
          <ScaleLoader color={isDarkMode ? "#fff" : "#000"} loading={true} />
        </div>
      )}

      <div className="chatInput">
        <div className="inputBox">
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
            className={loading ? "disabled" : ""}
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
