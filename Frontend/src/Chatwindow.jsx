import Chat from "./Chat";
import "./Chatwindow.css";
import { Mycontext } from "./MyContext.jsx";
import { apiFetch } from "./apiClient";
import { useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";

function Chatwindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
  } = useContext(Mycontext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    if (!prompt || loading) return;
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
      const userMessage = prompt;
      const res = await apiFetch("/chat", options);
      const assistantText = res?.reply ?? "";

      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: assistantText },
      ]);
      setReply(assistantText);
      setPrompt("");
    } catch (error) {
      console.error("Error fetching chat response:", error);
    }
    setLoading(false);
  };

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          MitraAi &nbsp; <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && <div className="dropdown">
          <div className="dropdownItem"><i class="fa-solid fa-gear"></i>Settings</div> 
           <div className="dropdownItem"><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan</div>
           <div className="dropdownItem"><i class="fa-solid fa-right-from-bracket"></i>Log Out</div>  
        </div>}
      <Chat></Chat>
      <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask MitraAI"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") getReply();
            }}
          ></input>
          <div
            id="submit"
            className="fa-solid fa-paper-plane"
            onClick={getReply}
          ></div>
        </div>
        <p className="info">MitraAI can make mistakes. check Important Info.</p>
      </div>
    </div>
  );
}

export default Chatwindow;
