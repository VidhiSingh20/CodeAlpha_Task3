const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");

// Get all tasks for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ createdBy: userId }).populate("project");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create a new task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, project } = req.body;
    const task = new Task({
      title,
      project,
      status: "todo",
      createdBy: req.user._id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Task creation failed" });
  }
});

// Update task status (drag and drop)
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task status" });
  }
});

module.exports = router;
