const Database = require('better-sqlite3');

// إنشاء الاتصال بقاعدة البيانات (بيتم إنشاؤها إذا مو موجودة)
const db = new Database('./clients.db');

try {
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
} catch (err) {
  console.error("❌ خطأ أثناء إنشاء الجدول:", err.message);
}

module.exports = db;
