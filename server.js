const path = require('path');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

//⭐️ يعرض صفحات HTML من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// ✅ إعداد Supabase
const supabaseUrl = 'https://opehxnqpqgpshgyrlatf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZWh4bnFwcWdwc2hndnJsYXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1ODQ5ODMsImV4cCI6MjA2NTE2MDk4M30.Y0rIFWEQdXHA-aDxKBct55yOqqKvKBsgqNT25MbZYug';
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ تسجيل الدخول
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username === 'maan' && password === '1234') {
      return res.json({
        success: true,
        message: 'تسجيل دخول المشرف ناجح',
        isAdmin: true
      });
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    res.json({ success: true, message: 'تسجيل دخول ناجح', client: data });
  } catch (err) {
    console.error('❌ خطأ تسجيل الدخول:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ بالسيرفر', error: err });
  }
});

// ✅ إضافة عميل
app.post('/api/add-client', async (req, res) => {
  const { name, username, password, phone, car_type = '', plate_number = '' } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ success: false, message: 'يجب تعبئة كل الحقول المطلوبة' });
  }

  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([{ name, username, password, phone, car_type, plate_number }]);

    if (error) {
      console.error('❌ فشل في الإضافة:', error);
      return res.status(500).json({
        success: false,
        message: 'فشل في إضافة العميل',
        error
      });
    }

    res.json({
      success: true,
      message: 'تم إضافة العميل بنجاح',
      clientId: data[0].id
    });
  } catch (err) {
    console.error('❌ خطأ بالسيرفر:', err);
    res.status(500).json({ success: false, message: 'خطأ بالسيرفر', error: err });
  }
});

// ✅ عرض كل الزبائن
app.get('/api/clients', async (req, res) => {
  try {
    const { data, error } = await supabase.from('clients').select('*');

    if (error) {
      console.error('❌ فشل في جلب الزبائن:', error);
      return res.status(500).json({ success: false, message: 'فشل في جلب الزبائن', error });
    }

    res.json({ success: true, clients: data });
  } catch (err) {
    console.error('❌ خطأ:', err);
    res.status(500).json({ success: false, message: 'خطأ بالسيرفر', error: err });
  }
});

// ✅ الصفحة الرئيسية
app.get('/', (req, res) => {
  res.send('🚀 السيرفر شغال بنجاح، لا يوجد index.html حالياً');
});

app.listen(port, () => {
  console.log(`🚀 السيرفر شغال على http://localhost:${port}`);
});
