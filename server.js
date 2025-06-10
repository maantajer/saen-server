const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

//⭐️ هذا السطر يخلي السيرفر يعرض صفحات HTML من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// تسجيل الدخول
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  try {
    // ✅ تحقق من المشرف
    if (username === 'maan' && password === '1234') {
      return res.json({
        success: true,
        message: 'تسجيل دخول المشرف ناجح',
        isAdmin: true
      });
    }

    // 🔍 تحقق من الزبائن
    const stmt = db.prepare('SELECT * FROM clients WHERE username = ? AND password = ?');
    const client = stmt.get(username, password);

    if (client) {
      res.json({ success: true, message: 'تسجيل دخول ناجح', client });
    } else {
      res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'حدث خطأ بالسيرفر' });
  }
});

// إضافة عميل
app.post('/api/add-client', (req, res) => {
  const { name, username, password, car_type, plate_number, phone } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ success: false, message: 'يجب تعبئة كل الحقول المطلوبة' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO clients (name, username, password, car_type, plate_number, phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, username, password, car_type, plate_number, phone);
    res.json({ success: true, message: 'تم إضافة العميل بنجاح', clientId: result.lastInsertRowid });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'فشل في إضافة العميل' });
  }
});

// عرض كل الزبائن
app.get('/api/clients', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM clients');
    const clients = stmt.all();
    res.json({ success: true, clients });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'فشل في جلب الزبائن' });
  }
});

// الصفحة الرئيسية (احتياطي)
app.get('/', (req, res) => {
  res.send('🚀 السيرفر شغال بنجاح، ما في index.html حالياً');
});

app.listen(port, () => {
  console.log(`🚀 السيرفر شغال على http://localhost:${port}`);
});
