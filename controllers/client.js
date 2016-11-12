// load required packages
var Client = require('../models/client');

// Create endpoint /api/client for POST
exports.postClients = function(req, res) {
  var client = new Client();

  //set the client properties that came from the POST data
  client.name = req.data.name;
  client.id = req.body.id;
  client.secret = req.body.secret;
  client.userId = req.user._id;

  //Save the client and check for errors
  client.save(function(err) {
    if (err) {
      res.send(err);
    }

    res.json({ message: 'Client added to the locker!', data: Clent });
  });
};

// Create endpoint /api/clients for GET
exports.getClients = function(req, res) {
  // Use the client model to find all clients
  Client.find({ userId: req.user._id }, function(err, clients) {
    if (err) {
      res.send(err);
    }

    res.json(clients);
  });
};
