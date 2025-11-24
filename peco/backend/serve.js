require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const cors = require('cors');
const db = require('./data/database');

const app = express();
const port = process.env.PORT || 3000;

// --- MIDDLEWARE ---

// Request Logger - This will log every incoming request to the console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Received ${req.method} request for ${req.url}`);
  next();
});

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new SQLiteStore({
      db: path.basename(process.env.DB_PATH),
      dir: path.dirname(process.env.DB_PATH)
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
  })
);

// --- ROUTES ---
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const postRoutes = require('./routes/posts');
const communityRoutes = require('./routes/community');
const chatRoutes = require('./routes/chat'); // New import

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/lessons', lessonRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/communities', communityRoutes);
app.use('/api/v1/chat', chatRoutes); // New route

// --- ROOT ENDPOINT ---
app.get('/', (req, res) => {
  res.send('Welcome to the PECO Backend API!');
});

module.exports = app;
