const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./clients.db');

db.all("SELECT * FROM clients", [], (err, rows) => {
  if (err) {
    throw err;
  }
  console.log("الزبائن الموجودين حاليًا:");
  rows.forEach((row) => {
    console.log(row);
  });
  db.close();
});
