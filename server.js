//get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Beer = require('./models/beer');

//define the app
var app = express();

//define mongodb connector to the beerlocker
mongoose.connect('mongodb://localhost:27017/beerlocker');

//define the port, if the env variable is not set, default to 3000
var port = process.env.PORT || 3000;

//create the express router
var router = express.Router();

// use the body-parser in our application to decode the form post parameters
// we can access the params via req.body.
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', function(req, res, next) {
  console.log(req.url);
  next();
});

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
  res.json({message: 'You are running dangerously low on beer!'});
});

// create a new route with the prefix /beers
var beersRoute = router.route('/beers');

// create endpoint /api/beers for POST
beersRoute.post(function(req, res) {
  // create a new instance of model Beer
  var beer = new Beer();

  //set the beer properties came from form post
  beer.name = req.body.name;
  beer.type = req.body.type;
  beer.quantity = req.body.quantity;

  //save the beer and check for errors
  beer.save(function(err) {
    if (err) {
      res.send(err);
    }

    res.json({message: 'Beer added to the locker!', data: beer});
  })
});

// create endpoint /api/beers/ for GET
beersRoute.get(function(req, res) {
  Beer.find(function(err, beers) {
    if (err) {
      res.send(err);
    }

    res.json(beers);
  })
});

// create a new route with /beers/:beer_id prefix
var beerRoute = router.route('/beers/:beer_id');

// create endpoint /api/beers/:beer_id for GET
beerRoute.get(function(req, res) {
  // Use the beer model to find the specific beer
  Beer.findById(req.params.beer_id, function(err, beer) {
    if (err) {
      res.send(err);
    }

    res.json(beer);
  })
});

// create endpoint /api/beers/:beer_id for PUT
beerRoute.put(function(req, res) {
  // use the beer model to find a specific beer
  Beer.findById(req.params.beer_id, function(err, beer) {
    if (err) {
      res.send(err);
    }

    //update the existing beer quantity
    beer.quantity = req.body.quantity;

    //save the beer and check for errors
    beer.save(function(err) {
      if (err) {
        res.send(err);
      }

      res.json(beer);
    });
  });
});

//create endpoint /api/beers/:beer_id for DELETE
beerRoute.delete(function(req, res) {
  //use the beer model to find a specific beer and remove it
  Beer.findByIdAndRemove(req.params.beer_id, function(err) {
    if (err) {
      res.send(err);
    }

    res.json({message: 'Beer removed from the locker!'});
  });
});

//register all our routes with /api -  This means that all defined routes will be prefixed with ‘/api’.
app.use('/api', router);

//start the server
app.listen(port);
console.log('Insert beer on port ' + port);
