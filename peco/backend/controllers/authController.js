const db = require('../data/db-wrapper');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken.' });
        }

        const hash = await bcrypt.hash(password, saltRounds);
        const result = await db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash]);
        
        res.status(201).json({ message: 'User registered successfully.', userId: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.userId = user.id;
            res.json({ message: 'Login successful.', user: { id: user.id, username: user.username } });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out.' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful.' });
    });
};

exports.isLoggedIn = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'You must be logged in to access this resource.' });
    }
};

exports.isAdmin = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'You must be logged in.' });
    }
    try {
        const user = await db.get('SELECT isAdmin FROM users WHERE id = ?', [req.session.userId]);
        if (user && user.isAdmin) {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden. Admin access required.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};