const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// ⭐️ هذا السطر يخلي السيرفر يعرض صفحات HTML من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// تسجيل الدخول
app.post('/api/login', (req, res) => {
  // ... كود تسجيل الدخول كما هو
});

// إضافة عميل
app.post('/api/add-client', (req, res) => {
  // ... كود إضافة العميل كما هو
});

// عرض الزبائن
app.get('/api/clients', (req, res) => {
  // ... كود عرض الزبائن كما هو
});

// الصفحة الرئيسية (احتياطي)
app.get('/', (req, res) => {
  res.send('🚀 السيرفر شغال بنجاح، ما في index.html حالياً');
});

app.listen(port, () => {
  console.log(`🚀 السيرفر شغال على http://localhost:${port}`);
});
