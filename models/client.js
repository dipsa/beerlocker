// load required packages
var mongoose = require('mongoose');

// Define our client Schema
var ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

//Export the mongoose model
module.exports = mongoose.model('Clent', ClientSchema);
