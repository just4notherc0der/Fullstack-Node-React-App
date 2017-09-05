const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

const app = express();
passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  },
  // callback when Google sends user back to /auth/google/callback
  (accessToken, refreshToken, profile, done) => {
    // accessToken - the code from Google
    // refreshToken - undefined
    // profile - user profile information from Google

    // in this case we dont care about refreshToken. It is used to refresh the access
    // token because access token exipres after some time
  })
);

app.get('/', (req, res) => {
  res.send({ hi: 'there' });
});

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${ PORT }`));
