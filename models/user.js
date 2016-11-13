// load required packages
var mongoose = require('mongoose');
// var bcrypt = require('bcrypt-nodejs');

// Define our user Schema
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// execute before each user.save() call
/* remove the password hashing due to the requirements of Digest authorization strategy
UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);

      user.password = hash;
      callback();
    });
  });
});

// function to verify the password in order to authenticate requests
UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  })
};
*/

// in order to test use
// curl -v --user pathum:pathum --digest http://127.0.0.1:3000/api/users

//Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
