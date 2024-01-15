const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: { type: String, required: true, minLength: 3 },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Regular expression for USA phone number format (111-111-1111)
        return /^\d{3}-\d{3}-\d{4}$/.test(v);
      }
    }
  }
});

// Export model
module.exports = mongoose.model('Person', PersonSchema);
