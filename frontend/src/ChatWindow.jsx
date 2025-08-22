import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import { UserButton, useUser } from "@clerk/clerk-react";

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
        throw new Error('Failed to get response');
      }
      
      const res = await response.json();
      setReply(res.reply);
      getAllThreads();
    } catch (err) {
      console.error("Error getting reply:", err);
      // You might want to show an error message to the user here
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
              }
            }}
          />
        </div>
      </div>

      <div className="chatContainer" ref={chatContainerRef}>
        <Chat />
      </div>

      {loading && (
        <div className="loaderAboveInput">
          <ScaleLoader color="#fff" loading={true} />
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
          LuminaAI can make mistakes. Check important info. Your chats are private to your account.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;