const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/users');
const { getAllNotes, getNoteById, createNote, updateNote, deleteNote } = require('../controller/notepad');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
});

const upload = multer({ storage });

router.get('/getnote', getAllNotes);
router.get('/getnote/:id', getNoteById);
router.post('/getnote', upload.single('image'), createNote);
router.put('/getnote/:id', upload.single('image'), updateNote);
router.delete('/getnote/:id', deleteNote);

router.post('/login', login);
router.post('/register', register);

module.exports = router;