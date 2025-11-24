const db = require('../data/db-wrapper');

exports.createCourse = async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required.' });
    }

    try {
        const result = await db.run('INSERT INTO courses (title) VALUES (?)', [title]);
        res.status(201).json({ message: 'Course created successfully.', courseId: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Placeholder for future functions
exports.updateCourse = async (req, res) => {
    res.status(501).json({ message: 'Not implemented.' });
};

exports.deleteCourse = async (req, res) => {
    res.status(501).json({ message: 'Not implemented.' });
};
