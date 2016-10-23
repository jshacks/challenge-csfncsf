const express = require("express");
const session = require('express-session');
const lusca = require('lusca');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const passport = require("passport");
const expressValidator = require('express-validator');

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log('%s MongoDB connection established!');
});
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

/**
 * Express configuration.
 */
app.set('port',  8080); //parseInt(process.env.PORT,10) ||
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
   //next(); 
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) { 
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * API keys and Passport configuration.
 */

const passportConfig = require('./config/passport');

/**
 * Primary app routes.
 */
app.get('/', homeController.index);

app.get('/story/:id', homeController.getSingle);
app.get('/stories/:tag?', homeController.getList);
app.get('/add-story', homeController.getAddStory);
app.post('/add-story', homeController.postAddStory);
app.get('/edit-story/:id', homeController.getEditStory);
app.post('/edit-story/:id', homeController.postEditStory);
app.get('/delete-story/:id', homeController.getDeleteStory);
app.get('/vote-story/:id', homeController.getVoteStory);
app.get('/donate/:id', homeController.getDonate);
app.post('/donate/:id', homeController.postDonate);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);


app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode.', app.get('port'), app.get('env'));
});

module.exports = app;