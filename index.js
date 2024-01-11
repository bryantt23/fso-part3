const express = require('express');

const app = express();
app.use(express.json());

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
  persons.push({ ...person, id });

  if (person) {
    res.status(201).end();
  } else {
    res.status(404).send('something went wrong').end();
  }
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
