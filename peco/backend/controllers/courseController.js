const db = require('../data/db-wrapper');

exports.getAllCourses = async (req, res) => {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Search
    const { search } = req.query;
    
    let query = `SELECT * FROM courses`;
    let countQuery = `SELECT COUNT(*) as total FROM courses`;
    const params = [];
    const countParams = [];

    if (search) {
        query += ` WHERE title LIKE ?`;
        countQuery += ` WHERE title LIKE ?`;
        params.push(`%${search}%`);
        countParams.push(`%${search}%`);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    try {
        const coursesPromise = db.all(query, params);
        const totalPromise = db.get(countQuery, countParams);

        const [courses, totalResult] = await Promise.all([coursesPromise, totalPromise]);
        
        const totalCourses = totalResult.total;
        const totalPages = Math.ceil(totalCourses / limit);

        res.json({
            courses,
            pagination: {
                currentPage: page,
                totalPages,
                totalCourses,
                limit,
                search: search || null
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCourseById = async (req, res) => {
    // ... (rest of the file is unchanged)
    const courseId = req.params.courseId;
    try {
        const course = await db.get(`SELECT * FROM courses WHERE id = ?`, [courseId]);
        if (!course) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        const units = await db.all(`SELECT * FROM units WHERE course_id = ?`, [courseId]);
        
        for (const unit of units) {
            unit.lessons = await db.all(`SELECT id, title, type FROM lessons WHERE unit_id = ?`, [unit.id]);
        }

        res.json({ course: { ...course, units: units } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLessonById = async (req, res) => {
    const { lessonId } = req.params;
    try {
        const lesson = await db.get(`SELECT * FROM lessons WHERE id = ?`, [lessonId]);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found.' });
        }

        if (lesson.type === 'quiz') {
            const questions = await db.all(`SELECT id, question FROM questions WHERE lesson_id = ?`, [lessonId]);
            for (const question of questions) {
                question.options = await db.all(`SELECT option_id, text FROM options WHERE question_id = ?`, [question.id]);
            }
            lesson.questions = questions;
        }

        res.json({ lesson });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};