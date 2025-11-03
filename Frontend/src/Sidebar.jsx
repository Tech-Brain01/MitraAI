import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mycontext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { apiFetch } from "./apiClient";
import logo from "./assets/logo.png";
import ModelSelector from "./ModelSelector.jsx";


function Sidebar({ isMobileOpen, closeMobileMenu }) {
  const navigate = useNavigate();
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    setShowSandbox,
  } = useContext(Mycontext);

  const getAllThreads = async () => {
    try {
      const res = await apiFetch("/thread");
      const filteredData = (res || []).map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      // console.log(filteredData);
      setAllThreads(filteredData);
      // console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    const newThreadId = uuidv1();
    setCurrThreadId(newThreadId);
    setPrevChats([]);
    setShowSandbox(false); // Close sandbox when creating new chat
    navigate('/chat'); // Navigate to /chat without thread ID
    
    // Close mobile menu after creating new chat
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    setShowSandbox(false); // Close sandbox when switching threads
    navigate(`/chat/${newThreadId}`); // Navigate to thread-specific URL

    try {
      const res = await apiFetch(`/thread/${newThreadId}`);
      // console.log(res);
      setPrevChats(res.messages || []);
      setNewChat(false);
      setReply(null);
      
      // Close mobile menu after selecting thread
      if (closeMobileMenu) {
        closeMobileMenu();
      }
    } catch (err) {
      console.log(err);
    }
  };

const deleteThread = async (threadId) => {
  try {
   const response = await apiFetch(`/thread/${threadId}`, {method: 'DELETE'});
   const res = await response;
  //  console.log(res);

  setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
  
  if (threadId === currThreadId) {
    createNewChat();
  }

  } catch (err) {
     console.error("Error deleting thread:", err);
  }
}

  return (
    <section className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Model Selector */}
      <div className="sidebar-model-selector">
        <ModelSelector />
      </div>

      {/* new chat button */}
      <button onClick={createNewChat}>
        <img className="logo" src={logo} alt="MitraAI logo"></img>
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* history */}

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            <span className="threadTitle">{thread.title}</span>
            <i
              className="fa-solid fa-trash"
              title="Delete"
              aria-hidden="true"
              onClick={(e) => {
                e.stopPropagation()
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* sign */}

      <div className="sign"></div>
      <p>By Amrendera Singh Tomar tomar.amrendera@outlook.com &hearts;</p>
    </section>
  );
}

export default Sidebar;
