const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.userId });
  res.json(notes);
};

exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.create({ userId: req.userId, title, content });
  res.json(note);
};

exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const note = await Note.findOneAndUpdate({ _id: id, userId: req.userId }, { title, content }, { new: true });
  res.json(note);
};

exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  await Note.findOneAndDelete({ _id: id, userId: req.userId });
  res.json({ message: "Note deleted" });
};
