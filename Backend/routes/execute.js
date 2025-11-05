import express from "express";
import { VM } from "vm2";
import { PythonShell } from "python-shell";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { promisify } from "util";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Small helper to check if a runtime exists on the server
async function runtimeAvailable(checkCommand) {
  try {
    const { exec } = await import("child_process");
    const execPromise = promisify(exec);
    await execPromise(checkCommand, { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

// Capability probe so the UI can show/hide languages gracefully
router.get("/capabilities", authenticateUser, async (_req, res) => {
  try {
    const [hasPython, hasJava] = await Promise.all([
      runtimeAvailable("python3 --version"),
      runtimeAvailable("javac -version"),
    ]);

    res.json({
      javascript: true,
      python: hasPython,
      java: hasJava,
    });
  } catch (e) {
    // In worst case, only JS is guaranteed
    res.json({ javascript: true, python: false, java: false });
  }
});

// JavaScript execution with vm2 (secure sandbox)
router.post("/javascript", authenticateUser, async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const vm = new VM({
      timeout: 5000, // 5 second timeout
      sandbox: {
        console: {
          log: (...args) => output.push(args.join(" ")),
          error: (...args) => output.push("Error: " + args.join(" ")),
        },
      },
    });

    const output = [];
    const result = vm.run(code);

    res.json({
      success: true,
      output: output.join("\n"),
      result: result !== undefined ? String(result) : "",
      executionTime: "< 5s",
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      output: "",
    });
  }
});

// Python execution (using temporary files)
router.post("/python", authenticateUser, async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  const tempDir = path.join(__dirname, "../temp");
  const fileName = `${uuidv4()}.py`;
  const filePath = path.join(tempDir, fileName);

  try {
    // Create temp directory if it doesn't exist
    await fs.mkdir(tempDir, { recursive: true });

    // Write code to temporary file
    await fs.writeFile(filePath, code);

    // Execute Python code
    const results = await PythonShell.run(filePath, {
      mode: "text",
      pythonOptions: ["-u"], // unbuffered output
    });

    // Clean up temp file
    await fs.unlink(filePath);

    res.json({
      success: true,
      output: results.join("\n"),
      executionTime: "< 5s",
    });
  } catch (error) {
    // Clean up on error
    try {
      await fs.unlink(filePath);
    } catch (e) {
      // File might not exist
    }

    res.json({
      success: false,
      error: error.message || "Python execution failed",
      output: error.stderr || "",
    });
  }
});

// Java execution (compile and run)
router.post("/java", authenticateUser, async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  const tempDir = path.join(__dirname, "../temp");
  const className = extractClassName(code) || "Main";
  const fileName = `${className}.java`;
  const filePath = path.join(tempDir, fileName);

  try {
    // Check if javac exists before proceeding
    const hasJavac = await runtimeAvailable("javac -version");
    if (!hasJavac) {
      return res.json({
        success: false,
        error:
          "Java (javac) is not installed on the server. Ask the admin to install a JDK or deploy the backend with a JDK-enabled image.",
        output: "",
      });
    }

    // Create temp directory if it doesn't exist
    await fs.mkdir(tempDir, { recursive: true });

    // Write code to temporary file
    await fs.writeFile(filePath, code);

    // Compile Java code
  const { exec } = await import("child_process");
    const execPromise = promisify(exec);

    // Compile
    const compileResult = await execPromise(`javac "${filePath}"`, {
      cwd: tempDir,
      timeout: 5000,
    });

    if (compileResult.stderr) {
      throw new Error(compileResult.stderr);
    }

    // Run compiled class
    const runResult = await execPromise(`java -cp "${tempDir}" ${className}`, {
      timeout: 5000,
    });

    // Clean up
    await fs.unlink(filePath);
    const classFile = path.join(tempDir, `${className}.class`);
    try {
      await fs.unlink(classFile);
    } catch (e) {
      // Class file might not exist
    }

    res.json({
      success: true,
      output: runResult.stdout || "Program executed successfully (no output)",
      executionTime: "< 5s",
    });
  } catch (error) {
    // Clean up on error
    try {
      await fs.unlink(filePath);
      const classFile = path.join(tempDir, `${extractClassName(code) || "Main"}.class`);
      await fs.unlink(classFile);
    } catch (e) {
      // Files might not exist
    }

    res.json({
      success: false,
      error: error.message || "Java compilation/execution failed",
      output: error.stderr || "",
    });
  }
});

// Helper function to extract class name from Java code
function extractClassName(code) {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : null;
}

export default router;
