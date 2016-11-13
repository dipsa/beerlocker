//get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var ejs = require('ejs');
var session = require('express-session');
var Beer = require('./models/beer');
var beerController = require('./controllers/beer');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var clientController = require('./controllers/client');
var oauth2Controller = require('./controllers/oauth2');


//define the app
var app = express();

//set view engine to ejs
app.set('view engine', 'ejs');

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

// use express-session support since OAuth2orize requires it
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
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
router.route('/api/beers')
  .post(authController.isAuthenticated, beerController.postBeers)
  .get(authController.isAuthenticated, beerController.getBeers);

// create endpoint handlers for /beers/:beer_id prefix
router.route('/api/beers/:beer_id')
  .get(authController.isAuthenticated, beerController.getBeer)
  .put(authController.isAuthenticated, beerController.putBeer)
  .delete(authController.isAuthenticated, beerController.deleteBeer);

// create endpoint handlers for /users prefix
router.route('/api/users')
  .post(authController.isAuthenticated, userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

// create endpoint handlers for /clients prefix
router.route('/api/clients')
  .post(authController.isAuthenticated, clientController.postClients)
  .get(authController.isAuthenticated, clientController.getClients);

// create endpoint handlers for oauth2 authorize
router.route('/api/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

// create endpoint handler for oauth2 token
router.route('/api/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);

//register all our routes with /api -  This means that all defined routes will be prefixed with ‘/api’.
// remove the /api prefix and move it to individual routes as Digest auth cannot see it when it is detached
app.use(router);

//start the server
app.listen(port);
console.log('Insert beer on port ' + port);
