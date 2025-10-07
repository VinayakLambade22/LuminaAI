import "./Chat.css";
import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat({ chatContainerRef }) {
  const { newChat, prevChats, reply, setReply, setPrevChats } =
    useContext(MyContext);
  const [typingReply, setTypingReply] = useState("");

  const typingReplyRef = useRef(typingReply);
  useEffect(() => {
    typingReplyRef.current = typingReply;
  }, [typingReply]);

  useEffect(() => {
    let interval;
    if (reply) {
      setTypingReply("");
      const words = reply.split(" ");
      let idx = 0;
      interval = setInterval(() => {
        if (idx < words.length) {
          setTypingReply((prev) => prev + (prev ? " " : "") + words[idx]);
          idx++;
        } else {
          clearInterval(interval);
          setReply(null);
        }
      }, 40);
    }

    return () => {
      clearInterval(interval);
      if (
        reply &&
        typingReplyRef.current.length > 0 &&
        typingReplyRef.current.length < reply.length
      ) {
        setPrevChats((prev) => {
          const updatedChats = [...prev];
          if (updatedChats.length > 0) {
            updatedChats[updatedChats.length - 1].content =
              typingReplyRef.current;
          }
          return updatedChats;
        });
      }
    };
  }, [reply, setReply, setPrevChats]);

  useLayoutEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const scrollThreshold = 100;

    const isScrolledToBottom =
      chatContainer.scrollHeight -
        chatContainer.scrollTop -
        chatContainer.clientHeight <=
      scrollThreshold;

    if (isScrolledToBottom) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [prevChats, typingReply]);

  return (
    <div className="chatContent">
      {newChat && <h1>What's on your mind today?</h1>}
      <div className="chats">
        {(reply ? prevChats.slice(0, -1) : prevChats).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {reply && (
          <div className="gptDiv">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {typingReply}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
