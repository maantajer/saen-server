// public/js/login.js
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error");

  if (!username || !password) {
    errorMsg.textContent = "يرجى تعبئة جميع الحقول";
    return;
  }

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = "dashboard.html";
    } else {
      errorMsg.textContent = "بيانات الدخول غير صحيحة";
    }
  } catch (err) {
    errorMsg.textContent = "حدث خطأ أثناء الاتصال بالخادم";
    console.error(err);
  }
}
