import "./Sidebar.css";
import { useContext, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { API_BASE_URL } from "./config.js";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    getAllThreads,
    makeAuthenticatedRequest,
  } = useContext(MyContext);

  const [isOpen, setIsOpen] = useState(false);
  const [loadingThread, setLoadingThread] = useState(null);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setLoadingThread(newThreadId);
    setCurrThreadId(newThreadId);

    try {
      const response = await makeAuthenticatedRequest(
        `${API_BASE_URL}/thread/${newThreadId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch thread");
      }

      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error("Error loading thread:", err);
      // Optionally show an error message to the user
    } finally {
      setLoadingThread(null);
    }
  };

  const deleteThread = async (threadId, e) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    try {
      const response = await makeAuthenticatedRequest(
        `${API_BASE_URL}/thread/${threadId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete thread");
      }

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }

      getAllThreads();
    } catch (err) {
      console.error("Error deleting thread:", err);
      // Optionally show an error message to the user
    }
  };

  return (
    <section className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      <div className="logoDiv">
        <img src="/blacklogo.png" alt="gpt logo" className="logo" />
        <span className="logoSidebar" onClick={toggleSidebar}>
          <svg
            className="bi bi-layout-sidebar"
            fill="currentColor"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H5zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2V2z" />
          </svg>
        </span>
      </div>

      {isOpen ? (
        <>
          <button className="newChat" onClick={createNewChat}>
            <span className="newChatIcon">
              <i className="fa-solid fa-pen-to-square"></i>
            </span>
            <span className="newChatText">New Chat</span>
          </button>

          <ul className="history">
            <p className="historyTitle">Chats</p>
            {allThreads?.map((thread, idx) => (
              <li
                key={idx}
                onClick={() => changeThread(thread.threadId)}
                className={
                  thread.threadId === currThreadId ? "highlighted" : ""
                }
              >
                {thread.title.length > 40
                  ? thread.title.substring(0, 40) + "..."
                  : thread.title}
                <i
                  className="fa-solid fa-trash"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(thread.threadId);
                  }}
                ></i>
              </li>
            ))}
          </ul>

          <div className="sign">
            <p>By LuminaAI &hearts;</p>
          </div>
        </>
      ) : (
        <>
          <button className="collapsedNewChat" onClick={createNewChat}>
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </>
      )}
    </section>
  );
}

export default Sidebar;
