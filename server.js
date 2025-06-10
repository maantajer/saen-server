const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// تسجيل الدخول
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    'SELECT * FROM clients WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'حدث خطأ بالسيرفر' });
      } else if (row) {
        res.json({ success: true, message: 'تسجيل دخول ناجح', client: row });
      } else {
        res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
      }
    }
  );
});

// إضافة عميل
app.post('/api/add-client', (req, res) => {
  const { name, username, password, car_type, plate_number, phone } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ success: false, message: 'يجب تعبئة كل الحقول المطلوبة' });
  }

  const stmt = db.prepare(`
    INSERT INTO clients (name, username, password, car_type, plate_number, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(name, username, password, car_type, plate_number, phone, function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'فشل في إضافة العميل' });
    } else {
      res.json({ success: true, message: 'تم إضافة العميل بنجاح', clientId: this.lastID });
    }
  });

  stmt.finalize();
});

// عرض كل الزبائن
app.get('/api/clients', (req, res) => {
  db.all('SELECT * FROM clients', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'فشل في جلب الزبائن' });
    } else {
      res.json({ success: true, clients: rows });
    }
  });
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.send('🚀 السيرفر شغال بنجاح، ما في index.html حالياً');
});

app.listen(port, () => {
  console.log(`🚀 السيرفر شغال على http://localhost:${port}`);
});
