document.getElementById("clientForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const client = {
    name: document.getElementById("name").value,
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    car_type: document.getElementById("car_type").value,
    plate_number: document.getElementById("plate_number").value,
    phone: document.getElementById("phone").value
  };

  fetch("http://localhost:4000/api/add-client", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client)
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById("status").textContent = data.message;
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("status").textContent = "فشل الإرسال.";
    });
});
