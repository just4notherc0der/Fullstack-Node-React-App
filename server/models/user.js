const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const { Schema } = mongoose; ES6 destructuring

const userSchema = new Schema({
  googleID: String
});

// create new collection 'users'
mongoose.model('users', userSchema);
