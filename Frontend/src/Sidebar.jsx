import "./Sidebar.css";
import { useContext , useEffect } from "react";
import { Mycontext } from "./MyContext.jsx";
import { v1 as uuidv1 } from 'uuid';
import logo from './assets/logo.png';

function Sidebar() {
  const { allThreads, setAllThreads,  currThreadId , setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(Mycontext);

  const getAllThreads = async () => {

     try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/thread`);
      const res = await response.json();
      const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
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
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  }

  const changeThread = async(newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/thread/${newThreadId}`);
      const res = await response.json();
      // console.log(res);   
      setPrevChats(res.messages || []);
      setNewChat(false);
      setReply(null);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">

      {/* new chat button */}
      <button onClick={createNewChat}>
          <img className="logo" src={logo} alt="MitraAI logo" ></img>
          <span><i className="fa-solid fa-pen-to-square"></i></span>
      </button>

        {/* history */}

        <ul className="history">
            {
               allThreads?.map((thread, idx) => (
                 <li key={idx}
                  onClick={(e) => changeThread(thread.threadId)}
                 > {thread.title} </li>
               ))
            }
        </ul>

          {/* sign */}
             
            <div className="sign"></div>
                <p>By Amrendera &hearts;</p>
    </section>
 )
}

export default Sidebar;