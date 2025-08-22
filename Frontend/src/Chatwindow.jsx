import Chat from "./Chat";
import "./Chatwindow.css";
import { Mycontext } from "./MyContext.jsx";
import { useContext , useState , useEffect } from "react";
import {ScaleLoader} from "react-spinners";

function Chatwindow() {
  const { prompt, setPrompt, reply, setReply , currThreadId , prevChats , setPrevChats , setNewChat } = useContext(Mycontext);
  const [loading, setLoading] = useState(false);



  const getReply = async () => {
    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body:  JSON.stringify({
        message: prompt,
        threadId: currThreadId
      })
    };
 
      try {
        const response =  await fetch(`${import.meta.env.VITE_API_URL}/chat`, options);
        const res = await response.json();
        console.log(res);
        setReply(res.reply);
      } catch (error) {
        console.error("Error fetching chat response:", error);
      }
     setLoading(false);
  }

  useEffect(() => {
     if(prompt && reply) {
      setPrevChats(prevChats => (
        [...prevChats,{
          role: "user",
          content: prompt
        },
      {
        role: "assistant",
        content: reply
      }]
      ))
     }

     setPrompt("");
  }, [reply]);

  return (
    // Add flex-1 to make this component grow and fill available space
    <div className="chatWindow">
      <div className="navbar">
        <span>
          MitraAi &nbsp; <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv">
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      <Chat></Chat>
      <ScaleLoader color="#fff" loading={loading}>

      </ScaleLoader>
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask MitraAI"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? getReply() : ' '}
          ></input>
          <div id="submit" className="fa-solid fa-paper-plane" onClick={getReply}></div>
        </div>
        <p className="info">MitraAI can make mistakes. check Important Info.</p>
      </div>
    </div>
  );
}

export default Chatwindow;
