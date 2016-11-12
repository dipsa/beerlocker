//get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var Beer = require('./models/beer');
var beerController = require('./controllers/beer');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');


//define the app
var app = express();

//define mongodb connector to the beerlocker
mongoose.connect('mongodb://localhost:27017/beerlocker');

//define the port, if the env variable is not set, default to 3000
var port = process.env.PORT || 3000;

// use the passport package in our application
app.use(passport.initialize());

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

// create endpoint handlers for /beers prefix
var beersRoute = router.route('/beers')
  .post(authController.isAuthenticated, beerController.postBeers)
  .get(authController.isAuthenticated, beerController.getBeers);

// create endpoint handlers for /beers/:beer_id prefix
var beerRoute = router.route('/beers/:beer_id')
  .get(authController.isAuthenticated, beerController.getBeer)
  .put(authController.isAuthenticated, beerController.putBeer)
  .delete(authController.isAuthenticated, beerController.deleteBeer);

// create endpoint handlers for /users prefix
var usersRoute = router.route('/users')
  .post(authController.isAuthenticated, userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

//register all our routes with /api -  This means that all defined routes will be prefixed with ‘/api’.
app.use('/api', router);

//start the server
app.listen(port);
console.log('Insert beer on port ' + port);
