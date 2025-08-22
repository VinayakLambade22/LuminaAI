import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import { requireAuth, extractUserId } from "../middleware/clerkAuth.js";

const router = express.Router();

router.use(requireAuth);
router.use(extractUserId);

router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select("threadId title updatedAt");

    res.json(threads);
  } catch (err) {
    console.error("Error fetching threads:", err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({
      threadId,
      userId: req.userId, 
    });

    if (!thread) {
      return res
        .status(404)
        .json({ error: "Thread not found or access denied" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      userId: req.userId, 
    });

    if (!deletedThread) {
      return res
        .status(404)
        .json({ error: "Thread not found or access denied" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.error("Error deleting thread:", err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({
      threadId,
      userId: req.userId,
    });

    if (!thread) {
      thread = new Thread({
        threadId,
        userId: req.userId,
        title: message.substring(0, 50),
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    // Get AI response
    const assistantReply = await getOpenAIAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.error("Error in chat:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
