const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id); // refers to _id inside mongo db
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  },
  /* OLD CODE
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleID: profile.id })
      .then((existingUser) => {
        if(existingUser) {
          done(null, existingUser);
        } else {
          new User({ googleID: profile.id })
            .save()
            .then((user) => done(null, user)); // null - error, user - model
        }
      })
  }*/
  /* NEW CODE - works only with newer versions of NodeJS */
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ googleID: profile.id });
    if(existingUser) {
      return done(null, existingUser);
    }
    const user =await new User({ googleID: profile.id }).save();
    done(null, user);
  }
));
