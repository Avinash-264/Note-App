const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
});

router.post('/', async (req, res) => {
  const note = new Note({
    content: req.body.content,
    user: req.user._id
  });
  await note.save();
  res.json(note);
});

router.delete('/:id', async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Note deleted' });
});

router.put('/:id', async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { content: req.body.content },
    { new: true }
  );
  res.json(note);
});

module.exports = router;
