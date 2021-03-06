const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const { Schema } = mongoose; ES6 destructuring

const userSchema = new Schema({
  googleID: String,
  credits: {
    type: Number,
    default: 0
  }
});

// create new collection 'users'
mongoose.model('users', userSchema);
