const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const keys = require('./config/keys');
require('./models/user'); // just execute these
require('./services/passport');

mongoose.connect(keys.mongoURI, {
  useMongoClient: true
});
const app = express();

authRoutes(app);

app.get('/', (req, res) => {
  res.send({ hi: 'there' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${ PORT }`));
