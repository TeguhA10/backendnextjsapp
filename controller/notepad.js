const { Note } = require('../models');
const fs = require('fs').promises;
const path = require('path');

const createNote = async (req, res) => {
    try {
        const { tittle, note } = req.body;
        let image = '';

        if (req.file) {
            image = req.file.filename;
        } else {
            return res.status(400).json({ message: 'Gambar harus diunggah' });
        }

        const newNote = await Note.create({ tittle, note, image });
        res.status(201).json(newNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal membuat catatan baru' });
    }
};


const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.findAll();
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil catatan' });
    }
};

const getNoteById = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findByPk(id);
        if (!note) {
            return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        }
        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil catatan' });
    }
};

const updateNote = async (req, res) => {
    const { id } = req.params;
    try {
        const existingNote = await Note.findByPk(id);
        if (!existingNote) {
            return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        }

        const updateData = {};
        if (req.file) {
            const newImagePath = req.file.path;
            if (existingNote.image) {
                const oldImagePath = path.join(__dirname, '../uploads', existingNote.image);
                await fs.unlink(oldImagePath)
            }
            updateData.image = req.file.filename;

            const destinationPath = path.join(__dirname, '../uploads', req.file.filename);
            await fs.rename(newImagePath, destinationPath);
            console.log(__dirname)
        }
        if (req.body.tittle) {
            updateData.tittle = req.body.tittle;
        }
        if (req.body.note) {
            updateData.note = req.body.note;
        }

        // Lakukan pembaruan data
        await existingNote.update(updateData);

        res.json({ message: 'Catatan berhasil diperbarui' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui catatan' });
    }
};


const deleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findByPk(id);
        if (!note) {
            return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        }

        if (note.image) {
            const imagePath = path.join(__dirname, '../uploads', note.image);
            await fs.unlink(imagePath);
        }

        await note.destroy();

        res.json({ message: 'Catatan berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus catatan' });
    }
};


module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
};
