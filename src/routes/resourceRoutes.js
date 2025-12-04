const express = require("express");
const router = express.Router();
const Resource = require("../models/Resource");
const auth = require("../middleware/authMiddleware");

// CREATE – POST /api/resources
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, category, status, amount } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const resource = await Resource.create({
      title,
      description,
      category,
      status,
      amount,
      createdBy: req.userId, // logged-in user
    });

    res.status(201).json({
      success: true,
      message: "Resource created successfully",
      resource,
    });
  } catch (error) {
    console.error("Create resource error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL – GET /api/resources
router.get("/", auth, async (req, res) => {
  try {
    const resources = await Resource.find({ createdBy: req.userId }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("Get all resources error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE – GET /api/resources/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error("Get single resource error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE – PUT /api/resources/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, category, status, amount } = req.body;

    const resource = await Resource.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Update fields
    if (title !== undefined) resource.title = title;
    if (description !== undefined) resource.description = description;
    if (category !== undefined) resource.category = category;
    if (status !== undefined) resource.status = status;
    if (amount !== undefined) resource.amount = amount;

    await resource.save();

    res.json({
      success: true,
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    console.error("Update resource error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE – DELETE /api/resources/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Delete resource error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
