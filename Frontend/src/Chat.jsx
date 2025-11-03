import "./Chat.css";
import { useContext, useEffect, useRef } from "react";
import { Mycontext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock.jsx";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply, setShowSandbox, setSandboxCode, setSandboxLanguage } = useContext(Mycontext);
  const listRef = useRef(null);

  const handleRunCode = (code, language) => {
    setShowSandbox(true);
    setSandboxCode(code);
    setSandboxLanguage(language);
  };

  // Auto-scroll like ChatGPT: follow new messages
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [prevChats, reply]);

  return (
    <>
      {newChat && <h1>Start a New Chat</h1>}

  <div className="chats" ref={listRef}>
        {Array.isArray(prevChats) &&
          prevChats.map((chat, idx) => (
            <div
              className={chat.role === "user" ? "userDiv" : "gptDiv"}
              key={idx}
            >
              {chat.role === "user" ? (
                <p className="userMessage">{chat.content}</p>
              ) : (
                <ReactMarkdown
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <CodeBlock
                          language={match[1]}
                          value={String(children).replace(/\n$/, '')}
                          onRunCode={handleRunCode}
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {chat.content}
                </ReactMarkdown>
              )}
            </div>
          ))}
        
        {/* Show typing animation for current reply */}
        {reply && (
          <div className="gptDiv typing">
            <ReactMarkdown
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <CodeBlock
                      language={match[1]}
                      value={String(children).replace(/\n$/, '')}
                      onRunCode={handleRunCode}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {reply}
            </ReactMarkdown>
            <span className="typing-cursor"></span>
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
