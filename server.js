
require('dotenv').config(); // تحميل المتغيرات من .env
const path = require('path');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 4000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ تسجيل الدخول
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === 'maan' && password === '1234') {
      return res.json({ success: true, message: 'تسجيل دخول المشرف ناجح', isAdmin: true });
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
    res.status(500).json({
      success: false,
      message: 'حدث خطأ بالسيرفر',
      error: {
        message: err.message,
        stack: err.stack
      }
    });
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
      .insert([{
        name,
        username,
        password,
        phone,
        car_type,
        plate_number,
        created_at: new Date().toISOString()
      }])
      .select();
    if (error) {
      console.error('❌ فشل في الإضافة:', error);
      return res.status(500).json({
        success: false,
        message: 'فشل في إضافة العميل',
        error: {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        }
      });
    }
    res.json({
      success: true,
      message: 'تم إضافة العميل بنجاح',
      clientId: data && data[0] ? data[0].id : null
    });
  } catch (err) {
    console.error('❌ خطأ بالسيرفر:', err);
    res.status(500).json({
      success: false,
      message: 'خطأ بالسيرفر',
      error: {
        message: err.message,
        stack: err.stack
      }
    });
  }
});

// ✅ عرض كل الزبائن
app.get('/api/clients', async (req, res) => {
  try {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) {
      console.error('❌ فشل في جلب الزبائن:', error);
      return res.status(500).json({
        success: false,
        message: 'فشل في جلب الزبائن',
        error: {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        }
      });
    }
    res.json({ success: true, clients: data });
  } catch (err) {
    console.error('❌ خطأ:', err);
    res.status(500).json({
      success: false,
      message: 'خطأ بالسيرفر',
      error: {
        message: err.message,
        stack: err.stack
      }
    });
  }
});

// ✅ حفظ أكواد الأعطال المرتبطة بالعميل
app.post('/api/add-error', async (req, res) => {
  const { client_id, dtc_codes } = req.body;
  if (!client_id || !dtc_codes || !Array.isArray(dtc_codes)) {
    return res.status(400).json({ success: false, message: 'بيانات غير مكتملة أو غير صحيحة' });
  }
  try {
    const { data, error } = await supabase
      .from('errors')
      .insert([{
        client_id,
        dtc_codes,
        created_at: new Date().toISOString()
      }]);
    if (error) {
      console.error('❌ فشل في إضافة الأعطال:', error);
      return res.status(500).json({
        success: false,
        message: 'فشل في حفظ الأعطال',
        error: {
          message: error.message,
          details: error.details
        }
      });
    }
    res.json({ success: true, message: 'تم حفظ أكواد الأعطال بنجاح' });
  } catch (err) {
    console.error('❌ خطأ:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الحفظ',
      error: {
        message: err.message,
        stack: err.stack
      }
    });
  }
});

// ✅ الصفحة الرئيسية
app.get('/', (req, res) => {
  res.send('🚀 السيرفر شغال بنجاح، لا يوجد index.html حالياً');
});

app.listen(port, () => {
  console.log(`🚀 السيرفر شغال على http://localhost:${port}`);
});
