const express = require('express');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');
// const { Query } = mongoose;

const schema = require('./schema/schema');
const authRoutes = require('./routes/auth');
const passportSetup = require('./passport/passport-setup');
const secrets = require('../secrets');

const app = express();
const PORT = process.env.PORT || '4000';
const db = process.env.MONGODB_URI || secrets.mongodb.dbURI;

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [secrets.session.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/auth', authRoutes);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/login');
  } else {
    next();
  }
};

app.use(
  '/',
  authCheck,
  cors(),
  bodyParser.json(),
  expressGraphQL({
    schema,
    graphiql: false
  })
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
