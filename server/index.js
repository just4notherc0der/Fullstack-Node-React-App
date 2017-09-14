const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const billingRoutes = require('./routes/billing');
const keys = require('./config/keys');
require('./models/user'); // just execute these
require('./services/passport');

// database connection
mongoose.connect(keys.mongoURI, {
  useMongoClient: true
});

// initialize the Application
const app = express();

// body parser
app.use(bodyParser.json());

// session cookies and passport
app.use(cookieSession({
  maxAge: 30*24*60*60*100, // last for 30 days, has to be in miliseconds
  keys: [keys.cookieKey] // encrypt cookies
}));
app.use(passport.initialize());
app.use(passport.session());

// routes
authRoutes(app);
billingRoutes(app);

// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${ PORT }`));
