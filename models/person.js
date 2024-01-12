const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: { type: String, required: true },
  number: { type: String, required: true }
});

// Export model
module.exports = mongoose.model('Person', PersonSchema);
