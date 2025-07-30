const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// Create a new group project
router.post("/", authMiddleware, async (req, res) => {
  const { name, members } = req.body;
  try {
    const owner = req.user;
    const memberEmails = members.split(",").map(e => e.trim());
    const memberUsers = await User.find({ email: { $in: memberEmails } });

    const allMembers = [...new Set([owner._id, ...memberUsers.map(u => u._id)])];

    const newProject = new Project({ name, members: allMembers });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: "Project creation failed" });
  }
});

// Get all projects where user is a member
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ members: userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to load projects" });
  }
});

module.exports = router;
