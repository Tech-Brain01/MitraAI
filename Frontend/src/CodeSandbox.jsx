import { useState, useEffect, useContext } from 'react';
import { Mycontext } from './MyContext.jsx';
import toast from 'react-hot-toast';
import './CodeSandbox.css';
import { apiFetch } from './apiClient.js';

const CodeSandbox = () => {
  const { sandboxCode, setSandboxCode, sandboxLanguage } = useContext(Mycontext);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  // Sync with context when code is sent from chat
  useEffect(() => {
    if (sandboxCode) {
      setCode(sandboxCode);
      setLanguage(sandboxLanguage);
      setSandboxCode(''); // Clear after loading
    }
  }, [sandboxCode, sandboxLanguage, setSandboxCode]);

  const executeCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first!');
      return;
    }

    setIsExecuting(true);
    setOutput('');

    try {
      const response = await apiFetch(`/execute/${language}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (result.success) {
        const fullOutput = [
          result.output,
          result.result && `\nReturn value: ${result.result}`,
          `\nExecution time: ${result.executionTime}`,
        ]
          .filter(Boolean)
          .join('');
        
        setOutput(fullOutput || '✅ Code executed successfully (no output)');
        toast.success('Code executed!');
      } else {
        setOutput(`Error:\n${result.error}`);
        toast.error('Execution failed');
      }
    } catch (error) {
      setOutput(`Network Error:\n${error.message}`);
      toast.error('Failed to connect to server');
    } finally {
      setIsExecuting(false);
    }
  };

  const clearCode = () => {
    setCode('');
    setOutput('');
  };

  const insertExample = () => {
    const examples = {
      javascript: `// JavaScript Example
console.log('Hello from MitraAI Sandbox!');

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('Fibonacci sequence:');
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,
      python: `# Python Example
print('Hello from MitraAI Sandbox!')

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print('Fibonacci sequence:')
for i in range(10):
    print(f'F({i}) = {fibonacci(i)}')`,
      java: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from MitraAI Sandbox!");
        
        System.out.println("Fibonacci sequence:");
        for (int i = 0; i < 10; i++) {
            System.out.println("F(" + i + ") = " + fibonacci(i));
        }
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`
    };

    setCode(examples[language]);
  };

  return (
    <div className="sandbox-container">
      <div className="sandbox-header">
        <div className="sandbox-title">
          <i className="fa-solid fa-code"></i>
          <h2>Code Sandbox</h2>
        </div>
        <div className="sandbox-controls">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button onClick={insertExample} className="example-btn">
            <i className="fa-solid fa-lightbulb"></i> Example
          </button>
          <button onClick={clearCode} className="clear-btn">
            <i className="fa-solid fa-trash"></i> Clear
          </button>
          <button 
            onClick={executeCode} 
            disabled={isExecuting}
            className="run-btn"
          >
            {isExecuting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Running...
              </>
            ) : (
              <>
                <i className="fa-solid fa-play"></i> Run Code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="sandbox-content">
        <div className="code-editor-section">
          <div className="section-label">
            <i className="fa-solid fa-pen-to-square"></i> Code Editor
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Write your ${language} code here...`}
            className="code-editor"
            spellCheck="false"
          />
        </div>

        <div className="output-section">
          <div className="section-label">
            <i className="fa-solid fa-terminal"></i> Output
          </div>
          <pre className="code-output">
            {output || 'Output will appear here...'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeSandbox;
