const sqlite3 = require('sqlite3').verbose();

// Use a file for the database
const DBSOURCE = "line_app_data.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message);
      throw err;
    } else {
        console.log('Connected to the SQLite database.');
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS reservations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                user_name TEXT,
                reservation_date TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        db.run(createTableSql, (err) => {
            if (err) {
                // Table already created or other error
                console.error('Error creating table', err.message);
            } else {
                console.log("'reservations' table is ready.");
            }
        });
    }
});

module.exports = db;
