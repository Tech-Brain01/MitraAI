import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";
import { getGeminiAPIResponseWithFallback } from "../utils/geminiai.js";
import rateLimit from "express-rate-limit";
import { authenticateUser } from "../middleware/authMiddleware.js";

// Chat-specific rate limiter - 20 messages per minute
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 chat requests per minute
  message: { error: "Too many messages sent. Please slow down and try again in a minute." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz",
      title: "testing new title",
    });

    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log("error occurred", err);
    res
      .status(500)
      .send({ error: "An error occurred while saving the thread." });
  }
});

// route to get all threads for authenticated user
router.get("/thread", authenticateUser, async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.userId }).sort({ updatedAt: -1 });
    //descending order of updatedat
    res.json(threads);
  } catch (err) {
    console.log("error occurred", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the thread." });
  }
});

// route to get the thread with specific threadId for authenticated user
router.get("/thread/:threadId", authenticateUser, async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId, userId: req.userId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found." });
    }
    res.json(thread);
  } catch (err) {
    console.log("error occurred", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the thread." });
  }
});

// route to delete the specific threadid for authenticated user
router.delete("/thread/:threadId", authenticateUser, async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.userId });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log("error occurred", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the thread." });
  }
});

// route to post threads for authenticated user
router.post("/chat", authenticateUser, chatLimiter, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }
  try {
    let thread = await Thread.findOne({ threadId, userId: req.userId });

    if (!thread) {
      thread = new Thread({
        threadId,
        userId: req.userId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getGeminiAPIResponseWithFallback(message);
    //  console.log("Gemini Response:", assistantReply);

    thread.messages.push({ role: "assistant", content: assistantReply.text });

    thread.updatedAt = Date.now();

    await thread.save();
    res.json({ reply: assistantReply.text });
  } catch (error) {
       console.error("Detailed error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving the message." });
  }
});


// router.get("/test-models", async (req, res) => {
//   const apiKey = process.env.GOOGLE_API_KEY;
//   const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
//   try {
//     const response = await fetch(url);
//     const data = await response.json();
    
//     const supportedModels = data.models?.filter(model => 
//       model.supportedGenerationMethods?.includes('generateContent')
//     ).map(model => model.name);
    
//     res.json({ 
//       availableModels: supportedModels,
//       total: supportedModels?.length || 0 
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

export default router;
