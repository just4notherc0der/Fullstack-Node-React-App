const passport = require('passport');

module.exports = (app) => {
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get(
    '/auth/google/callback',
    // passport middleware just for this route
    passport.authenticate('google'),
    // where request is sent to after passport auth finishes
    (req, res) => {
      res.redirect('/surveys');
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    //res.send(req.user); // empty response for testing
    res.redirect('/');
  });

  // test route to test authentication
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
