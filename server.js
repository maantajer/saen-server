require('dotenv').config();
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
    res.json({
  success: true,
  message: 'تسجيل دخول ناجح',
  result: {
    client_id: data.id,
    username: data.username
  }
});
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
        error
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
        error
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

// ✅ استقبال رموز الأعطال وربطها بالزبون
app.post('/api/add-error', async (req, res) => {
  console.log("🚀 البيانات الواصلة:", req.body);

  const { client_id, dtc_codes } = req.body;

  if (!client_id || !dtc_codes) {
    return res.status(400).json({ success: false, message: 'client_id و dtc_codes مطلوبين' });
  }

  try {
    const { data, error } = await supabase
      .from('dtc_errors')
      .insert([{
        client_id,
        dtc_codes,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('❌ خطأ في حفظ الأعطال:', error);
      return res.status(500).json({
        success: false,
        message: 'فشل في حفظ الأعطال',
        error
      });
    }

    res.json({ success: true, message: 'تم حفظ الأعطال بنجاح' });
  } catch (err) {
    console.error('❌ استثناء عند حفظ الأعطال:', err);
    res.status(500).json({
      success: false,
      message: 'خطأ في السيرفر',
      error: {
        message: err.message,
        stack: err.stack
      }
    });
  }
});

// ✅ جلب الأعطال حسب client_id
app.get('/api/get-errors/:client_id', async (req, res) => {
  const clientId = req.params.client_id;

  if (!clientId) {
    return res.status(400).json({ success: false, message: 'يرجى إرسال client_id صالح' });
  }

  try {
    const { data, error } = await supabase
      .from('dtc_errors')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ فشل في جلب الأعطال:', error);
      return res.status(500).json({ success: false, message: 'فشل في جلب الأعطال', error });
    }

    res.json({ success: true, errors: data });
  } catch (err) {
    console.error('❌ خطأ في السيرفر:', err);
    res.status(500).json({ success: false, message: 'خطأ بالسيرفر', error: { message: err.message, stack: err.stack } });
  }
});

// ✅ الصفحة الرئيسية
app.get('/', (req, res) => {
  res.send('🚀 السيرفر شغال بنجاح، لا يوجد index.html حالياً');
});

// ✅ تشغيل السيرفر
app.listen(port, () => {
  console.log(`🚀 السيرفر شغال على http://localhost:${port}`);
});
