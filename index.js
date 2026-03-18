require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// PROOF: This tells the database to count the visit
app.get('/api/data', (req, res) => {
  connection.query('UPDATE test.my_info SET views = views + 1 WHERE id = 1', () => {
    connection.query('SELECT * FROM test.my_info WHERE id = 1', (err, results) => {
      if (err) return res.json({ name: "DB Error" });
      res.json(results[0]);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server Ready'));