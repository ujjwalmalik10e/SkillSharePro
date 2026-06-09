import express from "express";
import Skill from "../models/Skill.js";
import authMiddleware from "../middleware/middleware.js";

const router = express.Router();

// Create a new skill
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, level } = req.body;

    const skill = new Skill({
      user: req.user.id,
      name,
      level,
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all skills for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id });
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a skill
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (skill.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    skill.name = req.body.name || skill.name;
    skill.level = req.body.level || skill.level;

    await skill.save();
    res.status(200).json(skill);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a skill
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (skill.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await skill.deleteOne();
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
