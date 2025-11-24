// data/db-wrapper.js
const dbPromise = require('./database');

async function get(query, params = []) {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

async function all(query, params = []) {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

async function run(query, params = []) {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
}

module.exports = {
    get,
    all,
    run
};