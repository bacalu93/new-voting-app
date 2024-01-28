const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE languages (id INTEGER PRIMARY KEY, name TEXT, votes INTEGER DEFAULT 0)');
  const languages = ['JavaScript', 'Python', 'Ruby', 'Java', 'C#'];
  languages.forEach(lang => {
    db.run('INSERT INTO languages (name) VALUES (?)', [lang]);
  });
});

app.get('/languages', (req, res) => {
  db.all('SELECT * FROM languages', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.sendStatus(500);
    } else {
      res.json(rows);
    }
  });
});

app.post('/vote', (req, res) => {
  const id = req.body.id;
  db.run('UPDATE languages SET votes = votes + 1 WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err.message);
      res.sendStatus(500);
    } else {
      res.json({ id: id, votes: this.changes });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
