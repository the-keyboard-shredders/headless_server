const path = require('path')
const express = require('express');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');
const schema = require('./schema/schema');
const authRoutes = require('./routes/auth');
const passportSetup = require('./passport/passport-setup');
const app = express();
const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'production') require('../secrets')

const db = process.env.MONGODB_URI;

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_KEY]
  })
);

app.use(passport.initialize());
app.use(passport.session());



mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB connected')
  })
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
  // authCheck,
  cors(),
  bodyParser.json(),
  expressGraphQL({
    schema,
    graphiql: true
  })
);
app.use('/googlec83ee420d92a4c50.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/googlec83ee420d92a4c50.html'))
})
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
