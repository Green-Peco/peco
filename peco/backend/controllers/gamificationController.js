const db = require('../data/database');

// POST /api/courses/lessons/:lessonId/complete
exports.completeLesson = async (req, res) => {
    const { answers } = req.body;
    const { lessonId } = req.params;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'You must be logged in.' });
    }
    if (!lessonId) {
        return res.status(400).json({ error: 'Missing lessonId.' });
    }

    try {
        const lesson = await getLesson(lessonId);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found.' });
        }

        // --- Handle Quiz Submissions ---
        if (lesson.type === 'quiz') {
            if (!answers || !Array.isArray(answers)) {
                return res.status(400).json({ error: 'Missing answers array for quiz.' });
            }
            await handleQuiz(req, res, userId, lesson, answers);
        } else {
            // --- Handle Article/Video Completion ---
            await handleNonQuiz(req, res, userId, lesson);
        }

    } catch (err) {
        res.status(500).json({ error: 'An error occurred while processing the lesson completion.', details: err.message });
    }
};

async function handleQuiz(req, res, userId, lesson, answers) {
    const questions = await getQuestionsForLesson(lesson.id);
    const correctAnswersCount = questions.reduce((count, question) => {
        const userAnswer = answers.find(a => a.questionId === question.id);
        if (userAnswer && userAnswer.answerId === question.correct_answer) {
            return count + 1;
        }
        return count;
    }, 0);

    const scorePercentage = (correctAnswersCount / questions.length) * 100;

    if (scorePercentage < 70) {
        return res.json({
            status: 'Failed',
            message: `You scored ${scorePercentage.toFixed(0)}%. You need at least 70% to pass.`,
            xp_awarded: 0
        });
    }

    // Passed the quiz, award points and update progress
    await completeAndReward(req, res, userId, lesson);
}

async function handleNonQuiz(req, res, userId, lesson) {
    // For non-quiz types, completion is automatic
    await completeAndReward(req, res, userId, lesson);
}

async function completeAndReward(req, res, userId, lesson) {
    // 1. Check if already completed
    const existingProgress = await db.get('SELECT * FROM user_progress WHERE user_id = ? AND lesson_id = ?', [userId, lesson.id]);
    if (existingProgress) {
        const nextLessonId = await findNextLessonId(lesson.id);
        return res.json({
            status: 'Already Completed',
            message: 'You have already completed this lesson.',
            xp_awarded: 0,
            next_lesson_id: nextLessonId
        });
    }
    
    const user = await getUser(userId);

    // 2. Streak Logic
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = user.streak;
    if (user.last_lesson_date === yesterday) {
        newStreak++;
    } else if (user.last_lesson_date !== today) {
        newStreak = 1; // Reset streak
    }

    // 3. XP & Level Up
    const xp_awarded = lesson.xp_reward || 10; // Default 10xp for articles/videos
    const newXp = user.xp + xp_awarded;
    const newLevel = Math.floor(newXp / 1000) + 1;
    const level_up = newLevel > user.level;

    // 4. Update Database (in a transaction)
    db.serialize(async () => {
        db.run('BEGIN TRANSACTION');
        try {
            // Update user stats
            await db.run('UPDATE users SET xp = ?, level = ?, streak = ?, last_lesson_date = ? WHERE id = ?', [newXp, newLevel, newStreak, today, userId]);
            // Mark lesson as complete
            await db.run('INSERT INTO user_progress (user_id, lesson_id, completed_at) VALUES (?, ?, ?)', [userId, lesson.id, new Date().toISOString()]);
            await db.run('COMMIT');

            // 5. Find Next Lesson
            const nextLessonId = await findNextLessonId(lesson.id);

            // 6. Send Response
            res.json({
                status: 'Completed',
                score: '100%', // Placeholder for non-quiz, could be quiz score if applicable
                xp_awarded,
                streak: newStreak,
                level_up,
                next_lesson_id: nextLessonId
            });

        } catch (err) {
            await db.run('ROLLBACK');
            throw err; // Let the outer catch handle it
        }
    });
}

// --- Database Helper Functions ---
// (These use async/await wrappers for the callback-based sqlite3 API)
function getLesson(lessonId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM lessons WHERE id = ?', [lessonId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function getUser(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function getQuestionsForLesson(lessonId) {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, correct_answer FROM questions WHERE lesson_id = ?', [lessonId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function findNextLessonId(currentLessonId) {
    // This logic assumes lessons are sequential by ID. A more robust system
    // might have an explicit 'sequence' or 'next_lesson_id' column.
    const currentLesson = await getLesson(currentLessonId);
    if (!currentLesson) return null;

    return new Promise((resolve, reject) => {
        const sql = `SELECT id FROM lessons WHERE unit_id = ? AND id > ? ORDER BY id ASC LIMIT 1`;
        db.get(sql, [currentLesson.unit_id, currentLessonId], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row.id);
            } else {
                // No more lessons in this unit, try to find the first lesson of the next unit
                const nextUnitSql = `
                    SELECT l.id 
                    FROM lessons l
                    JOIN units u ON l.unit_id = u.id
                    WHERE u.course_id = (SELECT course_id FROM units WHERE id = ?)
                    AND u.id > ?
                    ORDER BY u.id ASC, l.id ASC
                    LIMIT 1`;
                db.get(nextUnitSql, [currentLesson.unit_id, currentLesson.unit_id], (err, nextRow) => {
                    if (err) reject(err);
                    else resolve(nextRow ? nextRow.id : null);
                });
            }
        });
    });
}
