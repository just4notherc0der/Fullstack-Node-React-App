const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = (app) => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    //console.log(req.body);  // object coming when stripe form is submitted

    // charge object
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '5$ for five credits bro', // Just Anything
      source: req.body.id // payment id
    });
    //console.log(charge);
    req.user.credits += 5;
    const user = await req.user.save();
    res.send(user);
  });
};
