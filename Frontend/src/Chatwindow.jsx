import Chat from "./Chat";
import "./Chatwindow.css";
import { Mycontext } from "./MyContext.jsx";
import { apiFetch } from "./apiClient";
import { useContext, useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import CodeSandbox from "./CodeSandbox.jsx";
import Settings from "./Settings.jsx";
import UpgradePlan from "./UpgradePlan.jsx";

function Chatwindow() {
  const { threadId } = useParams(); // Get threadId from URL
  const navigate = useNavigate();
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    showSandbox,
    setShowSandbox,
    user,
    setUser,
    setIsAuthenticated,
  } = useContext(Mycontext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgradePlan, setShowUpgradePlan] = useState(false);
  const abortControllerRef = useRef(null);

  // Load thread from URL when component mounts or threadId changes
  useEffect(() => {
    if (threadId && threadId !== currThreadId) {
      // Load this specific thread
      const loadThread = async () => {
        try {
          const res = await apiFetch(`/thread/${threadId}`);
          setPrevChats(res.messages || []);
          setNewChat(false);
          setReply(null);
        } catch (err) {
          console.log("Error loading thread:", err);
          toast.error("Failed to load conversation");
        }
      };
      loadThread();
    }
  }, [threadId]);

  const simulateTyping = (text, callback) => {
    setIsTyping(true);
    let index = 0;
    const words = text.split(' ');
    let currentText = '';

    const typeNextWord = () => {
      if (index < words.length) {
        currentText += (index > 0 ? ' ' : '') + words[index];
        callback(currentText);
        index++;
        // Random delay between 30-80ms for natural typing
        setTimeout(typeNextWord, Math.random() * 50 + 30);
      } else {
        setIsTyping(false);
      }
    };

    typeNextWord();
  };

  const getReply = async () => {
    if (!prompt || loading) return;
    
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
      signal: abortControllerRef.current.signal, // Add abort signal
    };

    try {
      const userMessage = prompt;
      setPrompt(""); // Clear input immediately after sending
      
      const res = await apiFetch("/chat", options);
      const assistantText = res?.reply ?? "";

      // Simulate typing effect for the response
      simulateTyping(assistantText, (partialText) => {
        setReply(partialText);
      });

      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: assistantText },
      ]);
    } catch (error) {
      setIsTyping(false);
      if (error.name === 'AbortError') {
        toast('Response stopped', { icon: '⏹️' });
      } else if (error.message.includes('Too many')) {
        toast.error('Too many requests! Please slow down.');
      } else {
        console.error("Error fetching chat response:", error);
        toast.error('Failed to get response. Please try again.');
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsTyping(false);
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setIsOpen(false);
    toast.success('Logged out successfully');
    navigate('/'); // Navigate to landing page after logout
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setIsOpen(false);
  };

  const handleUpgradeClick = () => {
    setShowUpgradePlan(true);
    setIsOpen(false);
  };

  return (
    <div className="chatWindow">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(26, 94, 154, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#046a38',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff671f',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="navbar">
        <span>
          MitraAi &nbsp; <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="navbar-actions">
          <button 
            className={`sandbox-toggle ${showSandbox ? 'active' : ''}`}
            onClick={() => setShowSandbox(!showSandbox)}
            title="Toggle Code Sandbox"
          >
            <i className="fa-solid fa-code"></i>
            <span className="sandbox-label">Sandbox</span>
          </button>
          <div className="userIconDiv" onClick={handleProfileClick}>
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        </div>
      </div>
      {isOpen && <div className="dropdown">
          <div className="dropdownItem" onClick={handleSettingsClick}>
            <i className="fa-solid fa-gear"></i>Settings
          </div> 
          <div className="dropdownItem" onClick={handleUpgradeClick}>
            <i className="fa-solid fa-crown"></i>Upgrade Plan
          </div>
          <div className="dropdownItem" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>Log Out
          </div>  
        </div>}
      
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showUpgradePlan && <UpgradePlan onClose={() => setShowUpgradePlan(false)} />}
      
      {showSandbox && <CodeSandbox />}
      
      <Chat></Chat>
      
      {/* Thinking animation instead of spinner */}
      {(loading || isTyping) && (
        <div className="thinking-indicator">
          <span className="thinking-dot"></span>
          <span className="thinking-dot"></span>
          <span className="thinking-dot"></span>
          <span className="thinking-text">{loading ? "Thinking" : "Typing"}</span>
        </div>
      )}
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder={loading ? "Wait for response..." : "Ask MitraAI"}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) getReply();
            }}
            disabled={loading}
          ></input>
          
          {loading ? (
            <div
              id="stop-btn"
              className="fa-solid fa-stop"
              onClick={stopResponse}
              title="Stop generating"
            ></div>
          ) : (
            <div
              id="submit"
              className="fa-solid fa-paper-plane"
              onClick={getReply}
              title="Send message"
            ></div>
          )}
        </div>
        <p className="info">MitraAI can make mistakes. check Important Info.</p>
        <p className="developer-credit">Developed by Amrendra Singh Tomar</p>
      </div>
    </div>
  );
}

export default Chatwindow;
