const express = require('express');
const router = express.Router();
const { getNotes, createNote, deleteNote, updateNote } = require('../controllers/noteController');
const auth = require('../middleware/authMiddleware');

router.use(auth);
router.get('/', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote); // ✅ Add this
router.delete('/:id', deleteNote);

module.exports = router;
