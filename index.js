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

// THIS GETS THE DATA FROM TIDB
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM my_info LIMIT 1', (err, results) => {
    if (err) return res.json({ name: "Error loading data" });
    res.json(results[0]);
  });
});

app.listen(process.env.PORT || 3000, () => console.log('Server Running'));