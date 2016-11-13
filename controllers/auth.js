// load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var DigestStrategy = require('passport-http').DigestStrategy;
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');

passport.use('basic', new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return callback(err); }

      //No user found with the given username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        //password does not match
        if (!isMatch) { return callback(null, false); }

        // success
        return callback(null, user);
      });
    });
  }
));

passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({ id: username }, function(err, client) {
      if (err) { return callback(err); }

      // No client is found with the given id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }

      //success
      return callback(null, client);
    });
  }
));

passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({ value: accessToken }, function(err, token) {
      if (err) { return callback(err); }

      //No token found
      if (!token) {return callback(null, false); }

      User.findOne({ _id: token.userId }, function(err, user) {
        if (err) { callback(err); }

        // if no user found
        if (!user) { return callback(null, false); }

        // Simple example with no scope
        callback(null, user, { scope: '*' });
      });
    });
  }
));

passport.use(new DigestStrategy(
  { qop: 'auth' },
  function(username, callback) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return callback(err); }

      //No user found with the username
      if (!user) { return callback(null, false); }

      // success
      return callback(null, user, user.password);
    });
  },
  function(params, callback) {
    // validate nonces as necessary
    callback(null, true);
  }
));

// remove the basic auth and add digest instead
exports.isAuthenticated = passport.authenticate(['digest', 'bearer'], { session: false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });
