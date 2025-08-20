import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/geminiai.js";

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

// route to get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    //descending order of updatedat
    res.json(threads);
  } catch (err) {
    console.log("error occurred", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the thread." });
  }
});

// route to get the thread with specific threadId
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
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

// route to delete the specific threadid
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
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

// route to post threads
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }
  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getGeminiAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply.text });

    thread.updatedAt = Date.now();

    await thread.save();
    res.json({ reply: assistantReply.text });
  } catch (error) {
    console.log("error occurred", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving the message." });
  }
});

export default router;
