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

const errorHandler = (error, statusCode, message, req, res, next) => {
  console.error('Error:', error.message);
  if (statusCode) {
    res.status(statusCode).send(message).end();
  }

  next(error);
};

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :body'));
app.use(express.static('dist'));
app.use(errorHandler);

app.get('/', (req, res, next) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', async (req, res, next) => {
  const persons = await Person.find({});
  res.json(persons);
});

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error, 500, 'Internal Server Error');
  }
});

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const result = await Person.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).send('Person not found').end();
    }
  } catch (error) {
    next(error, 500, 'Internal Server Error');
  }
});

app.post('/api/persons/', async (req, res, next) => {
  const { name, number } = req.body;

  const existingPerson = await Person.findOne({ name });
  if (existingPerson) {
    return res.status(409).json({
      error: 'Name already exists',
      id: existingPerson._id
    });
  }

  const person = new Person({
    name,
    number
  });
  try {
    const savedPerson = await person.save();
    res.status(201).json(savedPerson);
  } catch (error) {
    next(error, 400, 'Invalid data');
  }
});

app.put('/api/persons/:id', async (req, res, next) => {
  const { id } = req.params;
  const { number } = req.body;

  // Check if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { number },
      { new: true, runValidators: true, context: 'query' } // options for findByIdAndUpdate
    );
    if (!updatedPerson) {
      return res
        .status(404)
        .json({ error: 'Person with the given ID does not exist' });
    }

    res.status(200).json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

app.get('/info', (req, res, next) => {
  res.send(`<div>
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date().toLocaleString()}</p>
  </div>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
