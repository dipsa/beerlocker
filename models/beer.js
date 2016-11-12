//load required packages
var mongoose = require('mongoose');

// define our beer schema
var BeerSchema = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number,
  userId: String
});

// export the Mongoose model
module.exports = mongoose.model('Beer', BeerSchema);
