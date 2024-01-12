const Person = require('./models/person');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

morgan.token('body', req => {
  return JSON.stringify(req.body);
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :body'));
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', async (req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

app.get('/api/persons/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error').end();
  }
});

app.delete('/api/persons/:id', async (req, res) => {
  try {
    const result = await Person.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).send('Person not found').end();
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error').end();
  }
});

app.post('/api/persons/', async (req, res) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number
  });
  try {
    const savedPerson = await person.save();
    res.status(201).json(savedPerson);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).send('Invalid data').end();
  }
});

app.get('/info', (req, res) => {
  res.send(`<div>
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date().toLocaleString()}</p>
  </div>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
