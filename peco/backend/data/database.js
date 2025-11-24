// data/database.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPromise = new Promise((resolve, reject) => {
    const dbPath = process.env.DB_PATH === ':memory:' 
        ? ':memory:' 
        : path.join(__dirname, '..', process.env.DB_PATH);

    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database', err.message);
            return reject(err);
        }
        if (process.env.NODE_ENV !== 'test') {
            console.log('Connected to the SQLite database.');
        }
        resolve(db);
    });
});

module.exports = dbPromise;
