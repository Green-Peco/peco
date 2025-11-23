const db = require('../data/database');

// GET /api/courses
exports.getAllCourses = (req, res) => {
    const sql = `SELECT * FROM courses`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ courses: rows });
    });
};

// GET /api/courses/:courseId
exports.getCourseById = (req, res) => {
    const courseId = req.params.courseId;
    const courseSql = `SELECT * FROM courses WHERE id = ?`;
    
    db.get(courseSql, [courseId], (err, course) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!course) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        const unitsSql = `SELECT * FROM units WHERE course_id = ?`;
        db.all(unitsSql, [courseId], (err, units) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const unitsWithLessons = units.map(async (unit) => {
                const lessonsSql = `SELECT id, title, type FROM lessons WHERE unit_id = ?`;
                const lessons = await new Promise((resolve, reject) => {
                    db.all(lessonsSql, [unit.id], (err, lessons) => {
                        if (err) reject(err);
                        else resolve(lessons);
                    });
                });
                return { ...unit, lessons };
            });

            Promise.all(unitsWithLessons).then(completedUnits => {
                res.json({ course: { ...course, units: completedUnits } });
            });
        });
    });
};

// GET /api/lessons/:lessonId
exports.getLessonById = (req, res) => {
    const lessonId = req.params.lessonId;
    const lessonSql = `SELECT * FROM lessons WHERE id = ?`;

    db.get(lessonSql, [lessonId], (err, lesson) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found.' });
        }

        if (lesson.type === 'quiz') {
            const questionsSql = `SELECT id, question FROM questions WHERE lesson_id = ?`;
            db.all(questionsSql, [lessonId], (err, questions) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                const questionsWithOptions = questions.map(async (question) => {
                    const optionsSql = `SELECT option_id, text FROM options WHERE question_id = ?`;
                    const options = await new Promise((resolve, reject) => {
                        db.all(optionsSql, [question.id], (err, options) => {
                            if (err) reject(err);
                            else resolve(options);
                        });
                    });
                    return { ...question, options };
                });

                Promise.all(questionsWithOptions).then(completedQuestions => {
                    res.json({ lesson: { ...lesson, questions: completedQuestions } });
                });
            });
        } else {
            res.json({ lesson });
        }
    });
};
