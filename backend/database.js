// database.js（雛形）
const sqlite3 = require('sqlite3').verbose();

// データベースファイルを開く（なければ作成される）
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // テーブルの作成など、初期化処理をここで行う
    db.run('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, displayName TEXT)', (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  }
});

module.exports = db;