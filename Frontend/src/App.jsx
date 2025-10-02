import './App.css';
import Sidebar from './Sidebar.jsx';
import Chatwindow from './Chatwindow.jsx';
import { Mycontext } from './MyContext.jsx';
import { useState } from 'react';
import { v1 as uuidv1} from 'uuid';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply , setReply] = useState("");
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };


  return (
    <div className="app">
      <Mycontext.Provider value={providerValues}>
      <Sidebar />
      <Chatwindow />
      </Mycontext.Provider>
    </div>
  );
}

export default App;
