const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'ember_spice.db');
const db = new Database(dbPath, { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

module.exports = db;
