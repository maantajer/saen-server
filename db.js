const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./clients.db', (err) => {
  if (err) {
    return console.error("❌ فشل الاتصال بقاعدة البيانات:", err.message);
  }
  console.log("✅ تم الاتصال بقاعدة البيانات بنجاح");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      username TEXT UNIQUE,
      password TEXT,
      car_type TEXT,
      plate_number TEXT,
      phone TEXT
    )
  `, (err) => {
    if (err) {
      return console.error("❌ خطأ أثناء إنشاء الجدول:", err.message);
    }
    console.log("✅ تم إنشاء جدول clients (أو موجود سابقًا)");
  });
});

module.exports = db;
