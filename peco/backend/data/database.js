require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', process.env.DB_PATH);
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDb();
    }
});

function initializeDb() {
    db.serialize(() => {
        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            xp INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            streak INTEGER DEFAULT 0,
            last_lesson_date TEXT
        )`);

        // Create courses table
        db.run(`CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL
        )`);

        // Create units table
        db.run(`CREATE TABLE IF NOT EXISTS units (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id INTEGER,
            title TEXT NOT NULL,
            FOREIGN KEY (course_id) REFERENCES courses(id)
        )`);

        // Create lessons table
        db.run(`CREATE TABLE IF NOT EXISTS lessons (
            id INTEGER PRIMARY KEY,
            unit_id INTEGER,
            title TEXT NOT NULL,
            type TEXT NOT NULL,
            content TEXT,
            video_url TEXT,
            xp_reward INTEGER,
            FOREIGN KEY (unit_id) REFERENCES units(id)
        )`);

        // Create questions table
        db.run(`CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY,
            lesson_id INTEGER,
            question TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            FOREIGN KEY (lesson_id) REFERENCES lessons(id)
        )`);

        // Create options table
        db.run(`CREATE TABLE IF NOT EXISTS options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER,
            option_id TEXT NOT NULL,
            text TEXT NOT NULL,
            FOREIGN KEY (question_id) REFERENCES questions(id)
        )`);

        // Create user_progress table
        db.run(`CREATE TABLE IF NOT EXISTS user_progress (
            user_id INTEGER,
            lesson_id INTEGER,
            completed_at TEXT,
            PRIMARY KEY (user_id, lesson_id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (lesson_id) REFERENCES lessons(id)
        )`);

        console.log('Database tables created or already exist.');
        seedData();
    });
}

function seedData() {
    const courseDataPath = path.join(__dirname, 'course_data.json');
    const courseData = JSON.parse(fs.readFileSync(courseDataPath, 'utf-8'));

    const course = courseData.course;

    const checkCourseSql = `SELECT id FROM courses WHERE title = ?`;
    db.get(checkCourseSql, [course.title], function(err, row) {
        if (err) {
            return console.error(err.message);
        }
        if (row) {
            // console.log('Course data already seeded.');
            return;
        }

        console.log('Seeding database...');
        const insertCourseSql = `INSERT INTO courses (title) VALUES (?)`;
        db.run(insertCourseSql, [course.title], function(err) {
            if (err) {
                return console.error(err.message);
            }
            const courseId = this.lastID;

            course.units.forEach(unit => {
                const insertUnitSql = `INSERT INTO units (course_id, title) VALUES (?, ?)`;
                db.run(insertUnitSql, [courseId, unit.title], function(err) {
                    if (err) {
                        return console.error(err.message);
                    }
                    const unitId = this.lastID;

                    unit.lessons.forEach(lesson => {
                        const insertLessonSql = `INSERT INTO lessons (id, unit_id, title, type, content, video_url, xp_reward) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                        db.run(insertLessonSql, [lesson.lesson_id, unitId, lesson.title, lesson.type, lesson.content, lesson.video_url, lesson.xp_reward], function(err) {
                            if (err) {
                                return console.error(err.message);
                            }
                            if (lesson.type === 'quiz') {
                                lesson.questions.forEach(question => {
                                    const insertQuestionSql = `INSERT INTO questions (id, lesson_id, question, correct_answer) VALUES (?, ?, ?, ?)`;
                                    db.run(insertQuestionSql, [question.question_id, lesson.lesson_id, question.question, question.correct_answer], function(err) {
                                        if (err) {
                                            return console.error(err.message);
                                        }
                                        const questionId = this.lastID;
                                        question.options.forEach(option => {
                                            const insertOptionSql = `INSERT INTO options (question_id, option_id, text) VALUES (?, ?, ?)`;
                                            db.run(insertOptionSql, [question.question_id, option.option_id, option.text]);
                                        });
                                    });
                                });
                            }
                        });
                    });
                });
            });
            console.log('Database seeding complete.');
        });
    });
}

module.exports = db;
