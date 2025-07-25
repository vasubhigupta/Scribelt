const express = require("express");
const router = express.Router();
const { validationResult, body } = require("express-validator");
const Notes = require("../model/Notes");
var fetchuser = require("../middleware/fetchuser");

// Route 1: Get all the notes using GET : "/api/notes/fetchnotes"
router.get("/fetchAllNotes", fetchuser, async (req, res) => {
  try{
    const notes = await Notes.find({ user: req.user.id });
    res.json({ notes });
  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Error");
  }
});

// Route 2: Add a notes using POST : "/api/notes/addnote"
router.post(
  "/addNote", fetchuser,
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
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
 

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // Create a newNote object
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    // Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {
    // Find the note to be delete and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    // Allow deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({ "Success": "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})