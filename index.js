require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

// This tells the server to show your HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// This is a "data" door for the website to get info
app.get('/data', (req, res) => {
  res.json({ message: "This info is coming from the Backend!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});