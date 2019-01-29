const express = require('express');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Query } = mongoose;

const app = express();
const PORT = process.env.PORT || '4000';

const db = process.env.MONGODB_URI || require('../secrets');

const schema = require('./schema/schema');

// allow cross origin requests
// app.use(cors());

mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

function isAuthenticated(req, res, next) {
  // do any checks you want to in here
  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (req.user.authenticated) return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.send('not authenticated');
}

app.use(
  '/',
  isAuthenticated,
  cors(),
  bodyParser.json(),
  expressGraphQL({
    schema,
    graphiql: false
  })
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
