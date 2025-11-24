// tests/teardown.js
const dbPromise = require('../data/database');

module.exports = async () => {
    const db = await dbPromise;
    db.close();
};
