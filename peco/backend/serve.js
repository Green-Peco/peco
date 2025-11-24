require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const cors = require('cors');
const db = require('./data/database'); // Import the database connection

const app = express();
const port = process.env.PORT || 3000;

// --- MIDDLEWARE ---

// A more flexible CORS configuration for development
// This allows any origin, which is fine for local testing but should be
// restricted in a production environment.
app.use(cors({
  origin: (origin, callback) => callback(null, true), // Allow all origins
  credentials: true
}));

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Session middleware
app.use(
  session({
    store: new SQLiteStore({
      db: path.basename(process.env.DB_PATH),
      dir: path.dirname(process.env.DB_PATH)
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
  })
);

// --- ROUTES ---
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/lessons', lessonRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);


// --- ROOT ENDPOINT ---
app.get('/', (req, res) => {
  res.send('Welcome to the PECO Backend API!');
});

module.exports = app;