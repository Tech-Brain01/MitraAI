import { useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import toast from 'react-hot-toast';
import './CodeBlock.css';

const CodeBlock = ({ language, value, onRunCode }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    if (onRunCode) {
      onRunCode(value, language);
      toast.success('Code sent to sandbox!');
    }
  };

  const highlightedCode = language
    ? hljs.highlight(value, { language }).value
    : hljs.highlightAuto(value).value;

  const isExecutable = ['javascript', 'python', 'java'].includes(language?.toLowerCase());

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-language">{language || 'plaintext'}</span>
        <div className="code-actions">
          {isExecutable && (
            <button onClick={handleRunCode} className="run-code-button">
              <i className="fa-solid fa-play"></i> Run
            </button>
          )}
          <button onClick={copyToClipboard} className="copy-button">
            {copied ? (
              <>
                <i className="fa-solid fa-check"></i> Copied
              </>
            ) : (
              <>
                <i className="fa-regular fa-copy"></i> Copy
              </>
            )}
          </button>
        </div>
      </div>
      <pre>
        <code
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          className={`hljs language-${language || 'plaintext'}`}
        />
      </pre>
    </div>
  );
};

export default CodeBlock;
