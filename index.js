require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/data', (req, res) => {
  connection.query('UPDATE test.my_info SET views = views + 1 WHERE id = 1', () => {
    connection.query('SELECT * FROM test.my_info WHERE id = 1', (err, results) => {
      if (err) return res.status(500).json({ error: "DB Error" });
      res.json(results[0]);
    });
  });
});

app.post('/api/contact', (req, res) => {
  const { name, msg } = req.body;
  connection.query('INSERT INTO test.messages (sender_name, message_text) VALUES (?, ?)', [name, msg], (err) => {
    if (err) return res.status(500).send("Error");
    res.send("Success");
  });
});

app.post('/api/admin/messages', (req, res) => {
  if (req.body.pass === "password") {
    connection.query('SELECT * FROM test.messages ORDER BY created_at DESC', (err, results) => {
      if (err) return res.status(500).send("Error");
      res.json(results);
    });
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.delete('/api/admin/messages/:id', (req, res) => {
  if (req.body.pass === "password") {
    connection.query('DELETE FROM test.messages WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).send("Error");
      res.send("Deleted");
    });
  } else {
    res.status(401).send("Unauthorized");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on ' + PORT));