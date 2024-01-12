require('dotenv').config();
const Person = require('./models/person');
const mongoose = require('mongoose');

// Data to be inserted, without IDs
const persons = [
  { name: 'Arto Hellas', number: '040-123456' },
  { name: 'Ada Lovelace', number: '39-44-5323523' },
  { name: 'Dan Abramov', number: '12-43-234345' },
  { name: 'Mary Poppendieck', number: '39-23-6423122' }
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Insert the data
    Person.insertMany(persons)
      .then(() => {
        console.log('Data inserted');
        return mongoose.connection.close();
      })
      .then(() => {
        console.log('Connection closed');
      })
      .catch(err => {
        console.error('Error inserting data:', err);
      });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
