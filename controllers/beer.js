// Load required packages
var Beer = require('../models/beer');

//Create endpoint /api/beers for POSTS
exports.postBeers = function(req, res) {
  // create a new instance of model Beer
  var beer = new Beer();

  //set the beer properties came from form post
  beer.name = req.body.name;
  beer.type = req.body.type;
  beer.quantity = req.body.quantity;
  beer.userId = req.user._id;

  //save the beer and check for errors
  beer.save(function(err) {
    if (err) {
      res.send(err);
    }

    res.json({message: 'Beer added to the locker!', data: beer});
  });
};

//Create endpoint /api/beers for GET
exports.getBeers = function(req, res) {
  // Use the Beer model to find all beer
  Beer.find({ userId: req.user._id }, function(err, beers) {
    if (err) {
      res.send(err);
    }

    res.json(beers);
  });
};

// create endpoint /api/beers/:beer_id for GET
exports.getBeer = function(req, res) {
  // Use the beer model to find the specific beer
  Beer.find({ userId: req.user._id, beerId: req.params.beer_id }, function(err, beer) {
    if (err) {
      res.send(err);
    }

    res.json(beer);
  });
};

// create endpoint /api/beers/:beer_id for PUT
exports.putBeer = function(req, res) {
  // use the beer model to find a specific beer
  Beer.update({ userId: req.user._id, _id: req.params.beer_id }, { quantity: req.body.quantity }, function(err, num, row) {
    if (err) {
      res.send(err);
    }

    res.json({ message: num + ' Updated' });
  });
};

exports.deleteBeer = function(req, res) {
  //use the beer model to find a specific beer and remove it
  Beer.remove({ userId: req.user._id, _id: req.body.beer_id }, function(err) {
    if (err) {
      res.send(err);
    }

    res.json({message: 'Beer removed from the locker!'});
  });
}
