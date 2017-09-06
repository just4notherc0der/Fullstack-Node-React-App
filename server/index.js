const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/user'); // just execute these
require('./services/passport');

mongoose.connect(keys.mongoURI, {
  useMongoClient: true
});
const app = express();

app.use(cookieSession({
  maxAge: 30*24*60*60*100, // last for 30 days, has to be in miliseconds
  keys: [keys.cookieKey] // encrypt cookies
}));
app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);

app.get('/', (req, res) => {
  res.send({ hi: 'there' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${ PORT }`));
