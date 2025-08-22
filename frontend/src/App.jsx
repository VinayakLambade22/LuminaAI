import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import AuthPage from "./AuthPage.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = await getToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  const getAllThreads = async () => {
    if (!isSignedIn) return;

    try {
      const response = await makeAuthenticatedRequest(
        "http://localhost:8080/api/thread"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch threads");
      }

      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.error("Error fetching threads:", err);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getAllThreads();
    } else if (isLoaded && !isSignedIn) {
      setAllThreads([]);
      setPrevChats([]);
      setPrompt("");
      setReply(null);
      setCurrThreadId(uuidv1());
      setNewChat(true);
    }
  }, [isLoaded, isSignedIn]);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
    getAllThreads,
    makeAuthenticatedRequest,
  };

  return (
    <div className="app">
      <SignedOut>
        <AuthPage />
      </SignedOut>

      <SignedIn>
        <MyContext.Provider value={providerValues}>
          <Sidebar />
          <ChatWindow />
        </MyContext.Provider>
      </SignedIn>
    </div>
  );
}

export default App;
