const express = require('express');
const PORT = process.env.port || 3001;
const path = require('path');
const app = express();
const noteList = require('./db/db.json')
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const generateUniqueId = require('generate-unique-id');

//parsing the JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./public'));

// GET Route 
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route 
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//Get all notes
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//post
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body

      const newNote = {
        title,
        text,
        id: generateUniqueId(),
      };

      readAndAppend(newNote, './db/db.json');

      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);