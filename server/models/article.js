const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  url: String,
  title: String,
  content: String,
  userId: String
});

module.exports = mongoose.model('Article', articleSchema);
