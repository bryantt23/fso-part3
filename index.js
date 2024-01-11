const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(morgan('combined'));

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
];

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => {
    return person.id === id;
  });
  console.log('🚀 ~ person ~ person:', person);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => {
    return person.id === id;
  });

  if (person) {
    persons = persons.filter(person => {
      return person.id !== id;
    });
    res.status(204).end();
  } else {
    res.status(404).send('person not found').end();
  }
});

app.post('/api/persons/', (req, res) => {
  const id = Date.now();
  const person = req.body;
  // Validate the incoming data
  if (!person || !person.name || !person.number) {
    return res.status(400).send('Invalid data').end();
  }

  const index = persons.findIndex(p => p.name === person.name);
  if (index > -1) {
    return res.status(409).send('Name already exists').end();
  }
  persons.push({ ...person, id });
  res.status(201).end();
});

app.get('/info', (req, res) => {
  res.send(`<div>
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date().toLocaleString()}</p>
  </div>`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
