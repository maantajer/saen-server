const Database = require('better-sqlite3');

// إنشاء الاتصال بقاعدة البيانات (بيتم إنشاؤها إذا مو موجودة)
const db = new Database('./clients.db');

try {
  // إنشاء جدول العملاء
  db.prepare(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      username TEXT UNIQUE,
      password TEXT,
      car_type TEXT,
      plate_number TEXT,
      phone TEXT
    )
  `).run();

  console.log("✅ تم إنشاء جدول clients (أو موجود سابقًا)");

  // إنشاء جدول الأعطال
  db.prepare(`
    CREATE TABLE IF NOT EXISTS errors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      code TEXT,
      desc TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  console.log("✅ تم إنشاء جدول errors (أو موجود سابقًا)");

} catch (err) {
  console.error("❌ خطأ أثناء إنشاء الجداول:", err.message);
}

module.exports = db;
