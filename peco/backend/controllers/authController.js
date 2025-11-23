const db = require('../data/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.register = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Check if user already exists
    const checkUserSql = `SELECT * FROM users WHERE username = ?`;
    db.get(checkUserSql, [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(400).json({ error: 'Username already taken.' });
        }

        // Hash password and insert new user
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: 'Error hashing password.' });
            }

            const insertUserSql = `INSERT INTO users (username, password) VALUES (?, ?)`;
            db.run(insertUserSql, [username, hash], function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ message: 'User registered successfully.', userId: this.lastID });
            });
        });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                // Passwords match. Set up session.
                req.session.userId = user.id;
                res.json({ message: 'Login successful.', user: { id: user.id, username: user.username } });
            } else {
                // Passwords don't match.
                res.status(401).json({ error: 'Invalid username or password.' });
            }
        });
    });
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out.' });
        }
        res.clearCookie('connect.sid'); // The default session cookie name
        res.json({ message: 'Logout successful.' });
    });
};

// Middleware to protect routes
exports.isLoggedIn = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'You must be logged in to access this resource.' });
    }
};
