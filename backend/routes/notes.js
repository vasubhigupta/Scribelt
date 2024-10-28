const express = require("express");
const router = express.Router();
const { validationResult, body } = require("express-validator");
const Notes = require("../model/Notes");
var fetchuser = require("../middleware/fetchuser");

// Route 1: Get all the notes using GET : "/api/notes/fetchnotes"
router.get("/fetchnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json({ notes });
});

// Route 2: Add a notes using POST : "/api/notes/addnote"
router.post(
  "/addnote",
  [
    body("title", "Not a valid name.").isLength({ min: 3 }),
    body("description", "Description must be of at least 5 character").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate key error
        return res
          .status(400)
          .json({ error: "Username or email already exists" });
      }
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
 