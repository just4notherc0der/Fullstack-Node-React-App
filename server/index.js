const express = require('express');
require('./services/passport'); // just execute it
const authRoutes = require('./routes/auth');

const app = express();

authRoutes(app);

app.get('/', (req, res) => {
  res.send({ hi: 'there' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${ PORT }`));
