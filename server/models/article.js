const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  googleId: String,
  url: String,
  title: String,
  content: String
});

module.exports = mongoose.model('Article', articleSchema);
